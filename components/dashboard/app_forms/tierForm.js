import { useState, useEffect } from "react";
import { supabase } from "../../../utils/initSupabase";
import Loading from "../cardLoading";
import FormTip from "./formTip";
import { MinusCircleIcon } from "@heroicons/react/solid";
import { connectScrollTo } from "react-instantsearch-core";

export default function TierForm({ tierNum, tierId, productId, updateFeatures, priceModel, fetchTierIds, user, refreshTiers }) {
  // form loading
  const [loading, setLoading] = useState(true);
  // form submission states
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState();
  const [message, setMessage] = useState();
  const [totalAnnualPrice, setTotalAnnualPrice] = useState();
  // delete tier
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  // drag and drop features
  const [dragIndex, setDragIndex] = useState();
  // form fields
  const [tierName, setTierName] = useState("");
  const [tierNumber, setTierNumber] = useState("");
  const [tierDescription, setTierDescription] = useState("");
  const [tierLimit, setTierLimit] = useState("");
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
    setLoading(true);
    fetchTierData(tierId);
    setLoading(false);
  }, [tierId, priceModel, refreshTiers]);

  const fetchTierData = async (tier_id) => {
    let { data: tiers, error } = await supabase.from("tiers").select("*").eq("id", tier_id);
    if (error) {
      throw error;
    }
    tiers[0].name ? setTierName(tiers[0].name) : "";
    tiers[0].number ? setTierNumber(tiers[0].number) : "";
    tiers[0].description ? setTierDescription(tiers[0].description) : "";
    tiers[0].limit ? setTierLimit(tiers[0].limit) : "";
    tiers[0].display_features ? setDisplayFeatures(tiers[0].display_features) : "";
    // primary price
    tiers[0].price_primary_number_month || tiers[0].price_primary_number_month === 0 ? setPricePrimaryNumberMonth(tiers[0].price_primary_number_month) : "";
    tiers[0].price_primary_number_year || tiers[0].price_primary_number_year === 0 ? setPricePrimaryNumberYear(tiers[0].price_primary_number_year) : "";
    tiers[0].price_primary_number_year || tiers[0].price_primary_number_year === 0 ? setTotalAnnualPrice(tiers[0].price_primary_number_year * 12) : "";
    tiers[0].price_primary_text_month ? setPricePrimaryTextMonth(tiers[0].price_primary_text_month) : "";
    tiers[0].price_primary_text_year ? setPricePrimaryTextYear(tiers[0].price_primary_text_year) : "";
    // tiers[0].price_primary_unit_month ? setPricePrimaryUnitMonth(tiers[0].price_primary_unit_month) : "";
    // tiers[0].price_primary_unit_year ? setPricePrimaryUnitYear(tiers[0].price_primary_unit_year) : "";
    // secondary price
    tiers[0].price_secondary_number_month || tiers[0].price_secondary_number_month === 0 ? setPriceSecondaryNumberMonth(tiers[0].price_secondary_number_month) : "";
    tiers[0].price_secondary_number_year || tiers[0].price_secondary_number_year === 0 ? setPriceSecondaryNumberYear(tiers[0].price_secondary_number_year) : "";
    tiers[0].price_secondary_text_month ? setPriceSecondaryTextMonth(tiers[0].price_secondary_text_month) : "";
    tiers[0].price_secondary_text_year ? setPriceSecondaryTextYear(tiers[0].price_secondary_text_year) : "";
    tiers[0].price_secondary_unit_month ? setPriceSecondaryUnitMonth(tiers[0].price_secondary_unit_month) : "";
    tiers[0].price_secondary_unit_year ? setPriceSecondaryUnitYear(tiers[0].price_secondary_unit_year) : "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    let updateObject = {};
    updateObject.name = tierName;
    updateObject.number = tierNumber;
    updateObject.product_id = productId;
    updateObject.description = tierDescription;
    updateObject.limit = tierLimit;
    updateObject.display_features = displayFeatures;
    pricePrimaryNumberMonth === "" ? (updateObject.price_primary_number_month = null) : (updateObject.price_primary_number_month = pricePrimaryNumberMonth);
    pricePrimaryNumberYear === "" ? (updateObject.price_primary_number_year = null) : (updateObject.price_primary_number_year = pricePrimaryNumberYear);
    updateObject.price_primary_text_month = pricePrimaryTextMonth;
    updateObject.price_primary_text_year = pricePrimaryTextYear;
    updateObject.last_updated_by = user.email;
    // if (tierName) {
    //   updateObject.name = tierName;
    // }
    // if (tierNumber) {
    //   updateObject.number = tierNumber;
    // }
    // if (productId) {
    //   updateObject.product_id = productId;
    // }
    // if (priceNote || priceNote === "") {
    //   updateObject.price_note = priceNote;
    // }
    // // if (priceModel) {
    // //   updateObject.price_model = priceModel;
    // // }
    // // if (features) {
    // //   updateObject.features = features;
    // // }
    // if (displayFeatures) {
    //   updateObject.display_features = displayFeatures;
    // }
    // // primary price
    // if (pricePrimaryNumberMonth) {
    //   updateObject.price_primary_number_month = pricePrimaryNumberMonth;
    // }
    // if (pricePrimaryNumberYear) {
    //   updateObject.price_primary_number_year = pricePrimaryNumberYear;
    // }
    // if (pricePrimaryTextMonth || pricePrimaryTextMonth === "") {
    //   updateObject.price_primary_text_month = pricePrimaryTextMonth;
    // }
    // if (pricePrimaryTextYear || pricePrimaryTextYear === "") {
    //   updateObject.price_primary_text_year = pricePrimaryTextYear;
    // }
    // if text instead of number, leave unit blank. otherwise, set unit based on the price model
    // if (!pricePrimaryTextMonth) {
    //   if (priceModel === "flat-rate") {
    //     updateObject.price_primary_unit_month = "per month";
    //   }
    //   if (priceModel === "per-user") {
    //     updateObject.price_primary_unit_month = "per user per month";
    //   }
    //   if (priceModel === "usage-based") {
    //     updateObject.price_primary_unit_month = "per month (starting)";
    //   }
    //   if (priceModel === "revenue-fee") {
    //     updateObject.price_primary_unit_month = "of revenue";
    //   }
    // } else {
    //   updateObject.price_primary_unit_month = "";
    // }

    // if (!pricePrimaryTextYear) {
    //   if (priceModel === "flat-rate") {
    //     updateObject.price_primary_unit_year = "per month";
    //   }
    //   if (priceModel === "per-user") {
    //     updateObject.price_primary_unit_year = "per user per month";
    //   }
    //   if (priceModel === "usage-based") {
    //     updateObject.price_primary_unit_year = "per month (starting)";
    //   }
    //   if (priceModel === "revenue-fee") {
    //     updateObject.price_primary_unit_year = "of revenue";
    //   }
    // } else {
    //   updateObject.price_primary_unit_year = "";
    // }

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
      fetchTierIds(productId);
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

  const deleteFeature = (index) => {
    const updatedFeatures = [...displayFeatures];
    updatedFeatures.splice(index, 1);
    setDisplayFeatures(updatedFeatures);
  };

  const handleFeatureChange = (e) => {
    const updatedFeatures = [...displayFeatures];
    updatedFeatures[e.target.dataset.idx] = e.target.value;
    setDisplayFeatures(updatedFeatures);
  };

  const handlePriceChange = (val, number, month, total) => {
    if (number && month) {
      setPricePrimaryNumberMonth(val);
      setPricePrimaryTextMonth("");
    }
    // for price, paid yearly - need to calc either the monthly or yearly price
    if (number && !month) {
      if (total) {
        // needs to clear both when empty
        if (val === "") {
          setPricePrimaryNumberYear("");
          setTotalAnnualPrice("");
          setPricePrimaryTextYear("");
        } else {
          setPricePrimaryNumberYear(val / 12);
          setTotalAnnualPrice(val);
          setPricePrimaryTextYear("");
        }
      } else {
        // needs to clear both when empty
        if (val === "") {
          setPricePrimaryNumberYear("");
          setTotalAnnualPrice("");
          setPricePrimaryTextYear("");
        } else {
          setPricePrimaryNumberYear(val);
          setTotalAnnualPrice(val * 12);
          setPricePrimaryTextYear("");
        }
      }
    }
    if (!number && month) {
      setPricePrimaryTextMonth(val);
      setPricePrimaryNumberMonth("");
    }
    if (!number && !month) {
      setPricePrimaryTextYear(val);
      setPricePrimaryNumberYear("");
      setTotalAnnualPrice("");
    }
  };

  const handleFeePrice = (val) => {
    setPricePrimaryNumberMonth(val);
    setPricePrimaryTextMonth("");
    setPricePrimaryNumberYear(val);
    setPricePrimaryTextYear("");
  };

  const deleteTier = async (id) => {
    const { data, error } = await supabase.from("tiers").delete().eq("id", id);
    if (error) {
      throw error;
    }
    setDeleteConfirm(false);
    fetchTierIds(productId);
    return data;
  };

  const handleDrag = (e) => {
    setDragIndex(e.target.dataset.idx);
  };

  const handleDrop = (e) => {
    let updatedFeatures = [...displayFeatures];
    let moveFeature = updatedFeatures[dragIndex];
    const dropIndex = e.target.dataset.idx;
    updatedFeatures.splice(dragIndex, 1);
    updatedFeatures.splice(dropIndex, 0, moveFeature);
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
            <div className="col-span-4 lg:col-span-2 flex flex-col space-x-2">
              <div className="flex space-x-2">
                <div className="w-1/4">
                  <label htmlFor="tierName" className="block text-sm font-medium text-gray-700">
                    Tier number
                  </label>
                  <input
                    type="number"
                    name="tierNumber"
                    id="tierNumber"
                    placeholder="1"
                    value={tierNumber}
                    onChange={(e) => setTierNumber(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
                  />
                </div>
                <div className="w-3/4">
                  <div className="flex space-x-2">
                    <label htmlFor="tierName" className="block text-sm font-medium text-gray-700">
                      Tier name
                    </label>
                    <span className="italic text-sm text-gray-400">required</span>
                  </div>
                  <input
                    type="text"
                    name="tierName"
                    id="tierName"
                    placeholder="Starter"
                    value={tierName}
                    onChange={(e) => setTierName(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
                  />
                </div>
              </div>
              <FormTip video_id="ef32b696bb48402abebe499b62af07a6" />
            </div>
            <div className="col-span-4 lg:col-span-2 flex flex-col space-x-2"></div>
            <div className="col-span-4 lg:col-span-2 flex flex-col">
              <div className="flex space-x-2">
                <label htmlFor="tierDescription" className="block text-sm font-medium text-gray-700">
                  Tier description
                </label>
                <span className="italic text-sm text-gray-400">optional - leave blank if not found</span>
              </div>
              <textarea
                type="text"
                name="tierDescription"
                id="tierDescription"
                placeholder="For screen recording and limited editing."
                maxLength="140"
                value={tierDescription}
                onChange={(e) => setTierDescription(e.target.value)}
                className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
              />
              <span className="mt-1 text-xs text-gray-500 italic">140 character maximum</span>
              <FormTip video_id="327ac54bac794ba1895f98cc0143a46d" />
            </div>
            <div className="col-span-4 lg:col-span-2 flex flex-col">
              <div className="flex space-x-2">
                <label htmlFor="tierLimit" className="block text-sm font-medium text-gray-700">
                  Tier limit
                </label>
                <span className="italic text-sm text-gray-400">optional - leave blank if not found</span>
              </div>
              <textarea
                type="text"
                name="tierLimit"
                id="tierLimit"
                placeholder="Minimum of 2 paid users"
                maxLength="140"
                value={tierLimit}
                onChange={(e) => setTierLimit(e.target.value)}
                className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
              />
              <span className="mt-1 text-xs text-gray-500 italic">140 character maximum</span>
              <FormTip video_id="327ac54bac794ba1895f98cc0143a46d" />
            </div>

            {priceModel === "revenue-fee" && (
              <>
                <div className="col-span-4 lg:col-span-2 flex flex-col">
                  <div className="flex space-x-2">
                    <label htmlFor="pricePrimaryNumberYear" className="block text-sm font-medium text-gray-700">
                      Revenue fee percentage
                    </label>
                    <span className="italic text-sm text-gray-400">required</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      name="pricePrimaryNumberYear"
                      id="pricePrimaryNumberYear"
                      placeholder="4.5"
                      value={pricePrimaryNumberYear}
                      onChange={(e) => handleFeePrice(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
                    />
                    <span className="text-lg">%</span>
                  </div>
                  <FormTip video_id="9c67988816354e4895cffc0be2209d7c" />
                </div>
                <div className="col-span-4 lg:col-span-2 flex flex-col space-x-2"></div>
              </>
            )}

            {priceModel === "one-time" && (
              <>
                <div className="col-span-4 lg:col-span-2 flex flex-col">
                  <div className="flex space-x-2">
                    <label htmlFor="pricePrimaryNumberYear" className="block text-sm font-medium text-gray-700">
                      One-time payment
                    </label>
                    <span className="italic text-sm text-gray-400">required</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      name="pricePrimaryNumberYear"
                      id="pricePrimaryNumberYear"
                      placeholder="300"
                      value={pricePrimaryNumberYear}
                      onChange={(e) => handleFeePrice(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
                    />
                  </div>
                  <FormTip video_id="9c67988816354e4895cffc0be2209d7c" />
                </div>
                <div className="col-span-4 lg:col-span-2 flex flex-col space-x-2"></div>
              </>
            )}

            {(priceModel === "custom" || priceModel === "quote") && (
              <>
                <div className="col-span-4 lg:col-span-2 flex flex-col">
                  <div className="flex space-x-2">
                    <label htmlFor="pricePrimaryTextYear" className="block text-sm font-medium text-gray-700">
                      {priceModel === "custom" ? "Custom pricing" : "Quote pricing"}
                    </label>
                    <span className="italic text-sm text-gray-400">required</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      name="pricePrimaryTextYear"
                      id="pricePrimaryTextYear"
                      placeholder="Upon request"
                      value={pricePrimaryTextYear}
                      disabled
                      className="cursor-not-allowed mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
                    />
                  </div>
                  <FormTip video_id="9c67988816354e4895cffc0be2209d7c" />
                </div>
                <div className="col-span-4 lg:col-span-2 flex flex-col space-x-2"></div>
              </>
            )}

            {["usage-based", "per-user", "per-project", "flat-rate"].includes(priceModel) && (
              <>
                <div className="col-span-4 lg:col-span-2 flex flex-col">
                  <div className="flex space-x-2">
                    <label htmlFor="pricePrimaryNumberYear" className="block text-sm font-medium text-gray-700">
                      Price, paid yearly
                    </label>
                    <span className="italic text-sm text-gray-400">required</span>
                  </div>
                  <div className="grid grid-cols-5">
                    <div className="col-span-2">
                      <span className="text-xs pl-2">If number:</span>
                      <div className="flex space-x-2">
                        <div className="flex flex-col">
                          <input
                            type="number"
                            name="pricePrimaryNumberYear"
                            id="pricePrimaryNumberYear"
                            placeholder="45"
                            step="any"
                            value={pricePrimaryNumberYear}
                            onChange={(e) => handlePriceChange(e.target.value, true, false)}
                            className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
                          />
                          <span className="mt-1 ml-2 text-xs text-gray-500 italic">per month</span>
                        </div>
                        <div className="flex flex-col">
                          <input
                            type="number"
                            name="totalAnnualPrice"
                            id="totalAnnualPrice"
                            placeholder="540"
                            step="any"
                            value={totalAnnualPrice}
                            onChange={(e) => handlePriceChange(e.target.value, true, false, true)}
                            className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
                          />
                          <span className="mt-1 ml-2 text-xs text-gray-500 italic">per year</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-1 flex flex-col items-center justify-center mt-4">or</div>
                    <div className="col-span-2">
                      <span className="text-xs pl-2">If text:</span>
                      <input
                        type="text"
                        name="pricePrimaryTextYear"
                        id="pricePrimaryTextYear"
                        placeholder="Upon request"
                        value={pricePrimaryTextYear}
                        onChange={(e) => handlePriceChange(e.target.value, false, false)}
                        className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
                      />
                    </div>
                  </div>
                  {/* <div className="flex flex-col space-y-1">
                <input type="text" name="pricePrimaryUnitYear" id="pricePrimaryUnitYear" placeholder="per user per month" value={pricePrimaryUnitYear} onChange={(e) => setPricePrimaryUnitYear(e.target.value)} className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm" />
                <span className="text-xs pl-2">unit</span>
              </div> */}
                  <FormTip video_id="b49d350447364191a8e3aa4cf63c3a25" />
                </div>

                <div className="col-span-4 lg:col-span-2 flex flex-col">
                  <div className="flex space-x-2">
                    <label htmlFor="pricePrimaryNumberMonth" className="block text-sm font-medium text-gray-700">
                      Price per month, paid monthly
                    </label>
                    <span className="italic text-sm text-gray-400">required</span>
                  </div>
                  <div className="grid grid-cols-5">
                    <div className="col-span-2">
                      <span className="text-xs pl-2">If number:</span>
                      <div className="flex flex-col">
                        <input
                          type="number"
                          name="pricePrimaryNumberMonth"
                          id="pricePrimaryNumberMonth"
                          placeholder="50"
                          step="any"
                          value={pricePrimaryNumberMonth}
                          onChange={(e) => handlePriceChange(e.target.value, true, true)}
                          className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
                        />
                        <span className="mt-1 ml-2 text-xs text-gray-500 italic">per month</span>
                      </div>
                    </div>
                    <div className="col-span-1 flex flex-col items-center justify-center mt-4">or</div>
                    <div className="col-span-2">
                      <span className="text-xs pl-2">If text:</span>
                      <input
                        type="text"
                        name="pricePrimaryTextMonth"
                        id="pricePrimaryTextMonth"
                        placeholder="Upon request"
                        value={pricePrimaryTextMonth}
                        onChange={(e) => handlePriceChange(e.target.value, false, true)}
                        className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
                      />
                    </div>
                  </div>
                  {/* <div className="flex flex-col space-y-1">
                <input type="text" name="pricePrimaryUnitMonth" id="pricePrimaryUnitMonth" placeholder="per user per month" value={pricePrimaryUnitMonth} onChange={(e) => setPricePrimaryUnitMonth(e.target.value)} className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm" />
                <span className="text-xs pl-2">unit</span>
              </div> */}
                  <FormTip video_id="15ff902c77e0442786873bdb619e5044" />
                </div>
              </>
            )}

            <div className="col-span-4 lg:col-span-2 flex flex-col">
              <div className="flex space-x-2 items-center mb-1">
                <h4 className="font-medium text-gray-900">Features</h4>
                <span className="italic text-sm text-gray-400">required</span>
              </div>
              {displayFeatures &&
                displayFeatures.map((val, idx) => {
                  const featureId = `feature-${idx}`;
                  return (
                    <div key={featureId} className="my-2">
                      <label htmlFor={featureId} className="block text-sm font-medium text-gray-700">
                        {`Feature #${idx + 1}`}
                      </label>
                      <div className="flex space-x-2 items-center">
                        <input
                          draggable={true}
                          onDragOver={(e) => e.preventDefault()}
                          onDragStart={handleDrag}
                          onDrop={handleDrop}
                          type="text"
                          name={featureId}
                          id={featureId}
                          data-idx={idx}
                          placeholder="Reporting dashboard"
                          value={displayFeatures[idx]}
                          onChange={handleFeatureChange}
                          className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
                        />
                        <MinusCircleIcon onClick={(e) => deleteFeature(idx)} className="text-gray-400 h-5 w-5 hover:cursor-pointer hover:text-gray-600" />
                      </div>
                    </div>
                  );
                })}
              {/* <div className="flex flex-col items-center mt-4 p-2 border border-gray-300"> */}
              <div>
                <button type="button" onClick={addFeature} className="text-sm bg-gray-100 hover:bg-gray-200 rounded-sm border border-gray-900 py-1 px-2 mt-2 focus:outline-none focus:ring-0">
                  Add feature
                </button>
              </div>
              {/* </div> */}
              <FormTip video_id="62898882f9504093b066d6e0e233f39b" />
            </div>
          </div>
        </div>
        <div className="flex px-4 py-3 bg-gray-50 text-right sm:px-6 space-x-4">
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
          {!deleteConfirm && (
            <button
              type="button"
              onClick={() => setDeleteConfirm(true)}
              className="bg-red-600 hover:bg-red-700 border border-transparent shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white focus:outline-none focus:ring-0"
            >
              Delete
            </button>
          )}
          {deleteConfirm && (
            <div className="flex space-x-2 items-center justify-center">
              <p className="">Are you sure? Deleting a tier cannot be undone.</p>
              <button
                type="button"
                onClick={() => deleteTier(tierId)}
                className="bg-red-600 hover:bg-red-700 border border-transparent shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white focus:outline-none focus:ring-0"
              >
                Yes, I'm sure.
              </button>
            </div>
          )}
          <div className={`flex items-center ml-4 ${success ? `text-green-600` : `text-red-600`}`}>{message}</div>
        </div>
      </form>
    </div>
  );
}
