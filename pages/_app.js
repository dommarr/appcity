import "../styles/globals.css";
import SimpleReactLightbox from "simple-react-lightbox-pro";
import { Auth } from "@supabase/ui";
import { supabase } from "../utils/initSupabase";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import * as ga from "../lib/ga";
import AppContainer from "../components/global/appContainer";

// Google Analytics setup source: https://mariestarck.com/add-google-analytics-to-your-next-js-application-in-5-easy-steps/

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const { user, session } = Auth.useUser();
  //const [profile, setProfile] = useState(null);

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
        <AppContainer>
          <Component {...pageProps} user={supabase.auth.currentUser} />
        </AppContainer>
      </SimpleReactLightbox>
    </Auth.UserContextProvider>
  );
}

export default MyApp;
