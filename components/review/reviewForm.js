import { useState, useEffect } from "react";
import { supabase } from "../../utils/initSupabase";
import { VideoCameraIcon } from "@heroicons/react/solid";
import { StarIcon, SupportIcon, XCircleIcon } from "@heroicons/react/outline";
import Tooltip from "../global/tooltip";
import Link from "next/link";
import TagButton from "./tagButton";
import { Loader } from "react-feather";

export default function MobileRecorder({ user, product, setShowReview, setSuccess, handleClose }) {
  const [video, setVideo] = useState("");
  const [videoFile, setVideoFile] = useState("");
  const [recorded, setRecorded] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [charactersRemaining, setCharactersRemaining] = useState(500);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");
  const [failure, setFailure] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  // tagging
  const [tags, setTags] = useState([]);
  const [tagArray, setTagArray] = useState([]);

  // Fetch on load
  useEffect(async () => {
    if (user) {
      let tags = await fetchTags();
      setTags(tags);
      let profile = await fetchProfile(user.id);
      if (profile[0].first_name) {
        setFirstName(profile[0].first_name);
      }
      if (profile[0].last_name) {
        setLastName(profile[0].last_name);
      }
      if (profile[0].company) {
        setCompany(profile[0].company);
      }
      if (profile[0].title) {
        setTitle(profile[0].title);
      }
    }
  }, []);

  const fetchTags = async () => {
    let { data: tags, error } = await supabase.from("tags").select("*").order("group").order("type").order("order");
    if (error) {
      throw error;
    }
    return tags;
  };

  const fetchProfile = async (user_id) => {
    let { data: users, error } = await supabase.from("users").select("*").eq("id", user_id);
    if (error) {
      throw error;
    }
    return users;
  };

  const updateProfile = async (first, last, comp, titl, user_id) => {
    let updateObj = {};
    first ? (updateObj.first_name = first) : null;
    last ? (updateObj.last_name = last) : null;
    comp ? (updateObj.company = comp) : null;
    titl ? (updateObj.title = titl) : null;

    const { data, error } = await supabase.from("users").update(updateObj).eq("id", user_id);
    if (error) {
      handleFailure(error);
      throw error;
    }
    return data;
  };

  const createReview = async (reviewObj) => {
    const { data, error } = await supabase.from("reviews").insert([reviewObj]);
    if (error) {
      handleFailure(error);
      throw error;
    }
    return data;
  };

  const handleFailure = (err) => {
    if (err.statusCode === "23505") {
      setErrorMessage("You already left a review for this product.");
    } else {
      setErrorMessage("There was an error. Please try again.");
    }
    setUploading(false);
    setFailure(true);
    setTimeout(() => {
      setErrorMessage("");
    }, 4000);
    setTimeout(() => {
      setFailure(false);
    }, 4000);
  };

  const checkForDuplicateReview = async (user_id, product_id) => {
    let { data, error } = await supabase.from("reviews").select("*").eq("user", user_id).eq("product", product_id);
    if (error) {
      throw error;
    }
    return data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setErrorMessage("Please select a rating.");
      setFailure(true);
      setTimeout(() => {
        setErrorMessage("");
      }, 4000);
      setTimeout(() => {
        setFailure(false);
      }, 4000);
      return;
    }
    setUploading(true);
    let reviewMatch = await checkForDuplicateReview(user.id, product.id);
    if (reviewMatch.length > 0) {
      setErrorMessage("You already left a review for this product.");
      setFailure(true);
      setTimeout(() => {
        setErrorMessage("");
      }, 4000);
      setTimeout(() => {
        setFailure(false);
      }, 4000);
      setUploading(false);
      return;
    }
    // update profile
    let profile = await updateProfile(firstName, lastName, company, title, user.id);
    // create review object
    let reviewObj = {
      rating: rating,
      product: product.id,
      user: user.id,
      path: null,
      title: reviewTitle,
      link: null,
      video_available: false,
      text: reviewText,
    };
    let review = await createReview(reviewObj);
    let tagInsertArray = createTagInsertArray(review[0].id);
    let tagResponse = await handleTagInsert(tagInsertArray);
    setUploading(false);
    setShowReview(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
    }, 4000);
  };

  const handleReviewTextChange = (e) => {
    setReviewText(e.target.value);
    setCharactersRemaining(500 - e.target.value.length);
  };

  const addTag = (tagId) => {
    let updatedTagArray = [...tagArray, tagId];
    setTagArray(updatedTagArray);
  };

  const removeTag = (tagId) => {
    let updatedTagArray = tagArray.filter((tag) => tag !== tagId);
    setTagArray(updatedTagArray);
  };

  const createTagInsertArray = (reviewId) => {
    let insertArray = [];
    tagArray.forEach((element) => {
      let obj = {
        review_id: reviewId,
        tag_id: element,
      };
      insertArray.push(obj);
    });
    return insertArray;
  };

  const handleTagInsert = async (arr) => {
    const { data, error } = await supabase.from("reviews_tags").insert(arr);
    if (error) {
      throw error;
    }
    return data;
  };

  if (!user)
    return (
      <div className="camera relative pb-4 bg-white border shadow">
        <XCircleIcon className="h-7 w-7 text-gray-400 absolute top-1 right-1 cursor-pointer" onClick={(e) => handleClose(e)} />
        <div className="flex flex-col justify-center items-center py-4 px-8 mt-8 mb-4 space-y-2">
          <h1 className="text-xl font-medium text-gray-900 text-center">Sign in to leave a review</h1>
        </div>
        <div className="flex items-center justify-center space-x-4 mb-4">
          <Link href={{ pathname: `/login`, query: { view: "magic_link" } }}>
            <a className={`text-purple hover:bg-gray-200 text-base font-medium border border-purple px-4 py-2`}>Sign in</a>
          </Link>
          <Link href={{ pathname: `/login`, query: { view: "sign_up" } }}>
            <a className={`text-white bg-purple hover:bg-purple-dark inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-base font-medium`}>Sign up</a>
          </Link>
        </div>
      </div>
    );

  return (
    <div className="camera relative pb-4 bg-white border shadow">
      <XCircleIcon className="h-7 w-7 text-gray-400 absolute top-1 right-1 cursor-pointer" onClick={(e) => handleClose(e)} />
      <div className="flex flex-col justify-center items-center p-2 mt-8 mb-6 space-y-2">
        <h1 className="text-xl font-medium text-gray-900 text-center">Select a rating and leave your review</h1>
      </div>
      <form
        encType="multipart/form-data"
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <div className="sm:overflow-hidden">
          <div className="px-4 pb-4">
            <div className="grid grid-cols-4 gap-6">
              <div className="col-span-4">
                <div className="flex space-x-1">
                  <label htmlFor="rating" className="block text-md font-medium text-gray-700">
                    Rating
                  </label>
                  <span className="block text-md font-medium text-red-700">*</span>
                </div>
                <div className="flex items-center justify-center">
                  <StarIcon className={`h-10 w-10 text-purple cursor-pointer hover:fill-current ${rating > 0 ? "fill-current" : ""}`} onClick={() => setRating(1)} />
                  <StarIcon className={`h-10 w-10 text-purple cursor-pointer hover:fill-current ${rating > 1 ? "fill-current" : ""}`} onClick={() => setRating(2)} />
                  <StarIcon className={`h-10 w-10 text-purple cursor-pointer hover:fill-current ${rating > 2 ? "fill-current" : ""}`} onClick={() => setRating(3)} />
                  <StarIcon className={`h-10 w-10 text-purple cursor-pointer hover:fill-current ${rating > 3 ? "fill-current" : ""}`} onClick={() => setRating(4)} />
                  <StarIcon className={`h-10 w-10 text-purple cursor-pointer hover:fill-current ${rating > 4 ? "fill-current" : ""}`} onClick={() => setRating(5)} />
                </div>
              </div>
              <div className="col-span-4">
                <div className="flex space-x-1">
                  <label htmlFor="reviewTitle" className="block text-md font-medium text-gray-700">
                    Review title
                  </label>
                  <span className="block text-md font-medium text-red-700">*</span>
                </div>
                <input
                  type="text"
                  name="reviewTitle"
                  id="reviewTitle"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
                />
              </div>
              <div className="col-span-4">
                <div className="flex space-x-1 items-end">
                  <label htmlFor="reviewText" className="block text-md font-medium text-gray-700">
                    Review
                  </label>
                  <span className="block text-md font-medium text-red-700">*</span>
                </div>
                <textarea
                  type="text"
                  rows={4}
                  maxLength={500}
                  name="reviewText"
                  id="reviewText"
                  value={reviewText}
                  onChange={(e) => handleReviewTextChange(e)}
                  required
                  className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
                />
                <span className={`block text-sm font-light mt-1 text-gray-700`}>{charactersRemaining} characters remaining</span>
              </div>
              <div className="col-span-4 sm:col-span-2">
                <div className="flex space-x-1">
                  <label htmlFor="first_name" className="block text-md font-medium text-gray-700">
                    First name
                  </label>
                  <span className="block text-md font-medium text-red-700">*</span>
                </div>
                <input
                  type="text"
                  name="first_name"
                  id="first_name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  autoComplete="given-name"
                  required
                  className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
                />
              </div>
              <div className="col-span-4 sm:col-span-2">
                <div className="flex space-x-1">
                  <label htmlFor="last_name" className="block text-md font-medium text-gray-700">
                    Last name
                  </label>
                  <span className="block text-md font-medium text-red-700">*</span>
                </div>
                <input
                  type="text"
                  name="last_name"
                  id="last_name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  autoComplete="family-name"
                  required
                  className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
                />
              </div>
              <div className="col-span-4 sm:col-span-2">
                <label htmlFor="title" className="block text-md font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
                />
              </div>
              <div className="col-span-4 sm:col-span-2">
                <label htmlFor="company" className="block text-md font-medium text-gray-700">
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  id="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
                />
              </div>

              <div id="tags" className="col-span-4 space-y-2 max-w-md">
                <div className="flex space-x-2 items-end justify-between">
                  <label htmlFor="tags" className="block text-md font-medium text-gray-700">
                    Tags
                  </label>
                  {/* <span className="italic text-xs text-gray-400 font-light">select all that apply</span> */}
                </div>
                <div className="flex flex-col space-y-2 items-start">
                  <div id="tags-company" className="flex flex-col space-y-1">
                    <div className="flex space-x-1 items-center justify-between">
                      <label className="block text-sm font-light text-gray-700">Describe yourself and/or company</label>
                      <span className="italic text-xs text-gray-400 font-light">select all that apply</span>
                    </div>
                    <div className="-mt-1 -mx-1 flex flex-wrap items-center justify-center">
                      {tags &&
                        tags
                          .filter((tag) => tag.group === "context")
                          .map((tag) => {
                            return <TagButton key={tag.id} tag={tag} add={addTag} remove={removeTag} />;
                          })}
                    </div>
                  </div>
                  <div id="tags-app" className="flex flex-col space-y-1">
                    <div className="flex space-x-1 items-center justify-between">
                      <label className="block text-sm font-light text-gray-700">Describe your experience</label>
                      <span className="italic text-xs text-gray-400 font-light">select all that apply</span>
                    </div>
                    <div className="-mt-1 -mx-1 flex flex-wrap items-center justify-center">
                      {tags &&
                        tags
                          .filter((tag) => tag.group === "app")
                          .map((tag) => {
                            return <TagButton key={tag.id} tag={tag} add={addTag} remove={removeTag} />;
                          })}
                      {/* {tags &&
                        tags
                          .filter((tag) => tag.type === "neutral")
                          .map((tag) => {
                            return <TagButton key={tag.id} tag={tag} add={addTag} remove={removeTag} />;
                          })}
                      {tags &&
                        tags
                          .filter((tag) => tag.type === "negative")
                          .map((tag) => {
                            return <TagButton key={tag.id} tag={tag} add={addTag} remove={removeTag} />;
                          })} */}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-4 flex justify-center items-center space-x-2">
                <button
                  type="submit"
                  className="bg-purple border border-transparent shadow-sm py-2 px-8 inline-flex justify-center text-md font-medium text-white hover:bg-purple-dark focus:outline-none focus:ring-0"
                >
                  {!uploading ? "Submit" : <Loader className="h-6 w-6 text-white animate-spin mx-4" />}
                </button>
              </div>

              {failure && (
                <div className="col-span-4">
                  <p className="text-md font-medium text-red-600 text-center">{errorMessage}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
