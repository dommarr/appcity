import Footer from "../../components/global/footer";
import Header from "../../components/global/header";
import Banner from "../../components/global/banner";
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
          <img className="w-20 h-20 sm:w-28 sm:h-28 mr-4" src={product.vendors.logo} alt={`${name} Logo`} />
          <div className="flex items-center justify-center text-xl sm:text-2xl font-medium pl-4">{name}</div>
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
    <section className="py-10">
      <div className="relative mb-4">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-start">
          <span className="pr-3 bg-white text-2xl sm:text-3xl font-medium text-gray-900">{name}</span>
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
      <Banner />
      <Header style="dark" />
      <Head title={`${name} Starter Kit"`} description={description} url={`shopappcity.com/kit/${kit.name}`} />
      <Container>
        <div className="mb-20">
          <div className="bg-white">
            <div className="max-w-7xl mx-auto py-10 px-4 sm:py-12 sm:px-6 lg:px-8">
              <div className="text-center">
                <h1 className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">{name} Starter Kit</h1>
                <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">{description}</p>
              </div>
            </div>
          </div>
          {sections &&
            sections.map((section, idx) => {
              return <KitSection key={idx} section={section} />;
            })}
        </div>
      </Container>
      <Footer dark={true} />
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
    products (id, name, 
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
