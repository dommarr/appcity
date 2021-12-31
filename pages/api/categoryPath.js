import { supabase } from "../../utils/initSupabase";

const fetchCategories = async () => {
  let { data: categories, error } = await supabase.from("categories").select("id, name, parent_id");
  if (error) {
    throw error;
  }
  return categories;
};

const createUpdateArray = (categories) => {
  let updateArray = categories.map((category) => {
    if (category.parent_id === null) {
      return {
        id: category.id,
        path: category.name,
      };
    } else {
      return {
        id: category.id,
        path: `${categories.find((c) => c.id === category.parent_id).name} > ${category.name}`,
      };
    }
  });
  return updateArray;
};

const updateCategories = async (arr) => {
  const { data, error } = await supabase.from("categories").upsert(arr);
  if (error) {
    throw error;
  }
  return data.length;
};

export default async function (req, res) {
  let categories = await fetchCategories();
  let updateArray = createUpdateArray(categories);
  let updated = await updateCategories(updateArray);

  res.statusCode = 200;
  res.json(updated);
}
