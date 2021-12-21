import { Fragment, useState } from "react";
import Head from "../../components/global/head";
import { supabase } from "../../utils/initSupabase";
import { Dialog, Disclosure, Popover, RadioGroup, Tab, Transition } from "@headlessui/react";
import { HeartIcon, MenuIcon, MinusSmIcon, PlusSmIcon, SearchIcon, ShoppingBagIcon, UserIcon, XIcon } from "@heroicons/react/outline";
import { StarIcon } from "@heroicons/react/solid";

const description = "Browse all categories and find the right app for your business.";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Categories({ categories }) {
  return (
    <div className="bg-white">
      <Head title={`All Categories | AppCity`} description={description} url={`https://www.appcity.com/categories`} />
      <main className="pb-24">
        <div className="text-center py-16 px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">All Categories</h1>
          <p className="mt-4 max-w-xl mx-auto text-base text-gray-500">{description}</p>
        </div>

        {/* Product grid */}
        <section aria-labelledby="products-heading" className="max-w-7xl mx-auto overflow-hidden sm:px-6 lg:px-8">
          <h2 id="products-heading" className="sr-only">
            Categories
          </h2>
          <div className="border-t divide-y divide-gray-200">
            {categories.map((category) => (
              <Disclosure as="div" key={category.name}>
                {({ open }) => (
                  <>
                    <h3>
                      <Disclosure.Button className="group relative w-full py-6 flex justify-between items-center text-left">
                        <span className={classNames(open ? "text-indigo-600" : "text-gray-900", "text-sm font-medium")}>{category.name}</span>
                        <span className="ml-6 flex items-center">
                          {open ? (
                            <MinusSmIcon className="block h-6 w-6 text-indigo-400 group-hover:text-indigo-500" aria-hidden="true" />
                          ) : (
                            <PlusSmIcon className="block h-6 w-6 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                          )}
                        </span>
                      </Disclosure.Button>
                    </h3>
                    <Disclosure.Panel as="div" className="pb-6 prose prose-sm">
                      <ul role="list">
                        {categories.map((category) => (
                          <li key={category}>{category}</li>
                        ))}
                      </ul>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            ))}
          </div>

          <div className="-mx-px border-l border-gray-200 grid grid-cols-2 sm:mx-0 md:grid-cols-3 lg:grid-cols-4"></div>
        </section>
      </main>
    </div>
  );
}

export async function getStaticProps() {
  let { data: categories, error } = await supabase.from("categories").select(`*`);
  if (error || categories.length === 0) {
    return {
      notFound: true,
    };
  }

  return {
    props: { categories },
    revalidate: 60,
  };
}
