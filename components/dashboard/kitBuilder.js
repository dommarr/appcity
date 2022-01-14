import { useState, useEffect } from "react";
import { supabase } from "../../utils/initSupabase";
import { PlusCircleIcon } from "@heroicons/react/outline";
import { ChevronLeftIcon } from "@heroicons/react/solid";
import Select from "react-select";
import KitForm from "./kit_builder/kitForm";
import SectionForm from "./kit_builder/sectionForm";

export default function KitBuilder() {
  const [kits, setKits] = useState([]);
  const [kitList, setKitList] = useState([]);
  const [apps, setApps] = useState([]);
  const [kit, setKit] = useState("");
  const [sections, setSections] = useState([]);

  // Fetch on load
  useEffect(() => {
    fetchKits();
    fetchApps();
  }, []);

  const fetchKits = async () => {
    let { data: kits, error } = await supabase.from("kits").select("*").order("name");
    if (error) {
      throw error;
    }
    if (kits) {
      setKits(kits);
      let list = kits.map((kit) => {
        return {
          label: kit.name,
          value: kit.id,
        };
      });
      setKitList(list);
    }
  };

  const fetchApps = async () => {
    let { data: products, error } = await supabase.from("products").select("id,name").order("name");
    if (error) {
      throw error;
    }
    if (products) {
      let list = products.map((product) => {
        return {
          label: product.name,
          value: product.id,
        };
      });
      setApps(list);
    }
  };

  const fetchSections = async (kitId) => {
    let { data: kit_sections, error } = await supabase.from("kit_sections").select("*, sections_products(*)").eq("kit_id", kitId).order("order");
    if (error) {
      throw error;
    }
    return kit_sections;
  };

  const createSection = async (kitId) => {
    let { data, error } = await supabase.from("kit_sections").insert([
      {
        kit_id: kitId,
        order: sections.length + 1,
      },
    ]);
    if (error) {
      throw error;
    }
    return data[0];
  };

  const handleAddSection = async () => {
    let section = await createSection(kit.id);
    setSections([...sections, section]);
  };

  const handleKitSelect = async (val) => {
    setKit(kits.filter((kit) => kit.id === val)[0]);
    let sections = await fetchSections(val);
    if (sections) {
      setSections(sections);
    }
  };

  return (
    <section className="py-4 space-y-4">
      {!kit && <h1 className="text-2xl font-semibold text-gray-900">Kit builder</h1>}
      {kit && (
        <>
          <h1 className="text-2xl font-semibold text-gray-900">Kit builder: {kit.name}</h1>
          <button
            type="button"
            onClick={() => setKit("")}
            className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium text-white bg-purple hover:bg-purple-dark focus:outline-none focus:ring-0"
          >
            <ChevronLeftIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
            Back to options
          </button>
        </>
      )}

      {!kit && (
        <>
          <div className="bg-white shadow py-6 px-4 sm:p-6 flex flex-col space-y-4">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Edit an existing kit</h2>
            <Select options={kitList} isSearchable={true} className="mt-1 z-20 bg-white col-span-2 md:col-span-1" value={kit} onChange={(option) => handleKitSelect(option.value)} />
          </div>
        </>
      )}
      <KitForm kit={kit} setKit={setKit} />
      {kit && (
        <div className="flex flex-col space-y-4">
          {sections.length > 0 && sections.map((section, idx) => <SectionForm key={section.id} section={section} apps={apps} idx={idx} />)}

          <button
            type="button"
            onClick={() => handleAddSection()}
            className="flex items-center w-36 space-x-2 px-3 py-2 border border-transparent shadow-sm text-sm font-medium text-white bg-purple hover:bg-purple-dark focus:outline-none focus:ring-0"
          >
            <PlusCircleIcon className="h-5 w-5" aria-hidden="true" />
            <span>Add section</span>
          </button>
        </div>
      )}
    </section>
  );
}
