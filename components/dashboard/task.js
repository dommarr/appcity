import { useState, useEffect } from "react";
import { supabase } from "../../utils/initSupabase";
import Loading from "./cardLoading";
import VendorForm from "./vendorForm";
import ProductForm from "./productForm";
import CategoryForm from "./categoryForm";
import TierForm from "./tierForm";
import { PlusCircleIcon } from "@heroicons/react/outline";

export default function Task({ productId }) {
  const [loading, setLoading] = useState(true);
  const [vendorId, setVendorId] = useState();
  const [tierIds, setTierIds] = useState([]);
  const [priceModel, setPriceModel] = useState();

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

  const handleAddTier = async () => {
    const { data, error } = await supabase.from("tiers").insert([{ product_id: productId, number: tierIds.length + 1 }]);
    if (error) {
      throw error;
    }
    if (data) {
      fetchTierIds(productId);
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
      {productId && vendorId && <ProductForm productId={productId} vendorId={vendorId} priceModel={priceModel} setPriceModel={setPriceModel} />}
      {productId && vendorId && <CategoryForm productId={productId} />}
      {tierIds &&
        tierIds.map((tierId, idx) => {
          return <TierForm key={idx} tierNum={idx + 1} tierId={tierId} productId={productId} updateFeatures={updateFeatures} priceModel={priceModel} fetchTierIds={fetchTierIds} />;
        })}
      <div>
        <button
          type="button"
          onClick={() => handleAddTier()}
          className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium text-white bg-purple hover:bg-purple-dark focus:outline-none focus:ring-0"
        >
          <PlusCircleIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
          Add tier
        </button>
      </div>
    </>
  );
}
