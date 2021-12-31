import { getServerSideSitemap } from "next-sitemap";
import { supabase } from "../../utils/initSupabase";
import { getPosts } from "../../lib/posts";

const fetchCategories = async () => {
  let { data: categories, error } = await supabase.from("categories").select(`slug`);
  if (error) {
    throw error;
  }
  return categories;
};

export async function getServerSideProps(ctx) {
  const res = await supabase.from("products").select("id").eq("complete", true);
  const products = res.data;
  const res2 = await supabase.from("kits").select(`slug`);
  const kits = res2.data;
  const res3 = await supabase.from("shares").select("handle").eq("publish", true);
  const shares = res3.data;
  const posts = await getPosts();
  const categories = await fetchCategories();

  const productFields = products.map((product) => ({ loc: `https://www.appcity.com/product/${product.id}`, lastmod: new Date().toISOString() }));
  const kitFields = kits.map((kit) => ({ loc: `https://www.appcity.com/kits/${kit.slug}`, lastmod: new Date().toISOString() }));
  const postFields = posts.map((post) => ({ loc: `https://www.appcity.com/blog/${post.slug}`, lastmod: new Date().toISOString() }));
  const shareFields = shares.map((share) => ({ loc: `https://www.appcity.com/u/${share.handle}`, lastmod: new Date().toISOString() }));
  const categoryFields = categories.map((category) => ({ loc: `https://www.appcity.com/categories/${category.slug}`, lastmod: new Date().toISOString() }));

  const fields = productFields.concat(kitFields, postFields, shareFields, categoryFields);

  return getServerSideSitemap(ctx, fields);
}

export default function Sitemap() {}
