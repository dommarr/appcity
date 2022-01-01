import algoliasearch from "algoliasearch";
import { supabase } from "../../utils/initSupabase";

const algoliaApp = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
const algoliaKey = process.env.ALGOLIA_ADMIN_KEY;
const algolia = algoliasearch(algoliaApp, algoliaKey);
const index = algolia.initIndex("app_catalog");

const fetchCategories = async () => {
  let { data: categories, error } = await supabase.from("categories").select("*");
  if (error) {
    throw error;
  }
  return categories;
};

const getIndustries = async () => {
  let { data: industries, error } = await supabase.from("industries").select("*");
  if (error) {
    throw error;
  }
  return industries;
};

const getProducts = async () => {
  let { data: products, error } = await supabase.from("products").select(`
        *,
        vendors (*),
        products_categories (*)
`);
  if (error) {
    throw error;
  }
  return products;
};

const getTiers = async () => {
  let { data: tiers, error } = await supabase.from("tiers").select(`*`);
  if (error) {
    throw error;
  }
  return tiers;
};

const getReviews = async () => {
  let { data: reviews, error } = await supabase.from("reviews").select("*");
  if (error) {
    throw error;
  }
  return reviews;
};

const compare = (a, b) => {
  const tierNumA = a.tier_number;
  const tierNumB = b.tier_number;

  let comparison = 0;
  if (tierNumA > tierNumB) {
    comparison = 1;
  } else if (tierNumA < tierNumB) {
    comparison = -1;
  }
  return comparison;
};

function add(accumulator, a) {
  return accumulator + a;
}

export default async function (req, res) {
  let allCategories = await fetchCategories();

  // get industries
  const industries = await getIndustries();

  // get all reviews
  const reviews = await getReviews();

  // get all products
  const products = await getProducts();

  // get all products
  const tierData = await getTiers();
  const tiers = tierData.map((elem) => {
    let obj = {};
    obj.tier_id = elem.id;
    obj.product_id = elem.product_id;
    obj.tier_name = elem.name;
    obj.tier_number = elem.number;
    // price
    if (elem.only_paid_monthly) {
      obj.price_primary_number_year = elem.price_primary_number_month;
      obj.price_primary_number_month = elem.price_primary_number_month;
    } else if (elem.only_paid_yearly) {
      obj.price_primary_number_year = elem.price_primary_number_year;
      obj.price_primary_number_month = elem.price_primary_number_year;
    } else {
      obj.price_primary_number_year = elem.price_primary_number_year;
      obj.price_primary_number_month = elem.price_primary_number_month;
    }
    //obj.price_primary_number_year = elem.price_primary_number_year;
    obj.price_primary_text_year = elem.price_primary_text_year;
    obj.price_primary_unit_year = elem.price_primary_unit_year;
    obj.price_secondary_number_year = elem.price_secondary_number_year;
    obj.price_secondary_text_year = elem.price_secondary_text_year;
    obj.price_secondary_unit_year = elem.price_secondary_unit_year;
    //obj.price_primary_number_month = elem.price_primary_number_month;
    obj.price_primary_text_month = elem.price_primary_text_month;
    obj.price_primary_unit_month = elem.price_primary_unit_month;
    obj.price_secondary_number_month = elem.price_secondary_number_month;
    obj.price_secondary_text_month = elem.price_secondary_text_month;
    obj.price_secondary_unit_month = elem.price_secondary_unit_month;
    // sort
    obj.sort_price_yearly = elem.price_primary_number_year;
    obj.sort_price_monthly = elem.price_primary_number_month;
    // no price fields
    obj.no_price = elem.no_price;
    obj.only_paid_monthly = elem.only_paid_monthly;
    obj.only_paid_yearly = elem.only_paid_yearly;
    return obj;
  });

  // array for algolia index
  let algoliaArray = [];

  // organize data for Algolia
  products.forEach(function (elem) {
    const obj = {};
    obj.objectID = elem.id;
    //obj.product_id = elem.products.id;
    //obj.tier = elem.name;
    obj.product = elem.name;
    obj.vendor = elem.vendors.name;
    obj.keywords = elem.keywords;
    obj.vendor_website = elem.vendors.website;
    obj.logo = elem.product_logo ? elem.product_logo : elem.vendors.logo;
    obj.price_model = elem.price_model;
    // If there is a discount at the product level, prioritize that. Otherwise, set discount to the vendor level.
    obj.discount_message = elem.discount_message ? elem.discount_message : elem.vendors.discount_message;
    obj.industry = industries.filter((industry) => industry.id === elem.industry_id)[0].name;

    // filter tiers to only tiers for this product
    let tierArray = tiers.filter((tier) => tier.product_id === elem.id).sort(compare);
    obj.tiers = tierArray;
    obj.monthly_prices = tierArray.map((tier) => tier.price_primary_number_month);
    obj.yearly_prices = tierArray.map((tier) => tier.price_primary_number_year);
    let tierCount = tierArray.length;
    // set sinlge tier y/n - used for ui purposes
    if (tierCount === 1) {
      obj.single_tier = true;
    } else {
      obj.single_tier = false;
    }
    // features are added cumulatively at the tier-level. for product-level features, we only need the last tier's features
    if (tierCount > 0) {
      let last_tier = tierData.filter((tier) => tier.id === tierArray[tierArray.length - 1].tier_id)[0];
      obj.features = tierData.filter((tier) => tier.id === last_tier.id)[0].features;
    }
    // for calculating a price to sort by...
    // first set price if there is a billing restriction
    let tierPrices = tierArray.map((tier) => {
      let obj = {};
      if (tier.only_paid_monthly) {
        obj.price_yearly = tier.price_primary_number_month;
        obj.price_monthly = tier.price_primary_number_month;
      } else if (tier.only_paid_yearly) {
        obj.price_yearly = tier.price_primary_number_year;
        obj.price_monthly = tier.price_primary_number_year;
      } else {
        obj.price_yearly = tier.price_primary_number_year;
        obj.price_monthly = tier.price_primary_number_month;
      }
      return obj;
    });
    // then filter prices to exclude non-numbers (include zeros)
    let yearlyPrices = tierPrices.filter((tier) => tier.price_yearly || tier.price_yearly === 0).map((tier) => tier.price_yearly);
    let monthlyPrices = tierPrices.filter((tier) => tier.price_monthly || tier.price_monthly === 0).map((tier) => tier.price_monthly);

    // prices used in filtering
    obj.min_price_year = Math.min(...yearlyPrices);
    obj.max_price_year = Math.max(...yearlyPrices);
    obj.min_price_month = Math.min(...monthlyPrices);
    obj.max_price_month = Math.max(...monthlyPrices);

    // sum and get average (for sorting)
    // yearly
    if (yearlyPrices.length > 0) {
      let sum = yearlyPrices.reduce(add, 0);
      let avg = sum / yearlyPrices.length;
      obj.sort_price_yearly = avg;
    } else {
      obj.sort_price_yearly = "";
    }
    // monthly
    if (monthlyPrices.length > 0) {
      let sum = monthlyPrices.reduce(add, 0);
      let avg = sum / monthlyPrices.length;
      obj.sort_price_monthly = avg;
    } else {
      obj.sort_price_monthly = "";
    }

    // calc and set review rating and count
    let filteredReviews = reviews.filter((review) => review.product === elem.id);
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

    // setup categories
    let catIds = elem.products_categories.map((item) => item.category_id);
    let productCategories = allCategories.filter((category) => catIds.includes(category.id));
    // virtual categories used for default filtering on category pages with the virtual refinement component from algolia
    obj.virtual_categories = productCategories.map((item) => item.name);
    let parents = productCategories.filter((item) => !item.parent_id);
    let children = productCategories.filter((item) => item.parent_id);
    // categories used in the hierarchical facet and menu
    obj.categories = {};
    if (parents.length) {
      obj.categories.lvl0 = parents.map((item) => item.path);
    }
    if (children.length) {
      obj.categories.lvl1 = children.map((item) => item.path);
    }

    algoliaArray.push(obj);
  });

  //save to Algolia
  return new Promise((resolve, reject) => {
    index
      .saveObjects(algoliaArray)
      .then(({ objectIDs }) => {
        res.statusCode = 200;
        res.json(objectIDs);
        return resolve();
      })
      .catch((error) => {
        res.statusCode = 500;
        res.json(error);
        return resolve();
      });
  });
}
