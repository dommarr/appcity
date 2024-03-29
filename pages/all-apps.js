import { useState, useEffect } from "react";
import { supabase } from "../utils/initSupabase";
import Container from "../components/global/mobilePaddingContainer";
import Link from "next/link";
import Head from "../components/global/head";

let description = "All business apps and software on AppCity.com";

const AppCard = ({ app }) => {
  return (
    <Link href={`/product/${app.id}`}>
      <a>
        <li className="col-span-1 bg-white border shadow-md divide-x divide-gray-200 flex p-4">
          <div className="w-20 h-20 mr-4 flex flex-col items-center justify-center">
            <img className="w-full" src={app.product_logo ? app.product_logo : app.vendors.logo} alt={`${app.name} Logo`} />
          </div>
          <div className="flex flex-col items-start justify-around">
            <div className="flex items-center justify-center text-xl font-medium pl-4">{app.name}</div>
          </div>
        </li>
      </a>
    </Link>
  );
};

export default function AllApps({ apps }) {
  return (
    <>
      <Head title={`All Business Apps | AppCity`} description={description} url={`https://www.appcity.com/all-apps`} />
      <div className="bg-gray-50 pb-20">
        <Container>
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-extrabold text-gray-900 md:text-4xl md:tracking-tight">All Business Apps</h1>
            <p className="max-w-xl mx-auto text-base text-gray-500">{description}</p>
          </div>
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {apps &&
              apps.map((app, idx) => {
                return <AppCard key={idx} app={app} />;
              })}
          </ul>
          {/* {sections &&
              sections.map((section, idx) => {
                return <KitSection key={idx} section={section} />;
              })} */}
        </Container>
      </div>
    </>
  );
}

const fetchApps = async () => {
  let { data: products, error } = await supabase.from("products").select("*, vendors(*)").order("name");

  if (error) {
    throw error;
  }
  return products;
};

export async function getStaticProps(context) {
  const apps = await fetchApps();

  if (!apps) {
    return {
      notFound: true,
    };
  }

  return {
    props: { apps },
    revalidate: 60,
  };
}
