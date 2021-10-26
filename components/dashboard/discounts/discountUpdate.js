import { useState, useEffect } from "react";
import { supabase } from "../../../utils/initSupabase";
import Loading from "../cardLoading";
import ProductDiscountForm from "./discount_update_sections/productDiscountForm";
import VendorDiscountForm from "./discount_update_sections/vendorDiscountForm";
import TestLinks from "./discount_update_sections/testLinks";

export default function DiscountUpdate({ productId, user }) {
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [vendor, setVendor] = useState(null);
  const [testLinksRender, setTestLinksRender] = useState(1);

  // Fetch on load
  useEffect(async () => {
    setLoading(true);
    let product = await fetchApp(productId);
    setProduct(product);
    setVendor(product.vendors);
    setLoading(false);
  }, []);

  const fetchApp = async (product_id) => {
    let { data: products, error } = await supabase.from("products").select(`*, vendors(*)`).eq("id", product_id);
    if (error) {
      throw error;
    }
    return products[0];
  };

  const forceRender = () => {
    setTestLinksRender(testLinksRender + 1);
  };

  if (loading) return <Loading />;

  return (
    <div className="flex flex-col space-y-4">
      {product && <TestLinks fetchApp={fetchApp} productId={productId} testLinksRender={testLinksRender} />}
      {vendor && <VendorDiscountForm vendor={vendor} forceRender={forceRender} />}
      {product && <ProductDiscountForm product={product} forceRender={forceRender} />}
    </div>
  );
}
