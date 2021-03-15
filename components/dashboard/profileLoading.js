export default function ProfileLoading() {
  return (
    <>
      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-white">
            <div className="flex-1 flex flex-col pb-4 overflow-y-auto">
              <nav className="mt-5 flex-1 px-2 bg-white space-y-4 relative animate-pulse">
                <div className="bg-gray-200 h-6 w-full"></div>
                <div className="bg-gray-200 h-6 w-full"></div>
                <div className="bg-gray-200 h-6 w-full"></div>
                <div className="bg-gray-200 h-6 w-full"></div>
                <div className="bg-gray-200 h-6 w-full"></div>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none" tabIndex={0}>
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 animate-pulse">
              <div className="bg-gray-200 h-8 w-60"></div>
            </div>
            <div className="flex flex-col justify-left max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="grid grid-cols-3 gap-4 mt-4 p-4 bg-white shadow animate-pulse">
                <div className="bg-gray-200 col-span-1 h-6"></div>
                <div className="bg-gray-200 col-span-3 h-6"></div>
                <div className="bg-gray-200 col-span-3 h-6"></div>
                <div className="bg-gray-200 col-span-2 h-6"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
