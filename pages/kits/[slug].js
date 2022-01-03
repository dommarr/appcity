import Container from "../../components/global/mobilePaddingContainer";
import Link from "next/link";
import Head from "../../components/global/head";
import { useState, useEffect } from "react";
import { supabase } from "../../utils/initSupabase";
import Page from "../../components/global/defaultPage";

const capitalizeEveryWord = (words) => {
  let wordArray = words.split(" ");
  wordArray = wordArray
    .map((word) => {
      return word[0].toUpperCase() + word.substring(1);
    })
    .join(" ");
  return wordArray;
};

const formatSentence = (sentence) => {
  let sentenceArray = sentence.split(" ");
  sentenceArray[0] = sentenceArray[0][0].toUpperCase() + sentenceArray[0].substring(1);
  let lastWordIndex = sentenceArray.length - 1;
  let lastLettersArray = sentenceArray[lastWordIndex].split("");
  let lastLetterIndex = lastLettersArray.length - 1;
  if (lastLettersArray[lastLetterIndex] !== ".") {
    lastLettersArray.push(".");
    sentenceArray[lastWordIndex] = lastLettersArray.join("");
  }
  sentenceArray = sentenceArray.join(" ");
  return sentenceArray;
};

const ProductCard = ({ product }) => {
  return (
    <Link href={`/product/${product.id}`}>
      <a>
        <li className="col-span-1 bg-white border shadow-md divide-x divide-gray-200 flex p-4">
          <div className="w-20 h-20 mr-4 flex flex-col items-center justify-center">
            <img className="w-full" src={product.product_logo ? product.product_logo : product.vendors.logo} alt={`${product.name} Logo`} />
          </div>

          <div className="flex items-center justify-center text-xl font-medium pl-4">{product.name}</div>
        </li>
      </a>
    </Link>
  );
};

const KitSection = ({ section }) => {
  return (
    <section className="pb-4">
      <div className="relative mb-4">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-start">
          <span className="pr-3 bg-white text-2xl sm:text-2xl font-medium text-gray-900">{section.name}</span>
        </div>
      </div>
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {section.products &&
          section.products.map((product, idx) => {
            return <ProductCard key={idx} product={product} />;
          })}
      </ul>
    </section>
  );
};

export default function Kit({ kit, sections }) {
  return (
    <Page title={`${kit.name} Starter Kit`} description={kit.description} url={`https://www.appcity.com/kits/${kit.slug}`}>
      <div className={`space-y-12`}>
        {sections &&
          sections.map((section, idx) => {
            return <KitSection key={idx} section={section} />;
          })}
      </div>
    </Page>
  );
}

const fetchKits = async () => {
  let { data: kits, error } = await supabase.from("kits").select(`slug`);
  if (error) {
    throw error;
  }
  return kits;
};

const fetchSingleKit = async (slug) => {
  let { data: kits, error } = await supabase.from("kits").select(`*`).eq("slug", slug);
  if (error) {
    throw error;
  }
  return kits[0];
};

const fetchSections = async (kit_id) => {
  let { data: kit_sections, error } = await supabase
    .from("kit_sections")
    .select(
      `
    *,
    sections_products (*),
    products (id, name, product_logo,
      vendors (logo))
  `
    )
    .eq("kit_id", kit_id)
    .order("order");
  if (error) {
    throw error;
  }
  return kit_sections;
};

export async function getStaticPaths() {
  const kits = await fetchKits();

  const paths = kits.map((kit) => ({
    params: { slug: kit.slug },
  }));

  return { paths, fallback: "blocking" };
}

export async function getStaticProps({ params }) {
  const kit = await fetchSingleKit(params.slug);
  let sections = "";

  if (!kit) {
    return {
      notFound: true,
    };
  } else {
    sections = await fetchSections(kit.id);
  }

  return {
    props: { kit, sections },
    revalidate: 60,
  };
}
