/* This example requires Tailwind CSS v2.0+ */
import { XIcon } from "@heroicons/react/outline";

export default function Banner() {
  return (
    <div className="relative bg-indigo-600 select-none">
      <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
        <div className="text-center sm:px-16 flex items-center justify-center">
          <p className=" text-white">
            <span className="md:hidden">🛠️ 🚧 Under construction. Have a look!</span>
            <span className="hidden md:inline">🛠️ 🚧 We're under construction, but feel free to look around!</span>
          </p>
        </div>
        {/* <div className="absolute inset-y-0 right-0 pt-1 pr-1 flex items-start sm:pt-1 sm:pr-2 sm:items-start">
          <button type="button" className="flex p-2 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white">
            <span className="sr-only">Dismiss</span>
            <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
          </button>
        </div> */}
      </div>
    </div>
  );
}
