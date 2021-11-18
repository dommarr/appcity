import "../styles/globals.css";
import SimpleReactLightbox from "simple-react-lightbox-pro";
import { Auth } from "@supabase/ui";
import { supabase } from "../utils/initSupabase";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import * as ga from "../lib/ga";
import Banner from "../components/global/banner";
import Navbar from "../components/global/navbar";
import Footer from "../components/global/footer";

// Google Analytics setup source: https://mariestarck.com/add-google-analytics-to-your-next-js-application-in-5-easy-steps/

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const { user, session } = Auth.useUser();
  //const [profile, setProfile] = useState(null);
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

  // useEffect(async () => {
  //   if (user) {
  //     let userProfile = await fetchProfile(user.id);
  //     setProfile(userProfile);
  //   }
  // }, [user]);

  // const fetchProfile = async (uid) => {
  //   let { data: users, error } = await supabase.from("users").select("*").eq("id", uid);
  //   if (error) {
  //     throw error;
  //   }
  //   return users[0];
  // };

  const hideBanner = ["/u/[handle]", "/404", "/login", "/dashboard"];
  const hideNav = ["/", "/about", "/u/[handle]", "/404", "/login", "/dashboard"];

  return (
    <Auth.UserContextProvider supabaseClient={supabase}>
      <SimpleReactLightbox>
        <div id="app-container" className={`min-h-screen flex flex-col max-w-7xl min-w-full ${router.route === "/search" ? "" : "justify-between"}`}>
          <div>
            {!hideBanner.includes(router.route) && <Banner />}
            {!hideNav.includes(router.route) && <Navbar search={true} />}
          </div>
          <Component {...pageProps} user={supabase.auth.currentUser} />
          {!hideBanner.includes(router.route) && <Footer dark={true} />}
        </div>
      </SimpleReactLightbox>
    </Auth.UserContextProvider>
  );
}

export default MyApp;
