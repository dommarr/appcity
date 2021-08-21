import { supabase } from "../../utils/initSupabase";
import Image from "next/image";
import Logo from "../../components/graphics/logo/Logo";
import Link from "next/link";
import Head from "../../components/global/head";

export default function Share({ share, favorites }) {
  const background = (ang, one, two, three) => {
    let backgroundStyle = "";
    if (ang === "none" || (share.color_two_disabled && share.color_three_disabled)) {
      backgroundStyle = { backgroundColor: `${one}` };
    } else if (share.color_two_disabled || share.color_three_disabled) {
      if (share.color_two_disabled) {
        backgroundStyle = { backgroundImage: `linear-gradient(${ang}, ${one}, ${three})` };
      } else if (share.color_three_disabled) {
        backgroundStyle = { backgroundImage: `linear-gradient(${ang}, ${one}, ${two})` };
      }
    } else {
      backgroundStyle = { backgroundImage: `linear-gradient(${ang}, ${one}, ${two}, ${three})` };
    }
    return backgroundStyle;
  };

  return (
    <div className={`flex-none flex-col items-center justify-between py-10 px-4 min-h-screen w-screen`} style={background(share.angle, share.color_one, share.color_two, share.color_three)}>
      <Head title={`${share.display_name}'s Favorite Business Apps | AppCity`} description={share.blurb} url={`https://www.appcity.com/u/${share.handle}`} />
      {favorites?.length > 0 && (
        <div className="flex flex-col items-center justify-between h-full space-y-8" style={{ color: share.text_color }}>
          {share.header_link !== "" && (
            <a target="_blank" href={share.header_link} className="flex flex-col items-center justify-center space-y-1 px-14 filter drop-shadow">
              {share.display_image && (
                <div className="w-24 h-24 aspect-w-1">
                  <Image
                    src={share.display_image}
                    alt={share.display_name}
                    placeholder="blur"
                    blurDataURL={`/_next/image?url=${share.display_image}&w=16&q=1`}
                    layout="fill"
                    objectFit="contain"
                    className="rounded-full"
                  />
                </div>
              )}
              {!share.display_image && (
                <div className="w-24 h-24 aspect-w-1">
                  <UserCircleIcon />
                </div>
              )}
              <h3 className="font-medium">{share.display_name}</h3>
              <p className="text-sm font-light text-center">{share.blurb}</p>
            </a>
          )}
          {share.header_link === "" && (
            <div className="flex flex-col items-center justify-center space-y-1 px-14 filter drop-shadow">
              {share.display_image && (
                <div className="w-24 h-24 aspect-w-1">
                  <Image
                    src={share.display_image}
                    alt={share.display_name}
                    placeholder="blur"
                    blurDataURL={`/_next/image?url=${share.display_image}&w=16&q=1`}
                    layout="fill"
                    objectFit="contain"
                    className="rounded-full"
                  />
                </div>
              )}
              {!share.display_image && (
                <div className="w-24 h-24 aspect-w-1">
                  <UserCircleIcon />
                </div>
              )}
              <h3 className="font-medium">{share.display_name}</h3>
              <p className="text-sm font-light">{share.blurb}</p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-x-8 gap-y-6 max-w-sm">
            {favorites &&
              favorites.map((favorite, idx) => {
                let product = favorite.products;
                let logo = favorite.products.product_logo ? favorite.products.product_logo : favorite.products.vendors.logo;
                let even = idx % 2 == 0 ? true : false;
                let used_for = favorite.used_for;
                let length = favorite.used_for?.length;
                let link = favorite.referral_link ? favorite.referral_link : `https://www.appcity.com/product/${favorite.products.id}`;
                return (
                  <div key={favorite.id} className={`col-span-1 flex flex-col justify-end ${even ? "items-center" : "items-center"}`}>
                    <a target="_blank" href={link} className="flex flex-col items-center justify-center space-y-2 filter drop-shadow">
                      <h5 className={`${length > 40 ? "text-sm" : "text-sm"} font-light text-center`}>{used_for}</h5>
                      <div className="w-20 h-20 aspect-w-1">
                        <Image src={logo} alt={product.name} placeholder="blur" blurDataURL={`/_next/image?url=${logo}&w=16&q=1`} layout="fill" objectFit="contain" className="rounded-2xl" />
                      </div>
                      <h5 className="text-lg text-center">{product.name}</h5>
                    </a>
                  </div>
                );
              })}
          </div>
          <Link href="/">
            <a className="flex flex-col items-center justify-center">
              <Logo size={30} alt="AppCity" className="filter drop-shadow" />
              <div className="relative flex stroke-1 stroke-current filter drop-shadow">
                <p className={`font-logo pl-1 text-2xl font-light`}>app</p>
                <span className={`font-logo pr-2 text-2xl font-semibold`}>city</span>
              </div>
            </a>
          </Link>
        </div>
      )}
    </div>
  );
}

const compare = (a, b) => {
  const tierNumA = a.order;
  const tierNumB = b.order;

  let comparison = 0;
  if (tierNumA > tierNumB) {
    comparison = 1;
  } else if (tierNumA < tierNumB) {
    comparison = -1;
  }
  return comparison;
};

const fetchShare = async (handle) => {
  let { data: shares, error } = await supabase.from("shares").select("*").eq("handle", handle);
  if (error) {
    throw error;
  }
  return shares;
};

const fetchFavorites = async (uid) => {
  let { data: favorites, error } = await supabase.from("favorites").select("*, products(*, vendors(*))").eq("user_id", uid);
  if (error) {
    throw error;
  }
  return favorites;
};

const processFavs = (arr) => {
  let shared = arr.filter((item) => item.share);
  let sorted = shared.sort(compare);
  let six = sorted.filter((item, index) => index < 6);
  return six;
};

export async function getStaticPaths() {
  let { data: shares, error } = await supabase.from("shares").select("handle").eq("publish", true);
  if (error) {
    throw error;
  }
  const paths = shares?.map((share) => ({
    params: { handle: share.handle },
  }));

  return { paths, fallback: "blocking" };
}

export async function getStaticProps({ params }) {
  let favorites = [];
  let share = await fetchShare(params.handle);
  if (share?.length === 0) {
    return {
      notFound: true,
    };
  } else {
    favorites = await fetchFavorites(share[0].user_id);
    if (favorites?.length === 0) {
      return {
        notFound: true,
      };
    } else {
      favorites = processFavs(favorites);
    }
  }
  share = share[0];

  return {
    props: { share, favorites },
    revalidate: 60,
  };
}
