const Crypto = require("crypto-js");
const jsdom = require("jsdom");
import { supabase } from "../../utils/initSupabase";

const fetchProducts = async () => {
  let { data: products, error } = await supabase.from("products").select("id,name,price_link,price_page_hash,hash_today").eq("complete", true);
  if (error) {
    throw error;
  }
  return products;
};

const fetchTasks = async () => {
  let { data: tasks, error } = await supabase.from("tasks").select("product_id").eq("complete", false).eq("name", "Check Data");
  if (error) {
    throw err;
  }
  return tasks;
};

const createTasks = async (arr) => {
  const { data, error } = await supabase.from("tasks").insert(arr);
  if (error) {
    throw error;
  }
  return data;
};

export default async function (req, res) {
  let products = await fetchProducts();
  let tasks = await fetchTasks();
  tasks = tasks.map((task) => task.product_id);
  let dataChangedArray = [];

  // check if hashes are equal, if not add to array
  products.forEach((product) => {
    if (product.price_page_hash !== product.hash_today) {
      dataChangedArray.push({ name: product.name, id: product.id });
    }
  });

  // filter out products that already have an open Check Data task
  dataChangedArray = dataChangedArray.filter((item) => !tasks.includes(item.id));

  // create new tasks
  let newTaskArray = dataChangedArray.map((item) => ({
    name: "Check Data",
    product_id: item.id,
    product_name: item.name,
    notes: ["Detected page change", "Please check accuracy of current data vs. this app's price page."],
  }));

  let response = await createTasks(newTaskArray);
  response = `${response.length} tasks created`;

  res.statusCode = 200;
  res.json(response);
}
