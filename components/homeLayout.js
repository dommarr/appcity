import { useRouter } from "next/router";
import { useState } from "react";
import Head from "next/head";
import Header from "../components/header";
import Footer from "../components/footer";
import Wedge from "../components/wedge";
const RotatingText = require("react-rotating-text");
import SmSkyline from "./skyline/smSkyline";
import MdSkyline from "./skyline/mdSkyline";
import LgSkyline from "./skyline/lgSkyline";
import XlSkyline from "./skyline/xlSkyline";
import XxlSkyline from "./skyline/xxlSkyline";

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
        <Header style="trans" />
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta name="description" content="Shop for software like you shop for everything else" />
          <meta property="og:image" content={`https://og-image.now.sh/${encodeURI(siteTitle)}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`} />
          <meta name="og:title" content={siteTitle} />
          <meta name="twitter:card" content="summary_large_image" />
        </Head>

        {/* Page Content */}
        <div className="relative pb-8 sm:pb-12">
          <main className="mt-16 mx-auto max-w-7xl px-4 sm:mt-24">
            {/* Heading */}
            <div className="text-center">
              {/* <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block text-white">Shop for software like you </span>
                <span className="block text-black">shop for everything else</span>
                </h1> */}
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block text-white">The app store for</span>
                {/* <span className="inline text-white">for </span> */}
                <RotatingText items={[" small business ", " startups ", " creators ", " builders. "]} color="yellow" pause={2500} />
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
                    <input type="text" name="search" id="search" className="border border-gray-200 focus:ring-purple-extradark focus:border-purple-extradark w-full text-sm" placeholder="CRM, video conferencing, analytics..." value={query} onChange={(event) => setQuery(event.target.value)} />
                    <button type="submit" className="bg-gray-200 w-20 flex justify-center items-center focus:outline-none focus:ring-0">
                      <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </form>
                </div>

                <div className="flex justify-center items-center flex-wrap pt-4">
                  <a href="/" className="text-white bg-transparent hover:bg-white hover:text-purple m-1 inline-flex items-center justify-center px-4 py-1 border border-white shadow-sm text-sm font-light">
                    CRM
                  </a>
                  <a href="/" className="text-white bg-transparent hover:bg-white hover:text-purple m-1 inline-flex items-center justify-center px-4 py-1 border border-white shadow-sm text-sm font-light">
                    Video Conferencing
                  </a>
                  <a href="/" className="text-white bg-transparent hover:bg-white hover:text-purple m-1 inline-flex items-center justify-center px-4 py-1 border border-white shadow-sm text-sm font-light">
                    Analytics
                  </a>
                </div>
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

        {/* Patterns */}
        {/* <div
          className="hidden sm:block sm:absolute sm:inset-y-0 sm:h-full sm:w-full"
          aria-hidden="true"
        >
          <div className="relative h-full max-w-7xl mx-auto">
            <svg
              className="absolute right-full transform translate-y-1/4 translate-x-1/4 lg:translate-x-1/2"
              width="404"
              height="784"
              fill="none"
              viewBox="0 0 404 784"
            >
              <defs>
                <pattern
                  id="f210dbf6-a58d-4871-961e-36d5016a0f49"
                  x="0"
                  y="0"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <rect
                    x="0"
                    y="0"
                    width="4"
                    height="4"
                    className="text-purple-extralight"
                    fill="currentColor"
                  />
                </pattern>
              </defs>
              <rect
                width="404"
                height="784"
                fill="url(#f210dbf6-a58d-4871-961e-36d5016a0f49)"
              />
            </svg>
            <svg
              className="absolute left-full transform -translate-y-3/4 -translate-x-1/4 md:-translate-y-1/2 lg:-translate-x-1/2"
              width="404"
              height="784"
              fill="none"
              viewBox="0 0 404 784"
            >
              <defs>
                <pattern
                  id="5d0dd344-b041-4d26-bec4-8d33ea57ec9b"
                  x="0"
                  y="0"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <rect
                    x="0"
                    y="0"
                    width="4"
                    height="4"
                    className="text-purple-extralight"
                    fill="currentColor"
                  />
                </pattern>
              </defs>
              <rect
                width="404"
                height="784"
                fill="url(#5d0dd344-b041-4d26-bec4-8d33ea57ec9b)"
              />
            </svg>
          </div>
        </div> */}
      </div>
      <div className="max-w-7xl mx-auto my-16 px-4 sm:px-6 lg:px-8">
        {/* We've used 3xl here, but feel free to try other max-widths based on your needs */}
        <div className="max-w-3xl mx-auto">
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 grid-rows-3 grid-flow-row gap-2">
            <div class="row-span-1 col-span-2 relative pt-24 pb-10 px-4 shadow-xl overflow-hidden">
              <img class="absolute inset-0 h-full w-full object-cover" src="https://images.unsplash.com/photo-1485579149621-3123dd979885?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=2089&q=80" alt="" />
              <div class="absolute inset-0 bg-violet-500 opacity-50"></div>
              <div class="absolute inset-0 bg-gradient-to-t from-violet-600 via-violet-600 opacity-90"></div>
              <div class="relative">
                <div>
                  <div className="text-white font-semibold text-xl">Podcasts</div>
                </div>
              </div>
            </div>

            <div class="row-span-2 col-span-1 relative pt-10 pb-10 px-4 shadow-xl overflow-hidden">
              <img class="absolute inset-0 h-full w-full object-cover" src="https://images.unsplash.com/photo-1570554886111-e80fcca6a029?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80" alt="" />
              <div class="absolute inset-0 bg-blue-500 opacity-50"></div>
              <div class="absolute inset-0 bg-gradient-to-b from-blue-600 via-blue-600 opacity-90"></div>
              <div class="relative">
                <div>
                  <div className="text-white font-semibold text-xl">Ecommerce</div>
                </div>
              </div>
            </div>

            <div class="row-span-2 col-span-1 relative pt-24 pb-10 px-4 shadow-xl overflow-hidden">
              <img class="absolute inset-0 h-full w-full object-cover" src="https://images.unsplash.com/photo-1611162616475-46b635cb6868?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1334&q=80" alt="" />
              <div class="absolute inset-0 bg-red-500 opacity-50"></div>
              <div class="absolute inset-0 bg-gradient-to-t from-red-600 via-red-600 opacity-90"></div>
              <div class="absolute bottom-10 left-4">
                <div>
                  <div className="text-white font-semibold text-xl">YouTube</div>
                </div>
              </div>
            </div>

            <div class="row-span-1 col-span-1 relative pt-10 pb-10 px-4 shadow-xl overflow-hidden">
              <img class="absolute inset-0 h-full w-full object-cover" src="https://images.unsplash.com/photo-1559057287-ce0f595679a8?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80" alt="" />
              <div class="absolute inset-0 bg-amber-400 opacity-50"></div>
              <div class="absolute inset-0 bg-gradient-to-b from-amber-400 via-amber-400 opacity-90"></div>
              <div class="relative">
                <div>
                  <div className="text-white font-semibold text-xl">Newsletters</div>
                </div>
              </div>
            </div>

            <div class="row-span-1 col-span-2 relative pt-24 pb-10 px-4 shadow-xl overflow-hidden">
              <img class="absolute inset-0 h-full w-full object-cover" src="https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1567&q=80" alt="" />
              <div class="absolute inset-0 bg-pink-500 opacity-50"></div>
              <div class="absolute inset-0 bg-gradient-to-t from-pink-600 via-pink-600 opacity-90"></div>
              <div class="relative">
                <div>
                  <div className="text-white font-semibold text-xl">Startups</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer dark={true} />
    </>
  );
}
