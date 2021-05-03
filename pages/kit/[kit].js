// export async function getStaticPaths() {
//   const res = await supabase.from("products").select("id");
//   const products = res.data;

//   const paths = products.map((product) => ({
//     params: { id: product.id.toString() },
//   }));

//   return { paths, fallback: false };
// }

// export async function getStaticProps({ params }) {
//   const res = await supabase.from("products").select(`*, vendors (*), tiers (*)`).eq("id", params.id);
//   const product = res.data[0];

//   return {
//     props: { product },
//   };
// }
