import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
import Link from "next/link";

// export default function Test({ products }) {
//   console.log(products);
//   return (
//     <div>
//       <h1>SaaS Products</h1>
//       <ul>
//         {products.map((product) => (
//           <li key={product.id}>
//             <Link href={`/product/${product.id}`}>
//               <a>{product.name}</a>
//             </Link>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export async function getStaticProps(context) {
//   const res = await supabase.from("products").select("*");
//   const products = res.data;

//   return {
//     props: { products },
//   };
// }
