import { useState } from "react";
import { RadioGroup } from "@headlessui/react";

const discountOptions = [
  { value: "all", label: "All apps" },
  { value: "none", label: "Not started" },
  { value: "discount", label: "Has discount" },
  { value: "referral-only", label: "Referral only" },
  { value: "no-program", label: "No program" },
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
        <img className="w-20" src={app.vendors.logo} alt={`${app.name} Logo`} />
      </div>
      <div className="col-span-2 flex items-center justify-start text-xl font-medium text-left pl-4 h-full">{app.name}</div>
    </li>
  );
};

export default function DiscountList({ appList, setAppList, setSelectedApp }) {
  const [discountStatus, setDiscountStatus] = useState(discountOptions[0].value);
  const [filteredAppList, setFilteredAppList] = useState(appList);

  const handleSelect = (val) => {
    if (val === "all") {
      setFilteredAppList(appList);
    } else {
      let updatedAppList = appList.filter((app) => app.discount_status === val);
      setFilteredAppList(updatedAppList);
    }
    //setAppList(appList.filter((app) => app.discount_status === val));
    setDiscountStatus(val);
  };

  return (
    <div className="bg-white shadow">
      <div className="max-w-3xl mx-auto px-4 text-center sm:px-6 lg:max-w-7xl lg:px-8">
        <section aria-labelledby="filter-heading" className="py-6 border-b border-gray-200 flex justify-between items-center">
          <RadioGroup value={discountStatus} onChange={handleSelect} className="mt-2">
            <RadioGroup.Label className="sr-only">Choose a discount option</RadioGroup.Label>
            <div className="flex space-x-2">
              {discountOptions.map((option) => (
                <RadioGroup.Option
                  key={option.label}
                  value={option.value}
                  className={({ active, checked }) =>
                    classNames(
                      active ? "ring-2 ring-offset-2 ring-indigo-500" : "",
                      checked ? "bg-indigo-600 border-transparent text-white hover:bg-indigo-700" : "bg-white border-gray-200 text-gray-900 hover:bg-gray-50",
                      "flex justify-center items-center border rounded-md py-3 px-3 text-xs font-medium uppercase hover:cursor-pointer "
                    )
                  }
                >
                  <RadioGroup.Label as="p">{option.label}</RadioGroup.Label>
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>
          <div id="app-count" className="flex items-center justify-center text-sm text-gray-700 pr-4">
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
