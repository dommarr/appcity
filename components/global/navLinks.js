import { Fragment, useEffect, useState } from "react";
import { Popover, Transition } from "@headlessui/react";
import Link from "next/link";
import { supabase } from "../../utils/initSupabase";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function NavLinks({ navigation }) {
  const [open, setOpen] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(async () => {
    let sections = await fetchCategories();
    let items = await fetchChildCategories(sections);
    let updatedSections = sections.map((section) => {
      section.items = items.filter((item) => item.parent_id === section.id);
      return section;
    });
    let cats = [
      {
        id: "categories",
        name: "Categories",
        sections: updatedSections,
        featured: [
          {
            name: "Starter Kits",
            href: "/kits",
            imageSrc: "https://images.unsplash.com/photo-1558906050-d6d6aa390fd3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1726&q=80",
            imageAlt: "Business app starter kits to help you hit the ground running.",
          },
        ],
      },
    ];
    setCategories(cats);
  }, []);

  const fetchCategories = async () => {
    let { data: categories, error } = await supabase.from("categories").select(`*`).is("parent_id", null).order(`product_count`, { ascending: false }).limit(4);
    if (error) {
      throw error;
    }
    return categories;
  };

  const fetchChildCategories = async (arr) => {
    let catIds = arr.map((cat) => cat.id);
    let { data: categories, error } = await supabase.from("categories").select(`*`).in("parent_id", catIds).gt("product_count", 0).order(`product_count`, { ascending: false });
    if (error) {
      throw error;
    }
    return categories;
  };

  return (
    <div className="hidden sm:flex items-center justify-center space-x-8 lg:space-x-16">
      <Popover.Group className="ml-8 block self-stretch">
        <div className="h-full flex space-x-8">
          {categories.map((category) => (
            <Popover key={category.name} className="flex">
              {({ open }) => (
                <>
                  <div className="relative flex">
                    <Popover.Button
                      className={classNames(
                        open ? "border-white text-white" : "border-transparent text-gray-300 hover:text-white hover:border-white",
                        "relative z-10 flex items-center transition-colors ease-out duration-200 border-b-2 -mb-px pt-px"
                      )}
                    >
                      Categories
                    </Popover.Button>
                  </div>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Popover.Panel className="absolute top-full inset-x-0 text-sm text-gray-500">
                      {/* Presentational element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow */}
                      <div className="absolute inset-0 top-1/2 bg-white shadow" aria-hidden="true" />

                      <div className="relative bg-white">
                        <div className="max-w-7xl mx-auto px-8">
                          <div className="grid grid-cols-4 gap-y-10 gap-x-8 py-16">
                            <div className="col-span-3 grid grid-cols-4 gap-y-10 gap-x-4 text-sm">
                              {category.sections.map((section) => (
                                <div key={section.name}>
                                  <p id={`${section.name}-heading`} className="font-medium text-gray-900">
                                    {section.name}
                                  </p>
                                  <ul role="list" aria-labelledby={`${section.name}-heading`} className="mt-6 space-y-6 sm:mt-4 sm:space-y-4">
                                    {section.items.map((item) => (
                                      <li key={item.name} className="flex">
                                        <a href={item.href} className="hover:text-gray-800">
                                          {item.name}
                                        </a>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                            <div className="col-span-1 grid grid-cols-1">
                              {category.featured.map((item) => (
                                <div key={item.name} className="group relative text-base sm:text-sm">
                                  <div className="aspect-w-6 aspect-h-9 bg-gray-100 overflow-hidden group-hover:opacity-75">
                                    <img src={item.imageSrc} alt={item.imageAlt} className="object-center object-cover" />
                                  </div>
                                  <a href={item.href} className="mt-6 block font-medium text-gray-900">
                                    <span className="absolute z-10 inset-0" aria-hidden="true" />
                                    {item.name}
                                  </a>
                                  <p aria-hidden="true" className="mt-1">
                                    Shop now
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Popover.Panel>
                  </Transition>
                </>
              )}
            </Popover>
          ))}

          {navigation
            .filter((item) => item.name !== "Home")
            .map((item, index) => (
              <Link href={item.href} key={index}>
                <a className="text-gray-300 hover:text-white">{item.name}</a>
              </Link>
            ))}
        </div>
      </Popover.Group>
    </div>
  );
}
