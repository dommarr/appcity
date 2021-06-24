import { useState, useEffect } from "react";
import { supabase } from "../../utils/initSupabase";
import Loading from "./sectionLoading";
import Task from "./task";
import { ChevronLeftIcon } from "@heroicons/react/solid";
import FormTip from "./formTip";
import Autocomplete from "../global/autoComplete";
import AppForms from "./appForms";

export default function EditApps(props) {
  const [apps, setApps] = useState([]);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState();
  const [loading, setLoading] = useState(true);

  // Fetch on load
  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    let { data: products, error } = await supabase.from("products").select("id,name");
    if (error) {
      setLoading(false);
      throw error;
    }
    if (products) {
      setLoading(false);
      setApps(products);
      let arr = products.map((app) => app.name);
      setOptions(arr);
    }
  };

  const buttonClick = (val) => {
    let selectedApp = apps.filter((app) => app.name === val);
    setSelected(selectedApp[0].id);
  };

  const handleBack = async () => {
    setSelected(null);
  };

  if (loading) return <Loading />;

  return (
    <section className="py-4 space-y-4">
      <h1 className="text-2xl font-semibold text-gray-900">Edit apps</h1>
      {!selected && (
        <div className="shadow sm:overflow-hidden">
          <div className="bg-white py-6 px-4 sm:p-6">
            <div>
              <h2 className="text-lg leading-6 font-medium text-gray-900">Search for an app to edit</h2>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-2">
              <Autocomplete options={options} buttonClick={buttonClick} />
            </div>
          </div>
        </div>
      )}
      {selected && (
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
          <AppForms user={props.user} appId={selected} />
        </div>
      )}
    </section>
  );
}
