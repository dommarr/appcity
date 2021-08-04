import { useState, useEffect } from "react";
import { supabase } from "../../../utils/initSupabase";
import Loading from "./../sectionLoading";

export default function AppCompanyForm(props) {
  const [loading, setLoading] = useState(true);
  const [vendors, setVendors] = useState([]);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState();

  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState();
  const [message, setMessage] = useState();
  // form fields
  const [vendorName, setVendorName] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [website, setWebsite] = useState("");
  const [productName, setProductName] = useState("");
  const [productLink, setProductLink] = useState("");
  const [sameName, setSameName] = useState(false);
  const [checked, setChecked] = useState(false);
  const [checkbox, setCheckbox] = useState(false);

  // Fetch on load
  useEffect(() => {
    setLoading(false);
  }, []);

  const createVendor = async () => {
    let { data, error } = await supabase.from("vendors").insert([{ name: vendorName, website: website }]);
    if (error) {
      handleFailure();
      throw error;
    }
    return data[0];
  };

  const createProduct = async (vendor_id) => {
    let { data, error } = await supabase.from("products").insert([{ name: productName, vendor_id: vendor_id, product_link: productLink }]);
    if (error) {
      handleFailure();
      throw error;
    }
    handleSuccess();
    return data[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    let vendor = await createVendor();
    let product = await createProduct(vendor.id);
    if (product) {
      handleSuccess(product.id);
    }
  };

  const handleCheckboxChange = (e) => {
    setSameName(e.target.checked);
    if (e.target.checked) {
      setProductName(vendorName);
      setProductLink(website);
    }
    if (!e.target.checked) {
      setProductName("");
      setProductLink("");
    }
  };

  const handleSuccess = (pid) => {
    setUpdating(false);
    setSuccess(true);
    setMessage("App created successfully");
    setVendorName("");
    setWebsite("");
    setProductName("");
    setProductLink("");
    setChecked(false);
    setCheckbox(false);
    setSameName(false);
    props.setAppCompany(false);
    props.setCategoryForm(true);
    props.setProductId(pid);
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
    <form
      onSubmit={(e) => {
        handleSubmit(e);
      }}
    >
      <div className="bg-white py-6 px-4 sm:p-6">
        <div>
          <h2 id="company-details-heading" className="text-lg leading-6 font-medium text-gray-900">
            Create new company & app
          </h2>
        </div>
        <div className="mt-6 grid grid-cols-4 gap-6">
          <div className="col-span-4 sm:col-span-2">
            <label htmlFor="vendorName" className="block text-sm font-medium text-gray-700">
              Company name
            </label>
            <input
              type="text"
              name="vendorName"
              id="vendorName"
              placeholder="Hubspot"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
            />
          </div>
          <div className="col-span-4 sm:col-span-2">
            <label htmlFor="website" className="block text-sm font-medium text-gray-700">
              Company website
            </label>
            <input
              type="url"
              name="website"
              id="website"
              placeholder="https://www.hubspot.com/"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
            />
          </div>
          <div className="col-span-4 sm:col-span-2">
            <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
              App name
            </label>
            <input
              type="text"
              name="productName"
              id="productName"
              placeholder="Hubspot Sales Hub"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
            />
            <div className="flex p-2 space-x-2 justify-start items-center">
              <input type="checkbox" value={sameName} onChange={handleCheckboxChange}></input>
              <label className="block text-sm text-gray-700">Same as company name</label>
            </div>
          </div>
          <div className="col-span-4 sm:col-span-2">
            <label htmlFor="productLink" className="block text-sm font-medium text-gray-700">
              App website
            </label>
            <input
              type="url"
              name="productLink"
              id="productLink"
              placeholder="https://www.hubspot.com/products/sales"
              value={productLink}
              onChange={(e) => setProductLink(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
            />
          </div>
        </div>
      </div>
      <div className="flex px-4 py-3 bg-gray-50 text-right sm:px-6">
        {!updating && (
          <button
            type="submit"
            className="bg-purple border border-transparent shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-purple-extradark focus:outline-none focus:ring-0"
          >
            Create
          </button>
        )}
        {updating && (
          <button className="bg-purple border border-transparent shadow-sm inline-flex py-1.5 px-5 justify-center items-center text-sm font-medium text-white focus:outline-none focus:ring-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </button>
        )}
        <div className={`flex items-center ml-4 ${success ? `text-green-600` : `text-red-600`}`}>{message}</div>
      </div>
    </form>
  );
}
