import { Transition } from "@headlessui/react";
import { useState, useEffect } from "react";
import { supabase } from "../utils/initSupabase";
import { useRouter } from "next/router";
import Loading from "./loading";

const navLinks = [
  {
    label: "Profile",
    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  },
  {
    label: "Products",
    icon: "M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z",
  },
];

export default function Dashboard(props) {
  const [profile, setProfile] = useState(null);
  const [screen, setScreen] = useState("Profile");
  const [showSidebar, setShowSidebar] = useState(false);
  const router = useRouter();

  const mobileSidebarClick = (label) => {
    setScreen(label);
    setShowSidebar(false);
  };

  const signOut = () => {
    supabase.auth.signOut();
    router.push("/");
  };

  const updateProfile = async (event) => {
    event.preventDefault();
    try {
      const { data, error } = await supabase.from("users").update({ other_column: "otherValue" }).eq("some_column", "someValue");
      return "Success";
    } catch (err) {
      alert(err);
    }
  };

  // Fetch on load
  useEffect(() => {
    async function fetchProfile() {
      try {
        let response = await supabase.from("users").select("*").eq("id", props.user.id);
        setProfile(response.data[0]);
      } catch (err) {
        alert(err);
      }
    }
    fetchProfile();
  }, []);

  if (!profile) return <Loading />;

  return (
    <>
      <Transition show={showSidebar} className="md:hidden">
        <div className="fixed inset-0 flex z-40">
          <Transition.Child enter="transition-opacity ease-linear duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity ease-linear duration-300" leaveFrom="opacity-100" leaveTo="opacity-0" className="fixed inset-0">
            <div className="absolute inset-0 bg-gray-600 opacity-75"></div>
          </Transition.Child>
          <Transition.Child enter="transition ease-in-out duration-300 transform" enterFrom="-translate-x-full" enterTo="translate-x-0" leave="transition ease-in-out duration-300 transform" leaveFrom="translate-x-0" leaveTo="-translate-x-full" className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button onClick={() => setShowSidebar(false)} className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                <span className="sr-only">Close sidebar</span>
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 h-0 pb-4 overflow-y-auto">
              <nav className="mt-5 px-2 space-y-1">
                {navLinks.map(({ label, icon }) => (
                  <button key={label} onClick={() => mobileSidebarClick(label)} className={`${screen === label ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"} group flex items-center w-full px-2 py-2 text-sm font-medium`}>
                    <svg className={`${screen === label ? "text-gray-500" : "text-gray-400 group-hover:text-gray-500"} mr-3 h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
                    </svg>
                    {label}
                  </button>
                ))}
              </nav>
            </div>
          </Transition.Child>
          <div className="flex-shrink-0 w-14">{/* Force sidebar to shrink to fit close icon */}</div>
        </div>
      </Transition>
      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-white">
            <div className="flex-1 flex flex-col pb-4 overflow-y-auto">
              <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
                {navLinks.map(({ label, icon }) => (
                  <button key={label} onClick={() => setScreen(label)} className={`${screen === label ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"} group flex items-center w-full px-2 py-2 text-sm font-medium`}>
                    <svg className={`${screen === label ? "text-gray-500" : "text-gray-400 group-hover:text-gray-500"} mr-3 h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
                    </svg>
                    {label}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
          <button onClick={() => setShowSidebar(true)} className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
            <span className="sr-only">Open sidebar</span>
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none" tabIndex={0}>
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <h1 className="text-2xl font-semibold text-gray-900">{screen}</h1>
            </div>
            <div className="flex flex-col justify-left max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {/* Replace with your content */}
              <section className="py-4 space-y-2">
                <form onSubmit={updateProfile}>
                  <div className="shadow sm:overflow-hidden">
                    <div className="bg-white py-6 px-4 sm:p-6">
                      <div className="grid grid-cols-4 gap-6">
                        <div className="col-span-4 sm:col-span-2">
                          <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                            First name
                          </label>
                          <input type="text" name="first_name" id="first_name" placeholder="Jane" value={profile.first_name} autoComplete="cc-given-name" className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm" />
                        </div>

                        <div className="col-span-4 sm:col-span-2">
                          <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                            Last name
                          </label>
                          <input type="text" name="last_name" id="last_name" placeholder="Doe" value={profile.last_name} autoComplete="cc-family-name" className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm" />
                        </div>

                        <div className="col-span-4 sm:col-span-2">
                          <label htmlFor="email_address" className="block text-sm font-medium text-gray-700">
                            Email address
                          </label>
                          <input type="text" name="email_address" id="email_address" placeholder="jane@doe.com" value={profile.email} autoComplete="email" className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm" />
                        </div>
                      </div>
                    </div>
                    <div className="flex px-4 py-3 bg-gray-50 text-right sm:px-6">
                      <button type="submit" className="bg-purple border border-transparent shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-purple-extradark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900">
                        Update
                      </button>
                      <button onClick={() => signOut()} className="ml-2 bg-white border border-black shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900">
                        Sign out
                      </button>
                    </div>
                  </div>
                </form>
              </section>

              {/* /End replace */}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
