import { useState, useEffect } from "react";
import { supabase } from "../../utils/initSupabase";
import Loading from "./cardLoading";
import VendorForm from "./vendorForm";
import ProductForm from "./productForm";
import CategoryForm from "./categoryForm";
import TierForm from "./tierForm";
import FormTip from "./formTip";
import { PlusCircleIcon } from "@heroicons/react/outline";
import { BadgeCheckIcon } from "@heroicons/react/solid";

export default function Task({ task, user }) {
  const [loading, setLoading] = useState(true);
  const [productId, setProductId] = useState();
  const [vendorId, setVendorId] = useState();
  const [tierIds, setTierIds] = useState([]);
  const [priceModel, setPriceModel] = useState();
  const [complete, setComplete] = useState(false);
  const [superAdmin, setSuperAdmin] = useState(false);

  // Fetch on load
  useEffect(() => {
    setProductId(task.product_id);
    fetchVendorId(task.product_id);
    fetchTierIds(task.product_id);
    fetchUserProfile(user.id);
    setLoading(false);
  }, []);

  const fetchUserProfile = async (user_id) => {
    let { data: users, error } = await supabase.from("users").select("super_admin").eq("id", user_id);
    if (error) {
      throw error;
    }
    setSuperAdmin(users[0].super_admin);
  };

  const fetchVendorId = async (product_id) => {
    let { data: products, error } = await supabase.from("products").select("vendor_id").eq("id", product_id);
    if (error) {
      throw error;
    }
    setVendorId(products[0].vendor_id);
  };

  const compare = (a, b) => {
    const tierNumA = a.number;
    const tierNumB = b.number;

    let comparison = 0;
    if (tierNumA > tierNumB) {
      comparison = 1;
    } else if (tierNumA < tierNumB) {
      comparison = -1;
    }
    return comparison;
  };

  const fetchTierIds = async (product_id) => {
    let { data: tiers, error } = await supabase.from("tiers").select("*").eq("product_id", product_id);
    if (error) {
      throw error;
    }
    let sortedTierArray = tiers.slice().sort(compare);
    let tierIdsArray = [];
    sortedTierArray.forEach((element) => tierIdsArray.push(element.id));
    setTierIds(tierIdsArray);
  };

  const getCumulativeFeatures = async (tier_id, product_id) => {
    let cumulativeFeatures = [];
    let { data: tiers, error } = await supabase.from("tiers").select("*").eq("product_id", product_id);
    if (error) {
      throw error;
    }
    let currentTier = tiers.filter((tier) => tier.id === tier_id);
    tiers.forEach((element) => {
      if (element.number <= currentTier[0].number) {
        cumulativeFeatures.push.apply(cumulativeFeatures, element.display_features);
      }
    });
    return cumulativeFeatures;
  };

  const updateFeatures = async (product_id) => {
    for (let index = 0; index < tierIds.length; index++) {
      const tier = tierIds[index];
      let features = await getCumulativeFeatures(tier, product_id);
      let uniqueFeatures = [...new Set(features)];
      const { data, error } = await supabase.from("tiers").update({ features: uniqueFeatures }).eq("id", tier);
      if (error) {
        throw error;
      }
    }
  };

  const handleAddTier = async () => {
    const { data, error } = await supabase.from("tiers").insert([{ product_id: productId, number: tierIds.length + 1 }]);
    if (error) {
      throw error;
    }
    if (data) {
      fetchTierIds(productId);
    }
  };

  const handleCompleteTask = async (task) => {
    let datetime = new Date().toLocaleString("en-US", { timeZone: "UTC" });
    const { data, error } = await supabase.from("tasks").update({ complete: true, date_complete: datetime, completed_by: user.email, in_progress: false }).eq("id", task.id);
    if (error) {
      throw error;
    }
    if (data) {
      const { data, error } = await supabase.from("products").update({ complete: true }).eq("id", task.product_id);
      if (error) {
        throw error;
      }
      if (data) {
        setComplete(true);
      }
    }
  };

  const taskTips = [
    {
      name: "Missing Data",
      tip: "1c675e66d2784cf28223aa2b0f8df435",
    },
  ];

  const TaskCard = ({ task }) => {
    let tipVid = taskTips.filter((tip) => task.name === tip.name);
    return (
      <div className={`grid grid-cols-4 gap-x-2 bg-white shadow p-4`}>
        <div className="col-span-1 font-bold text-lg underline">Task</div>
        <div className="col-span-1 font-bold text-lg underline">Product ID</div>
        <div className="col-span-1 font-bold text-lg underline">Notes</div>
        <div className="col-span-1 font-bold text-lg underline">Complete?</div>
        <div className="col-span-1 flex flex-col justify-center">
          <span className="">{task.name}</span>
          <span className="text-xs">Task ID: {task.id}</span>
        </div>
        <div className="col-span-1 flex flex-col justify-center">
          <a target="_blank" href={`https://www.appcity.com/product/${task.product_id}`}>
            <span className="underline text-blue-700">{task.product_name}</span>
          </a>
          <span className="text-xs">Product ID: {task.product_id}</span>
        </div>
        <ul className="col-span-1">
          {task.notes &&
            task.notes.map((note, idx) => (
              <li key={idx} className="text-sm">
                {note}
              </li>
            ))}
        </ul>
        <div className="col-span-1 flex justify-start items-center space-x-2">
          {complete && <BadgeCheckIcon className="h-10 w-10 text-green-500" />}
          {!complete && (
            <button
              type="button"
              onClick={() => handleCompleteTask(task)}
              className="text-sm bg-gray-100 hover:bg-gray-200 rounded-sm border border-gray-900 py-1 px-2 focus:outline-none focus:ring-0"
            >
              Mark complete
            </button>
          )}
        </div>
        <div className="row-start-3 col-span-4 lg:col-span-2">
          <FormTip video_id={tipVid[0].tip} />
        </div>
      </div>
    );
  };

  if (loading) return <Loading />;

  return (
    <>
      {task && <TaskCard task={task} />}
      {vendorId && <VendorForm vendorId={vendorId} superAdmin={superAdmin} />}
      {productId && vendorId && <ProductForm productId={productId} vendorId={vendorId} priceModel={priceModel} setPriceModel={setPriceModel} superAdmin={superAdmin} />}
      {productId && vendorId && superAdmin && <CategoryForm productId={productId} />}
      {tierIds &&
        tierIds.map((tierId, idx) => {
          return <TierForm key={idx} tierNum={idx + 1} tierId={tierId} productId={productId} updateFeatures={updateFeatures} priceModel={priceModel} fetchTierIds={fetchTierIds} />;
        })}
      <div className="flex flex-col max-w-sm">
        <div>
          <button
            type="button"
            onClick={() => handleAddTier()}
            className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium text-white bg-purple hover:bg-purple-dark focus:outline-none focus:ring-0"
          >
            <PlusCircleIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
            Add tier
          </button>
        </div>
        <FormTip video_id="1bbc4437ff1d4951b071a509bcc458dd" recent={true} />
      </div>
    </>
  );
}
