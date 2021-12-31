import { supabase } from "../../utils/initSupabase";

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

const getParents = (productCategories, allCategories) => {
  let catsWithParents = allCategories.filter((item) => productCategories.includes(item.id) && item.parent_id !== null);
  let parents = catsWithParents.map((item) => item.parent_id);
  return parents;
};

const updateProductCategories = async (arr) => {
  const { data, error } = await supabase.from("products_categories").insert(arr);
  if (error) {
    throw error;
  }
  return data.length;
};

export default async function (req, res) {
  let allCategories = await fetchCategories();
  let products = await fetchProducts();

  let updateArray = [];
  // for loop
  for (let i = 0; i < products.length; i++) {
    // for every product's categories, find the parent categories
    let productCategories = products[i].products_categories.map((item) => item.category_id);
    let parents = getParents(productCategories, allCategories);
    // if a parent category is not present, add it to the update array
    let missingParents = parents.filter((item) => !productCategories.find((cat) => cat === item));
    if (missingParents.length) {
      let arr = missingParents.map((item) => {
        return {
          product_id: products[i].id,
          category_id: item,
        };
      });
      updateArray.push.apply(updateArray, arr);
    }
  }

  let updated = "";

  if (updateArray.length) {
    updated = await updateProductCategories(updateArray);
  } else {
    updated = "No updates needed";
  }

  res.statusCode = 200;
  res.json(updated);
}
