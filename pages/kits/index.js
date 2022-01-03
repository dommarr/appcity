import Container from "../../components/global/mobilePaddingContainer";
import Link from "next/link";
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
  let last = sentenceArray.length - 1;
  if (sentenceArray[last] !== ".") {
    sentenceArray.push(".");
  }
  sentenceArray = sentenceArray.join(" ");
  return sentenceArray;
};

const KitCard = ({ kit, index }) => {
  const [background, setBackground] = useState("");
  const [gradient, setGradient] = useState("");

  useEffect(() => {
    setBackground(`absolute inset-0 opacity-50 bg-${kit.color}-500`);
    setGradient(`absolute inset-0 bg-gradient-to-t from-${kit.color}-600 via-${kit.color}-600 opacity-90`);
  }, []);

  if (!kit.complete) {
    return (
      <div className="row-span-1 col-span-1 relative pt-24 pb-10 px-4 shadow-xl overflow-hidden">
        <img className="absolute inset-0 h-full w-full object-cover" src={kit.image} alt={`${kit.name} starter kit`} />
        <div className={background}></div>
        <div className={gradient}></div>
        <div className="absolute bottom-10 left-4">
          <div className="text-white font-semibold text-xl">Coming soon: {kit.name}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="row-span-1 col-span-1 relative pt-24 pb-10 px-4 shadow-xl overflow-hidden">
      <Link href={`/kits/${kit.slug}`}>
        <a>
          <img className="absolute inset-0 h-full w-full object-cover" src={kit.image} alt={`${kit.name} starter kit`} />
          <div className={background}></div>
          <div className={gradient}></div>
          <div className="absolute bottom-10 left-4">
            <div className="text-white font-semibold text-xl">{kit.name}</div>
          </div>
        </a>
      </Link>
    </div>
  );
};

let description =
  "AppCity Starter Kits are curated bundles of business apps for specific use cases. Spend less time searching for software and more time building. Whether you are a startup founder, a content creator, or just tinkering, we have the perfect kit for you.";

export default function KitHome({ kits }) {
  return (
    <Page title={"Starter Kits"} description={description} url={"https://www.appcity.com/kits"}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {kits &&
          kits.map((kit, idx) => {
            return <KitCard key={idx} kit={kit} index={idx} />;
          })}
      </div>
    </Page>
  );
}

const fetchKits = async () => {
  let { data: kits, error } = await supabase.from("kits").select("*").eq("hide", false).order("complete", { ascending: false }).order("order");
  if (error) {
    throw error;
  }
  return kits;
};

export async function getStaticProps(context) {
  const kits = await fetchKits();

  if (!kits) {
    return {
      notFound: true,
    };
  }

  return {
    props: { kits },
    revalidate: 60,
  };
}
