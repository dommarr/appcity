import Link from "next/link";
import { useState } from "react";
import { Transition } from "@headlessui/react";
import { supabase } from "../../utils/initSupabase";
import { Auth } from "@supabase/ui";
import Logo from "../graphics/logo/Logo";
import LogoLight from "../graphics/logo/LogoLight";
import BugPopover from "./bugPopover";
import Bug from "../graphics/bug";
import BugModal from "./bugModal";

const appName = "AppCity";
const links = [
  {
    href: "/about",
    label: "About",
    icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    href: "/contact",
    label: "Partner",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
  },
  {
    href: "/blog",
    label: "Blog",
    icon: "M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222",
  },
];

export default function Header(props) {
  const [showMenu, setShowMenu] = useState(false);
  const [showProfileMenu, setProfileMenu] = useState(false);
  const { user, session } = Auth.useUser();
  const [open, setOpen] = useState(false);

  return (
    <div className={`select-none ${props.style === "dark" ? "bg-purple-extradark" : ""} ${props.style === "light" ? "bg-white" : ""} ${props.style === "trans" ? "bg-transparent" : ""} relative z-10`}>
      <div className="flex justify-between items-center px-4 py-6 sm:px-6 md:justify-start md:space-x-10 max-w-screen-3xl mx-auto">
        <div className="flex items-center justify-center relative">
          <Link href="/">
            <a className="flex items-center justify-center">
              {(props.style === "dark" || props.style === "trans") && <Logo size={40} alt={appName} />}
              {props.style === "light" && <LogoLight size={40} alt={appName} />}
              <span className={`${props.style === "dark" || props.style === "trans" ? "text-white" : "text-purple"} font-logo pl-1 text-3xl font-light`}>app</span>
              <span className={`${props.style === "dark" || props.style === "trans" ? "text-white" : "text-purple"} font-logo pr-2 text-3xl text-white font-semibold`}>city</span>
              <span className={`${props.style === "dark" || props.style === "trans" ? "text-white" : "text-purple"} absolute -bottom-3 right-7 text-white text-sm`}>beta</span>
            </a>
          </Link>
        </div>

        <div className="-mr-2 -my-2 md:hidden flex space-x-2 items-center">
          <div onClick={() => setOpen(true)}>
            <Bug size={30} color={`${props.style === "dark" || props.style === "trans" ? "text-white hover:text-gray-200 cursor-pointer" : "text-gray-500 hover:text-gray-900 cursor-pointer"}`} />
          </div>

          <BugModal open={open} setOpen={setOpen} />
          <button
            type="button"
            className={`${props.style === "dark" ? "bg-purple-extradark text-white hover:text-gray-200 hover:bg-purple-dark" : ""} ${
              props.style === "light" ? "bg-white text-gray-400 hover:text-gray-500 hover:bg-gray-100" : ""
            } ${props.style === "trans" ? "bg-transparent text-white hover:bg-purple-dark" : ""} p-2 inline-flex items-center justify-center focus:outline-none focus:ring-0`}
            onClick={() => setShowMenu(true)}
          >
            <span className="sr-only">Open menu</span>
            {/* Heroicon name: menu */}
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        <div className="hidden md:flex-1 md:flex md:items-center md:justify-between">
          <nav className="flex space-x-10">
            {links.map(({ href, label }) => (
              <Link href={href} key={`${href}${label}`}>
                <a className={`${props.style === "dark" || props.style === "trans" ? "text-white hover:text-gray-200" : "text-gray-500 hover:text-gray-900"} text-base font-medium`}>{label}</a>
              </Link>
            ))}
          </nav>
          <div className="flex items-center md:ml-12">
            <BugPopover caption="Report a bug." color={`${props.style === "dark" || props.style === "trans" ? "text-white hover:text-gray-200" : "text-gray-500 hover:text-gray-900"}`} />
            {/* if not signed in, show sign in and sign up */}
            {!user && (
              <>
                <Link href={{ pathname: `/profile`, query: { view: "magic_link" } }}>
                  <a className={`${props.style === "dark" || props.style === "trans" ? "text-white hover:text-gray-200" : "text-gray-500 hover:text-gray-900"} ml-8 text-base font-medium`}>Sign in</a>
                </Link>
                <Link href={{ pathname: `/profile`, query: { view: "sign_up" } }}>
                  <a
                    className={`${
                      props.style === "dark" || props.style === "trans" ? "text-purple-dark bg-white hover:bg-gray-200" : "text-white bg-purple hover:bg-purple-extradark"
                    } ml-8 inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-base font-medium`}
                  >
                    Sign up
                  </a>
                </Link>
              </>
            )}
            {/* if logged in, show profile and menu */}
            {user && (
              <div className="ml-3 relative">
                <div>
                  <button
                    onClick={() => setProfileMenu(!showProfileMenu)}
                    className={`max-w-xs bg-transparent flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-white lg:p-2 ${
                      props.style === "dark" || props.style === "trans" ? "lg:hover:bg-purple-dark text-white" : "lg:hover:bg-gray-200 text-gray-500 lg:hover:text-gray-900"
                    }`}
                    id="user-menu"
                    aria-haspopup="true"
                  >
                    <span className={`block ml-3 text-sm font-medium`}>
                      <span className="sr-only">Open user menu for </span>
                      {user.email}
                    </span>
                    {/* Heroicon name: solid/chevron-down */}
                    <svg className={`block flex-shrink-0 ml-1 h-5 w-5`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <Transition
                  show={showProfileMenu}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-48 shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu"
                  >
                    <Link href={{ pathname: `/profile`, query: { screen: "account" } }}>
                      <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                        Your Profile
                      </a>
                    </Link>
                    <button className="w-full" onClick={() => supabase.auth.signOut()}>
                      <a className="block px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100" role="menuitem">
                        Sign out
                      </a>
                    </button>
                  </div>
                </Transition>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on mobile menu state. */}
      <Transition
        className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden"
        show={showMenu}
        enter="duration-200 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <div className="shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
          <div className="pt-5 pb-6 px-5">
            <div className="flex items-center justify-between">
              <div>
                <LogoLight size={40} alt={appName} />
              </div>
              <div className="-mr-2">
                <button
                  type="button"
                  className="bg-white p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-0"
                  onClick={() => setShowMenu(false)}
                >
                  <span className="sr-only">Close menu</span>
                  {/* Heroicon name: x */}
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="mt-6">
              <nav className="grid gap-6">
                {links.map(({ href, label, icon }) => (
                  <Link href={href} key={`${href}${label}`}>
                    <a className="-m-3 p-3 flex items-center hover:bg-gray-50">
                      <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 bg-purple text-white">
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
                        </svg>
                      </div>
                      <div className="ml-4 text-base font-medium text-gray-900">{label}</div>
                    </a>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
          <div className="py-6 px-5">
            <div className="grid grid-cols-2 gap-4">
              {/* Sub-Menu */}
              {/* <a href="/" className="text-base font-medium text-gray-900 hover:text-gray-700">
                    Pricing
                    </a>
        
                    <a href="/" className="text-base font-medium text-gray-900 hover:text-gray-700">
                    Docs
                    </a>
        
                    <a href="/" className="text-base font-medium text-gray-900 hover:text-gray-700">
                    Enterprise
                    </a> */}
            </div>
            <div className="mt-6">
              {/* if not signed in, show sign in and sign up */}
              {!user && (
                <>
                  <Link href={{ pathname: `/profile`, query: { view: "sign_up" } }}>
                    <a className="w-full flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-base font-medium text-white bg-purple hover:bg-purple-extradark">
                      Sign up
                    </a>
                  </Link>
                  <p className="mt-6 text-center text-base font-medium text-gray-500">
                    Existing member?
                    <Link href={{ pathname: `/profile`, query: { view: "magic_link" } }}>
                      <a className="text-purple hover:text-purple-extralight pl-1">Sign in</a>
                    </Link>
                  </p>
                </>
              )}
              {/* if logged in, show profile and menu */}
              {user && (
                <>
                  <Link href={{ pathname: `/profile`, query: { screen: "account" } }}>
                    <a className="w-full flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-base font-medium text-white bg-purple hover:bg-purple-extradark">
                      Your profile
                    </a>
                  </Link>
                  <button className="w-full mt-6 text-center font-medium text-gray-500" onClick={() => supabase.auth.signOut()}>
                    <a className="text-purple hover:text-purple-extralight pl-1">Sign out</a>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </Transition>
    </div>
  );
}
