import Navbar from "../components/global/navbar";
import Head from "../components/global/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function About() {
  const router = useRouter();
  const [vendor, setVendor] = useState(false);

  useEffect(() => {
    if (router.query.customer === "vendor") {
      setVendor(true);
    }
  }, []);

  const handleBuyerClick = () => {
    router.push(`/about?customer=buyer`, undefined, { shallow: true });
    setVendor(false);
  };

  const handleVendorClick = () => {
    router.push(`/about?customer=vendor`, undefined, { shallow: true });
    setVendor(true);
  };

  return (
    <>
      <div className={`h-screen flex flex-col relative ${vendor ? "bg-white" : "bg-gradient-to-br from-purple-extradark to-purple-extralight via-purple"}`}>
        {/* <Header style={`${vendor ? "light" : "trans"}`} /> */}
        <Navbar trans={true} light={vendor} search={true} />
        <Head
          title="About Us | AppCity"
          description="Our mission is to make it easy for small business owners to find and buy the best business software to take their business to the next level. Whether you are a founder, content creator, or small business owner, we have business apps that will help you run your business."
          url="https://www.appcity.com/about"
        />
        <div className="absolute inset-0 flex flex-1 flex-col items-center justify-center text-center max-w-7xl mx-auto py-10 px-4 sm:py-12 sm:px-6 lg:px-8">
          {vendor && (
            <>
              <h1 className={`text-4xl font-extrabold ${vendor ? "text-purple" : "text-white"} sm:hidden sm:text-5xl sm:tracking-tight lg:text-6xl`}>
                Supplement your sales team, reach your target customers
              </h1>
              <h1 className={`text-4xl font-extrabold ${vendor ? "text-purple" : "text-white"} hidden sm:block sm:text-5xl sm:tracking-tight lg:text-6xl`}>Supplement your sales team,</h1>
              <h1 className={`text-4xl font-extrabold ${vendor ? "text-purple" : "text-white"} hidden sm:block sm:text-5xl sm:tracking-tight lg:text-6xl`}>reach your target customers</h1>
            </>
          )}
          {!vendor && (
            <>
              <h1 className={`text-4xl font-extrabold ${vendor ? "text-black" : "text-white"} sm:hidden sm:text-5xl sm:tracking-tight lg:text-6xl`}>
                Shop for software like you shop for everything else
              </h1>
              <h1 className={`text-4xl font-extrabold ${vendor ? "text-black" : "text-white"} hidden sm:block sm:text-5xl sm:tracking-tight lg:text-6xl`}>Shop for software like you</h1>
              <h1 className={`text-4xl font-extrabold ${vendor ? "text-black" : "text-white"} hidden sm:block sm:text-5xl sm:tracking-tight lg:text-6xl`}>shop for everything else</h1>
            </>
          )}
        </div>
        <div className={`absolute inset-x-0 top-40 flex justify-center`}>
          <div className={`${vendor ? "border border-purple" : "border border-white"} p-0.5 shadow-lg`}>
            <button
              type="button"
              onClick={() => handleBuyerClick()}
              className={`relative ${vendor ? "bg-transparent" : "bg-white"} text-purple py-2 text-sm font-medium whitespace-nowrap focus:outline-none w-auto px-4 sm:px-8`}
            >
              For buyers
            </button>
            <button
              type="button"
              onClick={() => handleVendorClick()}
              className={`ml-0.5 relative ${vendor ? "bg-purple" : "bg-transparent"} py-2 text-sm font-medium text-white whitespace-nowrap focus:outline-none w-auto px-4 sm:px-8`}
            >
              For sellers
            </button>
          </div>
        </div>
      </div>

      {/* Alternating Feature Section */}
      <div className="relative pt-16 pb-32 overflow-hidden">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-gray-100"></div>
        <div className="relative">
          <div className="lg:mx-auto lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-2 lg:grid-flow-col-dense lg:gap-24">
            <div className="px-4 max-w-xl mx-auto sm:px-6 lg:py-32 lg:max-w-none lg:mx-0 lg:px-0">
              {/* Builder Feature #1 */}
              {!vendor && (
                <div>
                  <div>
                    <span className="h-12 w-12 flex items-center justify-center border-2 border-purple">
                      <svg className="h-6 w-6 text-purple" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </span>
                  </div>
                  <div className="mt-6">
                    <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Shop online like you expect</h2>
                    <p className="mt-4 text-lg text-gray-500">
                      Search, filter, and compare the best business software just like you shop for everything else online. With transparent pricing and trustworthy reviews, you can be sure you'll
                      find the best business apps to get you going.
                    </p>
                    <div className="mt-6">
                      <Link href="/search">
                        <a className="inline-flex px-4 py-2 border border-transparent text-base font-medium shadow-sm text-white bg-gradient-to-r from-purple to-indigo-600 hover:from-purple-extradark hover:to-indigo-700">
                          Start shopping
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Vendor Feature #1 */}
              {vendor && (
                <div>
                  <div>
                    <span className="h-12 w-12 flex items-center justify-center border-2 border-purple">
                      <svg className="h-6 w-6 text-purple" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                  </div>
                  <div className="mt-6">
                    <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Supplement your sales team</h2>
                    <p className="mt-4 text-lg text-gray-500">
                      Let your sales team focus on what they do best: land those big accounts. Let us help you acquire smaller accounts, diversify your revenue, and bolster your business.
                    </p>
                    <div className="mt-6">
                      <Link href="/login?view=sign_up">
                        <a className="inline-flex px-4 py-2 border border-transparent text-base font-medium shadow-sm text-white bg-gradient-to-r from-purple to-indigo-600 hover:from-purple-extradark hover:to-indigo-700">
                          List your product
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
              {/* <div className="mt-8 border-t border-gray-200 pt-6">
              <blockquote>
                <div>
                  <p className="text-base text-gray-500">
                    &ldquo;Cras velit quis eros eget rhoncus lacus ultrices sed diam. Sit orci risus aenean curabitur donec aliquet. Mi venenatis in euismod ut.&rdquo;
                  </p>
                </div>
                <footer className="mt-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <img className="h-6 w-6 rounded-full" src="https://images.unsplash.com/photo-1509783236416-c9ad59bae472?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80" alt="" />
                    </div>
                    <div className="text-base font-medium text-gray-700">
                      Marcia Hill, Digital Marketing Manager
                    </div>
                  </div>
                </footer>
              </blockquote>
            </div> */}
            </div>

            <div className="mt-12 sm:mt-16 lg:mt-0 lg:col-start-2">
              <div className="pl-4 -mr-48 sm:pl-6 md:-mr-16 lg:px-0 lg:m-0 lg:relative lg:h-full">
                <img
                  className="w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 lg:absolute lg:left-0 lg:h-full lg:w-auto lg:max-w-none"
                  src="https://dnlvkovcawtkzuvpmmgr.supabase.co/storage/v1/object/sign/website_images/search_page_4.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ3ZWJzaXRlX2ltYWdlcy9zZWFyY2hfcGFnZV80LmpwZyIsImlhdCI6MTYyNTAxMzE0NiwiZXhwIjoxOTQwMzczMTQ2fQ.DZXqFfAyFVzU7Jx0tvzCJ5RC40vFHDGA8PmrZlmTu00"
                  alt="Search page"
                />
              </div>
            </div>

            {/* <div className="mt-12 sm:mt-16 lg:mt-0">
              <div className="pl-4 -mr-48 sm:pl-6 md:-mr-16 lg:px-0 lg:m-0 lg:relative lg:h-full">
                <img
                  className="w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 lg:absolute lg:left-0 lg:h-full lg:w-auto lg:max-w-none"
                  src="https://dnlvkovcawtkzuvpmmgr.supabase.co/storage/v1/object/sign/website_images/search_page_4.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ3ZWJzaXRlX2ltYWdlcy9zZWFyY2hfcGFnZV80LmpwZyIsImlhdCI6MTYyNTAxMzE0NiwiZXhwIjoxOTQwMzczMTQ2fQ.DZXqFfAyFVzU7Jx0tvzCJ5RC40vFHDGA8PmrZlmTu00"
                  alt="Search page"
                />
              </div>
            </div> */}
          </div>
        </div>
        <div className="mt-24">
          <div className="lg:mx-auto lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-2 lg:grid-flow-col-dense lg:gap-24">
            <div className="px-4 max-w-xl mx-auto sm:px-6 lg:py-32 lg:max-w-none lg:mx-0 lg:px-0 lg:col-start-2">
              {/* Builder Feature #2 */}
              {!vendor && (
                <div>
                  <div>
                    <span className="h-12 w-12 flex items-center justify-center border-2 border-purple">
                      <svg className="h-6 w-6 text-purple" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                    </span>
                  </div>
                  <div className="mt-6">
                    <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Discover the best apps</h2>
                    <p className="mt-4 text-lg text-gray-500">
                      Learn what software top builders use with our "starter kits". Whether you want to start a podcast, startup, or online store, we have a starter kit to help you hit the ground
                      running.
                    </p>
                    <div className="mt-6">
                      <Link href="/kits">
                        <a className="inline-flex px-4 py-2 border border-transparent text-base font-medium shadow-sm text-white bg-gradient-to-r from-purple to-indigo-600 hover:from-purple-extradark hover:to-indigo-700">
                          Browse starter kits
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Vendor Feature #2 */}
              {vendor && (
                <div>
                  <div>
                    <span className="h-12 w-12 flex items-center justify-center border-2 border-purple">
                      <svg className="h-6 w-6 text-purple" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </span>
                  </div>
                  <div className="mt-6">
                    <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Reach high intent shoppers</h2>
                    <p className="mt-4 text-lg text-gray-500">
                      <span>Don't waste ad dollars on low intent </span>
                      <span className="font-bold">browsers</span>
                      <span> with Google and Facebook. Reach high intent </span>
                      <span className="font-bold">shoppers</span>
                      <span> who come to discover and buy business software.</span>
                    </p>
                    <div className="mt-6">
                      <Link href="/contact">
                        <a className="inline-flex px-4 py-2 border border-transparent text-base font-medium shadow-sm text-white bg-gradient-to-r from-purple to-indigo-600 hover:from-purple-extradark hover:to-indigo-700">
                          Partner with us
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-12 sm:mt-16 lg:mt-0 lg:col-start-1">
              <div className="pr-4 -ml-48 sm:pr-6 md:-ml-16 lg:px-0 lg:m-0 lg:relative lg:h-full">
                {!vendor && (
                  <img
                    className="w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 lg:absolute lg:right-0 lg:h-full lg:w-auto lg:max-w-none"
                    src="https://dnlvkovcawtkzuvpmmgr.supabase.co/storage/v1/object/sign/website_images/starter_kit_4.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ3ZWJzaXRlX2ltYWdlcy9zdGFydGVyX2tpdF80LmpwZyIsImlhdCI6MTYyNTAxMzEzNywiZXhwIjoxOTQwMzczMTM3fQ.wHUUVKlVRRvPEft0DX6OVRCu7B44p-4oTrrzuVtPIaI"
                    alt="Podcast starter kit"
                  />
                )}
                {vendor && (
                  <img
                    className="w-full rounded-xl ring-0 lg:absolute lg:right-0 lg:h-full lg:w-auto lg:max-w-none"
                    src="https://dnlvkovcawtkzuvpmmgr.supabase.co/storage/v1/object/sign/website_images/funnel2?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ3ZWJzaXRlX2ltYWdlcy9mdW5uZWwyIiwiaWF0IjoxNjIwMjQyMTA0LCJleHAiOjE5MzU2MDIxMDR9.PlrGM8V6O0SrOkSvGEPn08szAoiV14Hz3UjnyZZ9QcU"
                    alt="AppCity funnel"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
