const Crypto = require("crypto-js");
const jsdom = require("jsdom");
import { supabase } from "../../utils/initSupabase";

export default async function (req, res) {
  let data = JSON.parse(req.body);
  let product = data.product;
  let url = data.price_page;

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

  if (hashOne === hashTwo) {
    const { data, error } = await supabase.from("products").update({ dynamic_price_page: false, price_page_hash: hashOne }).eq("id", product);
    if (error) {
      res.statusCode = 400;
      res.json("There was an error.");
      throw error;
    }
    if (data) {
      res.statusCode = 200;
      res.json(data);
      return;
    }
  } else {
    const { data, error } = await supabase.from("products").update({ dynamic_price_page: true, price_page_hash: hashOne }).eq("id", product);
    if (error) {
      res.statusCode = 400;
      res.json("There was an error.");
      throw error;
    }
    if (data) {
      res.statusCode = 200;
      res.json(data);
      return;
    }
  }
}
