import { useState, useEffect } from "react";
import { supabase } from "../../utils/initSupabase";
import Loading from "./cardLoading";

export default function ProductForm({ productId, vendorId }) {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState();
  const [message, setMessage] = useState();
  // form fields
  const [productName, setProductName] = useState("");
  const [priceLink, setPriceLink] = useState("");
  const [priceModel, setPriceModel] = useState("");
  const [keywords, setKeywords] = useState("");
  const [media, setMedia] = useState([]);

  // Fetch on load
  useEffect(() => {
    fetchProductData(productId);
    setLoading(false);
  }, []);

  const fetchProductData = async (product_id) => {
    let { data: products, error } = await supabase.from("products").select("*").eq("id", product_id);
    if (error) {
      throw error;
    }
    products[0].name ? setProductName(products[0].name) : "";
    products[0].price_link ? setPriceLink(products[0].price_link) : "";
    products[0].price_model ? setPriceModel(products[0].price_model) : "";
    products[0].keywords ? setKeywords(products[0].keywords) : "";
    products[0].media ? setMedia(products[0].media) : "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    const { data, error } = await supabase.from("products").update({ name: productName, price_link: priceLink, price_model: priceModel, keywords: keywords, media: media }).eq("id", productId);
    if (error) {
      handleFailure();
      throw error;
    }
    if (data) {
      handleSuccess();
    }
  };

  const handleSuccess = () => {
    setUpdating(false);
    setSuccess(true);
    setMessage("Saved successfully.");
    setTimeout(function () {
      setMessage("");
    }, 2000);
  };

  const handleFailure = () => {
    setUpdating(false);
    setSuccess(false);
    setMessage("There was an error. Please try again.");
    setTimeout(function () {
      setMessage("");
    }, 2000);
  };

  if (loading) return <Loading />;

  return (
    <div className="shadow sm:overflow-hidden">
      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <div className="bg-white py-6 px-4 sm:p-6">
          <div>
            <h2 id="app-details-heading" className="text-lg leading-6 font-medium text-gray-900">
              App details
            </h2>
          </div>
          <div className="mt-6 grid grid-cols-4 gap-6">
            <div className="col-span-4 sm:col-span-2">
              <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
                Product name
              </label>
              <input type="text" name="productName" id="productName" placeholder="Hubspot Sales Hub" value={productName} onChange={(e) => setProductName(e.target.value)} required className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm" />
            </div>
            <div className="col-span-4 sm:col-span-2">
              <label htmlFor="priceLink" className="block text-sm font-medium text-gray-700">
                Pricing page link
              </label>
              <input type="url" name="priceLink" id="priceLink" placeholder="https://www.hubspot.com/pricing/sales" value={priceLink} onChange={(e) => setPriceLink(e.target.value)} required className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm" />
            </div>
            <div className="col-span-4 sm:col-span-2">
              <label htmlFor="priceModel" className="block text-sm font-medium text-gray-700">
                Pricing model
              </label>
              <select type="text" name="priceModel" id="priceModel" placeholder="Flat-rate pricing" value={priceModel} onChange={(e) => setPriceModel(e.target.value)} required className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm">
                <option value="per-user">Per-user pricing</option>
                <option value="usage-based">Usage-based pricing</option>
                <option value="flat-rate">Flat-rate pricing</option>
              </select>
            </div>
            <div className="col-span-4 sm:col-span-2">
              <label htmlFor="keywords" className="block text-sm font-medium text-gray-700">
                Keywords
              </label>
              <textarea type="text" name="keywords" id="keywords" placeholder="sales crm contact management marketing" value={keywords} onChange={(e) => setKeywords(e.target.value)} required className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm" />
            </div>
            <div className="col-span-4 sm:col-span-2">
              <label htmlFor="media" className="block text-sm font-medium text-gray-700">
                Media
              </label>
              {/* {media && media.map((obj, index) => (
                <input type="url" name="media" id="media" placeholder="https://www.hubspot.com/pricing/sales" value={media} onChange={(e) => setMedia(e.target.value)} required className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm" />

                ))} */}
            </div>
          </div>
        </div>
        <div className="flex px-4 py-3 bg-gray-50 text-right sm:px-6">
          {!updating && (
            <button type="submit" className="bg-purple border border-transparent shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-purple-extradark focus:outline-none focus:ring-0">
              Save
            </button>
          )}
          {updating && (
            <button className="bg-purple border border-transparent shadow-sm inline-flex py-1.5 px-5 justify-center items-center text-sm font-medium text-white focus:outline-none focus:ring-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </button>
          )}
          <div className={`flex items-center ml-4 ${success ? `text-green-600` : `text-red-600`}`}>{message}</div>
        </div>
      </form>
    </div>
  );
}
