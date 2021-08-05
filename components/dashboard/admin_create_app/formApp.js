import { useState, useEffect } from "react";
import { supabase } from "../../../utils/initSupabase";
import Loading from "./../sectionLoading";
import Autocomplete from "../../global/autoComplete";
import { SearchIcon } from "@heroicons/react/solid";
import Select from "react-select";

export default function AppForm(props) {
  const [loading, setLoading] = useState(true);
  const [vendors, setVendors] = useState([]);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(false);

  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState();
  const [message, setMessage] = useState();
  // industries array
  const [industryList, setIndustryList] = useState([]);
  // form fields
  const [vendorName, setVendorName] = useState("");
  const [vendorId, setVendorId] = useState("");
  //   const [website, setWebsite] = useState("");
  const [productName, setProductName] = useState("");
  const [productLink, setProductLink] = useState("");
  const [productIndustry, setProductIndustry] = useState(1);
  const [sameName, setSameName] = useState(false);
  const [checked, setChecked] = useState(false);
  const [checkbox, setCheckbox] = useState(false);

  // Fetch on load
  useEffect(() => {
    setLoading(true);
    fetchIndustries();
    fetchVendors();
    setLoading(false);
  }, []);

  const fetchVendors = async () => {
    let { data: vendors, error } = await supabase.from("vendors").select("*");
    if (error) {
      setLoading(false);
      throw error;
    }
    if (vendors) {
      setLoading(false);
      setVendors(vendors);
      let arr = vendors.map((vendor) => vendor.name);
      setOptions(arr);
    }
  };

  const fetchIndustries = async () => {
    let { data: industries, error } = await supabase.from("industries").select("*");
    if (error) {
      throw error;
    }
    let list = [];
    industries.forEach(function (element) {
      list.push({ label: element.name, value: element.id });
    });
    setIndustryList(list);
    return;
  };

  const buttonClick = (val) => {
    setSelected(true);
    let selectedVendor = vendors.filter((vendor) => vendor.name === val);
    setVendorName(selectedVendor[0].name);
    setVendorId(selectedVendor[0].id);
  };

  const createProduct = async () => {
    let { data, error } = await supabase.from("products").insert([{ name: productName, vendor_id: vendorId, product_link: productLink, industry_id: productIndustry }]);
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
    let product = await createProduct();
    if (product) {
      handleSuccess(product.id);
    }
  };

  const handleCheckboxChange = (e) => {
    setSameName(e.target.checked);
    if (e.target.checked) {
      setProductName(vendorName);
    }
    if (!e.target.checked) {
      setProductName("");
    }
  };

  const handleSuccess = (pid) => {
    setUpdating(false);
    setSuccess(true);
    setSelected(false);
    setMessage("App created successfully");
    setVendorName("");
    setVendorId("");
    setProductName("");
    setProductLink("");
    setProductIndustry("");
    setChecked(false);
    setCheckbox(false);
    setSameName(false);
    props.setAppOnly(false);
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
            Create new app for existing company
          </h2>
        </div>
        <div className="mt-6 grid grid-cols-4 gap-6">
          {!selected && (
            <div className="col-span-4">
              <label htmlFor="vendorName" className="block text-sm font-medium text-gray-700">
                Select company
              </label>
              <Autocomplete options={options} buttonClick={buttonClick} select={true} />
            </div>
          )}
          {selected && (
            <>
              <div className="col-span-4">
                <button
                  type="button"
                  onClick={() => setSelected(false)}
                  className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium text-white bg-purple hover:bg-purple-dark focus:outline-none focus:ring-0"
                >
                  <SearchIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
                  Search again
                </button>
              </div>

              <div className="col-span-4 sm:col-span-2">
                <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                  Company ID
                </label>
                <span className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm">{vendorId}</span>
              </div>
              <div className="col-span-4 sm:col-span-2">
                <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                  Company Name
                </label>
                <span className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm">{vendorName}</span>
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
                <label htmlFor="detailsLink" className="block text-sm font-medium text-gray-700">
                  App details link
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
              <div className="col-span-4 sm:col-span-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                    App industry
                  </label>
                </div>
                <Select
                  options={industryList}
                  isSearchable={true}
                  className="mt-1 z-10"
                  value={industryList.filter((option) => option.value === productIndustry)}
                  onChange={(option) => setProductIndustry(option.value)}
                />
              </div>
            </>
          )}
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
