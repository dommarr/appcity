const Crypto = require("crypto-js");
const jsdom = require("jsdom");
import { supabase } from "../../utils/initSupabase";

export default async function (req, res) {
  let { data: products, error } = await supabase.from("products").select("id,name,price_link,dynamic_price_page,price_page_hash").eq("complete", true);
  if (error) {
    res.statusCode = 400;
    res.json("There was an error.");
    throw error;
  }

  let { data: tasks, err } = await supabase.from("tasks").select("product_id").eq("complete", false).eq("name", "Check Data");
  if (err) {
    res.statusCode = 400;
    res.json("There was an error.");
    throw err;
  }

  let updateArray = [];

  const hashUrl = async (url) => {
    const response = await fetch(url);
    const text = await response.text();
    const dom = new jsdom.JSDOM(text);
    const content = dom.serialize();
    const hash = Crypto.SHA256(content).toString();
    return hash;
  };

  const checkDynamic = async (url, product) => {
    const responseOne = await fetch(url);
    const textOne = await responseOne.text();
    const domOne = new jsdom.JSDOM(textOne);
    const contentOne = domOne.serialize();
    const hashOne = Crypto.SHA256(contentOne).toString();

    const responseTwo = await fetch(url);
    const textTwo = await responseTwo.text();
    const domTwo = new jsdom.JSDOM(textTwo);
    const contentTwo = domTwo.serialize();
    const hashTwo = Crypto.SHA256(contentTwo).toString();

    if (hashOne !== hashTwo) {
      const { data, error } = await supabase.from("products").update({ dynamic_price_page: true }).eq("id", product);
      if (error) {
        res.statusCode = 400;
        res.json("There was an error.");
        throw error;
      }
      return data;
    }
  };

  for (let i = 0; i < products.length; i++) {
    // check if price page is dynamic and update if yes
    let dynamic = await checkDynamic(products[i].price_link, products[i].id);
    // if hash, check changes. else, get hash
    if (products[i].price_page_hash) {
      // if it is a dynamic pricing page, then check the data once a week
      // eventually, exclude the dynamic portion of the page and check the data normally
      if (products[i].dynamic_price_page) {
        let today = new Date();
        if (today.getDay() === 0) {
          // create check data ticket
          let hash = await hashUrl(products[i].price_link);
          let updateObj = {};
          updateObj.task = true;
          updateObj.product_id = products[i].id;
          updateObj.product_name = products[i].name;
          updateObj.new_hash = hash;
          updateObj.note = ["Dynamic price page", "Weekly check"];
          updateArray.push(updateObj);
        }
        // not a dynamic page, check if hash is different
      } else {
        let hash = await hashUrl(products[i].price_link);
        if (hash !== products[i].price_page_hash) {
          let updateObj = {};
          updateObj.task = true;
          updateObj.product_id = products[i].id;
          updateObj.product_name = products[i].name;
          updateObj.new_hash = hash;
          updateObj.note = ["Detected page change"];
          updateArray.push(updateObj);
        }
      }
      // no hash, so get hash
    } else {
      let hash = await hashUrl(products[i].price_link);
      let updateObj = {};
      updateObj.task = false;
      updateObj.product_id = products[i].id;
      updateObj.product_name = products[i].name;
      updateObj.new_hash = hash;
      updateArray.push(updateObj);
    }
  }

  let response = [];

  const updateHash = async (product_id, hash) => {
    const { data, error } = await supabase.from("products").update({ price_page_hash: hash }).eq("id", product_id);
    if (error) {
      res.statusCode = 400;
      res.json("There was an error.");
      throw error;
    }
    return data;
  };

  const createTask = async (id, name, note) => {
    let insertObj = {
      name: "Check Data",
      product_id: id,
      product_name: name,
      notes: note,
    };
    const { data, error } = await supabase.from("tasks").insert([insertObj]);
    if (error) {
      res.statusCode = 400;
      res.json("There was an error.");
      throw error;
    }
    return data;
  };

  // flatten array
  let taskArray = tasks.map(function (obj) {
    return obj.product_id;
  });

  for (let i = 0; i < updateArray.length; i++) {
    let hashUpdated = await updateHash(updateArray[i].product_id, updateArray[i].new_hash);
    response.push(hashUpdated);
    // if task is true (set above) and there is NOT an existing task, create task
    if (updateArray[i].task && !taskArray.includes(updateArray[i].product_id)) {
      let taskCreated = await createTask(updateArray[i].product_id, updateArray[i].product_name, updateArray[i].note);
      response.push(taskCreated);
    }
  }

  res.statusCode = 200;
  res.json(response);
}
