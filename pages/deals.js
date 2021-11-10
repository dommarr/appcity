import { useState, useEffect } from "react";
import { supabase } from "../utils/initSupabase";
import Footer from "../components/global/footer";
import Header from "../components/global/header";
import Container from "../components/global/mobilePaddingContainer";
import Link from "next/link";
import Head from "../components/global/head";

let description = "Offers";

const AppCard = ({ app }) => {
  return (
    <Link href={`/product/${app.id}`}>
      <a>
        <li className="col-span-1 bg-white border shadow-md divide-x divide-gray-200 flex p-4">
          <img className="w-20 h-20 mr-4" src={app.vendors.logo} alt={`${app.name} Logo`} />
          <div className="flex flex-col items-start justify-around">
            <div className="flex items-center justify-center text-xl font-medium pl-4">{app.name}</div>
            <div className="flex items-center justify-center text-sm pl-4">{app.discount}</div>
          </div>
        </li>
      </a>
    </Link>
  );
};

export default function Deals({ apps }) {
  return (
    <>
      <Header style="dark" />
      <Head title={`Discounts and Offers | AppCity`} description={description} url={`https://www.appcity.com/deals`} />
      <div className="bg-gray-50 pb-20">
        <Container>
          <div className="">
            <div className="max-w-7xl mx-auto py-16 sm:px-6 lg:px-8">
              <div className="text-center space-y-4">
                <h1 className="text-3xl font-extrabold text-gray-900 md:text-4xl md:tracking-tight">Discounts and Offers</h1>
                <p className="max-w-xl mx-auto text-base text-gray-500">{description}</p>
              </div>
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
          </div>
        </Container>
      </div>
      <Footer dark={true} />
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

const setDiscount = (arr) => {
  arr.forEach((app) => {
    app.discount = app.discount_message ? app.discount_message : app.vendors.discount_message;
  });
  return arr;
};

export async function getStaticProps(context) {
  const appData = await fetchApps();
  let appDiscounts = setDiscount(appData);
  let apps = appDiscounts.filter((app) => app.discount);

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
