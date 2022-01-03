import { useRouter } from "next/router";
import React from "react";
import { useState } from "react";
import Navbar from "../global/navbar";
const RotatingText = require("react-rotating-text");
import SmSkyline from "../graphics/skyline/SmSkyline";
import MdSkyline from "../graphics/skyline/MdSkyline";
import LgSkyline from "../graphics/skyline/LgSkyline";
import XlSkyline from "../graphics/skyline/XlSkyline";
import XxlSkyline from "../graphics/skyline/XxlSkyline";
import Link from "next/link";
import StarterKitFeature from "./startkitFeature";
import Image from "next/image";
import ShopByCategory from "./shopByCategory";

export default function HomeLayout({ apps, kits }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    router.push({
      pathname: "/search",
      query: { query },
    });
  };

  const truncate = (text) => {
    if (text.length > 110) {
      let sub = text.substring(0, 107);
      return sub.concat("...");
    } else {
      return text;
    }
  };

  return (
    <>
      <section id="search" className="relative z-10 bg-gradient-to-br from-purple-extradark to-purple-extralight via-purple overflow-hidden">
        <Navbar trans={true} search={false} />
        {/* Page Content */}
        <div className="relative pt-16 pb-32 min-h-60vh sm:min-h-70vh flex flex-col justify-center items-center">
          <main className="mx-auto max-w-7xl px-4">
            {/* Heading */}
            <div className="text-center">
              <h1 className="hidden">AppCity, the business app store for business software and small business.</h1>
              <h2 className="text-3xl tracking-tight font-extrabold sm:text-5xl md:text-6xl">
                <span className="block text-white sm:mb-1">The business app store</span>
                <div className="flex text-center items-center justify-center space-x-2 sm:space-x-3 mx-0">
                  <span className="block text-white">for</span>
                  <RotatingText items={["creators", "founders", "indie hackers", "builders. "]} color="yellow" pause={2500} />
                </div>
              </h2>

              {/* Search */}
              <div className="block mt-8 max-w-sm md:max-w-md lg:max-w-lg mx-auto">
                <label htmlFor="search" className="sr-only">
                  Search
                </label>
                <div className="mt-1">
                  <form onSubmit={handleSubmit} className="flex">
                    <input
                      type="text"
                      name="search"
                      id="search"
                      className="border border-white bg-transparent text-white placeholder-gray-300 focus:ring-0 focus:outline-none focus:ring-white focus:border-white w-full md:text-lg"
                      placeholder="automation, ecommerce, newsletter..."
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                    />
                    <button
                      type="submit"
                      className="text-white hover:text-purple hover:bg-white bg-transparent border-t border-b border-r border-white w-20 flex justify-center items-center focus:outline-none focus:ring-0"
                    >
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </form>
                </div>

                <div className="flex justify-center items-center flex-wrap pt-4">
                  <Link
                    href={{
                      pathname: "/search",
                      query: { query: "website builder" },
                    }}
                  >
                    <a className="text-white bg-transparent hover:bg-white hover:text-purple m-1 inline-flex items-center justify-center px-4 py-2 sm:py-1 border border-white shadow-sm text-sm font-light">
                      Website builder
                    </a>
                  </Link>
                  <Link
                    href={{
                      pathname: "/search",
                      query: { query: "accounting" },
                    }}
                  >
                    <a className="hidden sm:inline-flex text-white bg-transparent hover:bg-white hover:text-purple m-1 inline-flex items-center justify-center px-4 py-2 sm:py-1 border border-white shadow-sm text-sm font-light">
                      Accounting
                    </a>
                  </Link>
                  <Link
                    href={{
                      pathname: "/search",
                      query: { query: "ecommerce store" },
                    }}
                  >
                    <a className="text-white bg-transparent hover:bg-white hover:text-purple m-1 inline-flex items-center justify-center px-4 py-2 sm:py-1 border border-white shadow-sm text-sm font-light">
                      Ecommerce store
                    </a>
                  </Link>

                  <Link
                    href={{
                      pathname: "/search",
                      query: { query: "email marketing" },
                    }}
                  >
                    <a className="text-white bg-transparent hover:bg-white hover:text-purple m-1 inline-flex items-center justify-center px-4 py-2 sm:py-1 border border-white shadow-sm text-sm font-light">
                      Email marketing
                    </a>
                  </Link>
                  <Link
                    href={{
                      pathname: "/search",
                      query: { query: "internal tools" },
                    }}
                  >
                    <a className="text-white bg-transparent hover:bg-white hover:text-purple m-1 inline-flex items-center justify-center px-4 py-2 sm:py-1 border border-white shadow-sm text-sm font-light">
                      Internal tools
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
        <SmSkyline />
        <MdSkyline />
        <LgSkyline />
        <XlSkyline />
        <XxlSkyline />
        <div className="animate-sunset absolute bottom-0 md:-bottom-12 right-4 sm:right-14 md:right-32 h-20 w-20 sm:h-40 sm:w-40 rounded-full bg-400 bg-right bg-gradient-to-br from-yellow to-red-500 via-amber-300 filter blur-lg z-10"></div>
      </section>
      {/* <section className="bg-white max-w-7xl mx-auto pt-24 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl font-extrabold text-gray-900 text-center mb-12">Featured Apps</h1>
          <h1 className="text-5xl font-extrabold text-gray-900 text-center mb-12">{apps[0].name}</h1>
        </div>
      </section> */}
      <section id="featured-apps" className="bg-white">
        <div className="max-w-7xl mx-auto py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-center mb-8 sm:mb-12 text-transparent bg-clip-text bg-gradient-to-l from-purple-extralight via-purple to-purple-extradark">
            Featured Apps
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-0.5 md:grid-cols-2 lg:grid-cols-3 lg:mt-8">
            {apps &&
              apps.map(({ id, name, vendors, categories }, idx) => {
                return (
                  <Link href={`/product/${id}`} key={idx}>
                    <a>
                      <div className="col-span-1 p-2 md:p-8 bg-gray-50 grid grid-cols-3 gap-4 h-full">
                        <div className="relative col-span-1 items-center justify-center hidden sm:flex">
                          <Image
                            src={vendors.logo}
                            alt={name}
                            placeholder="blur"
                            blurDataURL={`/_next/image?url=${vendors.logo}&w=16&q=1`}
                            layout="fixed"
                            height={100}
                            width={100}
                            objectFit="contain"
                          />
                        </div>
                        <div className="relative col-span-1 flex items-center justify-center sm:hidden">
                          <Image src={vendors.logo} alt={name} placeholder="blur" blurDataURL={`/_next/image?url=${vendors.logo}&w=16&q=1`} layout="fixed" height={80} width={80} objectFit="contain" />
                        </div>

                        <div className="col-span-2 flex flex-col space-y-1 justify-center">
                          <h5 className="text-xl font-medium">{name}</h5>
                          <div className="flex flex-wrap overflow-hidden">
                            {categories.map((category, idy) => {
                              if (idy > 2) return null;
                              return (
                                <span key={idy} className="py-0.5 px-2 bg-indigo-100 text-xs text-indigo-500 whitespace-nowrap mt-1 mr-1">
                                  {category.name}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </a>
                  </Link>
                );
              })}
          </div>
        </div>
      </section>
      <ShopByCategory />
      <StarterKitFeature kits={kits} />
      {/* <div className="max-w-7xl mx-auto pt-24 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl font-extrabold text-gray-900 text-center mb-12">Starter Kits</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 grid-rows-5 md:grid-rows-3 grid-flow-row gap-2">
            <div className="row-span-1 col-span-1 md:col-span-2 relative pt-24 pb-10 px-4 shadow-xl overflow-hidden">
              <Link href="/podcasts">
                <a>
                  <img
                    className="absolute inset-0 h-full w-full object-cover"
                    src="https://images.unsplash.com/photo-1485579149621-3123dd979885?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=2089&q=80"
                    alt=""
                  />
                  <div className="absolute inset-0 bg-violet-500 opacity-50"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-violet-600 via-violet-600 opacity-90"></div>
                  <div className="absolute bottom-10 left-4">
                    <div className="text-white font-semibold text-xl">Podcasts</div>
                  </div>
                </a>
              </Link>
            </div>

            <div className="row-span-1 col-span-1 sm:row-span-2 relative shadow-xl overflow-hidden">
              <img
                className="absolute inset-0 h-full w-full object-cover"
                src="https://images.unsplash.com/photo-1570554886111-e80fcca6a029?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80"
                alt=""
              />
              <div className="absolute inset-0 bg-blue-500 opacity-50"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-blue-600 via-blue-600 opacity-90"></div>
              <div className="absolute bottom-10 left-4">
                <div className="text-white font-semibold text-xl">Coming soon: Ecommerce</div>
              </div>
            </div>

            <div className="row-span-1 col-span-1 sm:row-span-2 relative pt-24 pb-10 px-4 shadow-xl overflow-hidden">
              <img
                className="absolute inset-0 h-full w-full object-cover"
                src="https://images.unsplash.com/photo-1611162616475-46b635cb6868?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1334&q=80"
                alt=""
              />
              <div className="absolute inset-0 bg-red-500 opacity-50"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-red-600 via-red-600 opacity-90"></div>
              <div className="absolute bottom-10 left-4">
                <div className="text-white font-semibold text-xl">Coming soon: YouTube</div>
              </div>
            </div>

            <div className="row-span-1 col-span-1 sm:row-span-2 md:row-span-1 relative pt-24 pb-10 px-4 shadow-xl overflow-hidden">
              <img
                className="absolute inset-0 h-full w-full object-cover"
                src="https://images.unsplash.com/photo-1559057287-ce0f595679a8?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80"
                alt=""
              />
              <div className="absolute inset-0 bg-amber-400 opacity-50"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-amber-400 via-amber-400 opacity-90"></div>
              <div className="absolute bottom-10 left-4">
                <div className="text-white font-semibold text-xl">Coming soon: Newsletters</div>
              </div>
            </div>

            <div className="row-span-1 col-span-1 md:col-span-2 relative pt-24 pb-10 px-4 shadow-xl overflow-hidden">
              <img
                className="absolute inset-0 h-full w-full object-cover"
                src="https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1567&q=80"
                alt=""
              />
              <div className="absolute inset-0 bg-pink-500 opacity-50"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-pink-600 via-pink-600 opacity-90"></div>
              <div className="absolute bottom-10 left-4">
                <div className="text-white font-semibold text-xl">Coming soon: Startups</div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      <div className="relative py-32 bg-purple">
        <div className="hidden absolute top-0 inset-x-0 h-1/2 bg-purple lg:block" aria-hidden="true"></div>
        <div className="max-w-7xl mx-auto bg-white lg:bg-transparent lg:px-8">
          <div className="lg:grid lg:grid-cols-12">
            <div className="relative z-10 lg:col-start-1 lg:row-start-1 lg:col-span-4 lg:py-16 lg:bg-transparent">
              <div className="absolute inset-x-0 h-1/2 bg-purple lg:hidden" aria-hidden="true"></div>
              <div className="max-w-md mx-auto px-4 sm:max-w-3xl sm:px-6 lg:max-w-none lg:p-0">
                <div className="aspect-w-10 aspect-h-6 sm:aspect-w-2 sm:aspect-h-1 lg:aspect-w-1">
                  <Image
                    className="shadow-2xl"
                    src="https://dnlvkovcawtkzuvpmmgr.supabase.co/storage/v1/object/sign/website_images/shopping_med?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ3ZWJzaXRlX2ltYWdlcy9zaG9wcGluZ19tZWQiLCJpYXQiOjE2Mjc4Mzk3NDQsImV4cCI6MTk0MzE5OTc0NH0.2_g-e5jkTERWS42LGZcn7xBpCEIYO1_-S62P5QY_ucg"
                    alt="AppCity shopping"
                    placeholder="blur"
                    //blurDataUrl="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mO8eP7gfwAIPANicW2+CgAAAABJRU5ErkJggg=="
                    blurDataURL={`/_next/image?url=https://dnlvkovcawtkzuvpmmgr.supabase.co/storage/v1/object/sign/website_images/shopping_med?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ3ZWJzaXRlX2ltYWdlcy9zaG9wcGluZ19tZWQiLCJpYXQiOjE2Mjc4Mzk3NDQsImV4cCI6MTk0MzE5OTc0NH0.2_g-e5jkTERWS42LGZcn7xBpCEIYO1_-S62P5QY_ucg&w=16&q=1`}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              </div>
            </div>
            <div className="relative bg-white lg:col-start-3 lg:row-start-1 lg:col-span-10 lg:grid lg:grid-cols-10 lg:items-center">
              <div className="hidden absolute inset-0 overflow-hidden lg:block" aria-hidden="true">
                <svg
                  className="absolute bottom-full left-full transform translate-y-1/3 -translate-x-2/3 xl:bottom-auto xl:top-0 xl:translate-y-0"
                  width="404"
                  height="384"
                  fill="none"
                  viewBox="0 0 404 384"
                  aria-hidden="true"
                >
                  <defs>
                    <pattern id="64e643ad-2176-4f86-b3d7-f2c5da3b6a6d" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                      <rect x="0" y="0" width="4" height="4" className="text-gray-100" fill="currentColor" />
                    </pattern>
                  </defs>
                  <rect width="404" height="384" fill="url(#64e643ad-2176-4f86-b3d7-f2c5da3b6a6d)" />
                </svg>
                <svg className="absolute top-full transform -translate-y-1/3 -translate-x-1/3 xl:-translate-y-1/2" width="404" height="384" fill="none" viewBox="0 0 404 384" aria-hidden="true">
                  <defs>
                    <pattern id="64e643ad-2176-4f86-b3d7-f2c5da3b6a6d" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                      <rect x="0" y="0" width="4" height="4" className="text-gray-100" fill="currentColor" />
                    </pattern>
                  </defs>
                  <rect width="404" height="384" fill="url(#64e643ad-2176-4f86-b3d7-f2c5da3b6a6d)" />
                </svg>
              </div>
              <div className="relative max-w-md mx-auto py-12 px-4 space-y-6 sm:max-w-3xl sm:py-16 sm:px-6 lg:max-w-none lg:p-0 lg:col-start-4 lg:col-span-6">
                <div>
                  <h2 className="text-4xl font-extrabold text-purple sm:hidden" id="join-heading">
                    Shop for software like you shop for everything else
                  </h2>
                  <h2 className="text-4xl font-extrabold text-purple hidden sm:block" id="join-heading">
                    Shop for software like you
                  </h2>
                  <h2 className="text-4xl font-extrabold text-purple hidden sm:block" id="join-heading">
                    shop for everything else
                  </h2>
                </div>
                <p className="text-lg text-gray-500">
                  You know the drill. Search, filter, compare, and buy. With trustworthy reviews and transparent pricing, find the tools to take your business to the next level.
                </p>
                <Link href="/search">
                  <a className="block w-full py-3 px-5 text-center bg-purple border border-transparent shadow-md text-base font-medium text-white hover:bg-purple-dark sm:inline-block sm:w-auto">
                    Start shopping
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-32 px-4 sm:px-6 lg:px-8">
          <div className="bg-purple shadow-xl overflow-hidden lg:grid lg:grid-cols-2 lg:gap-4">
            <div className="pt-10 pb-12 px-6 sm:pt-16 sm:px-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
              <div className="lg:self-center">
                <h2 className="text-4xl font-extrabold text-white sm:text-4xl">
                  <span className="block">Are you a developer?</span>
                  <span className="block">List your app today.</span>
                </h2>
                <div className="flex flex-col">
                  <p className="mt-4 text-lg leading-6 text-white">Sign up, add your business app to our catalog, and reach thousands of builders.</p>
                  <Link href="/about?customer=vendor">
                    <a className="text-lg leading-6 text-white underline hover:no-underline">Learn more</a>
                  </Link>
                </div>
                <Link href="/login?view=sign_up">
                  <a className="mt-8 bg-white border border-transparent shadow px-5 py-3 inline-flex items-center text-base font-medium text-purple hover:bg-gray-200">Sign up for free</a>
                </Link>
              </div>
            </div>
            <div className="-mt-6 aspect-w-5 aspect-h-3 md:aspect-w-2 md:aspect-h-1">
              <Image
                className="transform translate-x-6 translate-y-6 sm:translate-x-16 lg:translate-y-20 object-cover object-left-top rounded-md"
                src="https://dnlvkovcawtkzuvpmmgr.supabase.co/storage/v1/object/sign/website_images/search_page_4.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ3ZWJzaXRlX2ltYWdlcy9zZWFyY2hfcGFnZV80LmpwZyIsImlhdCI6MTYyNTAxMzE0NiwiZXhwIjoxOTQwMzczMTQ2fQ.DZXqFfAyFVzU7Jx0tvzCJ5RC40vFHDGA8PmrZlmTu00"
                alt="AppCity search page"
                placeholder="blur"
                //blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8+uX7fwAJpwPh3jeWxAAAAABJRU5ErkJggg=="
                blurDataURL={`/_next/image?url=https://dnlvkovcawtkzuvpmmgr.supabase.co/storage/v1/object/sign/website_images/search_page_4.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ3ZWJzaXRlX2ltYWdlcy9zZWFyY2hfcGFnZV80LmpwZyIsImlhdCI6MTYyNTAxMzE0NiwiZXhwIjoxOTQwMzczMTQ2fQ.DZXqFfAyFVzU7Jx0tvzCJ5RC40vFHDGA8PmrZlmTu00&w=16&q=1`}
                layout="fill"
                objectFit="cover"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
