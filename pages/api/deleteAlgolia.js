import algoliasearch from "algoliasearch";
import { supabase } from "../../utils/initSupabase";

const algoliaApp = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
const algoliaKey = process.env.ALGOLIA_ADMIN_KEY;
const algolia = algoliasearch(algoliaApp, algoliaKey);
const index = algolia.initIndex("app_catalog");

// https://www.algolia.com/doc/api-reference/api-methods/browse/

// This function deletes objects in the Algolia index that no longer exist in the Supabase database (i.e. a product that was deleted).

export default async function (req, res) {
  const fetchProducts = async () => {
    let { data: products, error } = await supabase.from("products").select("id");
    if (error) {
      throw error;
    }
    return products;
  };

  const fetchAlgoliaIndex = async () => {
    let hits = [];
    await index.browseObjects({
      query: "",
      attributesToRetrieve: ["objectID"],
      batch: (batch) => {
        hits = hits.concat(batch);
      },
    });
    return hits;
  };

  const deleteObjects = async (arr) => {
    let res = await index.deleteObjects(arr);

    return res;
  };

  let hits = await fetchAlgoliaIndex();
  hits = hits.map((elem) => elem.objectID);
  let products = await fetchProducts();
  products = products.map((elem) => elem.id.toString());

  let delArr = hits.filter((hit) => !products.includes(hit));

  let response = await deleteObjects(delArr);

  res.statusCode = 200;
  res.json(response.objectIDs);
}
