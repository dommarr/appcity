import { supabase } from "../../utils/initSupabase";

const fetchTiers = async () => {
  let { data: tiers, error } = await supabase.from("tiers").select("product_id,price_primary_text_year,price_primary_text_month,products(*)");
  if (error) {
    throw error;
  }
  return tiers;
};

const createNewTasks = async (arr) => {
  const { data, error } = await supabase.from("tasks").insert(arr);
  if (error) {
    throw error;
  }
  return data.length;
};

export default async function (req, res) {
  const tiers = await fetchTiers();

  let taskArr = [];

  tiers.forEach((tier) => {
    let taskObj = {};
    if (tier.price_primary_text_year || tier.price_primary_text_month) {
      taskObj.name = "Update Price Checkboxes";
      taskObj.product_id = tier.product_id;
      taskObj.product_name = tier.products.name;
      taskObj.notes = ["There is at least one tier where there is no price, only paid monthly, or only paid yearly.", "Check all tiers for this and check the correct box."];
      taskObj.complete = false;
      taskArr.push(taskObj);
    }
  });

  const removeDupes = taskArr.reduce((acc, current) => {
    const x = acc.find((item) => item.product_id === current.product_id);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);

  let tasksCreated = await createNewTasks(removeDupes);

  res.statusCode = 200;
  res.json(tasksCreated);
}
