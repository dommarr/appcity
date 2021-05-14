import { useState, useEffect } from "react";
import { supabase } from "../../utils/initSupabase";
import Loading from "./sectionLoading";
import Task from "./task";
import { ChevronLeftIcon } from "@heroicons/react/solid";

export default function TaskList(props) {
  const [tasks, setTasks] = useState(null);
  const [loading, setLoading] = useState(true);
  const [listview, setListview] = useState(true);
  const [currenttask, setCurrenttask] = useState(null);

  const NoTasks = () => {
    return (
      <div className="shadow sm:overflow-hidden">
        <div className="bg-white py-6 px-4 sm:p-6">There are currently no tasks.</div>
      </div>
    );
  };

  const TaskCard = ({ task }) => {
    return (
      <div onClick={() => handleTaskClick({ task })} className="shadow sm:overflow-hidden hover:cursor-pointer">
        <div className="bg-white py-6 px-4 sm:p-6 flex justify-between">
          <h3 className="font-medium">{task.name}</h3>
        </div>
      </div>
    );
  };

  function handleTaskClick({ task }) {
    setListview(false);
    setCurrenttask(task);
    // props.router.push(`/profile?screen=tasks&task=${task.id}`, undefined, { shallow: true });
  }
  // const [newproduct, setNewproduct] = useState(false);

  // let [form, setForm] = useState({
  //   name: "",
  //   pricelink: "",
  //   keywords: "",
  // });

  // let handleChange = (e) => {
  //   let name = e.target.name;
  //   let value = e.target.value;
  //   form[name] = value;
  //   setForm(form);
  // };

  // Fetch on load
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      let taskData = await supabase.from("products").select(`*`).eq("task", true);
      setTasks(taskData.body);
    } catch (error) {
      alert(error);
    }
    setLoading(false);
  };

  if (loading) return <Loading />;

  return (
    <section className="py-4 space-y-4">
      <h1 className="text-2xl font-semibold text-gray-900">Tasks</h1>
      {listview && (
        <ol className="space-y-2">
          {(tasks.length === 0 || !tasks) && <NoTasks />}
          {tasks.map((task) => (
            <li key={task.id}>
              <TaskCard task={task} />
            </li>
          ))}
        </ol>
      )}
      {!listview && (
        <div className="flex flex-col space-y-4">
          <div>
            <button type="button" onClick={() => setListview(true)} className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium text-white bg-purple hover:bg-purple-dark focus:outline-none focus:ring-0">
              <ChevronLeftIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
              Back to task list
            </button>
          </div>
          <Task productId={currenttask.id} />
        </div>
      )}
    </section>
  );
}
