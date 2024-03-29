import { useState, useEffect } from "react";
import { supabase } from "../../utils/initSupabase";
import { Auth } from "@supabase/ui";
import Loading from "./sectionLoading";
import DiscountStatus from "./discountStatus";

export default function Account(props) {
  const [profile, setProfile] = useState(null);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState("");
  const [reviewCount, setReviewCount] = useState(0);

  async function getProfile(id) {
    try {
      let response = await supabase.from("users").select("*").eq("id", id);
      return response.data;
    } catch (err) {
      alert(err);
    }
  }

  async function updateProfile(event) {
    event.preventDefault();
    try {
      const { data, error } = await supabase.from("users").update({ first_name: firstname, last_name: lastname, email: email, title: title, company: company }).eq("id", profile.id);
      if (error) {
        throw error;
      }
      if (data) {
        setSuccess("Account updated.");
        setTimeout(function () {
          setSuccess("");
        }, 2000);
      }
    } catch (err) {
      alert(err);
    }
  }

  function toggleVendor() {
    props.handleVendor(!props.vendor);
  }

  // Fetch on load
  useEffect(async () => {
    async function fetchProfile() {
      try {
        const profileData = await getProfile(props.user.id);
        if (profileData) {
          setProfile(profileData[0]);
          profileData[0]?.first_name ? setFirstname(profileData[0].first_name) : "";
          profileData[0]?.last_name ? setLastname(profileData[0].last_name) : "";
          profileData[0]?.email ? setEmail(profileData[0].email) : "";
          profileData[0]?.title ? setTitle(profileData[0].title) : "";
          profileData[0]?.company ? setCompany(profileData[0].company) : "";
          // profileData[0].vendor ? props.handleVendor(profileData[0].vendor) : "";
          // profileData[0].admin ? props.handleAdmin(profileData[0].admin) : "";
        }
      } catch (error) {
        throw error;
      }
    }
    fetchProfile();
    let reviews = await fetchReviewCount(props.user.id);
    setReviewCount(reviews.length);
  }, []);

  const fetchReviewCount = async (uid) => {
    let { data: reviews, error } = await supabase.from("reviews").select("id").eq("user", uid);
    if (error) {
      throw error;
    }
    return reviews;
  };

  if (!profile) return <Loading />;

  return (
    <section className="md:py-4 space-y-4">
      <h1 className="text-2xl font-semibold text-gray-900">Your account</h1>
      <div className="shadow sm:overflow-hidden">
        <div className="bg-white py-6 px-4 sm:p-6">
          <div>
            <h2 id="account_details_heading" className="text-lg leading-6 font-medium text-gray-900 mb-6">
              Discount status
            </h2>
            <DiscountStatus reviewCount={reviewCount} />
          </div>
        </div>
      </div>
      <form onSubmit={updateProfile}>
        <div className="shadow sm:overflow-hidden">
          <div className="bg-white py-6 px-4 sm:p-6">
            <div>
              <h2 id="account_details_heading" className="text-lg leading-6 font-medium text-gray-900">
                Account details
              </h2>
            </div>
            <div className="mt-6 grid grid-cols-4 gap-6">
              <div className="col-span-4 sm:col-span-2">
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                  First name
                </label>
                <input
                  type="text"
                  name="first_name"
                  id="first_name"
                  placeholder="Larry"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  autoComplete="given-name"
                  className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
                />
              </div>
              <div className="col-span-4 sm:col-span-2">
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                  Last name
                </label>
                <input
                  type="text"
                  name="last_name"
                  id="last_name"
                  placeholder="David"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  autoComplete="family-name"
                  className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
                />
              </div>
              <div className="col-span-4 sm:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  placeholder="Barista"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
                />
              </div>
              <div className="col-span-4 sm:col-span-2">
                <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  id="company"
                  placeholder="Latte Larry's"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
                />
              </div>
            </div>
          </div>
          <div className="flex px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              type="submit"
              className="bg-purple border border-transparent shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-purple-extradark focus:outline-none focus:ring-0"
            >
              Update
            </button>
            <div className="flex items-center ml-4">{success}</div>
          </div>
        </div>
      </form>
      <div className="shadow sm:overflow-hidden">
        <div className="bg-white py-6 px-4 sm:p-6">
          <div>
            <h2 id="account_details_heading" className="text-lg leading-6 font-medium text-gray-900">
              Settings
            </h2>
          </div>
          <div className="grid grid-cols-8 gap-6">
            {/* <div className="col-span-8 sm:col-span-4 ">
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => toggleVendor()}
                  className="flex-shrink-0 group relative rounded-full inline-flex items-center justify-center h-5 w-10 cursor-pointer focus:outline-none focus:ring-0"
                  aria-pressed="false"
                >
                  <span className="sr-only">Toggle app developer on off</span>
                  <span aria-hidden="true" className="pointer-events-none absolute bg-white w-full h-full rounded-md"></span>

                  <span
                    aria-hidden="true"
                    className={`${props.vendor ? "bg-purple" : "bg-gray-200"} pointer-events-none absolute h-4 w-9 mx-auto rounded-full transition-colors ease-in-out duration-200`}
                  ></span>

                  <span
                    aria-hidden="true"
                    className={`${
                      props.vendor ? "translate-x-5" : "translate-x-0"
                    } pointer-events-none absolute left-0 inline-block h-5 w-5 border border-gray-200 rounded-full bg-white shadow transform ring-0 transition-transform ease-in-out duration-200`}
                  ></span>
                </button>
                <span className="ml-3" id="app-developer-label">
                  <span className="text-sm font-medium text-gray-900">App developer</span>
                </span>
              </div>
            </div> */}
            <div className="col-span-8 sm:col-span-4 lg:col-span-3 xl:col-span-2 row-start-2">
              <Auth.UpdatePassword supabaseClient={supabase} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
