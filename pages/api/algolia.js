import algoliasearch from "algoliasearch";
import { supabase } from "../../utils/initSupabase";

const algoliaApp = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
const algoliaKey = process.env.ALGOLIA_ADMIN_KEY;
const algolia = algoliasearch(algoliaApp, algoliaKey);
const index = algolia.initIndex("catalog");

async function getCategories() {
  try {
    let response = await supabase.from("categories").select("*");
    return response.data;
  } catch (err) {
    alert(err);
  }
}

const fetchIndustries = async () => {
  let { data: industries, error } = await supabase.from("industries").select("*");
  if (error) {
    throw error;
  }
  return industries;
};

async function getCatalog() {
  try {
    let response = await supabase.from("tiers").select(`
            *,
            products (
                *,
                vendors (
                    *
                ),
                products_categories (
                    *
                )
            )
            )
        `);
    return response.data;
  } catch (err) {
    alert(err);
  }
}

async function getReviews() {
  try {
    let { data: reviews, error } = await supabase.from("reviews").select("*").eq("video_available", true);
    if (error) {
      throw error;
    }
    return reviews;
  } catch (err) {
    alert(err);
  }
}

// categories
const createCatTable = (cats, arr) => {
  const categories = [];
  let i;
  // for each category, create a new object
  for (i = 0; i < arr.length; i++) {
    const obj = {};
    // set default values (assumes top-level category, defined as parent_id === null)
    obj.id = arr[i].id;
    obj.lvl = 0;
    obj.name = arr[i].name;
    let current_parent = arr[i].parent_id;
    // if parent_id is not null, it is not a top-level category, so update lvl and name
    // continue until we have gone up the chain to the top-level (parent_id === null)
    while (current_parent !== null) {
      obj.lvl++;
      obj.name = cats[current_parent] + " > " + obj.name;
      let j;
      for (j = 0; j < arr.length; j++) {
        if (arr[j].id === current_parent) {
          current_parent = arr[j].parent_id;
        }
      }
    }
    categories.push(obj);
  }
  return categories;
};

export default async function (req, res) {
  // get category data and build out hierarchy (categories and sub-categories)
  const catArray = await getCategories();
  const catNames = {};
  catArray.forEach((elem) => (catNames[elem.id] = elem.name));
  const categories = createCatTable(catNames, catArray);

  // get industries
  const industries = await fetchIndustries();

  // get all reviews
  const reviews = await getReviews();

  // query data from Supabase
  const catalog = await getCatalog();

  // array for algolia index
  let objects = [];

  // organize data for Algolia
  catalog.forEach(function (elem) {
    const obj = {};
    obj.objectID = elem.id;
    obj.product_id = elem.products.id;
    obj.tier = elem.name;
    obj.product = elem.products.name;
    obj.vendor = elem.products.vendors.name;
    obj.keywords = elem.products.keywords;
    obj.vendor_website = elem.products.vendors.website;
    obj.logo = elem.products.product_logo ? elem.products.product_logo : elem.products.vendors.logo;
    obj.price_model = elem.products.price_model;
    obj.industry = industries.filter((industry) => industry.id === elem.products.industry_id)[0].name;

    let tierCount = catalog.filter((tier) => tier.products.id === elem.products.id).length;
    if (tierCount === 1) {
      obj.single_tier = true;
    } else {
      obj.single_tier = false;
    }

    // old pricing setup.....................
    // obj.starting_price_year = elem.starting_price_year;
    // obj.starting_price_year_other = elem.starting_price_year_other;
    // obj.starting_price_month = elem.starting_price_month;
    // obj.starting_price_month_other = elem.starting_price_month_other;
    // obj.starting_price_unit = elem.starting_price_unit;
    // obj.compare_price_year = elem.compare_price_year;
    // obj.compare_price_year_other = elem.compare_price_year_other;
    // obj.compare_price_month = elem.compare_price_month;
    // obj.compare_price_month_other = elem.compare_price_month_other;
    // obj.compare_price_unit = elem.compare_price_unit;
    // // determine what price to sort by - defined in database
    // elem.sort_by_starting_price ? (obj.sort_price_monthly = elem.starting_price_month) : (obj.sort_price_monthly = elem.compare_price_month);
    // elem.sort_by_starting_price ? (obj.sort_price_yearly = elem.starting_price_year) : (obj.sort_price_yearly = elem.compare_price_year);

    // Price fields
    obj.price_primary_number_year = elem.price_primary_number_year;
    obj.price_primary_text_year = elem.price_primary_text_year;
    obj.price_primary_unit_year = elem.price_primary_unit_year;
    obj.price_secondary_number_year = elem.price_secondary_number_year;
    obj.price_secondary_text_year = elem.price_secondary_text_year;
    obj.price_secondary_unit_year = elem.price_secondary_unit_year;
    obj.price_primary_number_month = elem.price_primary_number_month;
    obj.price_primary_text_month = elem.price_primary_text_month;
    obj.price_primary_unit_month = elem.price_primary_unit_month;
    obj.price_secondary_number_month = elem.price_secondary_number_month;
    obj.price_secondary_text_month = elem.price_secondary_text_month;
    obj.price_secondary_unit_month = elem.price_secondary_unit_month;

    obj.sort_price_yearly = elem.price_primary_number_year;
    obj.sort_price_monthly = elem.price_primary_number_month;

    // tier features
    obj.features = elem.features;
    // calc and set review rating and count
    let filteredReviews = reviews.filter((review) => review.product === elem.products.id);
    if (filteredReviews.length === 0) {
      obj.rating = 0;
      obj.count = 0;
    } else {
      let sum = 0;
      let i;
      for (i = 0; i < filteredReviews.length; i++) {
        sum += filteredReviews[i].rating;
      }
      obj.rating = Math.round((sum / filteredReviews.length) * 10) / 10;
      obj.count = filteredReviews.length;
    }
    obj.categories = {};
    // for each category, match and get the hierarchy level and name
    elem.products.products_categories.forEach(function (item) {
      let match = categories.filter(function (entry) {
        return entry.id === item.category_id;
      });
      let level = "lvl" + match[0].lvl;
      obj.categories[level] = match[0].name;
    });

    // if product is not complete, add tag hidden, else add empty tags
    if (!elem.products.complete) {
      obj._tags = ["hidden"];
    } else {
      obj._tags = [""];
    }

    objects.push(obj);
  });

  //save to Algolia
  return new Promise((resolve, reject) => {
    index
      .saveObjects(objects)
      .then(({ objectIDs }) => {
        res.statusCode = 200;
        res.json(objectIDs);
        resolve();
      })
      .catch((error) => {
        res.statusCode = 500;
        res.json(error);
        return resolve();
      });
  });
}
