import Head from "../components/global/head";
import HomeLayout from "../components/home/homeLayout";

export default function Home() {
  return (
    <HomeLayout home>
      <Head title="AppCity" description="Shop for software like you shop for everything else." url="shopappcity.com" />
    </HomeLayout>
  );
}
