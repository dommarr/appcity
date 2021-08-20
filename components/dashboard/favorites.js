import { useState, useEffect, useRef } from "react";
import { supabase } from "../../utils/initSupabase";
import Image from "next/image";
import Logo from "../graphics/logo/Logo";
import Link from "next/link";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon, MinusCircleIcon, XIcon, UserCircleIcon } from "@heroicons/react/solid";
import { ClipboardCheckIcon, ExternalLinkIcon, PlusIcon, HeartIcon } from "@heroicons/react/outline";
import { ArrowUpLeft, ArrowUp, ArrowUpRight, ArrowRight, ArrowDownRight, ArrowDown, ArrowDownLeft, ArrowLeft, Circle, Loader, Maximize, Minimize, User } from "react-feather";
import { capitalizeEveryWord, capitalizeFirstWord, formatParagraph } from "../../lib/format";
import Select from "react-select";
import { Switch } from "@headlessui/react";
import { HexColorPicker } from "react-colorful";
import QuestionMarkTooltip from "../global/questionMarkTooltip";

export default function Favorites({ user }) {
  const [profile, setProfile] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState("");
  const [currentTab, setCurrentTab] = useState("favorites");
  // share page url
  const [url, setUrl] = useState("https://www.appcity.com");
  // handle states
  const [handleLoading, setHandleLoading] = useState(false);
  const [handleRejected, setHandleRejected] = useState(false);
  const [handleAccepted, setHandleAccepted] = useState(false);
  // maximize or minimize
  //const [maximize, setMaximize] = useState(false);
  // clipboard copied
  const [copied, setCopied] = useState(false);
  // color checks disabled
  const [disabled, setDisabled] = useState(false);
  // whether a share is new or not
  const [newShare, setNewShare] = useState(false);
  const [shareId, setShareId] = useState("");
  // share form fields
  const [publish, setPublish] = useState(false);
  const [handle, setHandle] = useState("");
  const [acceptedHandle, setAcceptedHandle] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [displayImage, setDisplayImage] = useState("");
  const [headerLink, setHeaderLink] = useState("");
  const [blurb, setBlurb] = useState("");
  const [colorOne, setColorOne] = useState("#0F0059");
  const [colorTwo, setColorTwo] = useState("#540aff");
  const [colorThree, setColorThree] = useState("#8d5cff");
  const [angle, setAngle] = useState("to top right");
  const [colorTwoDisabled, setColorTwoDisabled] = useState(false);
  const [colorThreeDisabled, setColorThreeDisabled] = useState(false);
  const [textColor, setTextColor] = useState("#ffffff");
  // timers
  const [handleTime, setHandleTime] = useState("");
  const [favoriteTime, setFavoriteTime] = useState("");
  const [shareTime, setShareTime] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  // image
  const [imageUploading, setImageUploading] = useState(false);
  const [imageSuccess, setImageSuccess] = useState(false);
  const [imageFail, setImageFail] = useState(false);
  const [imageSet, setImageSet] = useState(false);
  // drag and drop features
  const [dragIndex, setDragIndex] = useState();
  const [dropIndex, setDropIndex] = useState();

  function useDidUpdateEffect(fn, inputs) {
    const didMountRef = useRef(false);

    useEffect(() => {
      if (didMountRef.current) return fn();
      else
        setTimeout(function () {
          didMountRef.current = true;
        }, 2000);
    }, inputs);
  }

  // Fetch on load
  useEffect(async () => {
    fetchProfile(user.id);
    let favs = await fetchFavorites(user.id);
    if (favs?.length > 0) {
      setFavorites(processFavs(favs));
    }
    fetchProducts(favs);
    fetchShare(user.id);
  }, []);

  useDidUpdateEffect(() => handleSaveShare(), [publish, displayName, headerLink, blurb, colorOne, colorTwo, colorThree, angle, colorTwoDisabled, colorThreeDisabled, textColor, displayImage]);

  useDidUpdateEffect(() => handleHandleChange(), [handle]);

  useDidUpdateEffect(() => handleSaveFavorites(), [dropIndex]);

  const fetchProfile = async (id) => {
    let { data: users, error } = await supabase.from("users").select("*").eq("id", id);
    if (error) {
      throw error;
    }
    if (users) {
      setProfile(users[0]);
    }
  };

  const fetchFavorites = async (id) => {
    let { data: favorites, error } = await supabase.from("favorites").select("*, products(*, vendors(*))").eq("user_id", id);
    if (error) {
      throw error;
    }
    if (favorites?.length) {
      return favorites;
    }
  };

  const fetchProducts = async (favs) => {
    let { data: products, error } = await supabase.from("products").select("id, name").eq("complete", true);
    if (error) {
      throw error;
    }
    if (products) {
      let list = [];
      products.forEach(function (element) {
        list.push({ label: element.name, value: element.id });
      });
      list.sort(function (a, b) {
        if (a.label < b.label) {
          return -1;
        }
        if (a.label > b.label) {
          return 1;
        }
        return 0;
      });
      let filtered;
      if (favs?.length > 0) {
        filtered = filterOutCurrentFavorites(list, favs);
      } else {
        filtered = list;
      }
      setProducts(filtered);
    }
  };

  const fetchShare = async (uid) => {
    let { data: shares, error } = await supabase.from("shares").select("*").eq("user_id", uid);
    if (error) {
      throw error;
    }
    if (shares?.length > 0) {
      let share = shares[0];
      setPublish(share.publish);
      setShareId(share.id);
      share.handle ? setHandle(share.handle) : "";
      share.handle ? setAcceptedHandle(share.handle) : "";
      share.handle ? setUrl("https://www.appcity.com/s/" + share.handle) : "";
      share.display_name ? setDisplayName(share.display_name) : "";
      share.display_image ? setDisplayImage(share.display_image) : "";
      share.display_image ? setImageSet(true) : "";
      share.header_link ? setHeaderLink(share.header_link) : "";
      share.blurb ? setBlurb(share.blurb) : "";
      share.color_one ? setColorOne(share.color_one) : "";
      share.color_two ? setColorTwo(share.color_two) : "";
      share.color_three ? setColorThree(share.color_three) : "";
      share.angle ? setAngle(share.angle) : "";
      setColorTwoDisabled(share.color_two_disabled);
      setColorThreeDisabled(share.color_three_disabled);
      share.text_color ? setTextColor(share.text_color) : "";
      setNewShare(false);
    } else {
      setNewShare(true);
    }
  };

  const filterOutCurrentFavorites = (arr, favs) => {
    let currentFavorites = favs.map((item) => item.product_id);
    let filtered = arr.filter((item) => !currentFavorites.includes(item.value));
    return filtered;
  };

  const handleUsedForChange = (e) => {
    const updatedFavorites = [...favorites];
    updatedFavorites[e.target.dataset.idx]["used_for"] = e.target.value;
    setFavorites(updatedFavorites);
    handleSaveFavorites();
  };

  const handleReferralLinkChange = (e) => {
    const updatedFavorites = [...favorites];
    updatedFavorites[e.target.dataset.idx]["referral_link"] = e.target.value;
    setFavorites(updatedFavorites);
    handleSaveFavorites();
  };

  const shareSections = (arr) => {
    let shared = arr.filter((item) => item.share);
    let unshared = arr.filter((item) => !item.share);
    return shared.concat(unshared);
  };

  const initialRefState = (favs) => {
    let updatedFavs = [...favs];
    updatedFavs = updatedFavs.map((elem) => ({ ...elem, refOpen: false }));
    return updatedFavs;
  };

  const compare = (a, b) => {
    const tierNumA = a.order;
    const tierNumB = b.order;

    let comparison = 0;
    if (tierNumA > tierNumB) {
      comparison = 1;
    } else if (tierNumA < tierNumB) {
      comparison = -1;
    }
    return comparison;
  };

  const processFavs = (favs) => {
    let processOne = initialRefState(favs);
    let processTwo = processOne.sort(compare);
    let processThree = shareSections(processTwo);
    return processThree;
  };

  const handleSelect = async (pid) => {
    if (pid) {
      await addFavorite(pid);
    }
  };

  const createFavorite = async (obj) => {
    const { data, error } = await supabase.from("favorites").insert([obj]);
    if (error) {
      throw error;
    }
    if (data) {
      return data;
    }
  };

  const addFavorite = async (pid) => {
    setSelected(pid);
    let order = favorites.length;
    let newFavorite = { user_id: user.id, product_id: pid, order: order };
    let data = await createFavorite(newFavorite);
    newFavorite = data[0];
    let { data: products, error } = await supabase.from("products").select("*, vendors(*))").eq("id", pid);
    if (error) {
      throw error;
    }
    if (products) {
      newFavorite.products = products[0];
    }
    const updatedFavorites = [...favorites, newFavorite];
    setFavorites(processFavs(updatedFavorites));
    fetchProducts(updatedFavorites);
    setSelected(null);
    return;
  };

  const deleteFavorite = async (index) => {
    let fav = favorites[index];
    const updatedFavorites = [...favorites];
    updatedFavorites.splice(index, 1);
    setFavorites(updatedFavorites);
    fetchProducts(updatedFavorites);
    if (fav.id) {
      const { data, error } = await supabase.from("favorites").delete().eq("id", fav.id);
      if (error) {
        throw error;
      }
      return;
    }
  };

  const handleShareChange = (index) => {
    const updatedFavorites = [...favorites];
    let current = updatedFavorites[index]["share"];
    updatedFavorites[index]["share"] = !current;
    setFavorites(shareSections(updatedFavorites));
    handleSaveFavorites();
  };

  const handleRefChange = (index, bool) => {
    const updatedFavorites = [...favorites];
    updatedFavorites[index]["refOpen"] = bool;
    setFavorites(updatedFavorites);
  };

  const handleCopyClick = (string) => {
    navigator.clipboard.writeText(string).then(
      function () {
        setCopied(true);
        setTimeout(function () {
          setCopied(false);
        }, 2000);
      },
      function () {
        alert("Cannot copy the url.");
      }
    );
  };

  const background = (ang, one, two, three) => {
    let backgroundStyle = "";
    if (ang === "none" || (colorTwoDisabled && colorThreeDisabled)) {
      backgroundStyle = { backgroundColor: `${one}` };
    } else if (colorTwoDisabled || colorThreeDisabled) {
      if (colorTwoDisabled) {
        backgroundStyle = { backgroundImage: `linear-gradient(${ang}, ${one}, ${three})` };
      } else if (colorThreeDisabled) {
        backgroundStyle = { backgroundImage: `linear-gradient(${ang}, ${one}, ${two})` };
      }
    } else {
      backgroundStyle = { backgroundImage: `linear-gradient(${ang}, ${one}, ${two}, ${three})` };
    }
    return backgroundStyle;
  };

  const handleDirectionClick = (direction) => {
    if (direction === "none") {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
    setAngle(direction);
  };

  const handleImageFail = () => {
    setImageUploading(false);
    setImageFail(true);
    setTimeout(function () {
      setImageFail(false);
    }, 2000);
  };

  const handleImageSuccess = () => {
    setImageUploading(false);
    setImageSuccess(true);
    setTimeout(function () {
      setImageSuccess(false);
      setImageSet(true);
    }, 2000);
  };

  const uploadImage = async (path, file) => {
    const { data, error } = await supabase.storage.from("user-images").upload(path, file, {
      upsert: true,
    });
    if (error) {
      handleImageFail();
      throw error;
    }
    if (data) {
      return data;
    }
  };

  const getPublicUrl = async (path) => {
    const { publicURL, error } = supabase.storage.from("user-images").getPublicUrl(path);
    if (error) {
      throw error;
    }
    return publicURL;
  };

  const handleDisplayImageChange = async (e) => {
    setImageUploading(true);
    let path = `${user.id}/share_page_image.png`;
    const file = e.target.files[0];
    let image = await uploadImage(path, file);
    if (image) {
      let publicUrl = await getPublicUrl(path);
      setDisplayImage(publicUrl);
      handleImageSuccess();
    }
  };

  const fetchHandle = async () => {
    let { data: shares, error } = await supabase.from("shares").select("id, user_id").eq("handle", handle);
    if (error) {
      throw error;
    }
    return shares;
  };

  const checkHandleAvailability = async () => {
    if (handle === "") {
      setHandleLoading(false);
      return;
    } else {
      let share = await fetchHandle();
      if (share?.length > 0) {
        if (share[0].user_id === user.id) {
          setHandleLoading(false);
          return;
        } else {
          setHandleLoading(false);
          setHandleRejected(true);
          setTimeout(function () {
            setHandleRejected(false);
          }, 3000);
          return;
        }
      } else {
        setHandleLoading(false);
        setHandleAccepted(true);
        setAcceptedHandle(handle);
        let link = "https://www.appcity.com/s/" + handle;
        setUrl(link);
        setTimeout(function () {
          setHandleAccepted(false);
        }, 3000);
        handleSaveShare();
        return;
      }
    }
  };

  const handleHandleChange = async () => {
    setHandleAccepted(false);
    setHandleRejected(false);
    setHandleLoading(true);
    clearTimeout(handleTime);
    let time = setTimeout(() => checkHandleAvailability(), 3000);
    setHandleTime(time);
  };

  const saveFavorites = async () => {
    let updateArray = favorites.map((elem, index) => ({
      id: elem.id,
      user_id: elem.user_id,
      product_id: elem.product_id,
      referral_link: elem.referral_link,
      share: elem.share,
      used_for: elem.used_for,
      order: index,
    }));
    const { data, error } = await supabase.from("favorites").insert(updateArray, { upsert: true });
    if (error) {
      setSaving(false);
      throw error;
    }
    if (data) {
      setSaving(false);
      setSaved(true);
      setTimeout(function () {
        setSaved(false);
      }, 3000);
    }
  };

  const handleSaveFavorites = async () => {
    setSaved(false);
    setSaving(true);
    clearTimeout(favoriteTime);
    let time = setTimeout(() => saveFavorites(favorites), 3000);
    setFavoriteTime(time);
  };

  const saveShare = async () => {
    let obj = {
      handle: acceptedHandle,
      display_name: displayName,
      header_link: headerLink,
      blurb: blurb,
      publish: publish,
      color_one: colorOne,
      color_two: colorTwo,
      color_three: colorThree,
      angle: angle,
      user_id: user.id,
      color_two_disabled: colorTwoDisabled,
      color_three_disabled: colorThreeDisabled,
      display_image: displayImage,
      text_color: textColor,
    };
    if (newShare) {
      const { data, error } = await supabase.from("shares").insert([obj]);
      if (error) {
        throw error;
      }
      if (data) {
        setNewShare(false);
        setShareId(data[0].id);
        setSaving(false);
        setSaved(true);
        setTimeout(function () {
          setSaved(false);
        }, 3000);
        return;
      }
    } else {
      const { data, error } = await supabase.from("shares").update(obj).eq("id", shareId);
      if (error) {
        throw error;
      }
      if (data) {
        setSaving(false);
        setSaved(true);
        setTimeout(function () {
          setSaved(false);
        }, 3000);
        return;
      }
    }
  };

  const handleSaveShare = () => {
    setSaved(false);
    setSaving(true);
    clearTimeout(shareTime);
    let time = setTimeout(() => saveShare(), 3000);
    setShareTime(time);
  };

  const handleDrag = (e) => {
    setDragIndex(e.target.dataset.idy);
  };

  const handleDrop = (e) => {
    let updatedFavorites = [...favorites];
    let moveFavorite = updatedFavorites[dragIndex];
    const dropIndex = e.target.dataset.idy;
    updatedFavorites.splice(dragIndex, 1);
    updatedFavorites.splice(dropIndex, 0, moveFavorite);
    setFavorites(updatedFavorites);
    setDropIndex(dropIndex);
  };

  const tabs = [
    { name: "Favorites", ref: "favorites", default: true },
    { name: "Style & Share", ref: "style", default: false },
  ];

  if (!profile) return <div>Loading...</div>;

  return (
    <section className="py-4 space-y-4">
      <h1 className="text-2xl font-semibold text-gray-900">Your favorites</h1>
      <div className={`shadow flex min-h-700px bg-white flex-col xl:flex-row`}>
        {/* Left */}
        <div className="relative bg-white pt-2 pb-10 px-4 w-full xl:w-1/2">
          {/* {!maximize && <Maximize onClick={(e) => setMaximize(true)} className="absolute left-2 top-2 h-5 w-5" />}
          {maximize && <Minimize onClick={(e) => setMaximize(false)} className="absolute left-2 top-2 h-5 w-5" />} */}
          {/* Tab select */}
          <div className="block">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex " aria-label="Tabs">
                {favorites?.length > 0 &&
                  tabs.map((tab) => (
                    <a
                      key={tab.name}
                      onClick={(e) => setCurrentTab(tab.ref)}
                      className={`${
                        tab.ref === currentTab ? "border-indigo-500 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      } w-1/2 sm:w-1/4 py-2 px-1 text-center border-b-2 font-medium text-sm hover:cursor-pointer`}
                    >
                      {tab.name}
                    </a>
                  ))}
                {favorites?.length === 0 &&
                  tabs
                    .filter((item) => item.default)
                    .map((tab) => (
                      <a
                        key={tab.name}
                        onClick={(e) => setCurrentTab(tab.ref)}
                        className={`${
                          tab.ref === currentTab ? "border-indigo-500 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        } w-1/4 py-2 px-1 text-center border-b-2 font-medium text-sm hover:cursor-pointer`}
                      >
                        {tab.name}
                      </a>
                    ))}
              </nav>
            </div>
            <div className="text-sm p-2 flex justify-end h-8">
              {saving && (
                <div className="flex space-x-1 text-indigo-600 items-center">
                  <Loader className="h-4 w-4 animate-spin" />
                  <p className="text-sm animate-pulse">Saving</p>
                </div>
              )}
              {saved && (
                <div className="flex space-x-1 text-green-600 items-center">
                  <CheckIcon className="h-4 w-4" />
                  <p className="text-sm">Saved</p>
                </div>
              )}
            </div>
          </div>

          {/* Favorites Tab */}
          {currentTab === "favorites" && (
            <div className="space-y-4">
              <div className="flex flex-col space-y-1">
                <label htmlFor="selected" className="block text-sm font-medium text-gray-700">
                  Add a favorite
                </label>
                <Select
                  options={products}
                  isSearchable={true}
                  isClearable={true}
                  noOptionsMessage={() => {
                    return (
                      <a target="_blank" href="/contact" className="flex space-x-2 items-center justify-center">
                        <span>Are we missing an app?</span>
                        <span className="text-blue-400 underline">Suggest one!</span>
                      </a>
                    );
                  }}
                  className="z-10"
                  value={products.filter((option) => option.value === selected)}
                  onChange={(option) => handleSelect(option?.value)}
                />
              </div>
              {(!favorites || favorites?.length < 1) && (
                <div className="flex flex-col items-center justify-center w-full border-2 border-dashed p-10">
                  <div className="relative">
                    <HeartIcon className="relative h-16 w-16 text-gray-400" />
                    <PlusIcon className="absolute bottom-3 right-1 h-6 w-6 text-gray-400 bg-white rounded-full" />
                  </div>
                </div>
              )}
              <div className="space-y-1">
                <div className="h-4">{favorites.filter((item) => item.share).length > 6 && <p className="text-xs italic text-right text-gray-500">Max 6 apps will be shared</p>}</div>
                <div className="flex flex-col space-y-2">
                  {favorites &&
                    favorites.map((favorite, idx) => {
                      let product = favorite.products;
                      let logo = favorite.products.product_logo ? favorite.products.product_logo : favorite.products.vendors.logo;
                      const favoriteId = favorite.id;
                      let used_for = favorite.used_for;
                      let share = favorite.share;
                      let referral_link = favorite.referral_link;
                      return (
                        <div
                          key={favoriteId}
                          data-idy={idx}
                          draggable={true}
                          onDragOver={(e) => e.preventDefault()}
                          onDragStart={handleDrag}
                          onDrop={(e) => handleDrop(e)}
                          className="flex flex-col bg-gray-50 shadow divide-y divide-gray-100 divide-solid cursor-move"
                        >
                          {/* Top */}
                          <div data-idy={idx} className="flex flex-col sm:flex-row items-center justify-between py-2 px-4">
                            <div data-idy={idx} className="flex items-center space-x-4">
                              <div data-idy={idx} className="flex flex-none items-center space-x-3">
                                <a data-idy={idx} target="_blank" href={`https://www.appcity.com/product/${product.id}`} className="w-10 h-10 aspect-w-1">
                                  <Image data-idy={idx} src={logo} alt={product.name} placeholder="blur" blurDataURL={`/_next/image?url=${logo}&w=16&q=1`} layout="fill" objectFit="contain" />
                                </a>
                                <h5 data-idy={idx} className="text-lg font-medium">
                                  {product.name}
                                </h5>
                              </div>
                              <p data-idy={idx} className="text-blue-600">
                                for
                              </p>
                              <input
                                type="text"
                                name={favoriteId}
                                id={favoriteId}
                                data-idy={idx}
                                data-idx={idx}
                                placeholder="Podcast Recording"
                                value={used_for}
                                onChange={handleUsedForChange}
                                className="block w-full border border-gray-100 shadow-inner py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
                              />
                            </div>
                            <div data-idy={idx} className="flex items-center space-x-2">
                              <Switch
                                data-idy={idx}
                                checked={share}
                                onChange={(e) => handleShareChange(idx)}
                                className="flex-shrink-0 group relative rounded-full inline-flex items-center justify-center h-5 w-10 cursor-pointer focus:outline-none focus:ring-0"
                              >
                                <span className="sr-only">Use setting</span>
                                <span aria-hidden="true" className="pointer-events-none absolute bg-white w-full h-full rounded-md" />
                                <span
                                  aria-hidden="true"
                                  className={`${share ? "bg-indigo-600" : "bg-gray-200"} pointer-events-none absolute h-4 w-9 mx-auto rounded-full transition-colors ease-in-out duration-200`}
                                />
                                <span
                                  aria-hidden="true"
                                  className={`${
                                    share ? "translate-x-5" : "translate-x-0"
                                  } pointer-events-none absolute left-0 inline-block h-5 w-5 border border-gray-200 rounded-full bg-white shadow transform ring-0 transition-transform ease-in-out duration-200`}
                                />
                              </Switch>
                              <MinusCircleIcon data-idy={idx} onClick={(e) => deleteFavorite(idx)} className="h-6 w-6 text-red-600 hover:cursor-pointer" />
                            </div>
                          </div>
                          {/* Bottom */}
                          {/* Closed */}
                          {!favorite.refOpen && (
                            <div data-idy={idx} onClick={(e) => handleRefChange(idx, true)} className="flex space-x-2 px-4 justify-between items-center hover:cursor-pointer">
                              <ChevronDownIcon data-idy={idx} className="h-5 w-5" />
                              <div data-idy={idx} className="flex space-x-1">
                                <QuestionMarkTooltip data-idy={idx} caption="When a user clicks one of your favorites on your share page, you'll get credit." />
                                <p data-idy={idx} className="text-xs text-gray-400">
                                  Your affiliate / referral link
                                </p>
                              </div>
                              <ChevronDownIcon data-idy={idx} className="h-5 w-5" />
                            </div>
                          )}
                          {/* Open */}
                          {favorite.refOpen && (
                            <div className="flex space-x-2 py-2 px-1">
                              <div onClick={(e) => handleRefChange(idx, false)} className="h-full justify-start hover:cursor-pointer">
                                <ChevronUpIcon className="h-5 w-5" />
                              </div>
                              <input
                                type="url"
                                name="referral_link"
                                id="referral_link"
                                data-idx={idx}
                                placeholder="hubspot.com/?ref=dom"
                                value={referral_link}
                                onChange={handleReferralLinkChange}
                                className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
                              />
                              <div onClick={(e) => handleRefChange(idx, false)} className="h-full justify-start">
                                <ChevronUpIcon className="h-5 w-5 hover:cursor-pointer" />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}
          {/* Style & Share Tab */}
          {currentTab === "style" && (
            <div className="grid grid-cols-4 gap-6">
              <div className="col-span-4 flex flex-col pl-4 space-y-1">
                <div className="flex items-center space-x-4">
                  <label htmlFor="publish" className="block text-lg font-medium text-gray-700">
                    Publish
                  </label>
                  <Switch
                    checked={publish}
                    onChange={setPublish}
                    className={`${publish ? "bg-green-500" : "bg-gray-200"} ${
                      acceptedHandle === "" ? "cursor-not-allowed pointer-events-none" : "cursor-pointer"
                    } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full transition-colors ease-in-out duration-200 focus:outline-none focus:ring-0`}
                  >
                    <span className="sr-only">Use setting</span>
                    <span
                      className={`${
                        publish ? "translate-x-5" : "translate-x-0"
                      } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                    >
                      <span
                        className={`${
                          publish ? "opacity-0 ease-out duration-100" : "opacity-100 ease-in duration-200"
                        } absolute inset-0 h-full w-full flex items-center justify-center transition-opacity`}
                        aria-hidden="true"
                      >
                        <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
                          <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <span
                        className={`${publish ? "opacity-100 ease-in duration-200" : "opacity-0 ease-out duration-100"}
                        absolute inset-0 h-full w-full flex items-center justify-center transition-opacity`}
                        aria-hidden="true"
                      >
                        <svg className="h-3 w-3 text-green-500" fill="currentColor" viewBox="0 0 12 12">
                          <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                        </svg>
                      </span>
                    </span>
                  </Switch>
                  {publish && (
                    <a target="_blank" href={url}>
                      <ExternalLinkIcon className={`h-6 w-6 ${publish ? "text-indigo-500 hover:cursor-pointer" : "text-gray-300 hover:cursor-not-allowed"}`} />
                    </a>
                  )}
                </div>
                <div className="h-2">{acceptedHandle === "" && <p className="text-xs text-red-600">Reserve a handle to publish.</p>}</div>
              </div>
              <div className="space-y-1 col-span-4">
                <div className="flex justify-between mr-20">
                  <label htmlFor="handle" className="block text-sm font-medium text-gray-700">
                    Reserve your handle
                  </label>
                  {handleRejected && (
                    <div className="flex space-x-1 text-red-600 items-center">
                      <XIcon className="h-3 w-3" />
                      <p className="text-xs">Sorry, that handle is taken.</p>
                    </div>
                  )}
                  {handleAccepted && (
                    <div className="flex space-x-1 text-green-600 items-center">
                      <CheckIcon className="h-3 w-3" />
                      <p className="text-xs">Handle available!</p>
                    </div>
                  )}
                  {handleLoading && (
                    <div className="flex space-x-1 text-indigo-600 items-center animate-spin">
                      <Loader className="h-4 w-4" />
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-x-2">
                  <div className="shadow-sm flex w-full">
                    <span className="bg-gray-50 border border-r-0 border-gray-300 px-3 inline-flex items-center text-gray-500 sm:text-sm">appcity.com/s/</span>
                    <input
                      type="text"
                      name="handle"
                      id="handle"
                      placeholder="dom"
                      value={handle}
                      onChange={(e) => setHandle(e.target.value)}
                      className="focus:ring-sky-500 focus:border-sky-500 flex-grow block min-w-0 sm:text-sm border-gray-300"
                    />
                  </div>
                  <div className="relative w-16 flex justify-center items-center">
                    {copied && <p className="absolute text-xs inset-x-0 -top-6 py-0.5 px-1 bg-green-100 text-green-500 text-center rounded">Copied!</p>}
                    <ClipboardCheckIcon onClick={(e) => handleCopyClick(url)} className={`hover:cursor-pointer h-8 w-8 ${copied ? "text-green-500 transform rotate-12" : "text-indigo-500"}`} />
                  </div>
                </div>
              </div>
              <div className="col-span-4 sm:col-span-2">
                <div className="flex space-x-2">
                  <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                    Header name
                  </label>
                </div>
                <input
                  type="text"
                  name="displayName"
                  id="displayName"
                  placeholder="Dom"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
                />
              </div>
              <div className="col-span-4 sm:col-span-2 space-y-1">
                <div className="flex space-x-1">
                  <label htmlFor="headerLink" className="block text-sm font-medium text-gray-700">
                    Header link
                  </label>
                  <QuestionMarkTooltip caption="Where to send users when they click on your display name or image. Social media, YouTube channels, or Linktree pages are a popular choice." />
                </div>
                <input
                  required
                  type="url"
                  name="headerLink"
                  id="headerLink"
                  placeholder="https://www.appcity.com"
                  value={headerLink}
                  onChange={(e) => setHeaderLink(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
                />
                <p className="italic text-xs text-gray-400">Entire URL, including https or http</p>
              </div>
              <div className="col-span-4 sm:col-span-2 space-y-1">
                <div className="flex space-x-2">
                  <label htmlFor="displayImage" className="block text-sm font-medium text-gray-700">
                    Header image
                  </label>
                </div>
                {!imageSet && !imageUploading && !imageSuccess && !imageFail && (
                  <div className="flex flex-col justify center space-y-3 items-center py-2 px-3">
                    <input type="file" onChange={handleDisplayImageChange} className="block w-full focus:outline-none focus:ring-gray-900 focus:border-gray-900 text-xs" />
                    {displayImage && (
                      <button
                        type="button"
                        onClick={(e) => setImageSet(true)}
                        className="inline-flex items-center px-2.5 py-1 border border-black text-xs text-black bg-gray-100 hover:bg-gray-200 rounded-sm focus:outline-none focus:ring-0"
                      >
                        Revert
                      </button>
                    )}
                  </div>
                )}
                {imageUploading && (
                  <div className="flex py-2 px-3 space-x-1 text-indigo-600 items-center">
                    <Loader className="h-4 w-4 animate-spin" />
                    <p className="text-sm animate-pulse">Uploading</p>
                  </div>
                )}
                {imageSuccess && (
                  <div className="flex items-center py-2 px-3">
                    <span className={`flex items-center text-green-600 text-sm`}>Image uploaded successfully.</span>
                  </div>
                )}
                {imageFail && (
                  <div className="flex items-center py-2 px-3">
                    <span className={`flex items-center text-red-600 text-sm`}>There was an error. Please try again.</span>
                  </div>
                )}
                {imageSet && (
                  <div className="flex items-center justify-center py-2 px-3 space-x-4">
                    <div className="w-16 h-16 aspect-w-1">
                      <Image
                        src={displayImage}
                        alt={displayName}
                        placeholder="blur"
                        blurDataURL={`/_next/image?url=${displayImage}&w=16&q=1`}
                        layout="fill"
                        objectFit="contain"
                        className="rounded-full"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={(e) => setImageSet(false)}
                      className="inline-flex items-center px-2.5 py-1 border border-black text-xs text-black bg-gray-100 hover:bg-gray-200 rounded-sm focus:outline-none focus:ring-0"
                    >
                      Replace
                    </button>
                  </div>
                )}
              </div>
              <div className="col-span-4 sm:col-span-2">
                <div className="flex space-x-2">
                  <label htmlFor="blurb" className="block text-sm font-medium text-gray-700">
                    Header blurb
                  </label>
                </div>
                <textarea
                  type="text"
                  name="blurb"
                  id="blurb"
                  placeholder="My favorite apps I use to run AppCity"
                  maxLength="140"
                  value={blurb}
                  onChange={(e) => setBlurb(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
                />
                <span className="text-xs text-gray-500 italic">140 character maximum</span>
              </div>
              <div className="col-span-2 flex flex-col space-y-4">
                <label htmlFor="colorOne" className="block text-sm font-medium text-gray-700">
                  Color one
                </label>
                <div className="w-full flex items-center justify-center">
                  <HexColorPicker color={colorOne} onChange={setColorOne} />
                </div>
              </div>
              <div className="col-span-2 flex flex-col space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    id="colorTwo"
                    aria-describedby="colorTwo-description"
                    name="colorTwo"
                    type="checkbox"
                    value={colorTwoDisabled}
                    checked={!colorTwoDisabled}
                    disabled={disabled}
                    onChange={(e) => setColorTwoDisabled(!colorTwoDisabled)}
                    className={`focus:ring-indigo-500 h-4 w-4 border-gray-300 rounded ${disabled ? "text-gray-300" : "text-indigo-600"}`}
                  />
                  <label htmlFor="colorTwo" className={`block text-sm font-medium ${disabled ? "text-gray-400" : "text-gray-700"}`}>
                    Color two
                  </label>
                </div>
                <div className="w-full flex items-center justify-center">
                  {!colorTwoDisabled && !disabled && <HexColorPicker color={colorTwo} onChange={setColorTwo} />}
                  {disabled && <p className="text-center bg-indigo-100 text-indigo-500 rounded px-2 py-4 text-sm mx-4">Select a gradient direction to add another color.</p>}
                </div>
              </div>
              <div className="col-span-2 flex flex-col space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    id="colorThree"
                    aria-describedby="colorThree-description"
                    name="colorThree"
                    type="checkbox"
                    value={colorThreeDisabled}
                    checked={!colorThreeDisabled}
                    disabled={disabled}
                    onChange={(e) => setColorThreeDisabled(!colorThreeDisabled)}
                    className={`focus:ring-indigo-500 h-4 w-4 border-gray-300 rounded ${disabled ? "text-gray-300" : "text-indigo-600"}`}
                  />
                  <label htmlFor="colorThree" className={`block text-sm font-medium ${disabled ? "text-gray-400" : "text-gray-700"}`}>
                    Color three
                  </label>
                </div>
                <div className="w-full flex items-center justify-center">
                  {!colorThreeDisabled && !disabled && <HexColorPicker color={colorThree} onChange={setColorThree} />}
                  {disabled && <p className="text-center bg-indigo-100 text-indigo-500 rounded px-2 py-4 text-sm mx-4">Select a gradient direction to add another color.</p>}
                  {/* <input type="color"></input> */}
                </div>
              </div>
              <div className="col-span-2 flex flex-col space-y-4">
                <label htmlFor="gradient" className="block text-sm font-medium text-gray-700">
                  Gradient direction
                </label>
                <div className="w-full flex items-center justify-center">
                  {(!colorTwoDisabled || !colorThreeDisabled) && (
                    <div className="h-32 w-32 grid grid-cols-3 grid-rows-3">
                      <div onClick={(e) => handleDirectionClick("to top left")} className="col-span-1 bg-gray-100 rounded-tl-lg flex items-center justify-center shadow border border-gray-200">
                        <ArrowUpLeft className={`h-8 w-8 ${angle === "to top left" ? "text-purple" : "text-gray-300"}`} />
                      </div>
                      <div onClick={(e) => handleDirectionClick("to top")} className="col-span-1 bg-gray-100 flex items-center justify-center shadow border border-gray-200">
                        <ArrowUp className={`h-8 w-8 ${angle === "to top" ? "text-purple" : "text-gray-300"}`} />
                      </div>
                      <div onClick={(e) => handleDirectionClick("to top right")} className="col-span-1 bg-gray-100 rounded-tr-lg flex items-center justify-center shadow border border-gray-200">
                        <ArrowUpRight className={`h-8 w-8 ${angle === "to top right" ? "text-purple" : "text-gray-300"}`} />
                      </div>
                      <div onClick={(e) => handleDirectionClick("to left")} className="col-span-1 bg-gray-100 flex items-center justify-center shadow border border-gray-200">
                        <ArrowLeft className={`h-8 w-8 ${angle === "to left" ? "text-purple" : "text-gray-300"}`} />
                      </div>
                      <div onClick={(e) => handleDirectionClick("none")} className="col-span-1 bg-gray-100 flex items-center justify-center shadow border border-gray-200">
                        <Circle className={`h-8 w-8 ${angle === "none" ? "text-purple" : "text-gray-300"}`} />
                      </div>
                      <div onClick={(e) => handleDirectionClick("to right")} className="col-span-1 bg-gray-100 flex items-center justify-center shadow border border-gray-200">
                        <ArrowRight className={`h-8 w-8 ${angle === "to right" ? "text-purple" : "text-gray-300"}`} />
                      </div>
                      <div onClick={(e) => handleDirectionClick("to bottom left")} className="col-span-1 bg-gray-100 rounded-bl-lg flex items-center justify-center shadow border border-gray-200">
                        <ArrowDownLeft className={`h-8 w-8 ${angle === "to bottom left" ? "text-purple" : "text-gray-300"}`} />
                      </div>
                      <div onClick={(e) => handleDirectionClick("to bottom")} className="col-span-1 bg-gray-100 flex items-center justify-center shadow border border-gray-200">
                        <ArrowDown className={`h-8 w-8 ${angle === "to bottom" ? "text-purple" : "text-gray-300"}`} />
                      </div>
                      <div onClick={(e) => handleDirectionClick("to bottom right")} className="col-span-1 bg-gray-100 rounded-br-lg flex items-center justify-center shadow border border-gray-200">
                        <ArrowDownRight className={`h-8 w-8 ${angle === "to bottom right" ? "text-purple" : "text-gray-300"}`} />
                      </div>
                    </div>
                  )}
                  {colorTwoDisabled && colorThreeDisabled && <p className="text-center bg-indigo-100 text-indigo-500 rounded px-2 py-4 text-sm mx-4">Select another color to create a gradient.</p>}
                </div>
              </div>
              <div className="col-span-2 flex flex-col space-y-4">
                <label htmlFor="textColor" className={`block text-sm font-medium text-gray-700`}>
                  Text color
                </label>
                <div className="w-full flex items-center justify-center">
                  <HexColorPicker color={textColor} onChange={setTextColor} />
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Right */}
        <div
          className={`relative flex-none flex-col items-center justify-between py-10 px-4 h-936px border border-gray-300 w-full xl:w-1/2`}
          // style={{ backgroundImage: `linear-gradient(${angle}, ${colorOne}, ${colorTwo}, ${colorThree})` }}
          style={background(angle, colorOne, colorTwo, colorThree)}
        >
          <h2 className="absolute z-20 top-0 left-0 py-1 px-2 bg-indigo-100 text-indigo-700 text-sm">Share page preview</h2>
          {favorites?.length === 0 && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center space-y-4 drop-shadow">
              <h3 className="rounded bg-indigo-100 text-indigo-700 py-2 px-2 shadow">Add favorites and create a share page like this!</h3>
              <div className="relative h-4/5 w-4/5 aspect-w-1">
                <Image
                  src="https://dnlvkovcawtkzuvpmmgr.supabase.in/storage/v1/object/sign/website_images/share_page_placeholder.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ3ZWJzaXRlX2ltYWdlcy9zaGFyZV9wYWdlX3BsYWNlaG9sZGVyLnBuZyIsImlhdCI6MTYyOTQ4NDcwMiwiZXhwIjoxOTQ0ODQ0NzAyfQ.r6ESllI3D4VlcT9iCDIPbCgB1oG3szXRBI0oyMiOt3Y"
                  alt="Share page example"
                  placeholder="blur"
                  blurDataURL={`/_next/image?url=https://dnlvkovcawtkzuvpmmgr.supabase.in/storage/v1/object/sign/website_images/share_page_placeholder.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ3ZWJzaXRlX2ltYWdlcy9zaGFyZV9wYWdlX3BsYWNlaG9sZGVyLnBuZyIsImlhdCI6MTYyOTQ4NDcwMiwiZXhwIjoxOTQ0ODQ0NzAyfQ.r6ESllI3D4VlcT9iCDIPbCgB1oG3szXRBI0oyMiOt3Y&w=16&q=1`}
                  layout="fill"
                  objectFit="contain"
                  className=""
                />
              </div>
            </div>
          )}
          {favorites?.length > 0 && (
            <div className="flex flex-col items-center justify-between h-full space-y-8" style={{ color: textColor }}>
              {headerLink !== "" && (
                <a target="_blank" href={headerLink} className="flex flex-col items-center justify-center space-y-1 px-14 filter drop-shadow">
                  {displayImage && (
                    <div className="w-24 h-24 aspect-w-1">
                      <Image
                        src={displayImage}
                        alt={displayName}
                        placeholder="blur"
                        blurDataURL={`/_next/image?url=${displayImage}&w=16&q=1`}
                        layout="fill"
                        objectFit="contain"
                        className="rounded-full"
                      />
                    </div>
                  )}
                  {!displayImage && (
                    <div className="w-24 h-24 aspect-w-1">
                      <UserCircleIcon />
                    </div>
                  )}
                  <h3 className="font-medium">{displayName}</h3>
                  <p className="text-sm font-light text-center">{blurb}</p>
                </a>
              )}
              {headerLink === "" && (
                <div className="flex flex-col items-center justify-center space-y-1 px-14 filter drop-shadow">
                  {displayImage && (
                    <div className="w-24 h-24 aspect-w-1">
                      <Image
                        src={displayImage}
                        alt={displayName}
                        placeholder="blur"
                        blurDataURL={`/_next/image?url=${displayImage}&w=16&q=1`}
                        layout="fill"
                        objectFit="contain"
                        className="rounded-full"
                      />
                    </div>
                  )}
                  {!displayImage && (
                    <div className="w-24 h-24 aspect-w-1">
                      <UserCircleIcon />
                    </div>
                  )}
                  <h3 className="font-medium">{displayName}</h3>
                  <p className="text-sm font-light">{blurb}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-x-8 gap-y-6 max-w-sm">
                {favorites &&
                  favorites
                    .filter((item) => item.share)
                    .filter((item, index) => index < 6)
                    .map((favorite, idx) => {
                      let product = favorite.products;
                      let logo = favorite.products.product_logo ? favorite.products.product_logo : favorite.products.vendors.logo;
                      let even = idx % 2 == 0 ? true : false;
                      let used_for = favorite.used_for;
                      let length = favorite.used_for?.length;
                      let link = favorite.referral_link ? favorite.referral_link : `https://www.appcity.com/product/${favorite.products.id}`;
                      return (
                        <div key={favorite.id} className={`col-span-1 flex flex-col justify-end ${even ? "items-center" : "items-center"}`}>
                          <a target="_blank" href={link} className="flex flex-col items-center justify-center space-y-2 filter drop-shadow">
                            <h5 className={`${length > 40 ? "text-sm" : "text-sm"} font-light text-center`}>{used_for}</h5>
                            <div className="w-20 h-20 aspect-w-1">
                              <Image src={logo} alt={product.name} placeholder="blur" blurDataURL={`/_next/image?url=${logo}&w=16&q=1`} layout="fill" objectFit="contain" className="rounded-2xl" />
                            </div>
                            <h5 className="text-lg text-center">{product.name}</h5>
                          </a>
                        </div>
                      );
                    })}
              </div>
              <a target="_blank" href="/" className="flex flex-col items-center justify-center">
                <Logo size={30} alt="AppCity" className="filter drop-shadow" />
                <div className="relative flex stroke-1 stroke-current filter drop-shadow">
                  <p className={`font-logo pl-1 text-2xl font-light`}>app</p>
                  <span className={`font-logo pr-2 text-2xl font-semibold`}>city</span>
                  {/* <span className={`absolute -bottom-3 right-6 text-xs`}>beta</span> */}
                </div>
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
