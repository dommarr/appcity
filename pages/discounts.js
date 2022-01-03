import { supabase } from "../utils/initSupabase";
import Container from "../components/global/mobilePaddingContainer";
import Link from "next/link";
import Head from "../components/global/head";

const description = "Discounts and offers from the best business apps around. More to come soon!";

const AppCard = ({ app }) => {
  return (
    <Link href={`/product/${app.id}`}>
      <a>
        <li className="col-span-1 grid grid-cols-4 gap-4 bg-white border shadow-md divide-x divide-gray-200 flex p-4">
          <div className="col-span-1 flex flex-col items-center justify-center">
            <div className="w-20 h-20">
              <img className="w-full" src={app.product_logo ? app.product_logo : app.vendors.logo} alt={`${app.name} Logo`} />
            </div>
          </div>

          <div className="col-span-3 flex flex-col items-start justify-around pl-4">
            <div className="flex items-center justify-center text-xl font-medium">{app.name}</div>
            <p className="flex items-center justify-center text-sm text-ellipsis overflow-hidden">{app.discount}</p>
          </div>
        </li>
      </a>
    </Link>
  );
};

export default function Deals({ apps }) {
  return (
    <>
      <Head title={`Discounts and Offers | AppCity`} description={description} url={`https://www.appcity.com/deals`} />
      <div className="bg-gray-50 pb-20">
        <Container>
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-extrabold text-gray-900 md:text-4xl md:tracking-tight">Discounts and Offers</h1>
            <p className="max-w-xl mx-auto text-base text-gray-500">{description}</p>
          </div>
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
