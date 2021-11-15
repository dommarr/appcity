import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";
import { Auth, Card, Typography, Space, Button, Icon } from "@supabase/ui";
import { supabase } from "../utils/initSupabase";
import { useEffect, useState } from "react";
import Head from "../components/global/head";
import Loading from "../components/global/loading";
import Logo from "../components/graphics/logo/Logo";
import LogoWhite from "../components/graphics/logo/LogoWhite";
import { Loader } from "react-feather";

const { Text } = Typography;

const fetcher = (url, token) =>
  fetch(url, {
    method: "GET",
    headers: new Headers({ "Content-Type": "application/json", token }),
    credentials: "same-origin",
  }).then((res) => res.json());

export default function Login() {
  const { user, session } = Auth.useUser();
  const { data, error } = useSWR(session ? ["/api/getUser", session.access_token] : null, fetcher);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

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
    setLoading(false);
    return () => {
      authListener.unsubscribe();
    };
  }, []);

  if (user) {
    router.replace("/dashboard");
    return (
      <div className="min-h-screen min-w-screen bg-gradient-to-b from-purple-extradark via-purple to-purple-extralight flex flex-col sm:justify-center pt-16 sm:py-12 sm:px-6 lg:px-8">
        <div className="h-full w-full flex flex-col items-center justify-center">
          <Loader size={50} className="animate-spin text-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen min-w-screen bg-gradient-to-b from-purple-extradark via-purple to-purple-extralight flex flex-col sm:justify-center pt-16 sm:py-12 sm:px-6 lg:px-8">
      <Head title="Sign In or Sign Up | AppCity" description="Log into your AppCity profile or create an account." url="https://www.appcity.com/login" />
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8">
        <div className="flex flex-col justify-center items-center space-y-4">
          <Link href="/">
            <a>
              <LogoWhite size={60} />
            </a>
          </Link>
          {router.query.view !== "sign_up" && (
            <div className="text-white flex space-x-1">
              <h3>Sign in or</h3>
              <button onClick={() => router.push("/login?view=sign_up")} className="underline hover:no-underline">
                create an account
              </button>
            </div>
          )}
        </div>
      </div>
      <Card className="sm:mx-auto sm:w-full sm:max-w-md">
        <Space direction="vertical" size={8}>
          {/* <Auth supabaseClient={supabase} view={authView} providers={["google", "facebook"]} socialLayout="horizontal" socialColors socialButtonSize="tiny" /> */}
          <Auth supabaseClient={supabase} view={router.query.view} providers={["google", "facebook"]} socialLayout="horizontal" socialColors socialButtonSize="tiny" />
        </Space>
      </Card>
    </div>
  );
}
