import { useState, useEffect } from "react";
import { supabase } from "../../utils/initSupabase";
import Loading from "./sectionLoading";
import Task from "./task";
import { ChevronLeftIcon } from "@heroicons/react/solid";
import FormTip from "./formTip";

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
    let { data: tasks, error } = await supabase.from("tasks").select("*").eq("complete", false);
    if (error) {
      setLoading(false);
      throw error;
    }
    if (tasks) {
      setLoading(false);
      setTasks(tasks);
    }
  };

  function handleTaskClick({ task }) {
    setListview(false);
    setCurrenttask(task);
    // props.router.push(`/profile?screen=tasks&task=${task.id}`, undefined, { shallow: true });
  }

  const NoTasks = () => {
    return <div className="col-span-4 p-2 bg-gray-200">There are currently no tasks.</div>;
  };

  const handleCompleteTask = async (task) => {
    const { data, error } = await supabase.from("tasks").update({ complete: true }).eq("id", task.id);
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
    fetchTasks();
    setListview(true);
  };

  const TaskCard = ({ task, index }) => {
    return (
      <div className={`col-span-4 grid grid-cols-4 gap-x-2 p-2 ${index % 2 === 0 ? "bg-gray-100" : "bg-gray-200"}`}>
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
          <button
            type="button"
            onClick={() => handleCompleteTask(task)}
            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-0"
          >
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
          <div className="col-span-1 font-bold text-lg underline">Task</div>
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
          <Task task={currenttask} user={props.user} />
        </div>
      )}
    </section>
  );
}
