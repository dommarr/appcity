import { useState, useEffect } from "react";
import { supabase } from "../../../utils/initSupabase";
import Loading from "../cardLoading";
import VendorForm from "./vendorForm";
import ProductForm from "./productForm";
import CategoryForm from "./categoryForm";
import TierForm from "./tierForm";
import FormTip from "./formTip";
import { PlusCircleIcon } from "@heroicons/react/outline";
import TaskCard from "../tasks/taskCard";

export default function Task({ pId, user, task }) {
  const [loading, setLoading] = useState(true);
  const [productId, setProductId] = useState();
  const [vendorId, setVendorId] = useState();
  const [tierIds, setTierIds] = useState([]);
  const [priceModel, setPriceModel] = useState();
  const [customUnit, setCustomUnit] = useState("");
  //const [complete, setComplete] = useState(false);
  const [superAdmin, setSuperAdmin] = useState(false);
  const [refreshTiers, setRefreshTiers] = useState(0);

  // Fetch on load
  useEffect(() => {
    setProductId(pId);
    fetchVendorId(pId);
    fetchTierIds(pId);
    fetchUserProfile(user.id);
    setLoading(false);
  }, []);

  const fetchUserProfile = async (user_id) => {
    let { data: users, error } = await supabase.from("users").select("super_admin").eq("id", user_id);
    if (error) {
      throw error;
    }
    setSuperAdmin(users[0].super_admin);
  };

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
    let unit = "";
    if (priceModel === "custom") {
      unit = "see app website for details";
    }
    if (priceModel === "quote") {
      unit = "contact developer for a quote";
    }
    if (priceModel === "per-project") {
      if (customUnit === "") {
        unit = "per project per month";
      } else {
        unit = `per ${customUnit} per month`;
      }
    }
    if (priceModel === "flat-rate") {
      unit = "per month";
    }
    if (priceModel === "per-user") {
      if (customUnit === "") {
        unit = "per user per month";
      } else {
        unit = `per ${customUnit} per month`;
      }
    }
    if (priceModel === "usage-based") {
      unit = "per month (starting)";
    }
    if (priceModel === "revenue-fee") {
      unit = "of revenue";
    }
    if (priceModel === "one-time") {
      unit = "one-time payment";
    }

    const { data, error } = await supabase
      .from("tiers")
      .insert([{ product_id: productId, number: tierIds.length + 1, price_primary_unit_year: unit, price_primary_unit_month: unit, last_updated_by: user.email }]);
    if (error) {
      throw error;
    }
    if (data) {
      fetchTierIds(productId);
    }
  };

  const updateTierPriceUnits = async (model) => {
    let unit = "";
    if (model === "custom") {
      unit = "see app website for details";
    }
    if (model === "quote") {
      unit = "contact developer for a quote";
    }
    if (model === "per-project") {
      if (customUnit === "") {
        unit = "per project per month";
      } else {
        unit = `per ${customUnit} per month`;
      }
    }
    if (model === "flat-rate") {
      unit = "per month";
    }
    if (model === "per-user") {
      if (customUnit === "") {
        unit = "per user per month";
      } else {
        unit = `per ${customUnit} per month`;
      }
    }
    if (model === "usage-based") {
      unit = "per month (starting)";
    }
    if (model === "revenue-fee") {
      unit = "of revenue";
    }
    if (model === "one-time") {
      unit = "one-time payment";
    }
    let updateObj = {
      price_primary_unit_year: unit,
      price_primary_unit_month: unit,
      last_updated_by: user.email,
    };
    if (model === "custom") {
      updateObj.price_primary_text_month = "Custom";
      updateObj.price_primary_text_year = "Custom";
      updateObj.price_primary_number_month = null;
      updateObj.price_primary_number_year = null;
    }
    if (model === "quote") {
      updateObj.price_primary_text_month = "Upon request";
      updateObj.price_primary_text_year = "Upon request";
      updateObj.price_primary_number_month = null;
      updateObj.price_primary_number_year = null;
    }

    const { data, error } = await supabase.from("tiers").update(updateObj).in("id", tierIds);
    if (error) {
      throw error;
    }
    if (data) {
      setTimeout(function () {
        setRefreshTiers(refreshTiers + 1);
      }, 2000);
      return;
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      {task && <TaskCard task={task} user={user} />}
      {vendorId && <VendorForm vendorId={vendorId} superAdmin={superAdmin} user={user} />}
      {productId && vendorId && (
        <ProductForm
          productId={productId}
          vendorId={vendorId}
          priceModel={priceModel}
          setPriceModel={setPriceModel}
          updateTierPriceUnits={updateTierPriceUnits}
          superAdmin={superAdmin}
          user={user}
          customUnit={customUnit}
          setCustomUnit={setCustomUnit}
        />
      )}
      {productId && vendorId && superAdmin && <CategoryForm productId={productId} />}
      {tierIds &&
        tierIds.map((tierId, idx) => {
          return (
            <TierForm
              key={idx}
              tierNum={idx + 1}
              tierId={tierId}
              productId={productId}
              updateFeatures={updateFeatures}
              priceModel={priceModel}
              fetchTierIds={fetchTierIds}
              user={user}
              refreshTiers={refreshTiers}
            />
          );
        })}
      <div className="flex flex-col max-w-sm">
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
        <FormTip video_id="1bbc4437ff1d4951b071a509bcc458dd" recent={true} />
      </div>
    </>
  );
}
