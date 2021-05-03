import { useState, useEffect } from "react";
import { supabase } from "../../utils/initSupabase";
import Loading from "./sectionLoading";

export default function Vendor(props) {
  const [loading, setLoading] = useState(true);

  const [vendorname, setVendorname] = useState("");
  const [vendorwebsite, setVendorwebsite] = useState("");
  const [vendorlogo, setVendorlogo] = useState("");

  // Fetch on load
  useEffect(() => {
    fetchData(props.user.id);
  }, []);

  const fetchData = async (user_id) => {
    try {
      let vendorData = await supabase
        .from("users")
        .select(
          `
            vendors:vendor_id (*)
            `
        )
        .eq("id", user_id);
      setVendorname(vendorData.body[0].vendors.name);
      setVendorwebsite(vendorData.body[0].vendors.website);
      setVendorlogo(vendorData.body[0].vendors.logo);
    } catch (error) {
      alert(error);
    }
    setLoading(false);
  };

  if (loading) return <Loading />;

  return (
    <section className="py-4 space-y-4">
      <form>
        <div className="shadow sm:overflow-hidden">
          <div className="bg-white py-6 px-4 sm:p-6">
            <div>
              <h2 id="account_details_heading" className="text-lg leading-6 font-medium text-gray-900">
                Vendor details
              </h2>
            </div>
            <div className="mt-6 grid grid-cols-4 gap-6">
              <div className="col-span-4 sm:col-span-2">
                <label htmlFor="vendor_name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input type="text" name="vendor_name" id="vendor_name" placeholder="AppCity" value={vendorname} onChange={(e) => setVendorname(e.target.value)} autoComplete="organization" className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm" />
              </div>

              <div className="col-span-4 sm:col-span-2">
                <label htmlFor="vendor_website" className="block text-sm font-medium text-gray-700">
                  Website
                </label>
                <input type="text" name="vendor_website" id="vendor_website" placeholder="tryappcity.com" value={vendorwebsite} onChange={(e) => setVendorwebsite(e.target.value)} className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm" />
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
    </section>
  );
}
