import { useState, useEffect } from "react";
import { supabase } from "../../utils/initSupabase";
import Loading from "./CardLoading";
import VendorForm from "./vendorForm";

export default function Task({ productId }) {
  const [loading, setLoading] = useState(true);
  const [vendorId, setVendorId] = useState();
  const [tierIds, setTierIds] = useState();

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

  const fetchTierIds = async (product_id) => {
    let { data: tiers, error } = await supabase.from("tiers").select("id").eq("product_id", product_id);
    if (error) {
      throw error;
    }
    let tierArray = [];
    tiers.forEach((element) => tierArray.push(element.id));
    setTierIds(tierArray);
  };

  if (loading) return <Loading />;

  return <>{vendorId && <VendorForm vendorId={vendorId} />}</>;
}
