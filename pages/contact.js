import Footer from "../components/global/footer";
import Header from "../components/global/header";
import Head from "../components/global/head";
import { useState } from "react";

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  let [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    message: "",
  });

  let handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    form[name] = value;
    setForm(form);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const res = await fetch("/api/contact", {
      body: JSON.stringify({
        From: "contact.form@shopappcity.com",
        To: "contact@shopappcity.com",
        ReplyTo: form.email,
        Subject: "Contact Form Message",
        TextBody: `
            From: ${form.first_name} ${form.last_name}
            Email: ${form.email}
            Message:
            ${form.message}
            `,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    const result = await res.json();
    if (result.ErrorCode === 0) {
      setLoading(false);
      setSuccess(true);
      setTimeout(function () {
        setSuccess(false);
      }, 3000);
    } else {
      setLoading(false);
      setError(true);
      setTimeout(function () {
        setError(false);
      }, 3000);
    }
  };

  return (
    <>
      <Header style="dark" />
      <Head title="Contact AppCity" description="Drop us a line and we'll get back to you." url="shopappcity.com/contact" />
      <div className="bg-white py-16 px-4 overflow-hidden sm:px-6 lg:px-8 lg:py-24">
        <div className="relative max-w-xl mx-auto">
          <svg className="absolute left-full transform translate-x-1/2" width="404" height="404" fill="none" viewBox="0 0 404 404" aria-hidden="true">
            <defs>
              <pattern id="85737c0e-0916-41d7-917f-596dc7edfa27" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="4" height="4" className="text-gray-200" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="404" height="404" fill="url(#85737c0e-0916-41d7-917f-596dc7edfa27)" />
          </svg>
          <svg className="absolute right-full bottom-0 transform -translate-x-1/2" width="404" height="404" fill="none" viewBox="0 0 404 404" aria-hidden="true">
            <defs>
              <pattern id="85737c0e-0916-41d7-917f-596dc7edfa27" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="4" height="4" className="text-gray-200" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="404" height="404" fill="url(#85737c0e-0916-41d7-917f-596dc7edfa27)" />
          </svg>
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">Contact us</h2>
            <p className="mt-4 text-lg leading-6 text-gray-500">Thanks for your interest. Drop us a line and we'll be in touch.</p>
          </div>
          <div className="mt-12">
            {!loading && !success && !error && (
              <form onSubmit={handleSubmit} method="POST" className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                    First name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="first_name"
                      id="first_name"
                      autoComplete="given-name"
                      onChange={handleChange}
                      className="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                    Last name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="last_name"
                      id="last_name"
                      autoComplete="family-name"
                      onChange={handleChange}
                      className="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      onChange={handleChange}
                      className="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="message"
                      name="message"
                      rows="4"
                      onChange={handleChange}
                      className="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
                    ></textarea>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent shadow-sm text-base font-medium text-white bg-purple hover:bg-purple-extradark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Let's talk
                  </button>
                </div>
              </form>
            )}
            {loading && (
              <div className="text-center">
                <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl animate-pulse">Sending...</h2>
              </div>
            )}
            {success && (
              <div className="text-center">
                <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">Sent!</h2>
                <p className="mt-4 text-lg leading-6 text-gray-500">We'll be in touch.</p>
              </div>
            )}
            {error && (
              <div className="text-center">
                <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">Uh oh!</h2>
                <p className="mt-4 text-lg leading-6 text-gray-500">There was an error. Please try again. The form will reset shortly.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer dark={true} />
    </>
  );
}
