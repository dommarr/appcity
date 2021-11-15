import Link from "next/link";
import useSWR from "swr";
import { Auth, Card, Typography, Space, Button, Icon } from "@supabase/ui";
import { supabase } from "../utils/initSupabase";
import { useEffect, useState } from "react";

const { Text } = Typography;

const Social = () => {
  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <a href="/" className="w-full inline-flex justify-center py-2 px-4 border border-google shadow-sm bg-google text-sm font-medium text-white hover:bg-google-light">
            <span className="sr-only">Sign in with Google</span>
            <svg className="w-5 h-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
              <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
            </svg>
          </a>
        </div>
        <div>
          <a href="/" className="w-full inline-flex justify-center py-2 px-4 border border-facebook shadow-sm bg-facebook text-sm font-medium text-white hover:bg-facebook-light">
            <span className="sr-only">Sign in with Facebook</span>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>
    </div>
  );
};

const SignUp = ({ setAuthView }) => {
  return (
    <form className="space-y-6" action="#" method="POST">
      <div>
        <div className="flex place-content-between items-center mb-4">
          <h3 className="text-md text-black font-bold">Sign up</h3>
        </div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <div className="mt-1">
          <input id="email" name="email" type="email" autocomplete="email" required className="appearance-none block w-full px-3 py-2 border border-gray-300 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="mt-1">
          <input id="password" name="password" type="password" autocomplete="current-password" required className="appearance-none block w-full px-3 py-2 border border-gray-300 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input id="remember_me" name="remember_me" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" />
          <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">
            Remember me
          </label>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <button type="submit" className="w-full flex justify-center py-2 px-4 mb-4 border border-transparent shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Sign up
        </button>
        <button className="text-sm text-indigo-600 font-medium hover:text-indigo-500" onClick={() => setAuthView("magic_link")}>
          Already have an account? Sign in
        </button>
      </div>
    </form>
  );
};

const SignIn = ({ setAuthView }) => {
  return (
    <form className="space-y-6" action="#" method="POST">
      <div>
        <div className="flex place-content-between items-center mb-4">
          <h3 className="text-md text-black font-bold">Sign in</h3>
          <button className="text-sm font-medium text-indigo-600 hover:text-indigo-500" onClick={() => setAuthView("magic_link")}>
            Passwordless sign in
          </button>
        </div>

        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <div className="mt-1">
          <input id="email" name="email" type="email" autocomplete="email" required className="appearance-none block w-full px-3 py-2 border border-gray-300 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="mt-1">
          <input id="password" name="password" type="password" autocomplete="current-password" required className="appearance-none block w-full px-3 py-2 border border-gray-300 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input id="remember_me" name="remember_me" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" />
          <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">
            Remember me
          </label>
        </div>

        <div className="text-sm">
          <button className="font-medium text-indigo-600 hover:text-indigo-500" onClick={() => setAuthView("forgot_password")}>
            Forgot your password?
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <button type="submit" className="w-full flex justify-center py-2 px-4 mb-4 border border-transparent shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Sign in
        </button>
        <button className="text-sm text-indigo-600 font-medium hover:text-indigo-500" onClick={() => setAuthView("sign_up")}>
          Don't have an account? Sign up
        </button>
      </div>
    </form>
  );
};

const MagicLink = ({ setAuthView }) => {
  return (
    <form className="space-y-6" action="#" method="POST">
      <div>
        <div className="flex place-content-between items-center mb-4">
          <h3 className="text-md text-black font-bold">Passwordless sign in</h3>
          <button className="text-sm font-medium text-indigo-600 hover:text-indigo-500" onClick={() => setAuthView("sign_in")}>
            Sign in with password
          </button>
        </div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <div className="mt-1">
          <input id="email" name="email" type="email" autocomplete="email" required className="appearance-none block w-full px-3 py-2 border border-gray-300 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
      </div>
      <div className="flex items-center">
        <input id="remember_me" name="remember_me" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" />
        <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">
          Remember me
        </label>
      </div>
      <div className="flex flex-col items-center">
        <button type="submit" className="w-full flex justify-center py-2 px-4 mb-4 border border-transparent shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Send magic link
        </button>
        <button className="text-sm text-indigo-600 font-medium hover:text-indigo-500" onClick={() => setAuthView("sign_up")}>
          Don't have an account? Sign up
        </button>
      </div>
    </form>
  );
};

const MagicLinkConfirm = () => {
  return (
    <div className="flex flex-col justify-center items-center px-4 text-center font-medium">
      <span>Check your email for the magic link.</span>
      <span>Follow the link to sign in.</span>
    </div>
  );
};

const ForgotPassword = ({ setAuthView }) => {
  return (
    <form className="space-y-6" action="#" method="POST">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <div className="mt-1">
          <input id="email" name="email" type="email" autocomplete="email" required className="appearance-none block w-full px-3 py-2 border border-gray-300 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
      </div>
      <div className="flex flex-col items-center">
        <button type="submit" className="w-full flex justify-center py-2 px-4 mb-4 border border-transparent shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Send password reset instructions
        </button>
        <button className="text-sm font-medium text-indigo-600 hover:text-indigo-500" onClick={() => setAuthView("sign_in")}>
          Go back to sign in
        </button>
      </div>
    </form>
  );
};

const fetcher = (url, token) =>
  fetch(url, {
    method: "GET",
    headers: new Headers({ "Content-Type": "application/json", token }),
    credentials: "same-origin",
  }).then((res) => res.json());

const Login = () => {
  const { user, session } = Auth.useUser();
  const { data, error } = useSWR(session ? ["/api/getUser", session.access_token] : null, fetcher);
  const [authView, setAuthView] = useState("magic_link");

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
        // <Space direction="vertical" size={8}>
        //   <div>
        //     <img src="https://app.supabase.io/img/supabase-dark.svg" width="96" />
        //     <Typography.Title level={3}>Welcome to Supabase Auth</Typography.Title>
        //   </div>
        //   <Auth supabaseClient={supabase} providers={["google", "facebook"]} view={authView} socialLayout="horizontal" socialButtonSize="xlarge" />
        // </Space>

        <div className="bg-purple h-full min-h-screen flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <img className="mx-auto h-12 w-auto" src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg" alt="Workflow" />
          </div>
          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:px-10">
              {authView === "sign_up" && (
                <>
                  <Social />
                  <SignUp setAuthView={setAuthView} />
                </>
              )}
              {authView === "sign_in" && (
                <>
                  <Social />
                  <SignIn setAuthView={setAuthView} />
                </>
              )}
              {authView === "magic_link" && (
                <>
                  <Social />
                  <MagicLink setAuthView={setAuthView} />
                </>
              )}
              {authView === "forgot_password" && (
                <>
                  <Social />
                  <ForgotPassword setAuthView={setAuthView} />
                </>
              )}
              {authView === "magic_link_confirm" && <MagicLinkConfirm />}
            </div>
          </div>
        </div>
      );

    return (
      <Space direction="vertical" size={6}>
        {authView === "update_password" && <Auth.UpdatePassword supabaseClient={supabase} />}
        {user && (
          <>
            <Typography.Text>You're signed in</Typography.Text>
            <Typography.Text strong>Email: {user.email}</Typography.Text>

            <Button icon={<Icon type="LogOut" />} type="outline" onClick={() => supabase.auth.signOut()}>
              Log out
            </Button>
            {error && <Typography.Text danger>Failed to fetch user!</Typography.Text>}
            {data && !error ? (
              <>
                <Typography.Text type="success">User data retrieved server-side (in API route):</Typography.Text>

                <Typography.Text>
                  <pre>{JSON.stringify(data, null, 2)}</pre>
                </Typography.Text>
              </>
            ) : (
              <div>Loading...</div>
            )}

            <Typography.Text>
              <Link href="/profile">
                <a>SSR example with getServerSideProps</a>
              </Link>
            </Typography.Text>
          </>
        )}
      </Space>
    );
  };

  return <View />;
};

export default Login;
