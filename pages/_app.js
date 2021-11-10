import "../styles/globals.css";
import SimpleReactLightbox from "simple-react-lightbox-pro";
import { Auth } from "@supabase/ui";
import { supabase } from "../utils/initSupabase";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import * as ga from "../lib/ga";
import Banner from "../components/global/banner";

// Google Analytics setup source: https://mariestarck.com/add-google-analytics-to-your-next-js-application-in-5-easy-steps/

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  //const [hideBanner, setHideBanner] = useState(false)

  useEffect(() => {
    const handleRouteChange = (url) => {
      ga.pageview(url);
    };
    //When the component is mounted, subscribe to router changes
    //and log those page views
    router.events.on("routeChangeComplete", handleRouteChange);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <Auth.UserContextProvider supabaseClient={supabase}>
      <SimpleReactLightbox>
        {router.route !== "/u/[handle]" && <Banner />}
        <Component {...pageProps} />
      </SimpleReactLightbox>
    </Auth.UserContextProvider>
  );
}

export default MyApp;
