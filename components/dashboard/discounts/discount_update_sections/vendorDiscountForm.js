import { useState, useEffect } from "react";
import { supabase } from "../../../../utils/initSupabase";
import Loading from "../../cardLoading";
import { ExternalLinkIcon } from "@heroicons/react/outline";
import { ExclamationIcon } from "@heroicons/react/solid";
import { Loader, Check, AlertCircle } from "react-feather";
import { Switch } from "@headlessui/react";

const VendorWarning = () => {
  return (
    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 mt-4">
      <div className="flex justify-between items-start flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4 lg:items-center">
        <div className="flex">
          <div className="flex-shrink-0">
            <ExclamationIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Only update vendor if the discount or referral applies to all apps for this vendor.</h3>
            <div className="mt-2 text-sm text-red-700">
              <ul role="list" className="list-disc pl-5 space-y-1">
                <li>
                  For example, a discount for Intuit that applies to all their apps (QuickBooks, TurboTax, Mint, etc.) would be updated at the vendor-level here. If the discount is only for
                  QuickBooks, then it should be updated at the app-level above.
                </li>
                <li>If you are unsure, update the app above.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function VendorDiscountForm({ vendor, forceRender }) {
  const [loading, setLoading] = useState(true);
  // form submission status
  const [buttonStatus, setButtonStatus] = useState("none");
  // vendor details
  const [vendorName, setVendorName] = useState("");
  const [vendorId, setVendorId] = useState("");
  // form fields
  const [refProgramLink, setRefProgramLink] = useState("");
  const [refType, setRefType] = useState(null);
  const [refLink, setRefLink] = useState("");
  const [discountMessage, setDiscountMessage] = useState("");
  const [noRef, setNoRef] = useState(false);
  const [discountStatus, setDiscountStatus] = useState("");

  // Fetch on load
  useEffect(async () => {
    setLoading(true);
    setDefaults(vendor);
    setLoading(false);
  }, []);

  const setDefaults = (vendor) => {
    vendor.name ? setVendorName(vendor.name) : "";
    vendor.id ? setVendorId(vendor.id) : "";
    vendor.ref_program_link ? setRefProgramLink(vendor.ref_program_link) : "";
    vendor.ref_type ? setRefType(vendor.ref_type) : "";
    vendor.ref_link ? setRefLink(vendor.ref_link) : "";
    vendor.discount_message ? setDiscountMessage(vendor.discount_message) : "";
    vendor.no_ref_program ? setNoRef(vendor.no_ref_program) : "";
    vendor.discount_status ? setDiscountStatus(vendor.discount_status) : "";
  };

  const updateVendor = async (obj) => {
    const { data, error } = await supabase.from("vendors").update(obj).eq("id", vendorId);
    if (error) {
      handleFailure();
      throw error;
    }
    handleSuccess();
    return data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonStatus("submitting");
    let updateObj = {
      ref_program_link: refProgramLink,
      ref_type: refType,
      ref_link: refLink,
      discount_message: discountMessage,
      no_ref_program: noRef,
      discount_status: discountStatus,
    };
    await updateVendor(updateObj);
    return;
  };

  const handleSuccess = () => {
    setButtonStatus("success");
    forceRender();
    setTimeout(function () {
      setButtonStatus("none");
    }, 3000);
  };

  const handleFailure = () => {
    setButtonStatus("failure");
    setTimeout(function () {
      setButtonStatus("none");
    }, 3000);
  };

  if (loading) return <Loading />;

  return (
    <div className="shadow">
      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <div className="bg-white py-6 px-4 sm:p-6">
          <div className="flex space-x-2 items-center justify-start">
            <h2 id="vendor-name" className="text-lg leading-6 font-medium text-gray-900">
              Update vendor: {vendorName}
            </h2>
          </div>
          <VendorWarning />
          <div className="mt-6 grid grid-cols-4 gap-6">
            {/* <div className="col-span-4 flex space-x-2 items-center">
              <Switch checked={noRef} onChange={setNoRef} className={`${noRef ? "bg-blue-600" : "bg-gray-200"} relative inline-flex items-center h-6 rounded-full w-11`}>
                <span className="sr-only">No referral or discount program</span>
                <span className={`${noRef ? "translate-x-6" : "translate-x-1"} inline-block w-4 h-4 transform bg-white rounded-full`} />
              </Switch>
              <label htmlFor="allPriorFeaturesOff" className="block text-sm font-medium text-gray-700">
                No referral or discount program
              </label>
            </div> */}
            <div className="col-span-4 sm:col-span-2">
              <label htmlFor="discountStatus" className="block text-sm font-medium text-gray-700">
                Discount status
              </label>
              <select
                type="text"
                name="discountStatus"
                id="discountStatus"
                placeholder=""
                value={discountStatus}
                onChange={(e) => setDiscountStatus(e.target.value)}
                className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
              >
                <option value="not-started">Not started</option>
                <option value="no-program">No program</option>
                <option value="in-progress">In progress</option>
                <option value="rejected">Rejected</option>
                <option value="referral">Referral only</option>
                <option value="discount">Discount added</option>
              </select>
            </div>
            <div className="col-span-4 sm:col-span-2">
              <div className="flex space-x-2 items-center justify-start">
                <label htmlFor="refProgramLink" className="block text-sm font-medium text-gray-700">
                  Program link
                </label>
                {refProgramLink !== "" && (
                  <a target="_blank" href={refProgramLink}>
                    <ExternalLinkIcon className={`h-4 w-4 text-indigo-500 hover:cursor-pointer`} />
                  </a>
                )}
              </div>
              <input
                type="url"
                name="refProgramLink"
                id="refProgramLink"
                placeholder="https://dash.partnerstack.com/webflow"
                value={refProgramLink}
                onChange={(e) => setRefProgramLink(e.target.value)}
                disabled={noRef}
                className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
              />
            </div>
            <div className="col-span-4 sm:col-span-2">
              <div className="flex space-x-2 items-center justify-start">
                <label htmlFor="refLink" className="block text-sm font-medium text-gray-700">
                  Referral link or code
                </label>
                {refLink !== "" && (
                  <a target="_blank" href={refLink}>
                    <ExternalLinkIcon className={`h-4 w-4 text-indigo-500 hover:cursor-pointer`} />
                  </a>
                )}
              </div>
              <input
                type="text"
                name="refLink"
                id="refLink"
                placeholder="https://webflow.grsm.io/appcity or ?ref=appcity"
                value={refLink}
                onChange={(e) => setRefLink(e.target.value)}
                disabled={noRef}
                className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
              />
            </div>
            <div className="col-span-4 sm:col-span-2">
              <label htmlFor="refType" className="block text-sm font-medium text-gray-700">
                Referral type
              </label>
              <select
                type="text"
                name="refType"
                id="refType"
                placeholder="Direct Link"
                value={refType}
                onChange={(e) => setRefType(e.target.value)}
                disabled={noRef}
                className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
              >
                <option hidden disabled selected value>
                  -- select an option --
                </option>
                <option value="direct-link">Direct Link</option>
                <option value="ref-code">Ref Code</option>
                <option value="subdomain">Subdomain</option>
                <option value="">Blank</option>
              </select>
            </div>
            <div className="col-span-4 sm:col-span-2">
              <label htmlFor="discountMessage" className="block text-sm font-medium text-gray-700">
                Discount message
              </label>
              <textarea
                type="text"
                rows={2}
                name="discountMessage"
                id="discountMessage"
                placeholder="Try it free for 30 days"
                value={discountMessage}
                onChange={(e) => setDiscountMessage(e.target.value)}
                disabled={noRef}
                className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
              />
            </div>
          </div>
        </div>
        <div className="flex px-4 py-3 bg-gray-50 text-right sm:px-6">
          {buttonStatus === "none" && (
            <button
              type="submit"
              className="bg-purple border border-transparent shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-purple-extradark focus:outline-none focus:ring-0"
            >
              Save
            </button>
          )}
          {buttonStatus === "submitting" && (
            <button
              type="submit"
              className="cursor-not-allowed bg-indigo-100 text-indigo-500 border border-transparent shadow-sm py-2 px-5 inline-flex justify-center text-sm font-medium focus:outline-none focus:ring-0"
            >
              <Loader className="h-5 w-5 animate-spin" />
            </button>
          )}
          {buttonStatus === "success" && (
            <button
              type="submit"
              className="cursor-not-allowed bg-green-100 text-green-500 border border-transparent shadow-sm py-2 px-5 inline-flex justify-center text-sm font-medium focus:outline-none focus:ring-0"
            >
              <Check className="h-5 w-5" />
            </button>
          )}
          {buttonStatus === "failure" && (
            <button
              type="submit"
              className="cursor-not-allowed bg-red-100 text-red-500 border border-transparent shadow-sm py-2 px-5 inline-flex justify-center text-sm font-medium focus:outline-none focus:ring-0"
            >
              <AlertCircle className="h-5 w-5" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
