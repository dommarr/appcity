import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import React from "react";
import Bug from "../graphics/bug";
import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import { useState } from "react";
import { supabase } from "../../utils/initSupabase";

export default function BugPopover({ caption, color }) {
  const [view, setView] = useState("form");
  const [bugMessage, setBugMessage] = useState("");

  const handleSubmit = async () => {
    setView("sending");
    const { data, error } = await supabase.from("bugs").insert([{ message: bugMessage }]);
    if (error) {
      setView("error");
      setBugMessage("");
      setTimeout(function () {
        setView("form");
      }, 3000);
    }
    if (data) {
      setView("success");
      setBugMessage("");
      setTimeout(function () {
        setView("form");
      }, 3000);
    }
  };

  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button className="flex items-center justify-center">
            <Tippy content={caption} touch="hold">
              <div className="flex justify-center items-center cursor-pointer select-none xl:mr-4">
                <Bug size={30} color={color} />
              </div>
            </Tippy>
          </Popover.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute z-10 left-1/2 transform -translate-x-1/2 mt-3 px-2 w-screen max-w-xs sm:px-0">
              <div className="shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
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
                          We appreciate your feedback.
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
                      <div className="text-right">
                        <button
                          type="submit"
                          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium text-white bg-purple hover:bg-purple-dark focus:outline-none focus:ring-0"
                        >
                          Submit
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
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}
