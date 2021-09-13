import { Transition } from "@headlessui/react";
import { useState, useEffect } from "react";
import { supabase } from "../../utils/initSupabase";
import { useRouter } from "next/router";
import Account from "./account";
import Favorites from "./favorites";
import Reviews from "./reviews";
import SectionLoading from "./sectionLoading";
import AddApp from "./addApp";
import TaskList from "./tasks/taskList";
//import AddProduct from "./createNew";
import AdminCreateApp from "./admin_create_app/createApp";
import EditApps from "./editApps";
import AuditTasks from "./auditTasks";

const navLinks = [
  {
    label: "Your account",
    route: "account",
    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  },
  {
    label: "Favorites",
    route: "favorites",
    icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
  },
  {
    label: "Reviews",
    route: "reviews",
    icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
  },
];

const vendorLinks = [
  // {
  //   label: "Vendor",
  //   icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
  // },
  // {
  //   label: "Products",
  //   icon: "M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z",
  // },
  {
    label: "Add your app",
    route: "add_app",
    icon: "M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z",
  },
];

const adminLinks = [
  {
    label: "Tasks",
    route: "tasks",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
  },
  {
    label: "Edit apps",
    route: "edit",
    icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
  },
];

const superAdminLinks = [
  {
    label: "Add app",
    route: "admin_create_app",
    icon: "M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    label: "Audit tasks",
    route: "audit_tasks",
    icon: "M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z",
  },
];

export default function Dashboard(props) {
  const router = useRouter();
  const initialState = router.query.screen ? router.query.screen : "account";
  const [screen, setScreen] = useState(initialState);
  const [showSidebar, setShowSidebar] = useState(false);
  const [vendor, setVendor] = useState();
  const [admin, setAdmin] = useState();
  const [superAdmin, setSuperAdmin] = useState();

  // Fetch on load
  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const profileData = await getProfile(props.user.id);
      if (profileData) {
        profileData[0]?.vendor ? setVendor(profileData[0].vendor) : "";
        profileData[0]?.admin ? setAdmin(profileData[0].admin) : "";
        profileData[0]?.super_admin ? setSuperAdmin(profileData[0].super_admin) : "";
      }
    } catch (error) {
      throw error;
    }
  }

  async function getProfile(id) {
    try {
      let response = await supabase.from("users").select("*").eq("id", id);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async function updateVendor(ven) {
    try {
      let response = await supabase.from("users").update({ vendor: ven }).eq("id", props.user.id);
      return response.data;
    } catch (err) {
      alert(err);
    }
  }

  function handleVendor(val) {
    setVendor(val);
    updateVendor(val);
  }

  const mobileSidebarClick = (route) => {
    router.push(`/profile?screen=${route}`, undefined, { shallow: true });
    setShowSidebar(false);
  };

  const desktopSidebarClick = (route) => {
    router.push(`/profile?screen=${route}`, undefined, { shallow: true });
  };

  const signOut = () => {
    supabase.auth.signOut();
    router.push("/");
  };

  // if (!profile) return <div>Loading...</div>;

  return (
    <>
      <Transition show={showSidebar} className="md:hidden">
        <div className="fixed inset-0 flex z-40">
          <Transition.Child
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            className="fixed inset-0"
          >
            <div className="absolute inset-0 bg-gray-600 opacity-75"></div>
          </Transition.Child>
          <Transition.Child
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
            className="relative flex-1 flex flex-col max-w-xs w-full bg-white"
          >
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button onClick={() => setShowSidebar(false)} className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                <span className="sr-only">Close sidebar</span>
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 h-0 pb-4 overflow-y-auto relative">
              <nav className="mt-5 px-2 space-y-1">
                {navLinks.map(({ label, route, icon }) => (
                  <button
                    key={route}
                    onClick={() => mobileSidebarClick(route)}
                    className={`${
                      screen === route ? "bg-gray-200 text-gray-900" : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                    } group flex items-center w-full px-2 py-2 text-sm font-medium focus:outline-none focus:ring-0`}
                  >
                    <svg
                      className={`${screen === route ? "text-gray-500" : "text-gray-400 group-hover:text-gray-500"} mr-3 h-6 w-6`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
                    </svg>
                    {label}
                  </button>
                ))}
                {vendor && (
                  <>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center">
                        <span className="px-2 bg-white text-sm text-gray-500">App developer</span>
                      </div>
                    </div>
                    {vendorLinks.map(({ label, route, icon }) => (
                      <button
                        key={route}
                        onClick={() => mobileSidebarClick(route)}
                        className={`${
                          screen === route ? "bg-gray-200 text-gray-900" : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                        } group flex items-center w-full px-2 py-2 text-sm font-medium focus:outline-none focus:ring-0`}
                      >
                        <svg
                          className={`${screen === route ? "text-gray-500" : "text-gray-400 group-hover:text-gray-500"} mr-3 h-6 w-6`}
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
                        </svg>
                        {label}
                      </button>
                    ))}
                  </>
                )}
                {admin && (
                  <>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center">
                        <span className="px-2 bg-white text-sm text-gray-500">Admin</span>
                      </div>
                    </div>
                    {adminLinks.map(({ label, route, icon }) => (
                      <button
                        key={route}
                        onClick={() => mobileSidebarClick(route)}
                        className={`${
                          screen === route ? "bg-gray-200 text-gray-900" : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                        } group flex items-center w-full px-2 py-2 text-sm font-medium focus:outline-none focus:ring-0`}
                      >
                        <svg
                          className={`${screen === route ? "text-gray-500" : "text-gray-400 group-hover:text-gray-500"} mr-3 h-6 w-6`}
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
                        </svg>
                        {label}
                      </button>
                    ))}
                    {superAdmin &&
                      superAdminLinks.map(({ label, route, icon }) => (
                        <button
                          key={route}
                          onClick={() => mobileSidebarClick(route)}
                          className={`${
                            screen === route ? "bg-gray-200 text-gray-900" : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                          } group flex items-center w-full px-2 py-2 text-sm font-medium focus:outline-none focus:ring-0`}
                        >
                          <svg
                            className={`${screen === route ? "text-gray-500" : "text-gray-400 group-hover:text-gray-500"} mr-3 h-6 w-6`}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
                          </svg>
                          {label}
                        </button>
                      ))}
                  </>
                )}
                <button
                  onClick={() => signOut()}
                  className={`absolute inset-x-0 bottom-4 mx-2 text-gray-600 hover:bg-gray-200 hover:text-gray-900 group flex items-center w-full px-2 py-2 text-sm font-medium`}
                >
                  <svg className={`text-gray-400 group-hover:text-gray-500 mr-3 h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign out
                </button>
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
              <nav className="mt-5 flex-1 px-2 bg-white space-y-1 relative">
                {navLinks.map(({ label, route, icon }) => (
                  <button
                    key={route}
                    onClick={() => desktopSidebarClick(route)}
                    className={`${
                      screen === route ? "bg-gray-200 text-gray-900" : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                    } group flex items-center w-full px-2 py-2 text-sm font-medium focus:outline-none focus:ring-0`}
                  >
                    <svg
                      className={`${screen === route ? "text-gray-500" : "text-gray-400 group-hover:text-gray-500"} mr-3 h-6 w-6`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
                    </svg>
                    {label}
                  </button>
                ))}
                {vendor && (
                  <>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center">
                        <span className="px-2 bg-white text-sm text-gray-500">App developer</span>
                      </div>
                    </div>
                    {vendorLinks.map(({ label, route, icon }) => (
                      <button
                        key={route}
                        onClick={() => desktopSidebarClick(route)}
                        className={`${
                          screen === route ? "bg-gray-200 text-gray-900" : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                        } group flex items-center w-full px-2 py-2 text-sm font-medium focus:outline-none focus:ring-0`}
                      >
                        <svg
                          className={`${screen === route ? "text-gray-500" : "text-gray-400 group-hover:text-gray-500"} mr-3 h-6 w-6`}
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
                        </svg>
                        {label}
                      </button>
                    ))}
                  </>
                )}
                {admin && (
                  <>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center">
                        <span className="px-2 bg-white text-sm text-gray-500">Admin</span>
                      </div>
                    </div>
                    {adminLinks.map(({ label, route, icon }) => (
                      <button
                        key={route}
                        onClick={() => desktopSidebarClick(route)}
                        className={`${
                          screen === route ? "bg-gray-200 text-gray-900" : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                        } group flex items-center w-full px-2 py-2 text-sm font-medium focus:outline-none focus:ring-0`}
                      >
                        <svg
                          className={`${screen === route ? "text-gray-500" : "text-gray-400 group-hover:text-gray-500"} mr-3 h-6 w-6`}
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
                        </svg>
                        {label}
                      </button>
                    ))}
                    {superAdmin &&
                      superAdminLinks.map(({ label, route, icon }) => (
                        <button
                          key={route}
                          onClick={() => mobileSidebarClick(route)}
                          className={`${
                            screen === route ? "bg-gray-200 text-gray-900" : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                          } group flex items-center w-full px-2 py-2 text-sm font-medium focus:outline-none focus:ring-0`}
                        >
                          <svg
                            className={`${screen === route ? "text-gray-500" : "text-gray-400 group-hover:text-gray-500"} mr-3 h-6 w-6`}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
                          </svg>
                          {label}
                        </button>
                      ))}
                  </>
                )}
                <button
                  onClick={() => signOut()}
                  className={`absolute inset-x-0 bottom-0 mx-2 text-gray-600 hover:bg-gray-200 hover:text-gray-900 group flex w-full items-center px-2 py-2 text-sm font-medium`}
                >
                  <svg className={`text-gray-400 group-hover:text-gray-500 mr-3 h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign out
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
          <button
            onClick={() => setShowSidebar(true)}
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          >
            <span className="sr-only">Open sidebar</span>
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none" tabIndex={0}>
          <div className="py-6">
            <div className="flex flex-col justify-left max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {/* Replace with your content */}
              {screen === "account" && <Account user={props.user} vendor={vendor} handleVendor={handleVendor} authView={props.authView} />}
              {screen === "favorites" && <Favorites user={props.user} />}
              {screen === "reviews" && <Reviews user={props.user} />}
              {/* {screen === "Vendor" && <Vendor user={props.user} />} */}
              {/* {screen === "Products" && <Products user={props.user} />} */}
              {screen === "add_app" && <AddApp user={props.user} />}
              {screen === "tasks" && <TaskList user={props.user} router={router} />}
              {screen === "edit" && <EditApps user={props.user} router={router} />}
              {screen === "admin_create_app" && <AdminCreateApp user={props.user} router={router} />}
              {screen === "audit_tasks" && <AuditTasks user={props.user} router={router} />}
              {/* /End replace */}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
