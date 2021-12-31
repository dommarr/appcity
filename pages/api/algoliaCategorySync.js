import { supabase } from "../../utils/initSupabase";
import algoliasearch from "algoliasearch";

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

const fetchProducts = async () => {
  let { data: products, error } = await supabase.from("products").select(`
          *,
          products_categories (*)
  `);
  if (error) {
    throw error;
  }
  return products;
};

export default async function (req, res) {
  let allCategories = await fetchCategories();
  let products = await fetchProducts();

  // array for algolia index
  let algoliaArray = [];

  products.forEach((product) => {
    let catIds = product.products_categories.map((item) => item.category_id);
    let productCategories = allCategories.filter((category) => catIds.includes(category.id));
    const obj = {};
    obj.objectID = product.id;
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
      .partialUpdateObjects(algoliaArray)
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
