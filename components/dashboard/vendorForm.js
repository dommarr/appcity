import { useState, useEffect } from "react";
import { supabase } from "../../utils/initSupabase";
import Loading from "./CardLoading";

export default function VendorForm({ vendorId }) {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState();
  const [message, setMessage] = useState();
  const [vendorName, setVendorName] = useState("");
  const [website, setWebsite] = useState("");
  const [logo, setLogo] = useState("");

  // Fetch on load
  useEffect(() => {
    fetchVendorData(vendorId);
    setLoading(false);
  }, []);

  const fetchVendorData = async (vendor_id) => {
    let { data: vendors, error } = await supabase.from("vendors").select("*").eq("id", vendor_id);
    if (error) {
      throw error;
    }
    vendors[0].name ? setVendorName(vendors[0].name) : "";
    vendors[0].website ? setWebsite(vendors[0].website) : "";
    vendors[0].logo ? setLogo(vendors[0].logo) : "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    const { data, error } = await supabase.from("vendors").update({ name: vendorName, website: website, logo: logo }).eq("id", vendorId);
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
            <h2 id="account_details_heading" className="text-lg leading-6 font-medium text-gray-900">
              Company details
            </h2>
          </div>
          <div className="mt-6 grid grid-cols-4 gap-6">
            <div className="col-span-4 sm:col-span-2">
              <label htmlFor="vendorName" className="block text-sm font-medium text-gray-700">
                Company name
              </label>
              <input type="text" name="vendorName" id="vendorName" placeholder="Hubspot" value={vendorName} onChange={(e) => setVendorName(e.target.value)} required className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm" />
            </div>
            <div className="col-span-4 sm:col-span-2">
              <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                Company website
              </label>
              <input type="url" name="website" id="website" placeholder="https://www.hubspot.com/" value={website} onChange={(e) => setWebsite(e.target.value)} required className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm" />
            </div>
            <div className="col-span-4 sm:col-span-2">
              <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
                Company logo
              </label>
              <input type="url" name="logo" id="logo" placeholder="https://assets.brandfetch.io/298f948a6d77483.png" value={logo} onChange={(e) => setLogo(e.target.value)} required className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm" />
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
