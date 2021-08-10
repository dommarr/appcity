import { useState, useEffect } from "react";
import { supabase } from "../../../utils/initSupabase";
import Loading from "../cardLoading";
import FormTip from "./formTip";
import { MinusCircleIcon } from "@heroicons/react/solid";
import Iframe from "../iFrame";
import Select from "react-select";

export default function ProductForm({ productId, vendorId, priceModel, setPriceModel, superAdmin, updateTierPriceUnits }) {
  // form loading
  const [loading, setLoading] = useState(true);
  // form submission states
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState();
  const [message, setMessage] = useState();
  // industries array
  const [industryList, setIndustryList] = useState([]);
  // drag and drop media
  const [dragIndex, setDragIndex] = useState();
  // form fields
  const [productName, setProductName] = useState("");
  const [productLink, setProductLink] = useState("");
  const [priceLink, setPriceLink] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [media, setMedia] = useState([]);
  const [productLogo, setProductLogo] = useState("");
  const [priceSubdomain, setPriceSubdomain] = useState("");
  const [productSubdomain, setProductSubdomain] = useState("");
  const [industry, setIndustry] = useState("");
  // image upload states
  const [imageUpload, setImageUpload] = useState(false);
  const [imageSuccess, setImageSuccess] = useState();
  const [imageMessage, setImageMessage] = useState();
  // for use in image search
  const [companyWebsite, setCompanyWebsite] = useState("");

  // Fetch on load
  useEffect(() => {
    setLoading(true);
    fetchIndustries();
    fetchProductData(productId);
    setLoading(false);
  }, [productId]);

  const fetchIndustries = async () => {
    let { data: industries, error } = await supabase.from("industries").select("*");
    if (error) {
      throw error;
    }
    let list = [];
    industries.forEach(function (element) {
      list.push({ label: element.name, value: element.id });
    });
    setIndustryList(list);
    return;
  };

  const fetchProductData = async (product_id) => {
    let { data: products, error } = await supabase.from("products").select(`*, vendors(website)`).eq("id", product_id);
    if (error) {
      throw error;
    }
    products[0].name ? setProductName(products[0].name) : "";
    products[0].product_link ? setProductLink(products[0].product_link) : "";
    products[0].price_link ? setPriceLink(products[0].price_link) : "";
    products[0].price_model ? setPriceModel(products[0].price_model) : "";
    products[0].description ? setDescription(products[0].description) : "";
    products[0].keywords ? setKeywords(products[0].keywords) : "";
    products[0].product_logo ? setProductLogo(products[0].product_logo) : "";
    products[0].media ? setMedia(products[0].media) : "";
    products[0].vendors.website ? setCompanyWebsite(products[0].vendors.website) : "";
    products[0].price_subdomain ? setPriceSubdomain(products[0].price_subdomain) : "";
    products[0].product_subdomain ? setProductSubdomain(products[0].product_subdomain) : "";
    products[0].industry_id ? setIndustry(products[0].industry_id) : "";
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
    updateTierPriceUnits(priceModel);
    // let uploadMedia = [];
    // media.forEach((element) => uploadMedia.push(element.link));
    const { data, error } = await supabase
      .from("products")
      .update({
        vendor_id: vendorId,
        name: productName,
        product_link: productLink,
        price_link: priceLink,
        price_model: priceModel,
        description: description,
        keywords: keywords,
        media: media,
        product_logo: productLogo,
        price_subdomain: priceSubdomain,
        product_subdomain: productSubdomain,
        industry_id: industry,
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
    let rand = Math.floor(Math.random() * 10000);
    let path = `${productId}_${media.length + 1}_${rand}`;
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

  const deleteMedia = async (index) => {
    const updatedMedia = [...media];
    updatedMedia.splice(index, 1);
    setMedia(updatedMedia);
  };

  const handlePriceLinkChange = (val) => {
    setPriceLink(val);
    let domain = val.split("//")[1];
    let subdomain = domain.split("/");
    subdomain.shift();
    setPriceSubdomain(subdomain.join("/"));
  };

  const handleProductLinkChange = (val) => {
    setProductLink(val);
    let domain = val.split("//")[1];
    let subdomain = domain.split("/");
    subdomain.shift();
    setProductSubdomain(subdomain.join("/"));
  };

  const handleDrag = (e) => {
    setDragIndex(e.target.dataset.idx);
  };

  const handleDrop = (e) => {
    let updatedMedia = [...media];
    let moveMedia = updatedMedia[dragIndex];
    const dropIndex = e.target.dataset.idx;
    updatedMedia.splice(dragIndex, 1);
    updatedMedia.splice(dropIndex, 0, moveMedia);
    setMedia(updatedMedia);
  };

  if (loading) return <Loading />;

  return (
    <div className="shadow">
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
            <div className="col-span-4 lg:col-span-2 lg:row-start-1">
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
            <div className="col-span-4 lg:col-span-2 lg:row-start-1">
              <div className="flex justify-between">
                <div className="flex space-x-2">
                  <label htmlFor="productLink" className="block text-sm font-medium text-gray-700">
                    App link
                  </label>
                  <span className="italic text-sm text-gray-400">required</span>
                </div>
                <a target="_blank" href={productLink} className="text-sm text-blue-600 underline pl-2">
                  Go to website
                </a>
              </div>

              <input
                type="url"
                name="productLink"
                id="productLink"
                placeholder="https://www.hubspot.com/products/sales"
                value={productLink}
                onChange={(e) => handleProductLinkChange(e.target.value)}
                className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
              />
            </div>
            <div className="col-span-4 lg:col-span-2 lg:row-start-2">
              <div className="flex justify-between">
                <div className="flex space-x-2">
                  <label htmlFor="priceLink" className="block text-sm font-medium text-gray-700">
                    Pricing page link
                  </label>
                  <span className="italic text-sm text-gray-400">required</span>
                </div>
                <a target="_blank" href={productLink} className="text-sm text-blue-600 underline pl-2">
                  Go to price page
                </a>
              </div>
              <input
                type="url"
                name="priceLink"
                id="priceLink"
                placeholder="https://www.hubspot.com/pricing/sales"
                value={priceLink}
                onChange={(e) => handlePriceLinkChange(e.target.value)}
                className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
              />
              <FormTip video_id="d5ef42a2ab1d413689ee584bf7370f79" />
            </div>
            <div className="col-span-4 lg:col-span-2 lg:row-start-2">
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
            <div className="col-span-4 lg:col-span-2 lg:row-start-3">
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
              <div className="col-span-4 lg:col-span-2 lg:row-start-3">
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
            <div className="col-span-4 lg:col-span-2 lg:row-start-4">
              <div className="flex space-x-2 items-center">
                <h4 className="font-medium text-gray-900">Media</h4>
                <span className="italic text-sm text-gray-400">required</span>
              </div>
              <div className="flex space-x-4 mb-4">
                <a
                  target="_blank"
                  href={`https://www.google.com/search?q=site:${productLink ? productLink : companyWebsite} ${productName}&tbm=isch&tbs=isz:l`}
                  className="text-sm text-blue-600 underline"
                >
                  Search images
                </a>
                <a target="_blank" href={`https://www.youtube.com/results?search_query=${productName}&sp=EgIQAg%253D%253D`} className="text-sm text-blue-600 underline">
                  Search videos
                </a>
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
                          draggable={true}
                          onDragOver={(e) => e.preventDefault()}
                          onDragStart={handleDrag}
                          onDrop={handleDrop}
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
            </div>
            <div className="col-span-4 lg:col-span-2 lg:row-start-4">
              <h6 className="block text-sm font-bold text-gray-700 py-2">Media tips</h6>
              <ol className="flex flex-col text-sm list-decimal px-4">
                <li className="mt-2">Image 1: Screenshot of the app home screen or dashboard.</li>
                <dd>
                  <a target="_blank" href="https://blog.close.com/content/images/hubfs/315483/product-hero-large-1.png" className="text-xs text-blue-600 underline">
                    Example: Close CRM Inbox
                  </a>
                </dd>
                <li className="mt-2">Image 2: Screenshot of a different section of the app.</li>
                <dd>
                  <a target="_blank" href="https://blog.close.com/content/images/hubfs/sales-20pipeline-20view-20in-20CRM.png" className="text-xs text-blue-600 underline">
                    Example: Close CRM Pipeline View
                  </a>
                </dd>
                <li className="mt-2">Image 3: Screenshot of a different section of the app.</li>
                <dd>
                  <a target="_blank" href="https://i.ytimg.com/vi/JgNRfLlp_JU/maxresdefault.jpg" className="text-xs text-blue-600 underline">
                    Example: Close CRM Reporting View
                  </a>
                </dd>
                <li className="mt-2">Video 1: App introduction video, showing the app in-use. Preferably 1-4 minutes long.</li>
                <dd>
                  <a target="_blank" href="https://www.youtube.com/watch?v=bR8z2vqboyE" className="text-xs text-blue-600 underline">
                    Example: Close CRM Intro
                  </a>
                </dd>
                <li className="mt-2">Video 2: Explaining a feature of the app or showing the app in-use.</li>
                <dd>
                  <a target="_blank" href="https://www.youtube.com/watch?v=vQdX1eE75GY" className="text-xs text-blue-600 underline">
                    Example: Close CRM Custom Activities Feature
                  </a>
                </dd>
              </ol>
              <div className="mt-4 text-sm font-medium">See videos for more tips:</div>
              <ul className="flex flex-col text-sm list-disc pl-4">
                <li className="mt-2">Images:</li>
                <FormTip video_id="70ef54ca4f1047eb804ee1f5e3af6c7b" />
                <li className="mt-2">Videos:</li>
                <FormTip video_id="9f7f88d888414deb8dafc8344c51b45c" />
              </ul>
            </div>
            {superAdmin && (
              <>
                <div className="col-span-4 lg:col-span-2 row-start-5">
                  <div className="flex justify-between items-center">
                    <label htmlFor="productLogo" className="text-sm font-medium text-gray-700">
                      Product logo
                    </label>
                    <a target="_blank" href={`https://brandfetch.com/brand-api/demo?url=${productLink}`} className="text-sm text-blue-600 underline pl-2">
                      Get logo
                    </a>
                  </div>
                  <input
                    type="url"
                    name="productLogo"
                    id="productLogo"
                    placeholder="https://assets.brandfetch.io/298f948a6d77483.png"
                    value={productLogo}
                    onChange={(e) => setProductLogo(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
                  />
                </div>
                <div className="col-span-4 lg:col-span-2 row-start-5">
                  <div className="flex justify-between items-center">
                    <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                      Industry
                    </label>
                  </div>
                  <Select
                    options={industryList}
                    isSearchable={true}
                    className="mt-1 z-10"
                    value={industryList.filter((option) => option.value === industry)}
                    onChange={(option) => setIndustry(option.value)}
                  />
                </div>
              </>
            )}
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
