import { useState, useEffect } from "react";
import { supabase } from "../../utils/initSupabase";
import Loading from "./sectionLoading";
import ProductCard from "./productCard";

export default function Products(props) {
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newproduct, setNewproduct] = useState(false);

  let [form, setForm] = useState({
    name: "",
    pricelink: "",
    keywords: "",
  });

  let handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    form[name] = value;
    setForm(form);
  };

  // Fetch on load
  useEffect(() => {
    fetchProducts(props.user.id);
  }, []);

  const fetchProducts = async (user_id) => {
    try {
      let vendorData = await supabase
        .from("users")
        .select(
          `
            vendors:vendor_id (*)
            `
        )
        .eq("id", user_id);
      if (vendorData) {
        let productData = await supabase
          .from("products")
          .select(
            `*
          `
          )
          .eq("vendor_id", vendorData.body[0].vendors.id);
        setProducts(productData.body);
      }
    } catch (error) {
      alert(error);
    }
    setLoading(false);
  };

  if (loading) return <Loading />;

  return (
    <section className="py-4 space-y-4">
      <ol>
        {products.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ol>
      {!newproduct && (
        <div className="flex justify-end">
          <button type="button" onClick={() => setNewproduct(true)} className="bg-purple border border-transparent shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-purple-extradark focus:outline-none focus:ring-0">
            Add product
          </button>
        </div>
      )}
      {newproduct && (
        <form>
          <div className="shadow sm:overflow-hidden">
            <div className="bg-white py-6 px-4 sm:p-6">
              <div>
                <h2 id="account_details_heading" className="text-lg leading-6 font-medium text-gray-900">
                  Add new product
                </h2>
              </div>
              <div className="mt-6 grid grid-cols-4 gap-6">
                <div className="col-span-4 sm:col-span-2">
                  <label htmlFor="product_name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input type="text" name="product_name" id="product_name" placeholder="Hubspot Sales Hub" onChange={handleChange} className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm" />
                </div>

                <div className="col-span-4 sm:col-span-2">
                  <label htmlFor="price_link" className="block text-sm font-medium text-gray-700">
                    Pricing Link
                  </label>
                  <input type="text" name="price_link" id="price_link" placeholder="https://www.hubspot.com/pricing/sales" onChange={handleChange} className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm" />
                </div>

                <div className="col-span-4 sm:col-span-2">
                  <label htmlFor="keywords" className="block text-sm font-medium text-gray-700">
                    Keywords
                  </label>
                  <textarea type="text" name="keywords" id="keywords" placeholder="crm, sales, contact management, customer management" onChange={handleChange} className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm" />
                </div>
              </div>
            </div>
            <div className="flex px-4 py-3 bg-gray-50 text-right sm:px-6 space-x-2">
              <button type="submit" className="bg-purple border border-transparent shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-purple-extradark focus:outline-none focus:ring-0">
                Submit
              </button>
              <button type="button" onClick={() => setNewproduct(false)} className="bg-transparent border border-purple shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-purple hover:bg-white focus:outline-none focus:ring-0">
                Cancel
              </button>
              <div className="flex items-center ml-4">"success"</div>
            </div>
          </div>
        </form>
      )}
    </section>
  );
}
