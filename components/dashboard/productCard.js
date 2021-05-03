import { useState, useEffect } from "react";
import { supabase } from "../../utils/initSupabase";
import Loading from "./sectionLoading";

export default function ProductCard({ product }) {
  const [tiers, setTiers] = useState(null);
  const [loading, setLoading] = useState(true);

  const [productname, setProductname] = useState(product.name);
  const [pricelink, setPricelink] = useState(product.price_link);
  const [keywords, setKeywords] = useState(product.keywords);

  // Fetch on load
  useEffect(() => {
    fetchTiers(product.id);
    console.log(product.id);
  }, []);

  const fetchTiers = async (product_id) => {
    try {
      let tierData = await supabase
        .from("tiers")
        .select(
          `*
            `
        )
        .eq("product_id", product_id);
      setTiers(tierData);
      console.log(tierData.data);
    } catch (error) {
      alert(error);
    }
  };

  //   if (loading) return <Loading />;

  return (
    <form>
      <div className="shadow sm:overflow-hidden">
        <div className="bg-white py-6 px-4 sm:p-6">
          <div>
            <h2 id="account_details_heading" className="text-lg leading-6 font-medium text-gray-900">
              {product.name}
            </h2>
          </div>
          <div className="mt-6 grid grid-cols-4 gap-6">
            <div className="col-span-4 sm:col-span-2">
              <label htmlFor="product_name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input type="text" name="product_name" id="product_name" placeholder="Hubspot Sales Hub" value={productname} onChange={(e) => setProductname(e.target.value)} className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm" />
            </div>

            <div className="col-span-4 sm:col-span-2">
              <label htmlFor="price_link" className="block text-sm font-medium text-gray-700">
                Pricing Link
              </label>
              <input type="text" name="price_link" id="price_link" placeholder="https://www.hubspot.com/pricing/sales" value={pricelink} onChange={(e) => setPricelink(e.target.value)} className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm" />
            </div>

            <div className="col-span-4 sm:col-span-2">
              <label htmlFor="keywords" className="block text-sm font-medium text-gray-700">
                Keywords
              </label>
              <textarea type="text" name="keywords" id="keywords" placeholder="crm, sales, contact management, customer management" value={keywords} onChange={(e) => setKeywords(e.target.value)} className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm" />
            </div>
          </div>
        </div>
        <div className="flex px-4 py-3 bg-gray-50 text-right sm:px-6">
          <button type="submit" className="bg-purple border border-transparent shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-purple-extradark focus:outline-none focus:ring-0">
            Update
          </button>
          <div className="flex items-center ml-4">"success"</div>
        </div>
      </div>
    </form>
  );
}
