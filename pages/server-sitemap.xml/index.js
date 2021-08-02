import { getServerSideSitemap } from "next-sitemap";
import { supabase } from "../../utils/initSupabase";
import { getPosts } from "../../lib/posts";

export async function getServerSideProps(ctx) {
  const res = await supabase.from("products").select("id").eq("complete", true);
  const products = res.data;
  const res2 = await supabase.from("kits").select(`name`);
  const kits = res2.data;
  const posts = await getPosts();

  const productFields = products.map((product) => ({ loc: `https://www.appcity.com/product/${product.id}`, lastmod: new Date().toISOString() }));
  const kitFields = kits.map((kit) => ({ loc: `https://www.appcity.com/kits/${kit.name}`, lastmod: new Date().toISOString() }));
  const postFields = posts.map((post) => ({ loc: `https://www.appcity.com/blog/${post.slug}`, lastmod: new Date().toISOString() }));

  const fields = productFields.concat(kitFields, postFields);

  return getServerSideSitemap(ctx, fields);
}

export default function Sitemap() {}