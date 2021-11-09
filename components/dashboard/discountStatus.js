import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../utils/initSupabase";
import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/solid";

export default function DiscountStatus({ reviewCount }) {
  if (reviewCount > 0)
    return (
      <div className="bg-green-50 border-l-4 border-green-400 p-4">
        <div className="flex justify-between items-start flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4 lg:items-center">
          <div className="flex">
            <div className="flex-shrink-0">
              <LockOpenIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Discounts Unlocked</h3>
              <div className="mt-2 text-sm text-green-700">
                <ul role="list" className="list-disc pl-5 space-y-1">
                  <li>Thanks for leaving a review!</li>
                  <li>Your contribution is helping others find the best apps for their business 💪</li>
                </ul>
              </div>
            </div>
          </div>
          {/* <p className="text-sm">
            <Link href={`/search`}>
              <a className="whitespace-nowrap font-medium text-green-800 hover:text-green-600">
                Search apps <span aria-hidden="true">&rarr;</span>
              </a>
            </Link>
          </p> */}
        </div>
      </div>
    );

  return (
    <div className="bg-red-50 border-l-4 border-red-400 p-4">
      <div className="flex justify-between items-start flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4 lg:items-center">
        <div className="flex">
          <div className="flex-shrink-0">
            <LockClosedIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Discounts Locked</h3>
            <div className="mt-2 text-sm text-red-700">
              <ul role="list" className="list-disc pl-5 space-y-1">
                <li>Leave one review on any app to unlock thousands in discounts and offers</li>
                <li>To leave a review, search for the app and go to the bottom of the app page</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="text-sm">
          <Link href={`/search`}>
            <a className="whitespace-nowrap font-medium text-red-800 hover:text-red-600">
              Search apps <span aria-hidden="true">&rarr;</span>
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
