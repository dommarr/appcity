import { useRouter } from "next/router";
import { useState } from "react";
import Head from "next/head";
import Header from "../global/header";
import Footer from "../global/footer";
const RotatingText = require("react-rotating-text");
import SmSkyline from "../graphics/skyline/SmSkyline";
import MdSkyline from "../graphics/skyline/MdSkyline";
import LgSkyline from "../graphics/skyline/LgSkyline";
import XlSkyline from "../graphics/skyline/XlSkyline";
import XxlSkyline from "../graphics/skyline/XxlSkyline";
import Link from "next/link";
import Banner from "../global/banner";

export const siteTitle = "AppCity";

export default function HomeLayout({ children }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    router.push({
      pathname: "/search",
      query: { query },
    });
  };

  return (
    <>
      <div className="relative bg-gradient-to-br from-purple-extradark to-purple-extralight via-purple overflow-hidden">
        <Banner />
        <Header style="trans" />
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta name="description" content="Shop for software like you shop for everything else" />
          <meta property="og:image" content={`https://og-image.now.sh/${encodeURI(siteTitle)}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`} />
          <meta name="og:title" content={siteTitle} />
          <meta name="twitter:card" content="summary_large_image" />
        </Head>

        {/* Page Content */}
        <div className="relative pt-16 pb-32 min-h-60vh sm:min-h-70vh flex flex-col justify-center items-center">
          <main className="mx-auto max-w-7xl px-4">
            {/* Heading */}
            <div className="text-center">
              {/* <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block text-white">Shop for software like you </span>
                <span className="block text-black">shop for everything else</span>
                </h1> */}
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block text-white mb-1">The app store for</span>
                {/* <span className="block text-yellow">creators</span> */}
                <RotatingText items={[" podcasters ", " writers ", " streamers ", " creators. "]} color="yellow" pause={2500} />
              </h1>

              {/* Search */}
              <div className="block mt-8 max-w-sm md:max-w-md lg:max-w-lg mx-auto">
                <label htmlFor="search" className="sr-only">
                  Search
                </label>
                {/* <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <input type="text" name="search" id="search" className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300" placeholder="CRM, video conferencing, analytics..." value={query} onChange={(event) => setQuery(event.target.value)} />
                  </form>
                </div> */}

                <div className="mt-1">
                  <form onSubmit={handleSubmit} className="flex">
                    <input type="text" name="search" id="search" className="border border-gray-200 focus:ring-purple-extradark focus:border-purple-extradark w-full text-sm" placeholder="podcast, email, video, audio..." value={query} onChange={(event) => setQuery(event.target.value)} />
                    <button type="submit" className="bg-gray-200 w-20 flex justify-center items-center focus:outline-none focus:ring-0">
                      <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </form>
                </div>

                {/* <div className="flex justify-center items-center flex-wrap pt-4">
                  <a href="/" className="text-white bg-transparent hover:bg-white hover:text-purple m-1 inline-flex items-center justify-center px-4 py-1 border border-white shadow-sm text-sm font-light">
                    CRM
                  </a>
                  <a href="/" className="text-white bg-transparent hover:bg-white hover:text-purple m-1 inline-flex items-center justify-center px-4 py-1 border border-white shadow-sm text-sm font-light">
                    Video Conferencing
                  </a>
                  <a href="/" className="text-white bg-transparent hover:bg-white hover:text-purple m-1 inline-flex items-center justify-center px-4 py-1 border border-white shadow-sm text-sm font-light">
                    Analytics
                  </a>
                </div> */}
              </div>
            </div>
            <div>{children}</div>
          </main>
        </div>
        <SmSkyline />
        <MdSkyline />
        <LgSkyline />
        <XlSkyline />
        <XxlSkyline />
      </div>
      <div className="max-w-7xl mx-auto pt-24 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl font-extrabold text-gray-900 text-center mb-12">Starter Kits</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 grid-rows-5 md:grid-rows-3 grid-flow-row gap-2">
            <div className="row-span-1 col-span-1 md:col-span-2 relative pt-24 pb-10 px-4 shadow-xl overflow-hidden">
              <Link href="/podcasts">
                <a>
                  <img className="absolute inset-0 h-full w-full object-cover" src="https://images.unsplash.com/photo-1485579149621-3123dd979885?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=2089&q=80" alt="" />
                  <div className="absolute inset-0 bg-violet-500 opacity-50"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-violet-600 via-violet-600 opacity-90"></div>
                  <div className="absolute bottom-10 left-4">
                    <div className="text-white font-semibold text-xl">Podcasts</div>
                  </div>
                </a>
              </Link>
            </div>

            <div className="row-span-1 col-span-1 sm:row-span-2 relative shadow-xl overflow-hidden">
              <img className="absolute inset-0 h-full w-full object-cover" src="https://images.unsplash.com/photo-1570554886111-e80fcca6a029?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80" alt="" />
              <div className="absolute inset-0 bg-blue-500 opacity-50"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-blue-600 via-blue-600 opacity-90"></div>
              <div className="absolute bottom-10 left-4">
                <div className="text-white font-semibold text-xl">Coming soon: Ecommerce</div>
              </div>
            </div>

            <div className="row-span-1 col-span-1 sm:row-span-2 relative pt-24 pb-10 px-4 shadow-xl overflow-hidden">
              <img className="absolute inset-0 h-full w-full object-cover" src="https://images.unsplash.com/photo-1611162616475-46b635cb6868?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1334&q=80" alt="" />
              <div className="absolute inset-0 bg-red-500 opacity-50"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-red-600 via-red-600 opacity-90"></div>
              <div className="absolute bottom-10 left-4">
                <div className="text-white font-semibold text-xl">Coming soon: YouTube</div>
              </div>
            </div>

            <div className="row-span-1 col-span-1 sm:row-span-2 md:row-span-1 relative pt-24 pb-10 px-4 shadow-xl overflow-hidden">
              <img className="absolute inset-0 h-full w-full object-cover" src="https://images.unsplash.com/photo-1559057287-ce0f595679a8?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80" alt="" />
              <div className="absolute inset-0 bg-amber-400 opacity-50"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-amber-400 via-amber-400 opacity-90"></div>
              <div className="absolute bottom-10 left-4">
                <div className="text-white font-semibold text-xl">Coming soon: Newsletters</div>
              </div>
            </div>

            <div className="row-span-1 col-span-1 md:col-span-2 relative pt-24 pb-10 px-4 shadow-xl overflow-hidden">
              <img className="absolute inset-0 h-full w-full object-cover" src="https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1567&q=80" alt="" />
              <div className="absolute inset-0 bg-pink-500 opacity-50"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-pink-600 via-pink-600 opacity-90"></div>
              <div className="absolute bottom-10 left-4">
                <div className="text-white font-semibold text-xl">Coming soon: Startups</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-purple">
        <div className="max-w-7xl mx-auto py-32 px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-xl overflow-hidden lg:grid lg:grid-cols-2 lg:gap-4">
            <div className="pt-10 pb-12 px-6 sm:pt-16 sm:px-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
              <div className="lg:self-center">
                <h2 className="text-3xl font-extrabold text-purple sm:text-4xl">
                  <span className="block">Are you a vendor?</span>
                  <span className="block">List your app today.</span>
                </h2>
                <div className="flex flex-col">
                  <p className="mt-4 text-lg leading-6 text-gray-900">Sign up, add your app to our catalog, and reach thousands of creators.</p>
                  <Link href="/about?customer=vendor">
                    <a className="text-lg leading-6 text-gray-900 underline hover:no-underline">Learn more</a>
                  </Link>
                </div>
                <Link href="/profile">
                  <a className="mt-8 bg-purple border border-transparent shadow px-5 py-3 inline-flex items-center text-base font-medium text-white hover:bg-purple-extradark">Sign up for free</a>
                </Link>
              </div>
            </div>
            <div className="-mt-6 aspect-w-5 aspect-h-3 md:aspect-w-2 md:aspect-h-1">
              <img className="transform translate-x-6 translate-y-6 rounded-md ring-1 ring-gray-200 object-cover object-left-top sm:translate-x-16 lg:translate-y-20" src="https://dnlvkovcawtkzuvpmmgr.supabase.co/storage/v1/object/sign/website_images/search.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ3ZWJzaXRlX2ltYWdlcy9zZWFyY2gucG5nIiwiaWF0IjoxNjE2NjA3MTUxLCJleHAiOjE5MzE5NjcxNTF9.wFfSBDOw1D1LFtRB0PQfNISRZTauQ9ey_1X12D3AYLw" alt="AppCity search page" />
            </div>
          </div>
        </div>
      </div>

      <div className="relative py-32 bg-white">
        <div className="hidden absolute top-0 inset-x-0 h-1/2 bg-gray-50 lg:block" aria-hidden="true"></div>
        <div className="max-w-7xl mx-auto bg-indigo-600 lg:bg-transparent lg:px-8">
          <div className="lg:grid lg:grid-cols-12">
            <div className="relative z-10 lg:col-start-1 lg:row-start-1 lg:col-span-4 lg:py-16 lg:bg-transparent">
              <div className="absolute inset-x-0 h-1/2 bg-gray-50 lg:hidden" aria-hidden="true"></div>
              <div className="max-w-md mx-auto px-4 sm:max-w-3xl sm:px-6 lg:max-w-none lg:p-0">
                <div className="aspect-w-10 aspect-h-6 sm:aspect-w-2 sm:aspect-h-1 lg:aspect-w-1">
                  <img className="object-cover object-center shadow-2xl" src="https://images.unsplash.com/photo-1507207611509-ec012433ff52?ixlib=rb-1.2.1&ixqx=xo9z4lpu5k&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=934&q=80" alt="" />
                </div>
              </div>
            </div>
            <div className="relative bg-purple lg:col-start-3 lg:row-start-1 lg:col-span-10 lg:grid lg:grid-cols-10 lg:items-center">
              <div className="hidden absolute inset-0 overflow-hidden lg:block" aria-hidden="true">
                <svg className="absolute bottom-full left-full transform translate-y-1/3 -translate-x-2/3 xl:bottom-auto xl:top-0 xl:translate-y-0" width="404" height="384" fill="none" viewBox="0 0 404 384" aria-hidden="true">
                  <defs>
                    <pattern id="64e643ad-2176-4f86-b3d7-f2c5da3b6a6d" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                      <rect x="0" y="0" width="4" height="4" className="text-purple-extralight" fill="currentColor" />
                    </pattern>
                  </defs>
                  <rect width="404" height="384" fill="url(#64e643ad-2176-4f86-b3d7-f2c5da3b6a6d)" />
                </svg>
                <svg className="absolute top-full transform -translate-y-1/3 -translate-x-1/3 xl:-translate-y-1/2" width="404" height="384" fill="none" viewBox="0 0 404 384" aria-hidden="true">
                  <defs>
                    <pattern id="64e643ad-2176-4f86-b3d7-f2c5da3b6a6d" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                      <rect x="0" y="0" width="4" height="4" className="text-purple-extralight" fill="currentColor" />
                    </pattern>
                  </defs>
                  <rect width="404" height="384" fill="url(#64e643ad-2176-4f86-b3d7-f2c5da3b6a6d)" />
                </svg>
              </div>
              <div className="relative max-w-md mx-auto py-12 px-4 space-y-6 sm:max-w-3xl sm:py-16 sm:px-6 lg:max-w-none lg:p-0 lg:col-start-4 lg:col-span-6">
                <div>
                  <h2 className="text-3xl font-extrabold text-white" id="join-heading">
                    Shop for software like you
                  </h2>
                  <h2 className="text-3xl font-extrabold text-white" id="join-heading">
                    shop for everything else
                  </h2>
                </div>
                <p className="text-lg text-white">Finally. No side projects, just apps you can count on to run your business. With transparent pricing and trustworthy reviews, find the tools to take your business to the next level.</p>
                <Link href="/search">
                  <a className="block w-full py-3 px-5 text-center bg-white border border-transparent shadow-md text-base font-medium text-indigo-700 hover:bg-gray-50 sm:inline-block sm:w-auto">Start shopping</a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer dark={true} />
    </>
  );
}
