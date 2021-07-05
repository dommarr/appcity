import { useState, useEffect } from "react";
import { supabase } from "../../utils/initSupabase";
import Loading from "./cardLoading";
import FormTip from "./formTip";
import { MinusCircleIcon } from "@heroicons/react/solid";

export default function ProductForm({ productId, vendorId, priceModel, setPriceModel, superAdmin }) {
  // form loading
  const [loading, setLoading] = useState(true);
  // form submission states
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState();
  const [message, setMessage] = useState();
  // form fields
  const [productName, setProductName] = useState("");
  const [priceLink, setPriceLink] = useState("");
  // const [priceModel, setPriceModel] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [media, setMedia] = useState([]);
  // image upload states
  const [imageUpload, setImageUpload] = useState(false);
  const [imageSuccess, setImageSuccess] = useState();
  const [imageMessage, setImageMessage] = useState();

  // Fetch on load
  useEffect(() => {
    setLoading(true);
    fetchProductData(productId);
    setLoading(false);
  }, [productId]);

  const fetchProductData = async (product_id) => {
    let { data: products, error } = await supabase.from("products").select("*").eq("id", product_id);
    if (error) {
      throw error;
    }
    products[0].name ? setProductName(products[0].name) : "";
    products[0].price_link ? setPriceLink(products[0].price_link) : "";
    products[0].price_model ? setPriceModel(products[0].price_model) : "";
    products[0].description ? setDescription(products[0].description) : "";
    products[0].keywords ? setKeywords(products[0].keywords) : "";
    products[0].media ? setMedia(products[0].media) : "";
  };

  const updateDynamic = async (product_id, pricing_page_link) => {
    const data = {
      product: product_id,
      price_page: pricing_page_link,
    };
    fetch("/api/checkDynamic", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    if (priceLink) {
      updateDynamic(productId, priceLink);
    }
    // let uploadMedia = [];
    // media.forEach((element) => uploadMedia.push(element.link));
    const { data, error } = await supabase
      .from("products")
      .update({
        vendor_id: vendorId,
        name: productName,
        price_link: priceLink,
        price_model: priceModel,
        description: description,
        keywords: keywords,
        media: media,
      })
      .eq("id", productId);
    if (error) {
      handleFailure();
      throw error;
    }
    if (data) {
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

  const addVideo = () => {
    setMedia([...media, ""]);
  };

  const signUrl = async (path) => {
    let { data, error } = await supabase.storage.from("product_images").createSignedUrl(path, 283824000);
    if (error) {
      throw error;
    }
    return data.signedURL;
  };

  const handleImageSuccess = () => {
    setImageUpload(false);
    setImageSuccess(true);
    setImageMessage("Image uploaded. See links above.");
    setTimeout(function () {
      setImageMessage("");
    }, 4000);
  };

  const handleImageFailure = () => {
    setImageUpload(false);
    setImageSuccess(false);
    setImageMessage("There was an error. Please try again.");
    setTimeout(function () {
      setImageMessage("");
    }, 4000);
  };

  const handleImageMediaChange = async (e) => {
    setImageUpload(true);
    let path = `${productId}_${media.length + 1}`;
    let { data, error } = await supabase.storage.from("product_images").upload(path, e.target.files[0]);
    if (error) {
      handleImageFailure();
      throw error;
    }
    if (data) {
      let url = await signUrl(path);
      const updatedMedia = [...media];
      updatedMedia.push(url);
      setMedia(updatedMedia);
      handleImageSuccess();
    }
  };

  const handleVideoMediaChange = (e) => {
    const updatedMedia = [...media];
    updatedMedia[e.target.dataset.idx] = e.target.value;
    setMedia(updatedMedia);
  };

  const deleteMedia = (index) => {
    const updatedMedia = [...media];
    updatedMedia.splice(index, 1);
    setMedia(updatedMedia);
  };

  if (loading) return <Loading />;

  return (
    <div className="shadow sm:overflow-hidden">
      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <div className="bg-white py-6 px-4 sm:p-6">
          <div>
            <h2 id="app-details-heading" className="text-lg leading-6 font-medium text-gray-900">
              App details
            </h2>
          </div>
          <div className="mt-6 grid grid-cols-4 gap-6">
            <div className="col-span-4 sm:col-span-2">
              <div className="flex space-x-2">
                <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
                  App name
                </label>
                <span className="italic text-sm text-gray-400">required</span>
              </div>
              <input
                type="text"
                name="productName"
                id="productName"
                placeholder="Hubspot Sales Hub"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
              />
            </div>
            <div className="col-span-4 sm:col-span-2">
              <div className="flex space-x-2">
                <label htmlFor="priceLink" className="block text-sm font-medium text-gray-700">
                  Pricing page link
                </label>
                <span className="italic text-sm text-gray-400">required</span>
              </div>
              <input
                type="url"
                name="priceLink"
                id="priceLink"
                placeholder="https://www.hubspot.com/pricing/sales"
                value={priceLink}
                onChange={(e) => setPriceLink(e.target.value)}
                className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
              />
              <FormTip video_id="d5ef42a2ab1d413689ee584bf7370f79" />
            </div>
            <div className="col-span-4 sm:col-span-2">
              <div className="flex space-x-2">
                <label htmlFor="priceModel" className="block text-sm font-medium text-gray-700">
                  Pricing model
                </label>
                <span className="italic text-sm text-gray-400">required</span>
              </div>
              <select
                type="text"
                name="priceModel"
                id="priceModel"
                placeholder="Flat-rate pricing"
                value={priceModel}
                onChange={(e) => setPriceModel(e.target.value)}
                className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
              >
                <option hidden disabled selected value>
                  -- select an option --
                </option>
                <option value="per-user">Per-user pricing</option>
                <option value="usage-based">Usage-based pricing</option>
                <option value="flat-rate">Flat-rate pricing</option>
                <option value="revenue-fee">Revenue-fee pricing</option>
              </select>
              <FormTip video_id="c14acb3e5f1e41ddbbac81d0eb9b22d1" recent={true} />
            </div>
            <div className="col-span-4 sm:col-span-2">
              <div className="flex space-x-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  App description
                </label>
                <span className="italic text-sm text-gray-400">required</span>
              </div>
              <textarea
                type="text"
                name="description"
                id="description"
                placeholder="Sales Hub eliminates friction by bringing all your tools and data together on one easy-to-use, powerful platform your whole team will love."
                maxLength="280"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
              />
              <span className="text-xs text-gray-500 italic">280 character maximum</span>
              <FormTip video_id="76d32cc65dbf4a9399d435b6a9d24a0a" recent={true} />
            </div>
            {superAdmin && (
              <div className="col-span-4 sm:col-span-2">
                <label htmlFor="keywords" className="block text-sm font-medium text-gray-700">
                  Keywords
                </label>
                <textarea
                  type="text"
                  name="keywords"
                  id="keywords"
                  placeholder="sales crm contact management marketing"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
                />
              </div>
            )}
            <div className="col-span-4 sm:col-span-3">
              <div className="flex space-x-2 items-center mb-1">
                <h4 className="font-medium text-gray-900">Media</h4>
                <span className="italic text-sm text-gray-400">required</span>
              </div>

              {media &&
                media.map((val, idx) => {
                  const mediaId = `media-${idx}`;
                  return (
                    <div key={mediaId} className="my-2">
                      <label htmlFor={mediaId} className="block text-sm font-medium text-gray-700">
                        {`Media #${idx + 1}`}
                      </label>
                      {/* <input type="url" name={mediaId} id={mediaId} data-idx={idx} placeholder="https://www.youtube.com/watch?v=qDCyvvdzND4" value={media[idx].link} onChange={handleVideoMediaChange} className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm" /> */}
                      <div className="flex space-x-2 items-center">
                        <input
                          type="url"
                          name={mediaId}
                          id={mediaId}
                          data-idx={idx}
                          placeholder="https://www.youtube.com/watch?v=qDCyvvdzND4"
                          value={media[idx]}
                          onChange={handleVideoMediaChange}
                          className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
                        />
                        <MinusCircleIcon onClick={(e) => deleteMedia(idx)} className="text-gray-400 h-5 w-5 hover:cursor-pointer hover:text-gray-600" />
                      </div>

                      {/* {val.type === "image" && val.link === "" && <input type="file" name={mediaId} id={mediaId} data-idx={idx} value={media[idx].link} onChange={handleImageMediaChange} className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm" />}
                      {val.type === "image" && val.link && <input type="url" name={mediaId} id={mediaId} data-idx={idx} placeholder="https://www.youtube.com/watch?v=qDCyvvdzND4" value={media[idx].link} onChange={handleVideoMediaChange} className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm" />}
                      {val.type === "video" && <input type="url" name={mediaId} id={mediaId} data-idx={idx} placeholder="https://www.youtube.com/watch?v=qDCyvvdzND4" value={media[idx].link} onChange={handleVideoMediaChange} className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm" />} */}
                    </div>
                  );
                })}
              <div className="flex flex-col items-center mt-4 p-2 border border-gray-300">
                {/* <button type="button" onClick={addImage} className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-0">
                  Add image
                </button> */}
                <h6 className="underline">Add media</h6>
                <div className="flex items-center justify-between space-x-2">
                  <div className="space-y-2">
                    {!imageUpload && (
                      <div className="p-1 flex flex-col space-y-1">
                        <span className="text-sm">Upload image:</span>
                        <input type="file" onChange={handleImageMediaChange} className="block w-full focus:outline-none focus:ring-gray-900 focus:border-gray-900 text-xs" />
                      </div>
                    )}
                    {imageUpload && (
                      <div className="px-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 animate-spin text-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                          />
                        </svg>
                      </div>
                    )}
                    <span className={`flex items-center ${imageSuccess ? `text-green-600` : `text-red-600`}`}>{imageMessage}</span>
                  </div>
                  <button
                    type="button"
                    onClick={addVideo}
                    className="inline-flex items-center px-2.5 py-1.5 border border-black text-xs text-black bg-gray-100 hover:bg-gray-200 rounded-sm focus:outline-none focus:ring-0"
                  >
                    Add video link
                  </button>
                </div>
              </div>
              <div className="max-w-lg">
                <FormTip video_id="54a35d2579604edf943d29ae237952bb" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex px-4 py-3 bg-gray-50 text-right sm:px-6">
          {!updating && (
            <button
              type="submit"
              className="bg-purple border border-transparent shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-purple-extradark focus:outline-none focus:ring-0"
            >
              Save
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
    </div>
  );
}
