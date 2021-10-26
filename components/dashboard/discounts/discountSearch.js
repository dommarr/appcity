import { useState, useEffect } from "react";
import { supabase } from "../../../utils/initSupabase";
import Loading from "../sectionLoading";
import { ChevronLeftIcon } from "@heroicons/react/solid";
import Select from "react-select";
import DiscountUpdate from "./discountUpdate";
import DiscountList from "./discountList";

export default function Discounts(props) {
  const [loading, setLoading] = useState(true);
  // app array
  const [appList, setAppList] = useState([]);
  // selected app
  const [selectedApp, setSelectedApp] = useState(1);

  // Fetch on load
  useEffect(() => {
    setLoading(true);
    fetchApps();
  }, []);

  const fetchApps = async () => {
    let { data: products, error } = await supabase.from("products").select("id,name");
    if (error) {
      throw error;
    }
    let list = [];
    products.forEach(function (element) {
      list.push({ label: element.name, value: element.id });
    });
    list.sort(function (a, b) {
      if (a.label < b.label) {
        return -1;
      }
      if (a.label > b.label) {
        return 1;
      }
      return 0;
    });
    setAppList(list);
    setLoading(false);
    return;
  };

  const handleBack = async () => {
    setSelectedApp(1);
  };

  if (loading) return <Loading />;

  return (
    <section className="py-4 space-y-4">
      <h1 className="text-2xl font-semibold text-gray-900">App Discounts & Affiliate Links</h1>
      {selectedApp === 1 && (
        <>
          <div className="shadow">
            <div className="bg-white py-6 px-4 sm:p-6">
              <div>
                <h2 className="text-lg leading-6 font-medium text-gray-900">Search for an app to edit</h2>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-2">
                <Select
                  options={appList}
                  isSearchable={true}
                  className="mt-1 z-10"
                  value={appList.filter((option) => option.value === selectedApp)}
                  onChange={(option) => setSelectedApp(option.value)}
                />
              </div>
            </div>
          </div>
          <DiscountList />
        </>
      )}
      {selectedApp !== 1 && (
        <div className="flex flex-col space-y-4">
          <div>
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium text-white bg-purple hover:bg-purple-dark focus:outline-none focus:ring-0"
            >
              <ChevronLeftIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
              Back to search
            </button>
          </div>
          <DiscountUpdate user={props.user} productId={selectedApp} />
        </div>
      )}
    </section>
  );
}
