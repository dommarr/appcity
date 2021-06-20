const Crypto = require("crypto-js");
const jsdom = require("jsdom");

export default async function (req, res) {
  let { data: products, error } = await supabase.from("products").select("id,name,price_link,dynamic_price_page,price_page_hash").eq("complete", true);
  if (error) {
    res.statusCode = 400;
    res.json("There was an error.");
    throw error;
  }

  let updateArray = [];

  const hashUrl = (url) => {
    const response = await fetch(url);
    const text = await response.text();
    const dom = new jsdom.JSDOM(text);
    const content = dom.serialize();
    const hash = Crypto.SHA256(content).toString();
    return hash;
  };

  products.forEach((elem) => {
    // if hash, check changes. else, get hash
    if (elem.price_page_hash) {
      // if it is a dynamic pricing page, then check the data once a week
      // eventually, exclude the dynamic portion of the page and check the data normally
      if (elem.dynamic_price_page) {
        let today = new Date();
        if (today.getDay() === 0) {
          // create check data ticket
          let hash = hashUrl(elem.price_link);
          let updateObj = {};
          updateObj.task = true;
          updateObj.product_id = elem.id;
          updateObj.product_name = elem.name;
          updateObj.new_hash = hash;
          updateObj.note = ["Dynamic price page", "Weekly check"];
          updateArray.push(updateObj);
        }
        // not a dynamic page, check if hash is different
      } else {
        let hash = hashUrl(elem.price_link);
        if (hash !== elem.price_page_hash) {
          let updateObj = {};
          updateObj.task = true;
          updateObj.product_id = elem.id;
          updateObj.product_name = elem.name;
          updateObj.new_hash = hash;
          updateObj.note = ["Detected page change"];
          updateArray.push(updateObj);
        }
      }
      // no hash, so get hash
    } else {
      let hash = hashUrl(elem.price_link);
      let updateObj = {};
      updateObj.task = false;
      updateObj.product_id = elem.id;
      updateObj.product_name = elem.name;
      updateObj.new_hash = hash;
      updateArray.push(updateObj);
    }
  });

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

  for (let i = 0; i < updateArray.length; i++) {
    let hashUpdated = await updateHash(updateArray[i].product_id, updateArray[i].new_hash);
    response.push(hashUpdated);
    if (updateArray[i].task) {
      let taskCreated = await createTask(updateArray[i].product_id, updateArray[i].product_name, updateArray[i].note);
      response.push(taskCreated);
    }
  }

  res.statusCode = 200;
  res.json(response);
}
