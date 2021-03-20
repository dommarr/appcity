import Head from "next/head";
import HomeLayout, { siteTitle } from "../components/home/homeLayout";

export default function Home() {
  return (
    <HomeLayout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
    </HomeLayout>
  );
}
