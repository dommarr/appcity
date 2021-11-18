import Container from "../../components/global/mobilePaddingContainer";
import Link from "next/link";
import Head from "../../components/global/head";
import { useState, useEffect } from "react";
import { supabase } from "../../utils/initSupabase";

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
  const [name, setName] = useState("");

  useEffect(() => {
    setName(capitalizeEveryWord(product.name));
  }, []);

  return (
    <Link href={`/product/${product.id}`}>
      <a>
        <li className="col-span-1 bg-white border shadow-md divide-x divide-gray-200 flex p-4">
          <div className="w-20 h-20 mr-4 flex flex-col items-center justify-center">
            <img className="w-full" src={product.product_logo ? product.product_logo : product.vendors.logo} alt={`${name} Logo`} />
          </div>

          <div className="flex items-center justify-center text-xl font-medium pl-4">{name}</div>
        </li>
      </a>
    </Link>
  );
};

const KitSection = ({ section }) => {
  const [name, setName] = useState("");

  useEffect(() => {
    setName(capitalizeEveryWord(section.name));
  }, []);

  return (
    <section className="pb-12">
      <div className="relative mb-4">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-start">
          <span className="pr-3 bg-gray-50 text-2xl sm:text-2xl font-medium text-gray-900">{name}</span>
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
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    setName(capitalizeEveryWord(kit.name));
    setDescription(formatSentence(kit.description));
  }, []);

  return (
    <>
      <Head title={`${name} Starter Kit | AppCity`} description={description} url={`https://www.appcity.com/kits/${kit.name}`} />
      <div className="bg-gray-50 pb-20">
        <Container>
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-extrabold text-gray-900 md:text-4xl md:tracking-tight">{name} Starter Kit</h1>
            <p className="max-w-xl mx-auto text-base text-gray-500">{description}</p>
          </div>
          {sections &&
            sections.map((section, idx) => {
              return <KitSection key={idx} section={section} />;
            })}
        </Container>
      </div>
    </>
  );
}

const fetchKit = async (name) => {
  let { data: kits, error } = await supabase.from("kits").select(`*`).eq("name", name);
  if (error) {
    throw error;
  }
  return kits;
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
    .eq("kit_id", kit_id);
  if (error) {
    throw error;
  }
  return kit_sections;
};

export async function getStaticPaths() {
  let { data: kits, error } = await supabase.from("kits").select("name");
  if (error) {
    throw error;
  }

  const paths = kits.map((kit) => ({
    params: { name: kit.name },
  }));

  return { paths, fallback: "blocking" };
}

export async function getStaticProps({ params }) {
  let sections = "";
  let kit = await fetchKit(params.name);
  if (kit.length === 0) {
    return {
      notFound: true,
    };
  } else {
    sections = await fetchSections(kit[0].id);
  }
  kit = kit[0];

  return {
    props: { kit, sections },
    revalidate: 60,
  };
}
