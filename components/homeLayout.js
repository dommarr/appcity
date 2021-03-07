import { useRouter } from "next/router";
import { useState } from "react";
import Head from "next/head";
import Header from "../components/header";
import Footer from "../components/footer";
import Wedge from "../components/wedge";
const RotatingText = require("react-rotating-text");

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
              <div className="block mt-8 max-w-lg mx-auto">
                <label htmlFor="search" className="sr-only">
                  Search
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {/* Heroicon name: search */}
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <input type="text" name="search" id="search" className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300" placeholder="CRM, video conferencing, analytics..." value={query} onChange={(event) => setQuery(event.target.value)} />
                  </form>
                </div>
                <div className="flex items-center pt-4">
                  <a href="/" className="text-white bg-transparent hover:bg-white hover:text-purple mx-1 inline-flex items-center justify-center px-4 py-1 border border-white shadow-sm text-sm font-light">
                    CRM
                  </a>
                  <a href="/" className="text-white bg-transparent hover:bg-white hover:text-purple mx-1 inline-flex items-center justify-center px-4 py-1 border border-white shadow-sm text-sm font-light">
                    Video Conferencing
                  </a>
                  <a href="/" className="text-white bg-transparent hover:bg-white hover:text-purple mx-1 inline-flex items-center justify-center px-4 py-1 border border-white shadow-sm text-sm font-light">
                    Analytics
                  </a>
                </div>
              </div>
            </div>
            <div>{children}</div>
          </main>
        </div>
        <Wedge className="absolute inset-x-0 bottom-0" />

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
      <div className="h-screen"></div>
      <Footer />
    </>
  );
}
