import { Fragment, useEffect, useState } from "react";
import { Popover, Transition } from "@headlessui/react";
import Link from "next/link";
import { ArrowSmRightIcon } from "@heroicons/react/outline";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function NavLinks({ navigation, categories, featured, categoriesLoading }) {
  return (
    <div className="hidden lg:flex items-center justify-center space-x-8 lg:space-x-16 h-full">
      <Popover.Group className="block self-stretch">
        <div className="h-full flex space-x-8">
          <Popover key="categories" className="flex">
            {({ open }) => (
              <>
                <div className="relative flex">
                  <Popover.Button
                    className={classNames(
                      open ? "border-white" : "border-transparent hover:underline",
                      "relative z-10 flex items-center transition-colors ease-out duration-200 border-b-2 -mb-px pt-px text-white"
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
                  <Popover.Panel className="absolute top-full inset-x-0 text-sm text-white">
                    {/* Presentational element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow */}
                    <div className="absolute inset-0 top-1/2 bg-purple-extradark shadow" aria-hidden="true" />

                    <div className="relative bg-purple-extradark">
                      <div className="max-w-7xl mx-auto px-8">
                        <div className="grid grid-cols-2 gap-y-10 gap-x-8 py-16 border-t border-purple-dark">
                          {!categoriesLoading && (
                            <div className="row-start-1 grid grid-cols-3 gap-y-10 gap-x-8 text-sm">
                              {categories.map((parent) => (
                                <div key={parent.id}>
                                  <p id={`${parent.name}-heading`} className="font-medium uppercase">
                                    {parent.name}
                                  </p>

                                  <ul role="list" aria-labelledby={`${parent.name}-heading`} className="mt-6 space-y-6 sm:mt-4 sm:space-y-4">
                                    {parent.children.map((child) => (
                                      <li key={child.id} className="flex">
                                        <Popover.Button onClick={() => (open = false)} className="w-full h-full flex items-start justify-start">
                                          <Link href={`/categories/${child.slug}`}>
                                            <a className="hover:underline cursor-pointer text-left">{child.name}</a>
                                          </Link>
                                        </Popover.Button>
                                      </li>
                                    ))}
                                  </ul>

                                  <Popover.Button onClick={() => (open = false)}>
                                    <Link key={parent.name} href={`/categories/${parent.slug}`}>
                                      <a className="group flex space-x-4 font-medium hover:underline mt-6">
                                        <span className="">Browse all</span>
                                        <ArrowSmRightIcon className="block h-5 w-5" aria-hidden="true" />
                                      </a>
                                    </Link>
                                  </Popover.Button>
                                </div>
                              ))}
                            </div>
                          )}
                          {categoriesLoading && (
                            <div className="row-start-1 grid grid-cols-3 gap-y-10 gap-x-8 text-sm">
                              {[...Array(3)].map((_, i) => (
                                <ul key={i} className="mt-6 space-y-6 sm:mt-4 sm:space-y-4">
                                  {[...Array(8)].map((_, i) => (
                                    <li key={i} className="h-5 bg-purple-dark animate-pulse"></li>
                                  ))}
                                </ul>
                              ))}
                            </div>
                          )}
                          <div className="col-start-2 grid grid-cols-2 gap-x-8">
                            {featured.map((item) => (
                              <div key={item.name} className="group relative text-base sm:text-sm">
                                <div className="aspect-w-1 aspect-h-1 bg-gray-100 overflow-hidden group-hover:opacity-75">
                                  <img src={item.imageSrc} alt={item.imageAlt} className="object-center object-cover" />
                                </div>
                                <Link href={item.href}>
                                  <a className="mt-6 block font-medium uppercase">
                                    <span className="absolute z-10 inset-0" aria-hidden="true" />
                                    {item.name}
                                  </a>
                                </Link>
                                <p aria-hidden="true" className="mt-1 group-hover:underline">
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

          {navigation
            .filter((item) => item.name !== "Home")
            .map((item, index) => (
              <div key={index} className="h-full flex items-center justify-center">
                <Link href={item.href}>
                  <a className="text-white hover:underline">{item.name}</a>
                </Link>
              </div>
            ))}
        </div>
      </Popover.Group>
    </div>
  );
}
