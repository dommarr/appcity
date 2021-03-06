import "../styles/globals.css";
import SimpleReactLightbox from "simple-react-lightbox-pro";
import { Auth } from "@supabase/ui";
import { supabase } from "../utils/initSupabase";

function MyApp({ Component, pageProps }) {
  return (
    <Auth.UserContextProvider supabaseClient={supabase}>
      <SimpleReactLightbox>
        <Component {...pageProps} />
      </SimpleReactLightbox>
    </Auth.UserContextProvider>
  );
}

export default MyApp;
