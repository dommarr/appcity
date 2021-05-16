import { useState, useEffect } from "react";
import { supabase } from "../../utils/initSupabase";
import Loading from "./cardLoading";
import VendorForm from "./vendorForm";
import ProductForm from "./productForm";
import TierForm from "./tierForm";

export default function Task({ productId }) {
  const [loading, setLoading] = useState(true);
  const [vendorId, setVendorId] = useState();
  const [tierIds, setTierIds] = useState([]);

  // Fetch on load
  useEffect(() => {
    fetchVendorId(productId);
    fetchTierIds(productId);
    setLoading(false);
  }, []);

  const fetchVendorId = async (product_id) => {
    let { data: products, error } = await supabase.from("products").select("vendor_id").eq("id", product_id);
    if (error) {
      throw error;
    }
    setVendorId(products[0].vendor_id);
  };

  const compare = (a, b) => {
    const tierNumA = a.number;
    const tierNumB = b.number;

    let comparison = 0;
    if (tierNumA > tierNumB) {
      comparison = 1;
    } else if (tierNumA < tierNumB) {
      comparison = -1;
    }
    return comparison;
  };

  const fetchTierIds = async (product_id) => {
    let { data: tiers, error } = await supabase.from("tiers").select("*").eq("product_id", product_id);
    if (error) {
      throw error;
    }
    let sortedTierArray = tiers.slice().sort(compare);
    let tierIdsArray = [];
    sortedTierArray.forEach((element) => tierIdsArray.push(element.id));
    setTierIds(tierIdsArray);
  };

  const getCumulativeFeatures = async (tier_id, product_id) => {
    let cumulativeFeatures = [];
    let { data: tiers, error } = await supabase.from("tiers").select("*").eq("product_id", product_id);
    if (error) {
      throw error;
    }
    let currentTier = tiers.filter((tier) => tier.id === tier_id);
    tiers.forEach((element) => {
      if (element.number <= currentTier[0].number) {
        cumulativeFeatures.push.apply(cumulativeFeatures, element.display_features);
      }
    });
    return cumulativeFeatures;
  };

  const updateFeatures = async (product_id) => {
    for (let index = 0; index < tierIds.length; index++) {
      const tier = tierIds[index];
      let features = await getCumulativeFeatures(tier, product_id);
      let uniqueFeatures = [...new Set(features)];
      const { data, error } = await supabase.from("tiers").update({ features: uniqueFeatures }).eq("id", tier);
      if (error) {
        throw error;
      }
    }
  };

  //   tierIds.forEach((tier) => {
  //     let features = await getCumulativeFeatures(tier, product_id);
  //     const { data, error } = await supabase.from("tiers").update({ features: features }).eq("id", tier);
  //     if (error) {
  //       throw error;
  //     }
  //   });
  // };

  if (loading) return <Loading />;

  return (
    <>
      {vendorId && <VendorForm vendorId={vendorId} />}
      {productId && vendorId && <ProductForm productId={productId} vendorId={vendorId} />}
      {tierIds &&
        tierIds.map((tierId, idx) => {
          return <TierForm key={idx} tierNum={idx + 1} tierId={tierId} productId={productId} updateFeatures={updateFeatures} />;
        })}
    </>
  );
}
