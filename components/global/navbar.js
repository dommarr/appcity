import { Fragment, useState, useEffect } from "react";
import { Auth } from "@supabase/ui";
import { supabase } from "../../utils/initSupabase";
import Link from "next/link";
import { useRouter } from "next/router";
import { Disclosure, Menu, Transition, Dialog } from "@headlessui/react";
import { SearchIcon } from "@heroicons/react/solid";
import { ArrowLeft } from "react-feather";
import {
  MenuIcon,
  XIcon,
  HomeIcon,
  UserIcon,
  HeartIcon,
  StarIcon,
  ViewGridAddIcon,
  ClipboardCheckIcon,
  PencilAltIcon,
  CurrencyDollarIcon,
  PlusCircleIcon,
  DocumentSearchIcon,
  AcademicCapIcon,
  InformationCircleIcon,
  LightningBoltIcon,
  LogoutIcon,
  ArrowSmRightIcon,
} from "@heroicons/react/outline";
import Logo from "../graphics/logo/Logo";
import LogoLight from "../graphics/logo/LogoLight";
import BugModal from "./bugModal";
import Bug from "../graphics/bug";
import BugPopover from "./bugPopover";
import { isMobile } from "react-device-detect";
import NavLinks from "./navLinks";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const SearchBar = ({ query, setQuery, handleSubmit, light }) => {
  const [focused, setFocused] = useState(false);

  const handleReset = () => {
    document.getElementById("search").focus();
    setQuery("");
  };

  const onFocus = () => setFocused(true);
  const onBlur = () => setFocused(false);

  return (
    <div className={`sm:max-w-sm lg:max-w-lg w-full`}>
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          name="search"
          id="search"
          onFocus={onFocus}
          onBlur={onBlur}
          className={`${
            light ? "border-purple text-purple placeholder-purple focus:ring-purple focus:border-purple" : "border-white text-white placeholder-white focus:ring-white focus:border-white"
          } border-l border-t border-b border-r-0 bg-transparent focus:ring-0 focus:outline-none  w-full md:text-sm"`}
          placeholder="Search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className={`${light ? "border-purple" : "border-white"} border-t border-b flex items-center justify-center w-12 pr-2`}>
          {!query && !isMobile && !focused && (
            <div className={`${light ? "bg-gray-200 text-purple" : "bg-purple text-white"} flex items-center justify-center space-x-0.5 px-3 pb-0.5 rounded`}>
              <span className="font-light">/</span>
            </div>
          )}
          {/* <Command size={15} className="text-white" />
            <span className="text-white font-light text-sm">CTRL-</span> */}
          {query && <XIcon onClick={() => handleReset()} className="text-white h-5 w-5 cursor-pointer" />}
        </div>
        <button
          type="submit"
          className={`${
            light ? "text-purple hover:text-white hover:bg-purple border-purple" : "text-white hover:text-purple-extradark hover:bg-white border-white"
          } bg-transparent border border border w-20 flex justify-center items-center focus:outline-none focus:ring-0`}
        >
          <SearchIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default function Navbar({ trans, light, search }) {
  const router = useRouter();
  const { user } = Auth.useUser();
  const [query, setQuery] = useState(router.query.query);
  const [showSearch, setShowSearch] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(async () => {
    let parents = await fetchCategories();
    let children = await fetchChildCategories(parents);
    if (parents && children) {
      let cats = parents.map((parent) => {
        parent.children = children.filter((child) => child.parent_id === parent.id).slice(0, 8);
        return parent;
      });
      setCategories(cats);
      setCategoriesLoading(false);
    }
  }, []);

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
    // for small screen widths, automatically show search bar on the search page
    if (router.pathname === "/search" && document?.body.clientWidth < 640) {
      setShowSearch(true);
    }
    // if there is no search query, set a default query
    if (router.pathname === "/search" && !router.query.query) {
      setQuery("website builder");
      router.replace(`/search?query=website+builder`);
    }

    let inputTags = ["INPUT", "TEXTAREA"];

    document.addEventListener(
      "keyup",
      (event) => {
        if (event.key === "/" && !inputTags.includes(document.activeElement.tagName)) {
          document.getElementById("search").focus();
        }
      },
      false
    );
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // if the user didn't enter a query, set a default query
    if (!query) {
      setQuery("website builder");
      router.push(`/search?query=website+builder`);
    } else {
      router.push(`/search?query=${query}`);
    }
    // cancel focus on the search bar - mainly so the keyboard collapses on mobile
    document.activeElement.blur();
  };

  const handleSignOut = () => {
    if (router.pathname === "/dashboard") {
      router.push("/");
    }
    supabase.auth.signOut();
  };

  const fetchCategories = async () => {
    let { data: categories, error } = await supabase.from("categories").select(`*`).is("parent_id", null).order(`product_count`, { ascending: false }).limit(3);
    if (error) {
      throw error;
    }
    categories = categories.map((category) => {
      category.current = router.asPath === `/categories/${category.slug}` ? true : false;
      return category;
    });
    return categories;
  };

  const fetchChildCategories = async (arr) => {
    let catIds = arr.map((cat) => cat.id);
    let { data: categories, error } = await supabase.from("categories").select(`*`).in("parent_id", catIds).gt("product_count", 0).order(`product_count`, { ascending: false });
    if (error) {
      throw error;
    }
    categories = categories.map((category) => {
      category.current = router.asPath === `/categories/${category.slug}` ? true : false;
      return category;
    });
    return categories;
  };

  const navigation = [
    { name: "Home", href: "/", icon: HomeIcon, current: router.pathname === "/" ? true : false },
    { name: "About", href: "/about", icon: InformationCircleIcon, current: router.pathname === "/about" ? true : false },
    { name: "Partner", href: "/contact", icon: LightningBoltIcon, current: router.pathname === "/contact" ? true : false },
    { name: "Blog", href: "/blog", icon: AcademicCapIcon, current: router.pathname === "/blog" ? true : false },
  ];

  const dashboardNavigation = [
    { name: "Your account", screen: "account", icon: UserIcon, current: router.query.screen === "account" ? true : false, default: true },
    { name: "Favorites", screen: "favorites", icon: HeartIcon, current: router.query.screen === "favorites" ? true : false, default: true },
    { name: "Reviews", screen: "reviews", icon: StarIcon, current: router.query.screen === "reviews" ? true : false, default: true },
    { name: "List your app", screen: "list_app", icon: ViewGridAddIcon, current: router.query.screen === "list_app" ? true : false, vendor: true },
    { name: "Tasks", screen: "tasks", icon: ClipboardCheckIcon, current: router.query.screen === "tasks" ? true : false, admin: true },
    { name: "Edit apps", screen: "edit", icon: PencilAltIcon, current: router.query.screen === "edit" ? true : false, admin: true },
    { name: "Discounts", screen: "discounts", icon: CurrencyDollarIcon, current: router.query.screen === "discounts" ? true : false, superadmin: true },
    { name: "Add app", screen: "admin_create_app", icon: PlusCircleIcon, current: router.query.screen === "admin_create_app" ? true : false, superadmin: true },
    { name: "Audit tasks", screen: "audit_tasks", icon: DocumentSearchIcon, current: router.query.screen === "audit_tasks" ? true : false, superadmin: true },
  ];

  let featured = [
    {
      name: "All Categories",
      href: "/categories",
      imageSrc:
        "https://dnlvkovcawtkzuvpmmgr.supabase.in/storage/v1/object/sign/website_images/categories_dropdown/files.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ3ZWJzaXRlX2ltYWdlcy9jYXRlZ29yaWVzX2Ryb3Bkb3duL2ZpbGVzLmpwZyIsImlhdCI6MTY0MTE1MjQ2NCwiZXhwIjoxOTU2NTEyNDY0fQ.g2u5x1vNgk4mzJuAT9DBxgZc_MXWjPepJ-80AOR5tck",
      imageAlt: "All of the categories on AppCity to find the best business software.",
    },
    {
      name: "Starter Kits",
      href: "/kits",
      imageSrc:
        "https://dnlvkovcawtkzuvpmmgr.supabase.in/storage/v1/object/sign/website_images/categories_dropdown/toolboxes.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ3ZWJzaXRlX2ltYWdlcy9jYXRlZ29yaWVzX2Ryb3Bkb3duL3Rvb2xib3hlcy5qcGciLCJpYXQiOjE2NDExNTI0ODAsImV4cCI6MTk1NjUxMjQ4MH0.117tlBBApSxFZxnCKYO01noXcuV0gnD-WEcZBQsCiTM",
      imageAlt: "Business app starter kits to help you hit the ground running.",
    },
  ];

  return (
    <>
      <Disclosure as="nav" className={`${trans ? "bg-transparent" : "bg-purple-extradark"} z-40 relative`}>
        {({ open }) => (
          <>
            <div className="max-w-screen-3xl mx-auto px-4 md:px-6 lg:px-8">
              {!showSearch && (
                <div className="grid grid-cols-7 flex items-center justify-between h-16">
                  {/* left section - menu icon, logo */}
                  <div className={`${search ? "col-span-3" : "col-span-5"} sm:col-span-2 flex items-center justify-start`}>
                    {search && (
                      <MenuIcon onClick={() => setSidebarOpen(true)} className={`h-6 w-6 cursor-pointer mr-4 ${light ? "text-purple hover:text-purple-dark" : "text-white hover:text-gray-200"}`} />
                    )}
                    {!search && <MenuIcon onClick={() => setSidebarOpen(true)} className="lg:hidden h-6 w-6 text-white cursor-pointer mr-4" />}
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
                  {/* middle section - search or nav links */}
                  <div className={`hidden sm:flex sm:col-span-3 w-full h-full flex-1 items-center justify-center`}>
                    {search && (
                      <div className="hidden sm:flex w-full items-center justify-center">
                        <SearchBar query={query} setQuery={setQuery} handleSubmit={handleSubmit} light={light} />
                      </div>
                    )}
                    {!search && <NavLinks navigation={navigation} categories={categories} featured={featured} categoriesLoading={categoriesLoading} />}
                  </div>
                  {/* right section */}
                  <div className={`${search ? "col-span-4" : "col-span-2"} sm:col-span-2 flex items-center justify-end space-x-4`}>
                    {search && !showSearch && (
                      <SearchIcon
                        onClick={() => setShowSearch(true)}
                        className={`w-5 h-5 cursor-pointer sm:hidden ${light ? "text-purple hover:text-purple-dark" : "text-white hover:text-gray-200"}`}
                      />
                    )}
                    <div>
                      <BugPopover caption="Report a bug" color={`${light ? "text-purple hover:text-purple-dark" : "text-white hover:text-gray-200"} hidden md:flex`} />
                      <div onClick={() => setFeedbackOpen(true)} className="md:hidden">
                        <Bug size={30} color={`${light ? "text-purple hover:text-purple-dark" : "text-white hover:text-gray-200"} cursor-pointer`} />
                      </div>
                      <BugModal open={feedbackOpen} setOpen={setFeedbackOpen} />
                    </div>
                    {/* Profile dropdown */}
                    {!user && (
                      <Link href={{ pathname: `/login`, query: { view: "magic_link" } }}>
                        <a
                          className={`${
                            light ? "text-white bg-purple hover:bg-purple-dark" : "text-purple-extradark bg-white hover:bg-gray-200"
                          } items-center justify-center px-2 py-1 shadow-sm text-sm font-medium whitespace-nowrap`}
                        >
                          Sign in
                        </a>
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
                                <a href="/dashboard?screen=account" className={classNames(active ? "bg-gray-100" : "", "block px-4 py-2 text-lg sm:text-sm text-gray-700")}>
                                  Your profile
                                </a>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <button className="w-full" onClick={() => handleSignOut()}>
                                  <a href="#" className={classNames(active ? "bg-gray-100" : "", "block px-4 py-2 text-lg sm:text-sm text-gray-700 text-left")}>
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
                    className={`col-span-1 w-5 h-5 cursor-pointer ml-2 ${light ? "text-purple hover:text-purple-dark" : "text-white hover:text-gray-200"}`}
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
            <div onClick={() => setSidebarOpen(false)} className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-purple-extradark">
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
                    <div className="pb-1">
                      <span className={`text-white font-logo pl-1 text-2xl font-light`}>app</span>
                      <span className={`text-white font-logo pr-2 text-2xl text-white font-semibold`}>city</span>
                      <span className={`text-white absolute -bottom-1.5 right-7 text-xs`}>beta</span>
                    </div>
                  </a>
                </Link>
              </div>
              <div className="mt-5 flex-1 h-0 overflow-y-auto">
                <nav className="px-2 space-y-1 h-full flex flex-col justify-between">
                  <div id="nav-top">
                    {navigation
                      .filter((item) => item.name === "Home")
                      .map((item) => (
                        <Link key={item.name} href={item.href}>
                          <a className={classNames(item.current ? "bg-purple-dark text-white" : "text-white hover:bg-purple-dark", "group flex items-center px-2 py-2 text-base font-medium")}>
                            <item.icon className="mr-4 flex-shrink-0 h-6 w-6 text-white" aria-hidden="true" />
                            {item.name}
                          </a>
                        </Link>
                      ))}
                    {router.pathname !== "/dashboard" && (
                      <div className="pt-8 px-2 space-y-10">
                        <div className="grid grid-cols-2 gap-x-4">
                          {featured.map((item) => (
                            <div key={item.name} className="group relative text-sm">
                              <div className="aspect-w-1 aspect-h-1 bg-gray-100 overflow-hidden group-hover:opacity-75">
                                <img src={item.imageSrc} alt={item.imageAlt} className="object-center object-cover" />
                              </div>
                              <Link href={item.href}>
                                <a className="mt-6 block font-medium text-white uppercase">
                                  <span className="absolute z-10 inset-0" aria-hidden="true" />
                                  {item.name}
                                </a>
                              </Link>
                              <p aria-hidden="true" className="mt-1 text-gray-200 group-hover:text-white">
                                Shop now
                              </p>
                            </div>
                          ))}
                        </div>
                        {categories.map((parent) => (
                          <div key={parent.id}>
                            <p id={`${parent.id}-heading-mobile`} className="font-medium text-white uppercase">
                              {parent.name}
                            </p>
                            <ul role="list" aria-labelledby={`${parent.id}-heading-mobile`} className="mt-6 flex flex-col space-y-4">
                              {parent.children.map((child) => (
                                <li key={child.name} className="flow-root">
                                  <Link href={`/categories/${child.slug}`}>
                                    <a className={`${child.current ? "bg-purple-dark" : "hover:bg-purple-dark"} -m-2 py-2 pl-6 pr-2 block text-white`}>{child.name}</a>
                                  </Link>
                                </li>
                              ))}
                              <li key={parent.name}>
                                <Link href={`/categories/${parent.slug}`}>
                                  <a className={`${parent.current ? "bg-purple-dark" : "hover:bg-purple-dark"} -m-2 p-2 block text-white font-medium flex space-x-4`}>
                                    <span className="">Browse all</span>
                                    <ArrowSmRightIcon className="block h-6 w-6" aria-hidden="true" />
                                  </a>
                                </Link>
                              </li>
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                    {router.pathname === "/dashboard" && (
                      <div className="md:hidden">
                        {dashboardNavigation
                          .filter((item) => item.default)
                          .map((item) => (
                            <Link
                              key={item.name}
                              href={{
                                pathname: router.pathname,
                                query: { screen: item.screen },
                              }}
                            >
                              <a className={classNames(item.current ? "bg-purple-dark text-white" : "text-white hover:bg-purple-dark", "group flex items-center px-2 py-2 text-base font-medium")}>
                                <item.icon className="mr-4 flex-shrink-0 h-6 w-6 text-white" aria-hidden="true" />
                                {item.name}
                              </a>
                            </Link>
                          ))}
                        {/* <div className="relative">
                          <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-white"></div>
                          </div>
                          <div className="relative flex justify-center">
                            <span className="px-2 text-sm text-white bg-purple-extradark">App developer</span>
                          </div>
                        </div> */}
                        {dashboardNavigation
                          .filter((item) => item.none)
                          .map((item) => (
                            <Link
                              key={item.name}
                              href={{
                                pathname: router.pathname,
                                query: { screen: item.screen },
                              }}
                            >
                              <a className={classNames(item.current ? "bg-purple-dark text-white" : "text-white hover:bg-purple-dark", "group flex items-center px-2 py-2 text-base font-medium")}>
                                <item.icon className="mr-4 flex-shrink-0 h-6 w-6 text-white" aria-hidden="true" />
                                {item.name}
                              </a>
                            </Link>
                          ))}
                        {/* <div className="relative">
                          <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-white"></div>
                          </div>
                          <div className="relative flex justify-center">
                            <span className="px-2 text-sm text-white bg-purple-extradark">Admin</span>
                          </div>
                        </div> */}
                        {dashboardNavigation
                          .filter((item) => item.none)
                          .map((item) => (
                            <Link
                              key={item.name}
                              href={{
                                pathname: router.pathname,
                                query: { screen: item.screen },
                              }}
                            >
                              <a className={classNames(item.current ? "bg-purple-dark text-white" : "text-white hover:bg-purple-dark", "group flex items-center px-2 py-2 text-base font-medium")}>
                                <item.icon className="mr-4 flex-shrink-0 h-6 w-6 text-white" aria-hidden="true" />
                                {item.name}
                              </a>
                            </Link>
                          ))}
                        {dashboardNavigation
                          .filter((item) => item.none)
                          .map((item) => (
                            <Link
                              key={item.name}
                              href={{
                                pathname: router.pathname,
                                query: { screen: item.screen },
                              }}
                            >
                              <a className={classNames(item.current ? "bg-purple-dark text-white" : "text-white hover:bg-purple-dark", "group flex items-center px-2 py-2 text-base font-medium")}>
                                <item.icon className="mr-4 flex-shrink-0 h-6 w-6 text-white" aria-hidden="true" />
                                {item.name}
                              </a>
                            </Link>
                          ))}
                        {/* <div className="relative">
                          <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-white"></div>
                          </div>
                          <div className="relative flex justify-center">
                            <span className="px-2 text-sm text-white bg-purple-extradark">Company</span>
                          </div>
                        </div> */}
                      </div>
                    )}
                    <div className="relative mt-8">
                      <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-white"></div>
                      </div>
                      <div className="relative flex justify-center">
                        <span className="px-2 text-sm text-white bg-purple-extradark">Company</span>
                      </div>
                    </div>
                    <div className="pb-8">
                      {navigation
                        .filter((item) => item.name !== "Home")
                        .map((item) => (
                          <Link key={item.name} href={item.href}>
                            <a className={classNames(item.current ? "bg-purple-dark text-white" : "text-white hover:bg-purple-dark", "group flex items-center px-2 py-2 text-base font-medium")}>
                              <item.icon className="mr-4 flex-shrink-0 h-6 w-6 text-white" aria-hidden="true" />
                              {item.name}
                            </a>
                          </Link>
                        ))}
                    </div>
                  </div>
                  {router.pathname === "/dashboard" && (
                    <button onClick={() => handleSignOut()} className={"md:hidden text-white hover:bg-purple-dark group flex items-center px-2 py-2 text-base font-medium w-full"}>
                      <LogoutIcon className="mr-4 flex-shrink-0 h-6 w-6 text-white" aria-hidden="true" />
                      Sign out
                    </button>
                  )}
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
