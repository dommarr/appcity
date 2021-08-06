import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../../utils/initSupabase";
import Image from "next/image";
import Container from "../global/mobilePaddingContainer";

export const siteTitle = "AppCity";

export default function StarterKitFeature({ kits }) {
  const capitalizeEveryWord = (words) => {
    let wordArray = words.split(" ");
    wordArray = wordArray
      .map((word) => {
        return word[0].toUpperCase() + word.substring(1);
      })
      .join(" ");
    return wordArray;
  };

  return (
    <section className="max-w-7xl mx-auto pb-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-5xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-extralight via-purple to-purple-extradark">Starter Kits</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 grid-rows-5 md:grid-rows-3 grid-flow-row gap-2">
          <div className="row-span-1 col-span-1 md:col-span-2 relative pt-24 pb-10 px-4 shadow-xl overflow-hidden">
            <Link href={`/kits/${kits[0].name}`}>
              <a>
                <Image src={kits[0].image} alt={`${kits[0].name} starter kit`} layout="fill" objectFit="cover" />
                <div className="absolute inset-0 bg-violet-500 opacity-50"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-violet-600 via-violet-600 opacity-90"></div>
                <div className="absolute bottom-10 left-4">
                  <div className="text-white font-semibold text-xl">{capitalizeEveryWord(kits[0].name)}</div>
                </div>
              </a>
            </Link>
          </div>
          <div className="row-span-1 col-span-1 sm:row-span-2 relative shadow-xl overflow-hidden">
            <Image src={kits[3].image} alt={`${kits[3].name} starter kit`} layout="fill" objectFit="cover" />
            <div className="absolute inset-0 bg-blue-500 opacity-50"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-blue-600 via-blue-600 opacity-90"></div>
            <div className="absolute bottom-10 left-4">
              <div className="text-white font-semibold text-xl">Coming soon: {capitalizeEveryWord(kits[3].name)}</div>
            </div>
          </div>

          <div className="row-span-1 col-span-1 sm:row-span-2 relative pt-24 pb-10 px-4 shadow-xl overflow-hidden">
            <Image src={kits[2].image} alt={`${kits[2].name} starter kit`} layout="fill" objectFit="cover" />
            <div className="absolute inset-0 bg-red-500 opacity-50"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-red-600 via-red-600 opacity-90"></div>
            <div className="absolute bottom-10 left-4">
              <div className="text-white font-semibold text-xl">Coming soon: {capitalizeEveryWord(kits[2].name)}</div>
            </div>
          </div>

          <div className="row-span-1 col-span-1 sm:row-span-2 md:row-span-1 relative pt-24 pb-10 px-4 shadow-xl overflow-hidden">
            <Image src={kits[1].image} alt={`${kits[1].name} starter kit`} layout="fill" objectFit="cover" />
            <div className="absolute inset-0 bg-amber-400 opacity-50"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-amber-400 via-amber-400 opacity-90"></div>
            <div className="absolute bottom-10 left-4">
              <div className="text-white font-semibold text-xl">Coming soon: {capitalizeEveryWord(kits[1].name)}</div>
            </div>
          </div>

          <div className="row-span-1 col-span-1 md:col-span-2 relative pt-24 pb-10 px-4 shadow-xl overflow-hidden">
            <Image src={kits[4].image} alt={`${kits[4].name} starter kit`} layout="fill" objectFit="cover" />
            <div className="absolute inset-0 bg-pink-500 opacity-50"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-pink-600 via-pink-600 opacity-90"></div>
            <div className="absolute bottom-10 left-4">
              <div className="text-white font-semibold text-xl">Coming soon: {capitalizeEveryWord(kits[4].name)}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
