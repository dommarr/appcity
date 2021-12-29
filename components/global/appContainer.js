import SimpleReactLightbox from "simple-react-lightbox-pro";
import { Auth } from "@supabase/ui";
import { supabase } from "../../utils/initSupabase";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Banner from "./banner";
import Navbar from "./navbar";
import Footer from "./footer";

function AppContainer(props) {
  const router = useRouter();
  const { children } = props;
  const { user, session } = Auth.useUser();
  //const [profile, setProfile] = useState(null);
  //const [hideBanner, setHideBanner] = useState(false)

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

  const hideBanner = ["/u/[handle]", "/404", "/login", "/dashboard", "/search", "/categories/[name]"];
  const hideNav = ["/", "/about", "/u/[handle]", "/404", "/login", "/dashboard", "/search", "/categories/[name]"];
  const hideFooter = ["/u/[handle]", "/404", "/login", "/dashboard", "/search", "/categories/[name]"];

  return (
    <div id="app-container" className={`flex flex-col max-w-7xl min-h-screen min-w-full select-none ${router.route === "/search" ? "" : "justify-between"}`}>
      <div>
        {!hideBanner.includes(router.route) && <Banner />}
        {!hideNav.includes(router.route) && <Navbar search={true} />}
      </div>
      <main className="flex-1">{children}</main>
      {!hideFooter.includes(router.route) && <Footer dark={true} />}
    </div>
  );
}

export default AppContainer;
