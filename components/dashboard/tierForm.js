import { useState, useEffect } from "react";
import { supabase } from "../../utils/initSupabase";
import Loading from "./cardLoading";

export default function TierForm({ tierNum, tierId, productId, updateFeatures }) {
  // form loading
  const [loading, setLoading] = useState(true);
  // form submission states
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState();
  const [message, setMessage] = useState();
  // price model from product fetch
  const [priceModel, setPriceModel] = useState("");
  // form fields
  const [tierName, setTierName] = useState("");
  const [tierNumber, setTierNumber] = useState("");
  const [priceNote, setPriceNote] = useState("");
  const [displayFeatures, setDisplayFeatures] = useState([]);
  // Primary price
  const [pricePrimaryNumberMonth, setPricePrimaryNumberMonth] = useState("");
  const [pricePrimaryNumberYear, setPricePrimaryNumberYear] = useState("");
  const [pricePrimaryTextMonth, setPricePrimaryTextMonth] = useState("");
  const [pricePrimaryTextYear, setPricePrimaryTextYear] = useState("");
  //   const [pricePrimaryUnitMonth, setPricePrimaryUnitMonth] = useState("");
  //   const [pricePrimaryUnitYear, setPricePrimaryUnitYear] = useState("");
  // Secondary price
  const [priceSecondaryNumberMonth, setPriceSecondaryNumberMonth] = useState("");
  const [priceSecondaryNumberYear, setPriceSecondaryNumberYear] = useState("");
  const [priceSecondaryTextMonth, setPriceSecondaryTextMonth] = useState("");
  const [priceSecondaryTextYear, setPriceSecondaryTextYear] = useState("");
  const [priceSecondaryUnitMonth, setPriceSecondaryUnitMonth] = useState("");
  const [priceSecondaryUnitYear, setPriceSecondaryUnitYear] = useState("");

  // Fetch on load
  useEffect(() => {
    fetchPriceModel(productId);
    fetchTierData(tierId);
    setLoading(false);
  }, []);

  const fetchPriceModel = async (product_id) => {
    let { data: products, error } = await supabase.from("products").select("*").eq("id", product_id);
    if (error) {
      throw error;
    }
    products[0].price_model ? setPriceModel(products[0].price_model) : "";
  };

  const fetchTierData = async (tier_id) => {
    let { data: tiers, error } = await supabase.from("tiers").select("*").eq("id", tier_id);
    if (error) {
      throw error;
    }
    tiers[0].name ? setTierName(tiers[0].name) : "";
    tiers[0].number ? setTierNumber(tiers[0].number) : "";
    tiers[0].price_note ? setPriceNote(tiers[0].price_note) : "";
    tiers[0].display_features ? setDisplayFeatures(tiers[0].display_features) : "";
    // primary price
    tiers[0].price_primary_number_month ? setPricePrimaryNumberMonth(tiers[0].price_primary_number_month) : "";
    tiers[0].price_primary_number_year ? setPricePrimaryNumberYear(tiers[0].price_primary_number_year) : "";
    tiers[0].price_primary_text_month ? setPricePrimaryTextMonth(tiers[0].price_primary_text_month) : "";
    tiers[0].price_primary_text_year ? setPricePrimaryTextYear(tiers[0].price_primary_text_year) : "";
    // tiers[0].price_primary_unit_month ? setPricePrimaryUnitMonth(tiers[0].price_primary_unit_month) : "";
    // tiers[0].price_primary_unit_year ? setPricePrimaryUnitYear(tiers[0].price_primary_unit_year) : "";
    // secondary price
    tiers[0].price_secondary_number_month ? setPriceSecondaryNumberMonth(tiers[0].price_secondary_number_month) : "";
    tiers[0].price_secondary_number_year ? setPriceSecondaryNumberYear(tiers[0].price_secondary_number_year) : "";
    tiers[0].price_secondary_text_month ? setPriceSecondaryTextMonth(tiers[0].price_secondary_text_month) : "";
    tiers[0].price_secondary_text_year ? setPriceSecondaryTextYear(tiers[0].price_secondary_text_year) : "";
    tiers[0].price_secondary_unit_month ? setPriceSecondaryUnitMonth(tiers[0].price_secondary_unit_month) : "";
    tiers[0].price_secondary_unit_year ? setPriceSecondaryUnitYear(tiers[0].price_secondary_unit_year) : "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    let updateObject = {};
    if (tierName) {
      updateObject.name = tierName;
    }
    if (tierNumber) {
      updateObject.number = tierNumber;
    }
    if (productId) {
      updateObject.product_id = productId;
    }
    if (priceNote) {
      updateObject.price_note = priceNote;
    }
    // if (priceModel) {
    //   updateObject.price_model = priceModel;
    // }
    // if (features) {
    //   updateObject.features = features;
    // }
    if (displayFeatures) {
      updateObject.display_features = displayFeatures;
    }
    // primary price
    if (pricePrimaryNumberMonth) {
      updateObject.price_primary_number_month = pricePrimaryNumberMonth;
    }
    if (pricePrimaryNumberYear) {
      updateObject.price_primary_number_year = pricePrimaryNumberYear;
    }
    if (pricePrimaryTextMonth) {
      updateObject.price_primary_text_month = pricePrimaryTextMonth;
    }
    if (pricePrimaryTextYear) {
      updateObject.price_primary_text_year = pricePrimaryTextYear;
    }
    // if text instead of number, leave unit blank. otherwise, set unit based on the price model
    if (!pricePrimaryTextMonth) {
      if (priceModel === "flat-rate") {
        updateObject.price_primary_unit_month = "per month";
      }
      if (priceModel === "per-user") {
        updateObject.price_primary_unit_month = "per user per month";
      }
      if (priceModel === "usage-based") {
        updateObject.price_primary_unit_month = "per month (starting)";
      }
    }
    if (!pricePrimaryTextYear) {
      if (priceModel === "flat-rate") {
        updateObject.price_primary_unit_year = "per month";
      }
      if (priceModel === "per-user") {
        updateObject.price_primary_unit_year = "per user per month";
      }
      if (priceModel === "usage-based") {
        updateObject.price_primary_unit_year = "per month (starting)";
      }
    }
    // secondary price
    if (priceSecondaryNumberMonth) {
      updateObject.price_secondary_number_month = priceSecondaryNumberMonth;
    }
    if (priceSecondaryNumberYear) {
      updateObject.price_secondary_number_year = priceSecondaryNumberYear;
    }
    if (priceSecondaryTextMonth) {
      updateObject.price_secondary_text_month = priceSecondaryTextMonth;
    }
    if (priceSecondaryTextYear) {
      updateObject.price_secondary_text_year = priceSecondaryTextYear;
    }
    if (priceSecondaryUnitMonth) {
      updateObject.price_secondary_unit_month = priceSecondaryUnitMonth;
    }
    if (priceSecondaryUnitYear) {
      updateObject.price_secondary_unit_year = priceSecondaryUnitYear;
    }

    const { data, error } = await supabase.from("tiers").update(updateObject).eq("id", tierId);
    if (error) {
      handleFailure();
      throw error;
    }
    if (data) {
      updateFeatures(productId);
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

  const addFeature = () => {
    setDisplayFeatures([...displayFeatures, ""]);
  };

  const handleFeatureChange = (e) => {
    const updatedFeatures = [...displayFeatures];
    updatedFeatures[e.target.dataset.idx] = e.target.value;
    setDisplayFeatures(updatedFeatures);
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
              {`Tier #${tierNum} details`}
            </h2>
          </div>
          <div className="mt-6 grid grid-cols-4 gap-6">
            <div className="col-span-4 sm:col-span-2">
              <label htmlFor="tierName" className="block text-sm font-medium text-gray-700">
                Tier name
              </label>
              <input required type="text" name="tierName" id="tierName" placeholder="Starter" value={tierName} onChange={(e) => setTierName(e.target.value)} className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm" />
            </div>
            {/* <div className="col-span-4 sm:col-span-2">
              <label htmlFor="tierNumber" className="block text-sm font-medium text-gray-700">
                Tier number
              </label>
              <input required type="number" name="tierNumber" id="tierNumber" placeholder="1" value={tierNumber} onChange={(e) => setTierNumber(e.target.value)} className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm" />
            </div> */}
            <div className="col-span-4 sm:col-span-2">
              <label htmlFor="priceNote" className="block text-sm font-medium text-gray-700">
                Price note
              </label>
              <input type="text" name="priceNote" id="priceNote" placeholder="Starts at 2 paid users" value={priceNote} onChange={(e) => setPriceNote(e.target.value)} className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm" />
            </div>
            <div className="col-span-4 sm:col-span-2">
              <label htmlFor="pricePrimaryNumberMonth" className="block text-sm font-medium text-gray-700">
                Price per month, paid monthly
              </label>
              <div className="flex items-center justify-start space-x-2 mt-1">
                <div className="flex flex-col space-y-1">
                  <span className="text-xs pl-2">If number:</span>
                  <input type="number" name="pricePrimaryNumberMonth" id="pricePrimaryNumberMonth" placeholder="50" value={pricePrimaryNumberMonth} onChange={(e) => setPricePrimaryNumberMonth(e.target.value)} className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm" />
                </div>
                <span className="mt-4">-- or --</span>
                <div className="flex flex-col space-y-1">
                  <span className="text-xs pl-2">If text:</span>
                  <input type="text" name="pricePrimaryTextMonth" id="pricePrimaryTextMonth" placeholder="Upon request" value={pricePrimaryTextMonth} onChange={(e) => setPricePrimaryTextMonth(e.target.value)} className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm" />
                </div>
              </div>
              {/* <div className="flex flex-col space-y-1">
                <input type="text" name="pricePrimaryUnitMonth" id="pricePrimaryUnitMonth" placeholder="per user per month" value={pricePrimaryUnitMonth} onChange={(e) => setPricePrimaryUnitMonth(e.target.value)} className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm" />
                <span className="text-xs pl-2">unit</span>
              </div> */}
            </div>
            <div className="col-span-4 sm:col-span-2">
              <label htmlFor="pricePrimaryNumberYear" className="block text-sm font-medium text-gray-700">
                Price per month, paid yearly
              </label>
              <div className="flex items-center justify-start space-x-2 mt-1">
                <div className="flex flex-col space-y-1">
                  <span className="text-xs pl-2">If number:</span>
                  <input type="number" name="pricePrimaryNumberYear" id="pricePrimaryNumberYear" placeholder="45" value={pricePrimaryNumberYear} onChange={(e) => setPricePrimaryNumberYear(e.target.value)} className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm" />
                </div>
                <span className="mt-4">-- or --</span>
                <div className="flex flex-col space-y-1">
                  <span className="text-xs pl-2">If text...</span>
                  <input type="text" name="pricePrimaryTextYear" id="pricePrimaryTextYear" placeholder="Upon request" value={pricePrimaryTextYear} onChange={(e) => setPricePrimaryTextYear(e.target.value)} className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm" />
                </div>
              </div>
              {/* <div className="flex flex-col space-y-1">
                <input type="text" name="pricePrimaryUnitYear" id="pricePrimaryUnitYear" placeholder="per user per month" value={pricePrimaryUnitYear} onChange={(e) => setPricePrimaryUnitYear(e.target.value)} className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm" />
                <span className="text-xs pl-2">unit</span>
              </div> */}
            </div>

            <div className="col-span-4 sm:col-span-2">
              <h4 className="font-medium text-gray-900 mb-1">Features</h4>
              {displayFeatures &&
                displayFeatures.map((val, idx) => {
                  const featureId = `feature-${idx}`;
                  return (
                    <div key={featureId} className="my-2">
                      <label htmlFor={featureId} className="block text-sm font-medium text-gray-700">
                        {`Feature #${idx + 1}`}
                      </label>
                      <input type="text" name={featureId} id={featureId} data-idx={idx} placeholder="Reporting dashboard" value={displayFeatures[idx]} onChange={handleFeatureChange} className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm" />
                    </div>
                  );
                })}
              {/* <div className="flex flex-col items-center mt-4 p-2 border border-gray-300"> */}
              <button type="button" onClick={addFeature} className="inline-flex items-center my-2 px-2.5 py-1.5 border border-transparent text-xs font-medium text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-0">
                Add feature
              </button>
              {/* </div> */}
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
