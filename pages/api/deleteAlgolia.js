import algoliasearch from "algoliasearch";
import { supabase } from "../../utils/initSupabase";

const algoliaApp = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
const algoliaKey = process.env.ALGOLIA_ADMIN_KEY;
const algolia = algoliasearch(algoliaApp, algoliaKey);
const index = algolia.initIndex("catalog");

// https://www.algolia.com/doc/api-reference/api-methods/browse/

export default async function (req, res) {
  const fetchTiers = async () => {
    let { data: tiers, error } = await supabase.from("tiers").select("id");

    if (error) {
      throw error;
    }
    return tiers;
  };

  const fetchAlgoliaIndex = async () => {
    let hits = [];
    let res = await index.browseObjects({
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
  let tiers = await fetchTiers();
  tiers = tiers.map((elem) => elem.id.toString());

  let delArr = hits.filter((hit) => !tiers.includes(hit));

  let response = await deleteObjects(delArr);

  res.statusCode = 200;
  res.json(response.objectIDs);
}
