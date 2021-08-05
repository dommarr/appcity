import { useState, useEffect } from "react";
import { supabase } from "../../utils/initSupabase";
import Loading from "./sectionLoading";
import Task from "./task";
import { ChevronLeftIcon } from "@heroicons/react/solid";
var moment = require("moment");

export default function TaskList(props) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listview, setListview] = useState(true);
  const [currenttask, setCurrenttask] = useState(null);

  // Fetch on load
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    let { data: tasks, error } = await supabase.from("tasks").select("*").eq("complete", true).eq("audited", false);
    if (error) {
      setLoading(false);
      throw error;
    }
    if (tasks) {
      let sortedTasks = tasks.slice().sort((a, b) => new Date(b.date_complete) - new Date(a.date_complete));
      setTasks(sortedTasks);
      setLoading(false);
    }
  };

  function handleTaskClick({ task }) {
    setListview(false);
    setCurrenttask(task);
  }

  const NoTasks = () => {
    return <div className="col-span-4 p-2 bg-gray-200">There are currently no tasks.</div>;
  };

  const handleBack = async () => {
    setListview(true);
  };

  const handleAuditClick = async (task) => {
    const { data, error } = await supabase.from("tasks").update({ audited: true }).eq("id", task.id);
    if (error) {
      throw error;
    }
    if (data) {
      fetchTasks();
    }
  };

  const TaskCard = ({ task, index }) => {
    let date = moment(task.date_complete).format("MMMM Do YYYY, h:mm:ss a");
    let relativeDate = moment(task.date_complete).fromNow();
    return (
      <div className={`relative col-span-5 grid grid-cols-5 gap-x-2 p-2 ${index % 2 === 0 ? "bg-gray-100" : "bg-gray-200"}`}>
        <div onClick={() => handleTaskClick({ task })} className="col-span-1 flex flex-col justify-center space-y-1 hover:cursor-pointer ">
          <span className="">{relativeDate}</span>
          <span className="text-sm">By: {task.completed_by}</span>
          <span className="text-xs">{date}</span>
        </div>
        <div onClick={() => handleTaskClick({ task })} className="col-span-1 flex flex-col justify-center hover:cursor-pointer ">
          <span className="">{task.name}</span>
          <span className="text-xs">Task ID: {task.id}</span>
        </div>
        <div onClick={() => handleTaskClick({ task })} className="col-span-1 flex flex-col justify-center hover:cursor-pointer ">
          <span className="">{task.product_name}</span>
          <span className="text-xs">Product ID: {task.product_id}</span>
        </div>
        <ul onClick={() => handleTaskClick({ task })} className="col-span-1 hover:cursor-pointer">
          {task.notes &&
            task.notes.map((note, idx) => (
              <li key={idx} className="text-sm">
                {note}
              </li>
            ))}
        </ul>
        <div className="col-span-1 flex justify-start items-center space-x-2">
          <button type="button" onClick={() => handleAuditClick(task)} className="text-sm bg-gray-100 hover:bg-gray-200 rounded-sm border border-gray-900 py-1 px-2 focus:outline-none focus:ring-0">
            Audit complete
          </button>
        </div>
      </div>
    );
  };

  if (loading) return <Loading />;

  return (
    <section className="py-4 space-y-4">
      <h1 className="text-2xl font-semibold text-gray-900">Completed tasks</h1>
      {listview && (
        <div className="grid grid-cols-5 gap-x-2 bg-white shadow p-4">
          <div className="col-span-1 font-bold text-lg underline">Completed</div>
          <div className="col-span-1 font-bold text-lg underline">Task</div>
          <div className="col-span-1 font-bold text-lg underline">Product</div>
          <div className="col-span-1 font-bold text-lg underline">Notes</div>
          <div className="col-span-1 font-bold text-lg underline">Audited?</div>
          {(tasks?.length === 0 || !tasks) && <NoTasks />}
          {tasks?.map((task, idx) => (
            <TaskCard key={task.id} task={task} index={idx} />
          ))}
        </div>
      )}
      {!listview && (
        <div className="flex flex-col space-y-4">
          <div>
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium text-white bg-purple hover:bg-purple-dark focus:outline-none focus:ring-0"
            >
              <ChevronLeftIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
              Back to task list
            </button>
          </div>
          <Task task={currenttask} user={props.user} />
        </div>
      )}
    </section>
  );
}
