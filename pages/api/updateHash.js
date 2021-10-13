const Crypto = require("crypto-js");
const jsdom = require("jsdom");
import { supabase } from "../../utils/initSupabase";

const fetchProducts = async () => {
  let { data: products, error } = await supabase.from("products").select("id,name,price_link,hash_new,hash_old").eq("complete", true).order("id", { ascending: true });
  if (error) {
    throw error;
  }
  return products;
};

const createHash = async (url) => {
  const response = await fetch(url);
  const text = await response.text();
  const dom = new jsdom.JSDOM(text);
  const content = dom.serialize();
  const hash = Crypto.SHA256(content).toString();
  return hash;
};

const updateProducts = async (arr) => {
  const { data, error } = await supabase.from("products").upsert(arr);
  if (error) {
    throw error;
  }
  return data;
};

const createBatch = (arr, batchNumber) => {
  let numberPerBatch = Math.floor(arr.length / 10);
  let remainder = arr.length % 10;

  let startIndex = "";
  let endIndex = "";

  let batchArray = "";

  if (batchNumber > 10 && remainder === 0) {
    batchArray = 0;
  } else if (batchNumber > 10 && remainder > 0) {
    startIndex = (batchNumber - 1) * numberPerBatch;
    endIndex = (batchNumber - 1) * numberPerBatch + remainder;
    batchArray = arr.slice(startIndex, endIndex);
  } else {
    startIndex = (batchNumber - 1) * numberPerBatch;
    endIndex = batchNumber * numberPerBatch;
    batchArray = arr.slice(startIndex, endIndex);
  }

  return batchArray;
};

export default async function (req, res) {
  // url syntax = appcity.com/api/updateHash?batch=1
  let batchNum = Number(req.query.batch);
  let products = await fetchProducts();
  let batch = createBatch(products, batchNum);

  if (batch === 0) {
    res.statusCode = 200;
    res.json("No products remaining.");
    return;
  } else {
    for (let item of batch) {
      let hash = await createHash(item.price_link);
      item.hash_old = item.hash_new;
      item.hash_new = hash;
    }

    let updateArray = batch.map((item) => ({ id: item.id, hash_new: item.hash_new, hash_old: item.hash_old }));

    let response = await updateProducts(updateArray);

    res.statusCode = 200;
    res.json(`${response.length} items updated.`);
  }
}
