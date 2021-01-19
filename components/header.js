import Link from 'next/link'
import { useState } from 'react';
import { Transition } from "@headlessui/react"

const appName = 'AppCity'
const links = [
    {
        href: 'http://localhost:3000/about', 
        label: 'About', 
        icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    },
    {
        href: 'http://localhost:3000/partner',
        label: 'Partner',
        icon: 'M13 10V3L4 14h7v7l9-11h-7z'
    },
    {
        href: 'http://localhost:3000/learn',
        label: 'Learn',
        icon: 'M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222'
    },
]
export default function Header(props){
    const [showMenu, setShowMenu] = useState(false)

    return (
    <div className={`${props.dark ? 'bg-indigo-600' : 'bg-white'} relative z-10`}>
        <div className="flex justify-between items-center px-4 py-6 sm:px-6 md:justify-start md:space-x-10">
            <div>
            <a href="/" className="flex">
                <span className="sr-only">{appName}</span>
                <img className="h-8 w-auto sm:h-10" src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg" alt={appName} />
            </a>
            </div>
            <div className="-mr-2 -my-2 md:hidden">
            <button type="button" className={`${props.dark ? 'bg-indigo-600 text-white hover:text-gray-200 hover:bg-indigo-500' : 'bg-white text-gray-400 hover:text-gray-500 hover:bg-gray-100'} rounded-md p-2 inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500`}
            onClick={() => setShowMenu(true)}>
                <span className="sr-only">Open menu</span>
                {/* Heroicon name: menu */}
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
            </div>
            <div className="hidden md:flex-1 md:flex md:items-center md:justify-between">
            <nav className="flex space-x-10">
                {links.map(({href, label}) => (
                        <Link href={href} key={`${href}${label}`}>
                            <a className={`${props.dark ? 'text-white hover:text-gray-200' : 'text-gray-500 hover:text-gray-900'} text-base font-medium`}>
                                {label}
                            </a>
                        </Link>
                    ))}
            </nav>
            <div className="flex items-center md:ml-12">
                <a href="/" className={`${props.dark ? 'text-white hover:text-gray-200' : 'text-gray-500 hover:text-gray-900'} text-base font-medium`}>
                Sign in
                </a>
                <a href="/" className={`${props.dark ? 'text-indigo-600 bg-white hover:bg-gray-200' : 'text-white bg-indigo-600 hover:bg-indigo-700'} ml-8 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium`}>
                Sign up
                </a>
            </div>
            </div>
        </div>
        
        {/*
            Mobile menu, show/hide based on mobile menu state.
        */}
        <Transition
            show={showMenu}
            enter="duration-200 ease-out"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="duration-100 ease-in"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
            >
            <div className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden">
            <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
                <div className="pt-5 pb-6 px-5">
                <div className="flex items-center justify-between">
                    <div>
                    <img className="h-8 w-auto" src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg" alt={appName} />
                    </div>
                    <div className="-mr-2">
                    <button type="button" className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                    onClick={() => setShowMenu(false)}>
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
                    
                    {links.map(({href, label, icon}) => (
                            <Link href={href} key={`${href}${label}`}>
                                <a className="-m-3 p-3 flex items-center rounded-lg hover:bg-gray-50">
                                <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-md bg-indigo-500 text-white">
                                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
                                    </svg>
                                </div>
                                <div className="ml-4 text-base font-medium text-gray-900">
                                    {label}
                                </div>
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
                    <a href="/" className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                    Sign up
                    </a>
                    <p className="mt-6 text-center text-base font-medium text-gray-500">
                    Existing customer?
                    <a href="/" className="text-indigo-600 hover:text-indigo-500 pl-1">
                        Sign in
                    </a>
                    </p>
                </div>
                </div>
            </div>
            </div>
        </Transition>
        </div>
    )
};