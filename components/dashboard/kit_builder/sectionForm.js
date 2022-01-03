import { useState, useEffect } from "react";
import { Loader } from "react-feather";
import Select from "react-select";
import { supabase } from "../../../utils/initSupabase";

export default function SectionForm({ apps, section }) {
  // form submission states
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState();
  const [message, setMessage] = useState();
  // section form
  const [sectionName, setSectionName] = useState("");
  const [sectionOrder, setSectionOrder] = useState(null);
  const [sectionApps, setSectionApps] = useState([]);

  // Fetch on load
  useEffect(() => {
    section.name ? setSectionName(section.name) : "";
    section.order ? setSectionOrder(section.order) : "";
    if (section.sections_products) {
      let sectionProducts = section.sections_products.map((sectionProduct) => sectionProduct.product_id);
      setSectionApps(apps.filter((app) => sectionProducts.includes(app.value)));
    }
  }, []);

  const updateSection = async (arr) => {
    let { data, error } = await supabase.from("kit_sections").update(arr).eq("id", section.id);
    if (error) {
      handleFailure();
      throw error;
    }
    return data[0];
  };

  const deleteSectionProducts = async (sectionId) => {
    const { data, error } = await supabase.from("sections_products").delete().eq("section_id", sectionId);
    if (error) {
      throw error;
    }
    return data;
  };

  const createSectionProducts = async (arr) => {
    const { data, error } = await supabase.from("sections_products").insert(arr);
    if (error) {
      handleFailure();
      throw error;
    }
    return data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    let sectionObj = {
      name: sectionName,
      order: sectionOrder,
    };
    let sectionProductsArray = sectionApps.map((app) => {
      return {
        section_id: section.id,
        product_id: app.value,
      };
    });
    let sectionUpdated = await updateSection([sectionObj]);
    let sectionProductsDeleted = await deleteSectionProducts(section.id);
    let sectionProductsCreated = "";
    if (sectionProductsDeleted) {
      sectionProductsCreated = await createSectionProducts(sectionProductsArray);
    }
    if (sectionUpdated && sectionProductsCreated) {
      handleSuccess();
    }
  };

  const handleSuccess = () => {
    setUpdating(false);
    setSuccess(true);
    setMessage("Saved successfully.");
    setTimeout(function () {
      setMessage("");
    }, 4000);
  };

  const handleFailure = () => {
    setUpdating(false);
    setSuccess(false);
    setMessage("There was an error. Please try again.");
    setTimeout(function () {
      setMessage("");
    }, 4000);
  };

  return (
    <form
      onSubmit={(e) => {
        handleSubmit(e);
      }}
      className="shadow"
    >
      <div className="bg-white py-6 px-4 sm:p-6">
        <div>
          <h2 id="company-details-heading" className="text-lg leading-6 font-medium text-gray-900">
            Edit section
          </h2>
        </div>
        <div className="mt-6 grid grid-cols-4 gap-6">
          <div className="col-span-4 sm:col-span-2">
            <label htmlFor="sectionName" className="block text-sm font-medium text-gray-700">
              Section name
            </label>
            <input
              type="text"
              name="sectionName"
              id="sectionName"
              placeholder="HR & Payroll"
              value={sectionName}
              onChange={(e) => setSectionName(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
            />
          </div>
          <div className="col-span-4 sm:col-span-2">
            <label htmlFor="sectionOrder" className="block text-sm font-medium text-gray-700">
              Section order
            </label>
            <input
              type="number"
              name="sectionOrder"
              id="sectionOrder"
              placeholder="3"
              value={sectionOrder}
              onChange={(e) => setSectionOrder(e.target.value)}
              className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
            />
          </div>
          <div className="col-span-4">
            <label htmlFor="sectionApps" className="block text-sm font-medium text-gray-700">
              Add apps
            </label>
            <Select isMulti name="sectionApps" options={apps} className="basic-multi-select" classNamePrefix="select" value={sectionApps} onChange={(option) => setSectionApps(option)} />
          </div>
        </div>
      </div>
      <div className="flex px-4 py-3 bg-gray-50 text-right sm:px-6">
        {!updating && (
          <button
            type="submit"
            className="bg-purple border border-transparent shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-purple-extradark focus:outline-none focus:ring-0"
          >
            Save
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
