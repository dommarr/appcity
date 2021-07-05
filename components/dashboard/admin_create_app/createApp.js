import { useState } from "react";
import AppForm from "./formApp";
import AppCompanyForm from "./formAppCompany";
import { ChevronLeftIcon } from "@heroicons/react/solid";

export default function CreateNew(props) {
  const [appOnly, setAppOnly] = useState(false);
  const [appCompany, setAppCompany] = useState(false);

  const handleBack = () => {
    setAppOnly(false);
    setAppCompany(false);
  };

  return (
    <section className="py-4 space-y-4">
      <h1 className="text-2xl font-semibold text-gray-900">Create app</h1>
      {(appOnly || appCompany) && (
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium text-white bg-purple hover:bg-purple-dark focus:outline-none focus:ring-0"
        >
          <ChevronLeftIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
          Back to options
        </button>
      )}
      <div className="shadow sm:overflow-hidden">
        {!appOnly && !appCompany && (
          <div className="bg-white py-6 px-4 sm:p-6">
            <div>
              <h2 id="company-details-heading" className="text-lg leading-6 font-medium text-gray-900">
                Select an option:
              </h2>
            </div>
            <div className="mt-6 grid grid-cols-4 gap-6">
              <div className="col-span-4 sm:col-span-2 space-x-2">
                <button
                  onClick={() => setAppCompany(true)}
                  className="bg-purple border border-transparent shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-purple-extradark focus:outline-none focus:ring-0"
                >
                  Add app + company
                </button>
                <button
                  onClick={() => setAppOnly(true)}
                  className="bg-purple border border-transparent shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-purple-extradark focus:outline-none focus:ring-0"
                >
                  Add app only (existing company)
                </button>
              </div>
            </div>
          </div>
        )}
        {appOnly && <AppForm setAppOnly={setAppOnly} />}
        {appCompany && <AppCompanyForm setAppCompany={setAppCompany} />}
      </div>
    </section>
  );
}
