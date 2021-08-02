import { useState, useEffect } from "react";
import { supabase } from "../../utils/initSupabase";
import { VideoCameraIcon } from "@heroicons/react/solid";
import { StarIcon, SupportIcon, XCircleIcon } from "@heroicons/react/outline";
import Tooltip from "../global/tooltip";
import Link from "next/link";

export default function MobileRecorder({ user, product, setReview, setSuccess, handleClose }) {
  const [video, setVideo] = useState("");
  const [videoFile, setVideoFile] = useState("");
  const [recorded, setRecorded] = useState(false);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [failure, setFailure] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  // Fetch on load
  useEffect(async () => {
    if (user) {
      let profile = await fetchProfile(user.id);
      if (profile[0].first_name) {
        setFirstName(profile[0].first_name);
      }
      if (profile[0].last_name) {
        setLastName(profile[0].last_name);
      }
    }
  }, []);

  const fetchProfile = async (user_id) => {
    let { data: users, error } = await supabase.from("users").select("*").eq("id", user_id);
    if (error) {
      throw error;
    }
    return users;
  };

  const onVideoChange = (e) => {
    let src = window.URL.createObjectURL(e.target.files[0]);
    setVideo(src);
    setVideoFile(e.target.files[0]);
    setRecorded(true);
  };

  const updateProfile = async (first, last, user_id) => {
    const { data, error } = await supabase
      .from("users")
      .update({
        first_name: first,
        last_name: last,
      })
      .eq("id", user_id);
    if (error) {
      handleFailure(error);
      throw error;
    }
    return data;
  };

  const uploadVideo = async (file, path) => {
    const { data, error } = await supabase.storage.from("reviews").upload(`${path}`, file);
    if (error) {
      handleFailure(error);
      throw error;
    }
    return data;
  };

  const signUrl = async (path) => {
    const { data, error } = await supabase.storage.from("reviews").createSignedUrl(path, 283824000);
    if (error) {
      handleFailure(error);
      throw error;
    }
    return data.signedURL;
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
    // update profile
    let profile = await updateProfile(firstName, lastName, user.id);
    let path = `${user.id}_${product.id}.mp4`;
    // upload video (with extension as path)
    let video = await uploadVideo(videoFile, path);
    // signUrl
    let signedUrl = await signUrl(path);
    // create review with path and signedUrl
    let reviewObj = {
      rating: rating,
      product: product.id,
      user: user.id,
      first_name: firstName,
      last_name: lastName,
      path: path,
      title: title,
      link: signedUrl,
      video_available: true,
    };
    let review = await createReview(reviewObj);
    setUploading(false);
    setReview(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
    }, 4000);
  };

  if (!user)
    return (
      <div className="camera relative pb-4 bg-white border shadow">
        <XCircleIcon className="h-7 w-7 text-gray-400 absolute top-1 right-1 cursor-pointer" onClick={(e) => handleClose(e)} />
        <div className="flex flex-col justify-center items-center py-4 px-8 mt-8 mb-4 space-y-2">
          <h1 className="text-xl font-medium text-gray-900 text-center">Sign in to leave a review</h1>
        </div>
        <div className="flex items-center justify-center space-x-4 mb-4">
          <Link href={{ pathname: `/profile`, query: { view: "magic_link" } }}>
            <a className={`text-purple hover:bg-gray-200 text-base font-medium border border-purple px-4 py-2`}>Sign in</a>
          </Link>
          <Link href={{ pathname: `/profile`, query: { view: "sign_up" } }}>
            <a className={`text-white bg-purple hover:bg-purple-dark inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-base font-medium`}>Sign up</a>
          </Link>
        </div>
      </div>
    );

  return (
    <div className="camera relative pb-4 bg-white border shadow">
      <XCircleIcon className="h-7 w-7 text-gray-400 absolute top-1 right-1 cursor-pointer" onClick={(e) => handleClose(e)} />
      <div className="flex flex-col justify-center items-center p-2 mt-8 mb-6 space-y-2">
        <h1 className="text-xl font-medium text-gray-900 text-center">Select a rating and record your review</h1>
        <Tooltip text="Why only video?" caption="Video reviews are more trustworthy. When someone puts their face and name on a video, you can better trust its authenticity." />
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
                <label htmlFor="rating" className="block text-md font-medium text-gray-700">
                  Rating
                </label>
                <div className="flex items-center justify-center">
                  <StarIcon className={`h-10 w-10 text-purple cursor-pointer hover:fill-current ${rating > 0 ? "fill-current" : ""}`} onClick={() => setRating(1)} />
                  <StarIcon className={`h-10 w-10 text-purple cursor-pointer hover:fill-current ${rating > 1 ? "fill-current" : ""}`} onClick={() => setRating(2)} />
                  <StarIcon className={`h-10 w-10 text-purple cursor-pointer hover:fill-current ${rating > 2 ? "fill-current" : ""}`} onClick={() => setRating(3)} />
                  <StarIcon className={`h-10 w-10 text-purple cursor-pointer hover:fill-current ${rating > 3 ? "fill-current" : ""}`} onClick={() => setRating(4)} />
                  <StarIcon className={`h-10 w-10 text-purple cursor-pointer hover:fill-current ${rating > 4 ? "fill-current" : ""}`} onClick={() => setRating(5)} />
                </div>
              </div>
              <div className="col-span-4">
                <label htmlFor="title" className="block text-md font-medium text-gray-700">
                  Review title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
                />
              </div>
              <div className="col-span-4 sm:col-span-2">
                <label htmlFor="first_name" className="block text-md font-medium text-gray-700">
                  First name
                </label>
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
                <label htmlFor="last_name" className="block text-md font-medium text-gray-700">
                  Last name
                </label>
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

              {recorded && (
                <div className="col-span-4 border">
                  <video
                    id="player"
                    controls
                    src={video}
                    poster="https://dnlvkovcawtkzuvpmmgr.supabase.co/storage/v1/object/sign/reviews/video_poster_images/black.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJyZXZpZXdzL3ZpZGVvX3Bvc3Rlcl9pbWFnZXMvYmxhY2suc3ZnIiwiaWF0IjoxNjIyMjMxMTE2LCJleHAiOjE5Mzc1OTExMTZ9.rOm1ZK5Hms9UyqefE7xEYdmSKBdCh2a9npV8BH5CbDs"
                  ></video>
                </div>
              )}

              <div className="col-span-4 flex justify-center items-center space-x-2">
                <label
                  htmlFor="recorder"
                  className="flex justify-center items-center border border-green-500 py-2 px-4 inline-flex justify-center text-md font-medium text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-0 cursor-pointer"
                >
                  <VideoCameraIcon className="h-6 w-6 text-white mr-2" />
                  {recorded ? "Record again" : "Record review"}
                </label>
                <input id="recorder" type="file" accept="video/*" capture="user" onChange={onVideoChange} className="hidden" />
                {recorded && (
                  <button
                    type="submit"
                    className="bg-purple border border-transparent shadow-sm py-2 px-8 inline-flex justify-center text-md font-medium text-white hover:bg-purple-dark focus:outline-none focus:ring-0"
                  >
                    {!uploading ? "Submit" : <SupportIcon className="h-6 w-6 text-white animate-spin mx-4" />}
                  </button>
                )}
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
