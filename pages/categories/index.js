import Head from "../../components/global/head";
import { supabase } from "../../utils/initSupabase";
import { Disclosure } from "@headlessui/react";
import { MinusSmIcon, PlusSmIcon, ArrowSmRightIcon } from "@heroicons/react/outline";
import Link from "next/link";
import Page from "../../components/global/defaultPage";

const description =
  "Browse all the categories on AppCity to find the best software for your business. Whether you're looking for productivity apps or accounting tools, we make it easy to browse and sort our catalog by category.";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Categories({ categories }) {
  let parentCategories = categories.filter((category) => category.parent_id === null);
  return (
    <Page title="All Categories" description={description} url="https://www.appcity.com/categories">
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 px-4 pb-4">
        {parentCategories.map((parentCategory) => {
          let childCategories = categories.filter((category) => category.parent_id === parentCategory.id);
          {
            /* if no children, render a non-expandable box that links to the category page */
          }
          if (childCategories.length < 1) {
            return (
              <Link key={parentCategory.name} href={`/categories/${parentCategory.slug}`}>
                <a className="col-span-1 group">
                  <div className="pl-8 sm:pl-0 bg-gray-50 shadow">
                    <h3 className="text-gray-900 font-medium p-4">
                      <div className="relative w-full flex items-center text-left">
                        <span className={""}>{parentCategory.name}</span>
                        <span className="ml-6 flex items-center">
                          <ArrowSmRightIcon className="block h-6 w-6 text-gray-400 group-hover:text-indigo-500" aria-hidden="true" />
                        </span>
                      </div>
                    </h3>
                  </div>
                </a>
              </Link>
            );
          }
          {
            /* if children, render an expandable box with links inside */
          }
          return (
            <Disclosure as="div" key={parentCategory.name}>
              {({ open }) => (
                <div className={`col-span-1 bg-gray-50 shadow group`}>
                  <div className="pl-8 sm:pl-0">
                    <h3 className="">
                      <Disclosure.Button className="relative w-full flex items-center text-left p-4">
                        <span className={classNames(open ? "text-indigo-600" : "text-gray-900", "font-medium")}>{parentCategory.name}</span>
                        <span className="ml-6 flex items-center">
                          {open ? (
                            <MinusSmIcon className="block h-6 w-6 text-indigo-400 group-hover:text-indigo-500" aria-hidden="true" />
                          ) : (
                            <PlusSmIcon className="block h-6 w-6 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                          )}
                        </span>
                      </Disclosure.Button>
                    </h3>
                    <Disclosure.Panel as="div" className="flex flex-col space-y-6 text-sm text-gray-500 pt-2 pb-4 px-4">
                      <ul role="list" className="space-y-2 list-disc pl-6">
                        {childCategories.map((childCategory) => {
                          return (
                            <li key={childCategory.id} className="hover:text-indigo-500">
                              <Link href={`/categories/${childCategory.slug}`}>
                                <a>{childCategory.name}</a>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                      {/* "Browse all" link to the parent category page */}
                      <Link key={parentCategory.id} href={`/categories/${parentCategory.slug}`}>
                        <a className="group flex space-x-4 font-medium text-gray-500 hover:text-indigo-500">
                          <span className="">Browse all</span>
                          <ArrowSmRightIcon className="block h-5 w-5" aria-hidden="true" />
                        </a>
                      </Link>
                    </Disclosure.Panel>
                  </div>
                </div>
              )}
            </Disclosure>
          );
        })}
      </div>
    </Page>
  );
}

export async function getStaticProps() {
  let { data: categories, error } = await supabase.from("categories").select(`*`).order(`name`).gt("product_count", 0);
  if (error || categories.length === 0) {
    return {
      notFound: true,
    };
  }
  // move Other to the end
  let cat1 = categories.filter((category) => category.name !== "Other");
  let cat2 = categories.filter((category) => category.name === "Other");
  categories = cat1.concat(cat2);

  return {
    props: { categories },
    revalidate: 60,
  };
}
