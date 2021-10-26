import { useState, useEffect } from "react";
import Loading from "../../cardLoading";
import { ExternalLinkIcon } from "@heroicons/react/outline";
import { buildLinks } from "../../../../lib/linkBuilder";

export default function TestLinks({ fetchApp, productId, testLinksRender }) {
  const [loading, setLoading] = useState(true);
  const [links, setLinks] = useState(null);

  // Fetch on load
  useEffect(async () => {
    setLoading(true);
    let product = await fetchApp(productId);
    let links = buildLinks(product);
    setLinks(links);
    setLoading(false);
  }, [testLinksRender]);

  if (loading) return <Loading />;

  return (
    <div className="shadow">
      <div className="bg-white py-6 px-4 sm:p-6">
        <div className="flex space-x-2 items-center justify-start">
          <h2 id="vendor-name" className="text-lg leading-6 font-medium text-gray-900">
            Test links
          </h2>
        </div>
        <div className="mt-6 grid grid-cols-4 gap-6">
          <div className="col-span-4 space-y-1">
            <div className="flex space-x-2 items-center justify-start">
              <label htmlFor="vendorLink" className="block text-sm font-medium text-gray-700">
                Vendor link
              </label>
              {links.vendor_link && (
                <a target="_blank" href={links.vendor_link}>
                  <ExternalLinkIcon className={`h-4 w-4 text-indigo-500 hover:cursor-pointer`} />
                </a>
              )}
            </div>
            <p className="text-sm text-gray-700">{links.vendor_link}</p>
          </div>
          <div className="col-span-4 space-y-1">
            <div className="flex space-x-2 items-center justify-start">
              <label htmlFor="appLink" className="block text-sm font-medium text-gray-700">
                App link
              </label>
              {links.app_link && (
                <a target="_blank" href={links.app_link}>
                  <ExternalLinkIcon className={`h-4 w-4 text-indigo-500 hover:cursor-pointer`} />
                </a>
              )}
            </div>
            <p className="text-sm text-gray-700">{links.app_link}</p>
          </div>
          <div className="col-span-4 space-y-1">
            <div className="flex space-x-2 items-center justify-start">
              <label htmlFor="priceLink" className="block text-sm font-medium text-gray-700">
                Price link
              </label>
              {links.price_link && (
                <a target="_blank" href={links.price_link}>
                  <ExternalLinkIcon className={`h-4 w-4 text-indigo-500 hover:cursor-pointer`} />
                </a>
              )}
            </div>
            <p className="text-sm text-gray-700">{links.price_link}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
