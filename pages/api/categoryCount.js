import { supabase } from "../../utils/initSupabase";

const fetchProductCategories = async () => {
  let { data: products_categories, error } = await supabase.from("products_categories").select("category_id");
  if (error) {
    throw error;
  }
  let counts = {};
  let flattenedArr = products_categories.map((category) => category.category_id);
  flattenedArr.forEach(function (x) {
    counts[x] = (counts[x] || 0) + 1;
  });
  let updatedArray = [];
  for (let key in counts) {
    updatedArray.push({
      id: key,
      product_count: counts[key],
    });
  }
  return updatedArray;
};

const updateCategories = async (arr) => {
  const { data, error } = await supabase.from("categories").upsert(arr);
  if (error) {
    throw error;
  }
  return data.length;
};

export default async function (req, res) {
  let updateArray = await fetchProductCategories();
  let updated = await updateCategories(updateArray);
  res.statusCode = 200;
  res.json(updated);
}
