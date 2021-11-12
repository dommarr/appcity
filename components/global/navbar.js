import { Fragment, useState, useEffect } from "react";
import { Auth } from "@supabase/ui";
import { supabase } from "../../utils/initSupabase";
import Link from "next/link";
import { useRouter } from "next/router";
import Avatar from "boring-avatars";
import { Disclosure, Menu, Transition, Dialog } from "@headlessui/react";
import { SearchIcon } from "@heroicons/react/solid";
import { Command, ArrowLeft } from "react-feather";
import {
  MenuIcon,
  XIcon,
  BellIcon,
  CalendarIcon,
  ChartBarIcon,
  FolderIcon,
  HomeIcon,
  InboxIcon,
  MenuAlt2Icon,
  UsersIcon,
  AcademicCapIcon,
  InformationCircleIcon,
  LightningBoltIcon,
} from "@heroicons/react/outline";
import Logo from "../graphics/logo/Logo";
import LogoLight from "../graphics/logo/LogoLight";
import BugModal from "./bugModal";
import Bug from "../graphics/bug";
import BugPopover from "./bugPopover";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const SearchBar = ({ query, setQuery, handleSubmit, light }) => {
  return (
    <div className={`sm:max-w-sm lg:max-w-lg w-full`}>
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          name="search"
          id="search"
          className={`${
            light ? "border-gray-500 text-gray-500 placeholder-gray-400 focus:ring-gray-500 focus:border-gray-500" : "border-white text-white placeholder-white focus:ring-white focus:border-white"
          } border-l border-t border-b border-r-0 bg-transparent focus:ring-0 focus:outline-none  w-full md:text-sm"`}
          placeholder="Search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        {/* <div className="border-t border-b border-white flex items-center justify-center pr-2">
          <div className="flex items-center justify-center bg-purple space-x-0.5 px-3 pb-0.5 rounded">
            <Command size={15} className="text-white" />
            <span className="text-white font-light text-sm">CTRL-</span>
            <span className="text-white font-light">/</span>
          </div>
        </div> */}
        <button
          type="submit"
          className={`${
            light ? "text-gray-500 hover:text-white hover:bg-gray-500 border-gray-500" : "text-white hover:text-purple-extradark hover:bg-white border-white"
          } bg-transparent border border border w-20 flex justify-center items-center focus:outline-none focus:ring-0`}
        >
          <SearchIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default function SearchNav({ trans, light, search }) {
  const router = useRouter();
  const { user } = Auth.useUser();
  const [query, setQuery] = useState(router.query.query);
  const [showSearch, setShowSearch] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    if (user) {
      let defaultUrl = "https://source.boringavatars.com/pixel/120/?colors=540AFF,0F0059,8D5CFF,FFFF00,FCD34D";
      if (user.app_metadata.provider === "google") {
        let url = user.user_metadata.avatar_url ? user.user_metadata.avatar_url : defaultUrl;
        setAvatar(url);
      } else {
        setAvatar(defaultUrl);
      }
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push(`/search?query=${query}`);
  };

  const navigation = [
    { name: "Home", href: "/", icon: HomeIcon, current: router.pathname === "/" ? true : false },
    { name: "About", href: "/about", icon: InformationCircleIcon, current: router.pathname === "/about" ? true : false },
    { name: "Partner", href: "/contact", icon: LightningBoltIcon, current: router.pathname === "/contact" ? true : false },
    { name: "Blog", href: "/blog", icon: AcademicCapIcon, current: router.pathname === "/blog" ? true : false },
  ];

  const profileNavigation = [
    { name: "Your account", href: "/", icon: HomeIcon, current: router.pathname === "/" ? true : false },
    { name: "Favorites", href: "/about", icon: InformationCircleIcon, current: router.pathname === "/about" ? true : false },
    { name: "Reviews", href: "/contact", icon: LightningBoltIcon, current: router.pathname === "/contact" ? true : false },
    { name: "List your app", href: "/blog", icon: AcademicCapIcon, current: router.pathname === "/blog" ? true : false },
    { name: "Tasks", href: "/blog", icon: AcademicCapIcon, current: router.pathname === "/blog" ? true : false },
    { name: "Edit apps", href: "/blog", icon: AcademicCapIcon, current: router.pathname === "/blog" ? true : false },
    { name: "Discounts", href: "/blog", icon: AcademicCapIcon, current: router.pathname === "/blog" ? true : false },
    { name: "Add app", href: "/blog", icon: AcademicCapIcon, current: router.pathname === "/blog" ? true : false },
    { name: "Audit tasks", href: "/blog", icon: AcademicCapIcon, current: router.pathname === "/blog" ? true : false },
  ];

  const HeaderLinks = () => {
    return (
      <div className="hidden sm:flex items-center justify-center space-x-8 lg:space-x-16">
        {navigation
          .filter((item) => item.name !== "Home")
          .map((item, index) => (
            <Link href={item.href} key={index}>
              <a className="text-white hover:text-gray-200">{item.name}</a>
            </Link>
          ))}
      </div>
    );
  };

  return (
    <>
      <Disclosure as="nav" className={`${trans ? "bg-transparent" : "bg-purple-extradark"} z-40`}>
        {({ open }) => (
          <>
            <div className="max-w-screen-3xl mx-auto px-4 lg:px-8">
              {!showSearch && (
                <div className="grid grid-cols-5 flex items-center justify-between h-16">
                  <div className={`${search ? "col-span-2" : "col-span-3 sm:space-x-0"}  sm:col-span-1 flex items-center justify-start space-x-4`}>
                    {search && <MenuIcon onClick={() => setSidebarOpen(true)} className={`h-6 w-6 cursor-pointer ${light ? "text-gray-500 hover:text-gray-900" : "text-white hover:text-gray-200"}`} />}
                    {!search && <MenuIcon onClick={() => setSidebarOpen(true)} className="sm:hidden h-6 w-6 text-white cursor-pointer" />}
                    <Link href="/">
                      <a className="relative flex items-center justify-center">
                        {!light && <Logo size={36} alt="AppCity" />}
                        {light && <LogoLight size={36} alt="AppCity" />}
                        {search && (
                          <div className="hidden lg:block pb-1">
                            <span className={`${light ? "text-purple" : "text-white"} font-logo pl-1 text-2xl font-light`}>app</span>
                            <span className={`${light ? "text-purple" : "text-white"} font-logo pr-2 text-2xl text-white font-semibold`}>city</span>
                            <span className={`${light ? "text-purple" : "text-white"} absolute -bottom-1.5 right-7 text-xs`}>beta</span>
                          </div>
                        )}
                        {!search && (
                          <div className="pb-1">
                            <span className={`${light ? "text-purple" : "text-white"} font-logo pl-1 text-2xl font-light`}>app</span>
                            <span className={`${light ? "text-purple" : "text-white"} font-logo pr-2 text-2xl text-white font-semibold`}>city</span>
                            <span className={`${light ? "text-purple" : "text-white"} absolute -bottom-1.5 right-7 text-xs`}>beta</span>
                          </div>
                        )}
                      </a>
                    </Link>
                  </div>

                  <div className={`${search ? "col-span-1" : "hidden"} sm:flex sm:col-span-3 w-full flex-1 items-center justify-center`}>
                    {search && (
                      <div className="hidden sm:flex w-full items-center justify-center">
                        <SearchBar query={query} setQuery={setQuery} handleSubmit={handleSubmit} light={light} />
                      </div>
                    )}
                    {!search && <HeaderLinks />}
                  </div>

                  <div className="col-span-2 sm:col-span-1 flex items-center justify-end space-x-4">
                    {search && !showSearch && (
                      <SearchIcon
                        onClick={() => setShowSearch(true)}
                        className={`w-5 h-5 cursor-pointer sm:hidden ${light ? "text-gray-500 hover:text-gray-900" : "text-white hover:text-gray-200"}`}
                      />
                    )}
                    <div>
                      <BugPopover caption="Report a bug" color={`${light ? "text-gray-500 hover:text-gray-900" : "text-white hover:text-gray-200"} hidden md:flex`} />
                      <div onClick={() => setFeedbackOpen(true)} className="md:hidden">
                        <Bug size={30} color={`${light ? "text-gray-500 hover:text-gray-900" : "text-white hover:text-gray-200"} cursor-pointer`} />
                      </div>
                      <BugModal open={feedbackOpen} setOpen={setFeedbackOpen} />
                    </div>
                    {/* Profile dropdown */}
                    {!user && (
                      <Link href={{ pathname: `/profile`, query: { view: "magic_link" } }}>
                        <a className={`text-purple-extradark bg-white hover:bg-gray-200 items-center justify-center px-2 py-1 shadow-sm text-sm font-medium`}>Sign in</a>
                      </Link>
                    )}
                    {user && (
                      <Menu as="div" className="relative flex-shrink-0">
                        <div>
                          <Menu.Button className={`bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}>
                            <span className="sr-only">Open user menu</span>
                            <img className="h-8 w-8 rounded-full" src={avatar} alt="" />
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="z-10 origin-top-right absolute right-0 mt-2 w-48 shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <Menu.Item>
                              {({ active }) => (
                                <a href="/profile?screen=account" className={classNames(active ? "bg-gray-100" : "", "block px-4 py-2 text-sm text-gray-700")}>
                                  Your Profile
                                </a>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <button className="w-full" onClick={() => supabase.auth.signOut()}>
                                  <a href="#" className={classNames(active ? "bg-gray-100" : "", "block px-4 py-2 text-sm text-gray-700 text-left")}>
                                    Sign out
                                  </a>
                                </button>
                              )}
                            </Menu.Item>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    )}
                  </div>
                </div>
              )}
              {showSearch && (
                <div className="grid grid-cols-7 flex items-center justify-center h-16">
                  <ArrowLeft
                    onClick={() => setShowSearch(false)}
                    className={`col-span-1 w-5 h-5 cursor-pointer ml-2 ${light ? "text-gray-500 hover:text-gray-900" : "text-white hover:text-gray-200"}`}
                  />
                  <div className="col-span-5 flex items-center justify-center w-full">
                    <SearchBar query={query} setQuery={setQuery} handleSubmit={handleSubmit} light={light} />
                  </div>
                  <div className="col-span-1"></div>
                </div>
              )}
            </div>
          </>
        )}
      </Disclosure>

      {/* Left Sidebar */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 flex z-40" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-purple-extradark">
              <Transition.Child as={Fragment} enter="ease-in-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in-out duration-300" leaveFrom="opacity-100" leaveTo="opacity-0">
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    type="button"
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </Transition.Child>
              <div className="flex-shrink-0 flex items-center px-4">
                <Link href="/">
                  <a className="relative flex items-center justify-center">
                    <Logo size={36} alt="AppCity" />
                    <div className="hidden lg:block pb-1">
                      <span className={`text-white font-logo pl-1 text-2xl font-light`}>app</span>
                      <span className={`text-white font-logo pr-2 text-2xl text-white font-semibold`}>city</span>
                      <span className={`text-white absolute -bottom-1.5 right-7 text-xs`}>beta</span>
                    </div>
                  </a>
                </Link>
              </div>
              <div className="mt-5 flex-1 h-0 overflow-y-auto">
                <nav className="px-2 space-y-1">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className={classNames(item.current ? "bg-purple-dark text-white" : "text-white hover:bg-purple-dark", "group flex items-center px-2 py-2 text-base font-medium")}
                    >
                      <item.icon className="mr-4 flex-shrink-0 h-6 w-6 text-white" aria-hidden="true" />
                      {item.name}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </Transition.Child>
          <div className="flex-shrink-0 w-14" aria-hidden="true">
            {/* Dummy element to force sidebar to shrink to fit close icon */}
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
