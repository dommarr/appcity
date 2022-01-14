import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "../../utils/initSupabase";
const fetchApps = async (vendorId, productId) => {
  let { data: products, error } = await supabase.from("products").select("*, vendors(*)").eq("vendor_id", vendorId).neq("id", productId);
  if (error) {
    throw error;
  }
  return products;
};

export default function DeveloperRecs({ vendorId, productId }) {
  const [developerRecs, setDeveloperRecs] = useState([]);

  useEffect(async () => {
    let apps = await fetchApps(vendorId, productId);
    if (apps.length > 0) {
      setDeveloperRecs(apps);
    }
  }, [productId]);

  if (developerRecs.length === 0) {
    return <></>;
  }

  return (
    <section id="other-apps-from-this-developer" className="bg-gray-50">
      <div className="pt-24 xl:max-w-7xl xl:mx-auto xl:px-8">
        <div className="px-4 sm:px-6 sm:flex sm:items-end sm:justify-between lg:px-8 xl:px-0">
          <h2 className="text-4xl sm:text-3xl mb-8 sm:mb-0 font-extrabold text-center text-purple">Other apps from this developer</h2>
        </div>

        <div className="mt-2 flow-root">
          <div className="py-2">
            <div className="box-content relative h-48 overflow-x-auto xl:overflow-visible">
              <div className="absolute min-w-screen-xl px-4 flex space-x-8 sm:px-6 lg:px-8 xl:relative xl:px-0 xl:space-x-0 xl:grid xl:grid-cols-5 xl:gap-x-8 h-full">
                {developerRecs.map((rec) => (
                  <Link key={rec.name} href={`/product/${rec.id}`}>
                    <a className="relative w-48 h-48 py-4 px-2 flex flex-col items-center justify-center overflow-hidden hover:opacity-75 xl:w-auto border border-gray-200 shadow bg-white">
                      <span aria-hidden="true" className="">
                        <img src={rec.product_logo ? rec.product_logo : rec.vendors.logo} alt={`${rec.name} logo`} className="w-28 h-28 object-center object-cover" />
                      </span>
                      <span className="mt-auto text-center text-lg font-bold text-gray-700 leading-tight text-ellipsis overflow-hidden">{rec.name}</span>
                    </a>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
