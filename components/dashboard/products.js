import { useState, useEffect } from "react";
import { supabase } from "../../utils/initSupabase";
import Loading from "./sectionLoading";

export default function Products(props) {
    const [vendor, setVendor] = useState(null);
    const [products, setProducts] = useState(null);
    const [tiers, setTiers] = useState(null);
    const [loading, setLoading] = useState(true);

    // let [vendorForm, setVendorForm] = useState({
    //   vendor_name: '',
    //   vendor_website: '',
    //   vendor_logo: ''
    // });

  //   let handleChange = (e) => {
  //     let name = e.target.name;
  //     let value = e.target.value;
  //     form[name] = value;
  //     setForm(form);
  // }
  
    // Fetch on load
    useEffect(() => {
        fetchData(props.user.id)
      }, [])
    
    const fetchData = async (user_id) => {
      try {
        let vendorData = await supabase.from('users').select(`
            vendors:vendor_id (*)
            `).eq("id", user_id)
        setVendor(vendorData.body[0].vendors)
        console.log(vendorData.body[0].vendors.id)
        if (vendorData) {
          let productData = await supabase.from('products').select(`*
          `).eq("vendor_id", vendorData.body[0].vendors.id)
          console.log(productData.body[0].id)
          setProducts(productData.body)
          if (productData) {
            let tierData = []
            for (const product of productData.body) {
              let tierResponse = await supabase.from('tiers').select(`*
              `).eq("product_id", product.id)
              tierData.push(tierResponse.body)
            }
            setTiers(tierData)
          }
        }
      } catch (error) {
        alert(error)
      }
      setLoading(false)
    }
  
    if (loading) return <Loading />;
  
    return (
      <section className="py-4 space-y-4">
        <form>
        {/* <div className="shadow sm:overflow-hidden">
          <div className="bg-white py-6 px-4 sm:p-6">
            <div>
              <h2 id="account_details_heading" className="text-lg leading-6 font-medium text-gray-900">
                Vendor details
              </h2>
            </div>
            <div className="mt-6 grid grid-cols-4 gap-6">
              <div className="col-span-4 sm:col-span-2">
                <label htmlFor="vendor_name" className="block text-sm font-medium text-gray-700">
                  Vendor name
                </label>
                <input type="text" name="vendor_name" id="vendor_name" placeholder="Salesforce" value={vendor_name} className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm" />
              </div>

              <div className="col-span-4 sm:col-span-2">
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                  Last name
                </label>
                <input type="text" name="last_name" id="last_name" placeholder="Doe" value={lastname} autoComplete="family-name" className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm" />
              </div>
            </div>
          </div>
          <div className="flex px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button type="submit" className="bg-purple border border-transparent shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-purple-extradark focus:outline-none focus:ring-0">
              Update
            </button>
            <div className="flex items-center ml-4">{success}</div>
          </div>
        </div> */}
      </form>
        
      </section>
    );
  }