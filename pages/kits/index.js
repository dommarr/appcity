import Footer from "../../components/global/footer";
import Header from "../../components/global/header";
import Banner from "../../components/global/banner";
import Container from "../../components/global/mobilePaddingContainer";
import Link from "next/link";
import Head from "../../components/global/head";
import { useState, useEffect } from "react";
import { supabase } from "../../utils/initSupabase";
import Loading from "../../components/global/loading";

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

  const colors = ["violet", "blue", "red", "amber", "pink"];

  useEffect(() => {
    let colorIndex = index % 5;
    setBackground(`absolute inset-0 opacity-50 bg-${colors[colorIndex]}-500`);
    setGradient(` absolute inset-0 bg-gradient-to-t from-${colors[colorIndex]}-600 via-${colors[colorIndex]}-600 opacity-90`);
  }, []);

  return (
    <div className="row-span-1 col-span-1 relative pt-24 pb-10 px-4 shadow-xl overflow-hidden">
      <Link href={`/kits/${kit.name}`}>
        <a>
          <img className="absolute inset-0 h-full w-full object-cover" src={kit.image} alt={`${kit.name} starter kit`} />
          <div className={background}></div>
          <div className={gradient}></div>
          <div className="absolute bottom-10 left-4">
            <div className="text-white font-semibold text-xl">{capitalizeEveryWord(kit.name)}</div>
          </div>
        </a>
      </Link>
    </div>
  );
};

export default function KitHome() {
  const [loading, setLoading] = useState(true);
  const [kits, setKits] = useState([""]);

  const capitalizeEveryWord = (words) => {
    let wordArray = words.split(" ");
    wordArray = wordArray
      .map((word) => {
        return word[0].toUpperCase() + word.substring(1);
      })
      .join(" ");
    return wordArray;
  };

  const fetchKits = async () => {
    let { data: kits, error } = await supabase.from("kits").select("*");
    if (error) {
      throw error;
    }
    return kits;
  };

  // Fetch on load
  useEffect(async () => {
    let kits = await fetchKits();
    setKits(kits);
    setLoading(false);
  }, []);

  if (loading) return <Loading />;

  return (
    <>
      <Banner />
      <Header style="dark" />
      <Head title="Starter Kits" description="App starter kits to hit the ground running." url="shopappcity.com/kit" />
      <Container>
        <div className="mb-20">
          <div className="bg-white">
            <div className="max-w-7xl mx-auto py-10 px-4 sm:py-12 sm:px-6 lg:px-8">
              <div className="text-center">
                <h1 className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">Starter Kits</h1>
                <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">The best apps to get your project up and running.</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {kits &&
              kits.map((kit, idx) => {
                return <KitCard key={idx} kit={kit} index={idx} />;
              })}
          </div>
        </div>
      </Container>
      <Footer dark={true} />
    </>
  );
}
