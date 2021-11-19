import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const tabs = [
  { value: "all", name: "All apps", current: true },
  { value: "not-started", name: "Not started", current: false },
  { value: "discount", name: "Has discount", current: false },
  { value: "referral", name: "Referral only", current: false },
  { value: "no-program", name: "No program", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const AppCard = ({ app, setSelectedApp }) => {
  return (
    <li
      key={app.id}
      onClick={() => setSelectedApp(app.id)}
      className="col-span-1 grid grid-cols-3 bg-white border shadow-md divide-x divide-gray-200 flex items-center justify-center p-4 gap-4 hover:cursor-pointer"
    >
      <div className="col-span-1 flex items-center justify-center w-full h-20">
        <img className="w-20" src={app.product_logo ? app.product_logo : app.vendors.logo} alt={`${app.name} Logo`} />
      </div>
      <div className="col-span-2 flex items-center justify-start text-xl font-medium text-left pl-4 h-full">{app.name}</div>
    </li>
  );
};

export default function DiscountList({ appList, setAppList, setSelectedApp }) {
  let router = useRouter();
  const [discountStatus, setDiscountStatus] = useState(router.query.status ? router.query.status : "all");
  const [filteredAppList, setFilteredAppList] = useState(appList);

  useEffect(() => {
    if (discountStatus === "all") {
      setFilteredAppList(appList);
    } else {
      let updatedAppList = appList.filter((app) => app.discount === discountStatus);
      setFilteredAppList(updatedAppList);
    }
  }, []);

  const handleSelect = (val) => {
    if (val === "all") {
      setFilteredAppList(appList);
    } else {
      let updatedAppList = appList.filter((app) => app.discount === val);
      setFilteredAppList(updatedAppList);
    }
    router.push({
      query: {
        screen: "discounts",
        status: val,
      },
    });
    setDiscountStatus(val);
  };

  return (
    <div className="bg-white shadow">
      <div className="max-w-3xl mx-auto px-4 text-center sm:px-6 lg:max-w-7xl lg:px-8">
        <section aria-labelledby="filter-heading" className="py-6 border-b border-gray-200 flex justify-between items-center space-x-6">
          <div className="w-full">
            {/* <div className="sm:hidden">
              <label htmlFor="tabs" className="sr-only">
                Select a tab
              </label>
              <select
                id="tabs"
                name="tabs"
                onChange={() => {
                  router.replace({ query: { status: tabs.find((tab) => tab.current).value } });
                }}
                className="block w-full focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                defaultValue={tabs.find((tab) => tab.current).name}
              >
                {tabs.map((tab) => (
                  <option key={tab.name}>{tab.name}</option>
                ))}
              </select>
            </div> */}
            <div className="block">
              <nav className="relative z-0 rounded-lg shadow flex divide-x divide-gray-200" aria-label="Tabs">
                {tabs.map((tab, tabIdx) => (
                  <div
                    key={tab.name}
                    onClick={() => handleSelect(tab.value)}
                    className={classNames(
                      discountStatus === tab.value ? "text-gray-900" : "text-gray-500 hover:text-gray-700",
                      tabIdx === 0 ? "rounded-l-lg" : "",
                      tabIdx === tabs.length - 1 ? "rounded-r-lg" : "",
                      "group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-sm font-medium text-center hover:bg-gray-50 focus:z-10 cursor-pointer"
                    )}
                    aria-current={tab.current ? "page" : undefined}
                  >
                    <span>{tab.name}</span>
                    <span aria-hidden="true" className={`${discountStatus === tab.value ? "bg-indigo-500" : "bg-transparent"} absolute inset-x-0 bottom-0 h-0.5`} />
                  </div>
                ))}
              </nav>
            </div>
          </div>
          <div id="app-count" className="flex items-center justify-center text-sm text-gray-700 pr-4 whitespace-nowrap w-32">
            {filteredAppList.length} {filteredAppList.length === 1 ? "app" : "apps"}
          </div>
        </section>
        <section aria-labelledby="app-list" className="py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">{filteredAppList && filteredAppList.map((app) => <AppCard app={app} setSelectedApp={setSelectedApp} />)}</div>
        </section>
      </div>
    </div>
  );
}
