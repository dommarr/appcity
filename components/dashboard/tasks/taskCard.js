import FormTip from "../app_forms/formTip";
import { BadgeCheckIcon } from "@heroicons/react/solid";
import { useState, useEffect } from "react";
import { supabase } from "../../../utils/initSupabase";
var moment = require("moment");

const taskTips = [
  {
    name: "Missing Data",
    tip: "1c675e66d2784cf28223aa2b0f8df435",
  },
];

export default function TaskCard({ task, user }) {
  const [complete, setComplete] = useState(false);

  const handleCompleteTask = async (task) => {
    let datetime = moment();
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
          <button type="button" onClick={() => handleCompleteTask(task)} className="text-sm bg-gray-100 hover:bg-gray-200 rounded-sm border border-gray-900 py-1 px-2 focus:outline-none focus:ring-0">
            Mark complete
          </button>
        )}
      </div>
      <div className="row-start-3 col-span-4 lg:col-span-2">
        <FormTip video_id={tipVid[0].tip} />
      </div>
    </div>
  );
}
