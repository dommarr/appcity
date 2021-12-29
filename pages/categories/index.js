import Head from "../../components/global/head";
import { supabase } from "../../utils/initSupabase";
import { Disclosure } from "@headlessui/react";
import { MinusSmIcon, PlusSmIcon, ArrowSmRightIcon } from "@heroicons/react/outline";
import Link from "next/link";

const description = "Browse all categories and find the right app for your business.";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Categories({ categories }) {
  let parentCategories = categories.filter((category) => category.parent_id === null);
  return (
    <div className="bg-white">
      <Head title={`All Categories | AppCity`} description={description} url={`https://www.appcity.com/categories`} />
      <main className="pb-24">
        <div className="text-center py-16 px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">All Categories</h1>
          <p className="mt-4 max-w-xl mx-auto text-base text-gray-500">{description}</p>
        </div>
        <section aria-labelledby="products-heading" className="max-w-7xl mx-auto overflow-hidden sm:px-6 lg:px-8">
          <h2 id="products-heading" className="sr-only">
            Categories
          </h2>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 px-4">
            {parentCategories.map((parentCategory) => {
              let childCategories = categories.filter((category) => category.parent_id === parentCategory.id);
              if (childCategories.length < 1) {
                let parent = encodeURIComponent(parentCategory.name);
                return (
                  <Link href={`/categories/${parentCategory.name}?parent=${parent}`}>
                    <a className="col-span-1 ">
                      <div className="pl-8 sm:pl-0 bg-gray-50">
                        <h3 className="text-gray-900 font-medium p-4">
                          <div className="group relative w-full flex items-center text-left">
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
              return (
                <Disclosure as="div" key={parentCategory.name}>
                  {({ open }) => (
                    <div className={`col-span-1 p-4 bg-gray-50`}>
                      <div className="pl-8 sm:pl-0">
                        <h3 className="">
                          <Disclosure.Button className="group relative w-full flex items-center text-left">
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
                        <Disclosure.Panel as="div" className="flex flex-col space-y-6 text-sm text-gray-500 pt-6">
                          <ul role="list" className="space-y-2 list-disc pl-6">
                            {childCategories.map((childCategory) => {
                              let parent = encodeURIComponent(`${parentCategory.name} > ${childCategory.name}`);
                              return (
                                <li key={childCategory} className="hover:text-indigo-500">
                                  <Link href={`/categories/${childCategory.name}?parent=${parent}`}>
                                    <a>{childCategory.name}</a>
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                          <Link key={parentCategory} href={`/categories/${parentCategory.name}?parent=${encodeURIComponent(parentCategory.name)}`}>
                            <a>
                              <div className="group flex space-x-4 font-medium">
                                <span className="group-hover:text-indigo-500">See all</span>
                                <ArrowSmRightIcon className="block h-5 w-5 text-gray-400 group-hover:text-indigo-500" aria-hidden="true" />
                              </div>
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
        </section>
      </main>
    </div>
  );
}

const fetchProductCategories = async () => {
  let { data: products_categories, error } = await supabase.from("products_categories").select("category_id");
  if (error) {
    throw error;
  }
  let flattenedArr = products_categories.map((category) => category.category_id);
  let deDupedArr = [...new Set(flattenedArr)];
  return deDupedArr;
};

export async function getStaticProps() {
  let productCategories = await fetchProductCategories();
  let { data: categories, error } = await supabase.from("categories").select(`*`).order(`name`);
  if (error || categories.length === 0) {
    return {
      notFound: true,
    };
  }
  // exclude categories that have no products
  categories = categories.filter((category) => productCategories.includes(category.id));
  // move Other to the end
  let cat1 = categories.filter((category) => category.name !== "Other");
  let cat2 = categories.filter((category) => category.name === "Other");
  categories = cat1.concat(cat2);

  return {
    props: { categories },
    revalidate: 60,
  };
}
