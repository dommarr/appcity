import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { supabase } from "../../utils/initSupabase";

export default function Modal({ open, setOpen }) {
  const [view, setView] = useState("form");
  const [bugMessage, setBugMessage] = useState("");
  const cancelButtonRef = useRef(null);

  const handleCancel = () => {
    setOpen(false);
    setBugMessage("");
  };

  const handleSubmit = async () => {
    setView("sending");
    const { data, error } = await supabase.from("bugs").insert([{ message: bugMessage }]);
    if (error) {
      setView("error");
      setBugMessage("");
      setTimeout(function () {
        setOpen(false);
        setView("form");
      }, 3000);
    }
    if (data) {
      setView("success");
      setBugMessage("");
      setTimeout(function () {
        setOpen(false);
        setView("form");
      }, 3000);
    }
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" initialFocus={cancelButtonRef} onClose={setOpen}>
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              {view === "form" && (
                <form
                  action="#"
                  method="POST"
                  className="space-y-4"
                  onSubmit={(e) => {
                    handleSubmit(e);
                  }}
                >
                  <div>
                    <label htmlFor="bug" className="block text-lg font-medium text-gray-700">
                      Report a bug
                    </label>
                    <span id="bug-description" className="text-sm text-gray-500">
                      We appreciate your feedback. It helps!
                    </span>
                    <div className="mt-1">
                      <textarea
                        id="bug"
                        name="bug"
                        aria-describedby="bug-description"
                        rows={4}
                        className="block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border border-gray-300"
                        value={bugMessage}
                        onChange={(e) => setBugMessage(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center border border-transparent shadow-sm px-4 py-2 bg-purple text-base font-medium text-white hover:bg-purple-dark focus:outline-none focus:ring-0 sm:col-start-2 sm:text-sm"
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-0 sm:mt-0 sm:col-start-1 sm:text-sm"
                      onClick={() => handleCancel()}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
              {view === "sending" && (
                <div className="flex justify-center items-center">
                  <h4 className="text-lg font-bold tracking-tight text-gray-900 animate-pulse">Sending...</h4>
                </div>
              )}
              {view === "success" && (
                <div className="flex flex-col justify-center items-center space-y-1">
                  <h4 className="text-lg font-bold tracking-tight text-gray-900">Received!</h4>
                  <p className="text-sm tracking-tight text-gray-900">Thanks for the feedback. It's a huge help!</p>
                </div>
              )}
              {view === "error" && (
                <div className="flex flex-col justify-center items-center space-y-1">
                  <h4 className="text-lg font-bold tracking-tight text-gray-900">Uh oh...</h4>
                  <p className="text-sm tracking-tight text-gray-900 text-center">There was an error. Please try again soon.</p>
                  <p className="text-sm tracking-tight text-gray-900 text-center">The form will reset shortly. </p>
                </div>
              )}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
