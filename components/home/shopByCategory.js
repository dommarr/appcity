import Link from "next/link";
const categories = [
  {
    name: "Website Builders",
    href: `/categories/Website & App Builders?parent=${encodeURIComponent("Website & App Builders")}`,
    imageSrc:
      "https://dnlvkovcawtkzuvpmmgr.supabase.in/storage/v1/object/sign/website_images/shop_by_category/computer.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ3ZWJzaXRlX2ltYWdlcy9zaG9wX2J5X2NhdGVnb3J5L2NvbXB1dGVyLnBuZyIsImlhdCI6MTY0MDczNzY3MSwiZXhwIjoxOTU2MDk3NjcxfQ.bo0BiwGJA-xyUExOaqpJ9Vhne2Pzz3tXdr6E4xTuqYQ",
  },
  {
    name: "Marketing",
    href: `/categories/Marketing?parent=${encodeURIComponent("Marketing")}`,
    imageSrc:
      "https://dnlvkovcawtkzuvpmmgr.supabase.in/storage/v1/object/sign/website_images/shop_by_category/hashtag.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ3ZWJzaXRlX2ltYWdlcy9zaG9wX2J5X2NhdGVnb3J5L2hhc2h0YWcucG5nIiwiaWF0IjoxNjQwNzM3NjkwLCJleHAiOjE5NTYwOTc2OTB9.WN7dPSxuj6ZRhelvLzrup3NTsUKYs7M1uVu7qadAlxA",
  },
  {
    name: "Productivity",
    href: `/categories/Productivity & Admin?parent=${encodeURIComponent("Productivity & Admin")}`,
    imageSrc:
      "https://dnlvkovcawtkzuvpmmgr.supabase.in/storage/v1/object/sign/website_images/shop_by_category/coffee.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ3ZWJzaXRlX2ltYWdlcy9zaG9wX2J5X2NhdGVnb3J5L2NvZmZlZS5wbmciLCJpYXQiOjE2NDA3Mzc2NTgsImV4cCI6MTk1NjA5NzY1OH0.lAaucaGuI69n2gcTZ1HXIDwmA8MBIVGukVvMt0oLtQg",
  },
  {
    name: "Customer Service",
    href: `/categories/Customer Service?parent=${encodeURIComponent("Customer Service")}`,
    imageSrc:
      "https://dnlvkovcawtkzuvpmmgr.supabase.in/storage/v1/object/sign/website_images/shop_by_category/handshake.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ3ZWJzaXRlX2ltYWdlcy9zaG9wX2J5X2NhdGVnb3J5L2hhbmRzaGFrZS5wbmciLCJpYXQiOjE2NDA3Mzg0NTQsImV4cCI6MTk1NjA5ODQ1NH0.x8xCF8-SNe93zZv0dKhDB-1ZwbI4mfZru3oKZoYRBeo",
  },
  {
    name: "Project Management",
    href: `/categories/Project Management?parent=${encodeURIComponent("Project Management")}`,
    imageSrc:
      //  "https://dnlvkovcawtkzuvpmmgr.supabase.in/storage/v1/object/sign/website_images/shop_by_category/phone.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ3ZWJzaXRlX2ltYWdlcy9zaG9wX2J5X2NhdGVnb3J5L3Bob25lLnBuZyIsImlhdCI6MTY0MDczODQyMCwiZXhwIjoxOTU2MDk4NDIwfQ.jLfmOVa0EtHkHOI3GlyNHnzC4Hldu3ZEYP8gtisNKeY",
      "https://dnlvkovcawtkzuvpmmgr.supabase.in/storage/v1/object/sign/website_images/shop_by_category/calendar.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ3ZWJzaXRlX2ltYWdlcy9zaG9wX2J5X2NhdGVnb3J5L2NhbGVuZGFyLmpwZyIsImlhdCI6MTY0MDc0NjY1MCwiZXhwIjoxOTU2MTA2NjUwfQ.5jhd4dQOrDQACTynPT4Rfeg2mfqu_dh_tEimK93mT1o",
  },
];

export default function ShopByCategory() {
  return (
    <section id="shop-by-category" className="bg-white">
      <div className="pb-24 sm:pb-32 xl:max-w-7xl xl:mx-auto xl:px-8">
        <div className="px-4 sm:px-6 sm:flex sm:items-end sm:justify-between lg:px-8 xl:px-0">
          <h2 className="text-4xl sm:text-3xl mb-8 sm:mb-0 font-extrabold text-center text-purple">Shop by Category</h2>
          <Link href="/categories">
            <a className="hidden font-semibold text-indigo-600 hover:text-indigo-500 sm:block">
              Browse all categories<span aria-hidden="true"> &rarr;</span>
            </a>
          </Link>
        </div>

        <div className="mt-4 flow-root">
          <div className="-my-2">
            <div className="box-content py-2 relative h-80 overflow-x-auto xl:overflow-visible">
              <div className="absolute min-w-screen-xl px-4 flex space-x-8 sm:px-6 lg:px-8 xl:relative xl:px-0 xl:space-x-0 xl:grid xl:grid-cols-5 xl:gap-x-8">
                {categories.map((category) => (
                  <Link key={category.name} href={category.href}>
                    <a className="relative w-56 h-80 py-6 px-2 flex flex-col overflow-hidden hover:opacity-75 xl:w-auto">
                      <span aria-hidden="true" className="absolute inset-0">
                        <img src={category.imageSrc} alt="" className="w-full h-full object-center object-cover" />
                      </span>
                      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-gray-800 opacity-50" />
                      <span className="relative mt-auto text-center text-xl font-bold text-white">{category.name}</span>
                    </a>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 px-4 sm:hidden">
          <Link href="/categories">
            <a className="block font-semibold text-indigo-600 hover:text-indigo-500 text-center">
              Browse all categories<span aria-hidden="true"> &rarr;</span>
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
}
