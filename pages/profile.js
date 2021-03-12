import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";
import { Auth, Card, Typography, Space, Button, Icon } from "@supabase/ui";
import { supabase } from "../utils/initSupabase";
import { useEffect, useState } from "react";
import Footer from "../components/footer";
import Header from "../components/header";
import Dashboard from "../components/dashboard";
import Loading from "../components/loading";
import Logo from "../components/logo";

const { Text } = Typography;

const fetcher = (url, token) =>
  fetch(url, {
    method: "GET",
    headers: new Headers({ "Content-Type": "application/json", token }),
    credentials: "same-origin",
  }).then((res) => res.json());

const SupabaseLogin = () => {
  const { user, session } = Auth.useUser();
  const { data, error } = useSWR(session ? ["/api/getUser", session.access_token] : null, fetcher);
  const router = useRouter();
  const [authView, setAuthView] = useState(router.query.view);
  console.log(authView);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") setAuthView("update_password");
      if (event === "USER_UPDATED") setTimeout(() => setAuthView("sign_in"), 1000);
      // Send session to /api/auth route to set the auth cookie.
      // NOTE: this is only needed if you're doing SSR (getServerSideProps)!
      fetch("/api/auth", {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        credentials: "same-origin",
        body: JSON.stringify({ event, session }),
      }).then((res) => res.json());
    });

    return () => {
      authListener.unsubscribe();
    };
  }, []);

  const View = () => {
    if (!user)
      return (
        <div className="min-h-screen min-w-screen bg-gradient-to-bl from-purple-extradark to-purple-extralight flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8">
            <div className="flex justify-center">
              <Link href="/">
                <a>
                  <Logo size={100} />
                </a>
              </Link>
            </div>
          </div>
          <Card className="sm:mx-auto sm:w-full sm:max-w-md">
            <Space direction="vertical" size={8}>
              <Auth supabaseClient={supabase} providers={["google", "facebook"]} view={authView} socialLayout="horizontal" socialColors socialButtonSize="tiny" />
            </Space>
          </Card>
        </div>
      );

    return (
      <>
        <div className="h-screen flex flex-col">
          <Header style="dark" />
          <div className="flex flex-1 overflow-hidden bg-gray-100">
            {user && (
              <>
                {error && <Typography.Text danger>Failed to fetch user!</Typography.Text>}
                {data && !error ? <Dashboard user={user} authView={authView} /> : <Loading />}
              </>
            )}
          </div>
        </div>
        <Footer />
      </>
    );
  };

  return <View />;
};

export default SupabaseLogin;
