import { useState, useEffect } from "react";
import { supabase } from "../../utils/initSupabase";
import Loading from "./cardLoading";

export default function ProductForm({ productId, vendorId, priceModel, setPriceModel }) {
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
  const [keywords, setKeywords] = useState("");
  const [media, setMedia] = useState([]);
  // image upload states
  const [imageUpload, setImageUpload] = useState(false);
  const [imageSuccess, setImageSuccess] = useState();
  const [imageMessage, setImageMessage] = useState();
  const [allCategories, setAllCategories] = useState();

  // Fetch on load
  useEffect(() => {
    fetchProductData(productId);
    fetchCategories();
    setLoading(false);
  }, []);

  const fetchProductData = async (product_id) => {
    let { data: products, error } = await supabase.from("products").select("*").eq("id", product_id);
    if (error) {
      throw error;
    }
    products[0].name ? setProductName(products[0].name) : "";
    products[0].price_link ? setPriceLink(products[0].price_link) : "";
    products[0].price_model ? setPriceModel(products[0].price_model) : "";
    products[0].keywords ? setKeywords(products[0].keywords) : "";
    products[0].media ? setMedia(products[0].media) : "";
  };

  const fetchCategories = async () => {
    let { data: categories, error } = await supabase.from("categories").select("*");
    if (error) {
      throw error;
    }
    setAllCategories(categories);
    console.log(categories);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    // let uploadMedia = [];
    // media.forEach((element) => uploadMedia.push(element.link));
    const { data, error } = await supabase
      .from("products")
      .update({
        vendor_id: vendorId,
        name: productName,
        price_link: priceLink,
        price_model: priceModel,
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

  // const addImage = () => {
  //   const blankImage = { type: "image", link: "" };
  //   // setMedia(media.concat({ type: "image", link: "" }));
  //   setMedia([...media, { ...blankImage }]);
  // };

  const addVideo = () => {
    // const blankVideo = { type: "video", link: "" };
    // setMedia([...media, { ...blankVideo }]);
    setMedia([...media, ""]);
    console.log(media);
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
    setImageMessage("Image uploaded. See links below.");
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
      // updatedMedia[e.target.dataset.idx]["link"] = url;
      // let imageObj = { type: "image", link: url };
      updatedMedia.push(url);
      setMedia(updatedMedia);
      handleImageSuccess();
    }
  };

  const handleVideoMediaChange = (e) => {
    const updatedMedia = [...media];
    // updatedMedia[e.target.dataset.idx]["link"] = e.target.value;
    updatedMedia[e.target.dataset.idx] = e.target.value;
    setMedia(updatedMedia);
    console.log(updatedMedia);
    console.log(media);
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
              <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
                Product name
              </label>
              <input
                type="text"
                name="productName"
                id="productName"
                placeholder="Hubspot Sales Hub"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
              />
            </div>
            <div className="col-span-4 sm:col-span-2">
              <label htmlFor="priceLink" className="block text-sm font-medium text-gray-700">
                Pricing page link
              </label>
              <input
                type="url"
                name="priceLink"
                id="priceLink"
                placeholder="https://www.hubspot.com/pricing/sales"
                value={priceLink}
                onChange={(e) => setPriceLink(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
              />
            </div>
            <div className="col-span-4 sm:col-span-2">
              <label htmlFor="priceModel" className="block text-sm font-medium text-gray-700">
                Pricing model
              </label>
              <select
                type="text"
                name="priceModel"
                id="priceModel"
                placeholder="Flat-rate pricing"
                value={priceModel}
                onChange={(e) => setPriceModel(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
              >
                <option value="per-user">Per-user pricing</option>
                <option value="usage-based">Usage-based pricing</option>
                <option value="flat-rate">Flat-rate pricing</option>
              </select>
            </div>
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
                required
                className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
              />
            </div>
            <div className="col-span-4 sm:col-span-2">
              <h4 className="font-medium text-gray-900 mb-1">Media</h4>

              {media &&
                media.map((val, idx) => {
                  const mediaId = `media-${idx}`;
                  return (
                    <div key={mediaId} className="my-2">
                      <label htmlFor={mediaId} className="block text-sm font-medium text-gray-700">
                        {`Media #${idx + 1}`}
                      </label>
                      {/* <input type="url" name={mediaId} id={mediaId} data-idx={idx} placeholder="https://www.youtube.com/watch?v=qDCyvvdzND4" value={media[idx].link} onChange={handleVideoMediaChange} className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm" /> */}

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
                        <input type="file" onChange={handleImageMediaChange} className="block w-full focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm" />
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
                    className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-0"
                  >
                    Add video link
                  </button>
                </div>
              </div>
            </div>
            <div className="col-span-4 sm:col-span-2">
              <label htmlFor="keywords" className="block text-sm font-medium text-gray-700">
                Categories
              </label>
              <ul>
                {allCategories &&
                  allCategories.map((val, idx) => {
                    if (val.parent_id === null) {
                      return (
                        <li key={idx}>
                          <input type="checkbox" id={val.id} value={val.id} />
                          <label htmlFor={val.id}>{val.name}</label>
                        </li>
                      );
                    }
                  })}
              </ul>
              <div className="grid grid-cols-4 gap-6"></div>
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
