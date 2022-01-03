import { useState, useEffect } from "react";
import { Loader } from "react-feather";
import { ExternalLinkIcon } from "@heroicons/react/outline";
import { Switch } from "@headlessui/react";
import { supabase } from "../../../utils/initSupabase";

export default function KitForm({ kit, setKit }) {
  // form submission states
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState();
  const [message, setMessage] = useState();
  // image states
  const [imageState, setImageState] = useState("none");
  // kit form
  const [kitName, setKitName] = useState("");
  const [kitSlug, setKitSlug] = useState("");
  const [kitDescription, setKitDescription] = useState("");
  const [kitImage, setKitImage] = useState("");
  const [kitColor, setKitColor] = useState("");
  const [kitOrder, setKitOrder] = useState(null);
  const [kitComplete, setKitComplete] = useState(false);
  const [kitHide, setKitHide] = useState(false);

  // Fetch on load
  useEffect(() => {
    if (kit) {
      kit.name && setKitName(kit.name);
      kit.slug && setKitSlug(kit.slug);
      kit.description && setKitDescription(kit.description);
      kit.image && setKitImage(kit.image);
      kit.color && setKitColor(kit.color);
      kit.order && setKitOrder(kit.order);
      kit.complete && setKitComplete(kit.complete);
      kit.hide && setKitHide(kit.hide);
    } else {
      setKitName("");
      setKitSlug("");
      setKitDescription("");
      setKitImage("");
      setKitColor("");
      setKitOrder(null);
      setKitComplete(false);
      setKitHide(false);
    }
  }, [kit]);

  const signImageUrl = async (path) => {
    let { data, error } = await supabase.storage.from("website_images").createSignedUrl(path, 283824000);
    if (error) {
      throw error;
    }
    return data.signedURL;
  };

  const handleImageUpload = async (e) => {
    setImageState("uploading");
    let path = `starter_kit_images/${kitSlug}`;
    let { data, error } = await supabase.storage.from("website_images").upload(path, e.target.files[0], {
      upsert: true,
    });
    if (error) {
      handleImageFailure();
      throw error;
    }
    if (data) {
      let url = await signImageUrl(path);
      handleImageSuccess(url);
    }
  };

  const handleImageSuccess = (url) => {
    setImageState("success");
    setKitImage(url);
    setTimeout(function () {
      setImageState("none");
    }, 3000);
  };

  const handleImageFailure = () => {
    setImageState("failure");
    setTimeout(function () {
      setImageState("none");
    }, 3000);
  };

  const createKit = async (arr) => {
    let { data, error } = await supabase.from("kits").insert(arr);
    if (error) {
      handleFailure();
      throw error;
    }
    return data[0];
  };

  const editKit = async (arr) => {
    let { data, error } = await supabase.from("kits").update(arr).eq("id", kit.id);
    if (error) {
      handleFailure();
      throw error;
    }
    return data[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    let kitObj = {
      name: kitName,
      slug: kitSlug,
      description: kitDescription,
      image: kitImage,
      color: kitColor,
      order: kitOrder,
      complete: kitComplete,
      hide: kitHide,
    };
    let kitRes = "";
    if (kit) {
      kitRes = await editKit([kitObj]);
    } else {
      kitRes = await createKit([kitObj]);
    }
    if (kitRes) {
      setKit(kitRes);
      handleSuccess();
    }
  };

  const handleSuccess = () => {
    setUpdating(false);
    setSuccess(true);
    setMessage("Saved successfully.");
    setTimeout(function () {
      setMessage("");
    }, 4000);
  };

  const handleFailure = () => {
    setUpdating(false);
    setSuccess(false);
    setMessage("There was an error. Please try again.");
    setTimeout(function () {
      setMessage("");
    }, 4000);
  };

  return (
    <form
      onSubmit={(e) => {
        handleSubmit(e);
      }}
      className="shadow"
    >
      <div className="bg-white py-6 px-4 sm:p-6">
        <div className="flex space-x-2 items-center">
          <h2 id="company-details-heading" className="text-lg leading-6 font-medium text-gray-900">
            {kit ? "Edit starter kit" : "Create a new starter kit"}
          </h2>
          {kit && (
            <a target="_blank" href={`kits/${kit.slug}`}>
              <ExternalLinkIcon className="h5 w-5 text-purple" />
            </a>
          )}
        </div>
        <div className="mt-6 grid grid-cols-4 gap-6">
          <div className="col-span-4 sm:col-span-2">
            <label htmlFor="kitName" className="block text-sm font-medium text-gray-700">
              Kit name
            </label>
            <input
              type="text"
              name="kitName"
              id="kitName"
              placeholder="Venture-Backed Startup Starter Kit"
              value={kitName}
              onChange={(e) => setKitName(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
            />
          </div>
          <div className="col-span-4 sm:col-span-2">
            <label htmlFor="kitSlug" className="block text-sm font-medium text-gray-700">
              Kit slug
            </label>
            <input
              type="text"
              name="kitSlug"
              id="kitSlug"
              placeholder="venture-startup"
              value={kitSlug}
              onChange={(e) => setKitSlug(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
            />
          </div>
          <div className="col-span-4 sm:col-span-2">
            <label htmlFor="kitDescription" className="block text-sm font-medium text-gray-700">
              Kit description
            </label>
            <textarea
              type="text"
              name="kitDescription"
              id="kitDescription"
              required
              value={kitDescription}
              onChange={(e) => setKitDescription(e.target.value)}
              className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
            />
          </div>
          <div className="col-span-4 sm:col-span-2">
            <label htmlFor="kitImage" className="block text-sm font-medium text-gray-700">
              Kit image
            </label>
            <div className="flex flex-col space-y-3">
              <input
                type="url"
                name="kitImage"
                id="kitImage"
                required
                value={kitImage}
                onChange={(e) => setKitImage(e.target.value)}
                className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
              />
              {imageState === "none" && kitSlug && <input type="file" onChange={handleImageUpload} className="block w-full focus:outline-none focus:ring-gray-900 focus:border-gray-900 text-xs" />}
              {imageState === "none" && !kitSlug && <p className="text-xs">Fill in kit slug to add an image.</p>}
              {imageState === "uploading" && (
                <div className="text-purple px-4">
                  <Loader className="h-5 w-5 animate-spin" />
                </div>
              )}
              {imageState === "success" && <span className={`flex items-center text-green-600 text-sm`}>Image uploaded successfully.</span>}
              {imageState === "failure" && <span className={`flex items-center text-red-600 text-sm`}>There was an error. Please try again.</span>}
            </div>
          </div>
          <div className="col-span-4 sm:col-span-2">
            <label htmlFor="kitColor" className="block text-sm font-medium text-gray-700">
              Kit color
            </label>
            <select
              type="text"
              name="kitColor"
              id="kitColor"
              placeholder="amber"
              required
              value={kitColor}
              onChange={(e) => setKitColor(e.target.value)}
              className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
            >
              <option value="gray">Gray</option>
              <option value="red">Red</option>
              <option value="amber">Amber</option>
              <option value="green">Green</option>
              <option value="blue">Blue</option>
              <option value="indigo">Indigo</option>
              <option value="violet">Violet</option>
              <option value="pink">Pink</option>
            </select>
          </div>
          <div className="col-span-4 sm:col-span-2">
            <label htmlFor="kitOrder" className="block text-sm font-medium text-gray-700">
              Kit order
            </label>
            <input
              type="number"
              name="kitOrder"
              id="kitOrder"
              placeholder="3"
              value={kitOrder}
              onChange={(e) => setKitOrder(e.target.value)}
              className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
            />
          </div>
          <div className="col-span-4 lg:col-span-2 flex items-center space-x-2">
            <Switch checked={kitComplete} onChange={setKitComplete} className={`${kitComplete ? "bg-blue-600" : "bg-gray-200"} relative inline-flex items-center h-6 rounded-full w-11`}>
              <span className="sr-only">Kit complete</span>
              <span className={`${kitComplete ? "translate-x-6" : "translate-x-1"} inline-block w-4 h-4 transform bg-white rounded-full`} />
            </Switch>
            <label htmlFor="kitComplete" className="block text-sm font-medium text-gray-700">
              Kit complete?
            </label>
          </div>
          <div className="col-span-4 lg:col-span-2 flex items-center space-x-2">
            <Switch checked={kitHide} onChange={setKitHide} className={`${kitHide ? "bg-blue-600" : "bg-gray-200"} relative inline-flex items-center h-6 rounded-full w-11`}>
              <span className="sr-only">Kit complete</span>
              <span className={`${kitHide ? "translate-x-6" : "translate-x-1"} inline-block w-4 h-4 transform bg-white rounded-full`} />
            </Switch>
            <label htmlFor="kitComplete" className="block text-sm font-medium text-gray-700">
              Hide kit?
            </label>
          </div>
        </div>
      </div>
      <div className="flex px-4 py-3 bg-gray-50 text-right sm:px-6">
        {!updating && (
          <button
            type="submit"
            className="bg-purple border border-transparent shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-purple-extradark focus:outline-none focus:ring-0"
          >
            {kit ? "Save" : "Create"}
          </button>
        )}
        {updating && (
          <button className="bg-purple border border-transparent shadow-sm inline-flex py-1.5 px-5 justify-center items-center text-sm font-medium text-white focus:outline-none focus:ring-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </button>
        )}
        <div className={`flex items-center ml-4 ${success ? `text-green-600` : `text-red-600`}`}>{message}</div>
      </div>
    </form>
  );
}
