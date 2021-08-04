import { supabase } from "../../utils/initSupabase";

const fetchCategories = async () => {
  let { data: categories, error } = await supabase.from("categories").select("*");
  if (error) {
    throw error;
  }
  return categories;
};

const fetchProducts = async () => {
  let { data: products, error } = await supabase.from("products").select("*");
  if (error) {
    throw error;
  }
  return products;
};

const fetchProductCategories = async () => {
  let { data: products_categories, error } = await supabase.from("products_categories").select("*");
  if (error) {
    throw error;
  }
  return products_categories;
};

const removeDuplicateWords = (string) => {
  return string
    .split(" ")
    .filter(function (item, pos, self) {
      return self.indexOf(item) == pos;
    })
    .join(" ");
};

const updateProducts = async (arr) => {
  const { data, error } = await supabase.from("products").insert(arr, { upsert: true });
  if (error) {
    throw error;
  }
  return data;
};

export default async function (req, res) {
  const categories = await fetchCategories();
  const products = await fetchProducts();
  const products_categories = await fetchProductCategories();

  products.forEach((elem) => {
    let categoryArray = products_categories.filter((cat) => cat.product_id === elem.id);
    categoryArray = categoryArray.map((obj) => obj.category_id);
    //elem.categories = categoryArray;
    // let keywords = categoryArray.map((id) => categories.filter((cat) => cat.id === id));
    // console.log(keywords);
    let keywords = categories.filter((cat) => categoryArray.includes(cat.id));
    keywords = keywords.map((obj) => obj.keywords);
    keywords = keywords.join(" ");
    keywords = keywords + " " + elem.keywords;
    keywords = removeDuplicateWords(keywords);
    elem.keywords = keywords;
  });

  let updateArr = products.map((obj) => {
    let rObj = {};
    rObj.id = obj.id;
    rObj.keywords = obj.keywords;
    return rObj;
  });

  let response = await updateProducts(updateArr);

  res.statusCode = 200;
  res.json(response);
}
