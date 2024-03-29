import { useState, useEffect } from "react";
import { supabase } from "../../../utils/initSupabase";
import Loading from "../sectionLoading";
import AppForms from "../app_forms/appForms";
import { ChevronLeftIcon } from "@heroicons/react/solid";
import FormTip from "../app_forms/formTip";
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
    let { data: tasks, error } = await supabase.from("tasks").select("*").eq("complete", false).order("id");
    if (error) {
      setLoading(false);
      throw error;
    }
    if (tasks) {
      setLoading(false);
      setTasks(tasks);
    }
  };

  const setTaskInProgress = async (task, bool, fetchTasksBool) => {
    const { data, error } = await supabase.from("tasks").update({ in_progress: bool }).eq("id", task.id);
    if (error) {
      throw error;
    }
    if (data) {
      if (fetchTasksBool) {
        fetchTasks();
      }
      return;
    }
  };

  function handleTaskClick({ task }) {
    setListview(false);
    setTaskInProgress(task, true);
    setCurrenttask(task);
    // props.router.push(`/dashboard?screen=tasks&task=${task.id}`, undefined, { shallow: true });
  }

  const NoTasks = () => {
    return <div className="col-span-4 p-2 bg-gray-200">There are currently no tasks.</div>;
  };

  const handleCompleteTask = async (task) => {
    let datetime = moment();
    const { data, error } = await supabase.from("tasks").update({ complete: true, date_complete: datetime, completed_by: props.user.email, in_progress: false }).eq("id", task.id);
    if (error) {
      throw error;
    }
    if (data) {
      const { data, error } = await supabase.from("products").update({ complete: true }).eq("id", task.product_id);
      if (error) {
        throw error;
      }
      if (data) {
        fetchTasks();
      }
    }
  };

  const handleBack = async () => {
    setTaskInProgress(currenttask, false, true);
    setListview(true);
  };

  const TaskCard = ({ task, index }) => {
    return (
      <div className={`relative col-span-4 grid grid-cols-4 gap-x-2 p-2 ${index % 2 === 0 ? "bg-gray-100" : "bg-gray-200"}`}>
        {task.in_progress && (
          <div className="absolute inset-0 bg-blue-200 bg-opacity-90 h-full w-full flex flex-row items-center justify-around px-2 border">
            <h5 className="text-xl font-bold">Task in progress</h5>
            <p className="text-md">Someone else is working on this task. Skip to the next one.</p>
            <button
              onClick={() => {
                setTaskInProgress(task, false, true);
              }}
              className="text-sm bg-gray-100 hover:bg-gray-200 rounded-sm border border-gray-900 py-1 px-2 focus:outline-none focus:ring-0"
            >
              It was me. Unblock.
            </button>
          </div>
        )}
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
          <button type="button" onClick={() => handleCompleteTask(task)} className="text-sm bg-gray-100 hover:bg-gray-200 rounded-sm border border-gray-900 py-1 px-2 focus:outline-none focus:ring-0">
            Mark complete
          </button>
        </div>
      </div>
    );
  };

  if (loading) return <Loading />;

  return (
    <section className="py-4 space-y-4">
      <h1 className="text-2xl font-semibold text-gray-900">Tasks</h1>
      <div className="max-w-lg">
        <FormTip video_id="c3aed7f9f8194fecb7af2cf30157eaee" />
      </div>
      {listview && (
        <div className="grid grid-cols-4 gap-x-2 bg-white shadow p-4">
          <div className="col-span-1 flex space-x-2 items-center">
            <span className="font-bold text-lg underline">Task</span>
            <span className="text-sm">({tasks.length} tasks)</span>
          </div>
          <div className="col-span-1 font-bold text-lg underline">Product</div>
          <div className="col-span-1 font-bold text-lg underline">Notes</div>
          <div className="col-span-1 font-bold text-lg underline">Complete?</div>
          {(tasks.length === 0 || !tasks) && <NoTasks />}
          {tasks.map((task, idx) => (
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
          <AppForms pId={currenttask.product_id} task={currenttask} user={props.user} />
        </div>
      )}
    </section>
  );
}
