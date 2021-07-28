import Head from "../components/global/head";
import HomeLayout from "../components/home/homeLayout";
import { supabase } from "../utils/initSupabase";

export default function Home({ apps }) {
  return (
    <>
      <Head title="AppCity" description="Shop for software like you shop for everything else." url="shopappcity.com" />
      <HomeLayout apps={apps} />
    </>
  );
}

const appIds = [1022, 1032, 1044, 1005, 1029, 1012];

const fetchApps = async (ids) => {
  let { data: products, error } = await supabase
    .from("products")
    .select(
      `*,
    vendors(*)`
    )
    .in("id", ids);
  if (error) {
    throw error;
  }
  return products;
};

const fetchCategories = async (ids) => {
  let { data: cats, error } = await supabase.from("products_categories").select(`*, categories(*)`).in("product_id", ids);
  if (error) {
    throw error;
  }
  return cats;
};

export async function getStaticProps() {
  let apps = await fetchApps(appIds);
  if (!apps) {
    return {
      notFound: true,
    };
  }
  let cats = await fetchCategories(appIds);
  if (!cats) {
    return {
      notFound: true,
    };
  }

  apps.forEach((elem) => {
    let result = cats.filter((cat) => cat.product_id === elem.id);
    result = result.map((c) => ({ id: c.categories.id, name: c.categories.name }));
    elem.categories = result;
  });

  return {
    props: { apps },
  };
}
