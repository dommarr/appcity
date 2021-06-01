import { useState, useEffect, useRef, useReducer } from "react";
import { supabase } from "../../utils/initSupabase";
import { VideoCameraIcon, StopIcon } from "@heroicons/react/solid";
import { StarIcon, SupportIcon, XCircleIcon } from "@heroicons/react/outline";
import Tooltip from "../global/tooltip";
import Link from "next/link";

const reducer = (chunks, action) => {
  switch (action.type) {
    case "reset":
      return action.payload;
    case "add":
      return [...chunks, action.payload];
  }
};

export default function DesktopRecorder({ user, product, setReview, setSuccess, handleClose, mediaRecorder, setMediaRecorder, stopStream }) {
  let initialChunk = [];
  const streamRef = useRef();
  const [chunks, dispatch] = useReducer(reducer, initialChunk);
  // recorded video for uploading
  const [video, setVideo] = useState("");
  const [videoFile, setVideoFile] = useState("");
  const [recording, setRecording] = useState(false);
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
      let recorder = await setupStream();
    }
  }, []);

  const handleDataAvailable = ({ data }) => {
    dispatch({ type: "add", payload: data });
  };

  const setupStream = async () => {
    try {
      let streamSrc = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current.srcObject = streamSrc;
      //let recorder = new MediaRecorder(streamSrc);
      setMediaRecorder(
        Object.assign(new MediaRecorder(streamSrc, { mimeType: "video/webm;codecs=h264" }), {
          ondataavailable: handleDataAvailable,
        })
      );
      return;
    } catch (error) {
      setErrorMessage("This browser doesn't support video recording. Please upgrade your browser or try on your phone.");
      setFailure(true);
      setTimeout(() => {
        setErrorMessage("");
      }, 4000);
      setTimeout(() => {
        setFailure(false);
      }, 4000);
    }
  };

  const handleCanPlay = () => {
    streamRef.current.play();
  };

  const onRecord = (e) => {
    e.preventDefault();
    // hide record button and show stop button
    setRecording(true);
    // haven't completed recording
    setRecorded(false);
    // clear old data
    dispatch({ type: "reset", payload: initialChunk });
    mediaRecorder.start(10);
  };

  const onStop = (e) => {
    e.preventDefault();
    mediaRecorder.stop();
    // hide stop button and show record button
    setRecording(false);
    // save video for display
    saveVideo();
    // recording has completed
    setRecorded(true);
  };

  const saveVideo = () => {
    const blob = new Blob(chunks, { type: "video/mp4" });
    // clear old data
    dispatch({ type: "reset", payload: initialChunk });
    // generate video url from blob
    const videoUrl = window.URL.createObjectURL(blob);
    setVideo(videoUrl);
    setVideoFile(blob);
  };

  const fetchProfile = async (user_id) => {
    let { data: users, error } = await supabase.from("users").select("*").eq("id", user_id);
    if (error) {
      throw error;
    }
    return users;
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
    const { signedURL, error } = await supabase.storage.from("reviews").createSignedUrl(path, 283824000);
    if (error) {
      handleFailure(error);
      throw error;
    }
    return signedURL;
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
    };
    let review = await createReview(reviewObj);
    setUploading(false);
    setReview(false);
    setSuccess(true);
    stopStream();
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
            <a className={`text-white bg-purple hover:bg-purple-extradark inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-base font-medium`}>Sign up</a>
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

              <div className={`col-span-4 border min-h-300px flex justify-center items-center`}>
                <video id="streamPlayer" style={{ width: 400 }} muted ref={streamRef} onCanPlay={handleCanPlay} className={`${recorded ? "hidden" : "block"}`}>
                  Video stream not available.
                </video>
                <video id="player" style={{ width: 400 }} autoPlay controls src={video} className={`${recorded ? "block" : "hidden"}`}></video>
              </div>

              <div className="col-span-4 flex justify-center items-center space-x-2">
                {recording ? (
                  <button
                    onClick={(e) => onStop(e)}
                    className="flex justify-center items-center border border-red-500 py-2 px-4 inline-flex justify-center text-md font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-0"
                  >
                    <StopIcon className="h-6 w-6 text-white mr-2 animate-pulse" />
                    <span className="animate-pulse">Stop</span>
                  </button>
                ) : (
                  <button
                    onClick={(e) => onRecord(e)}
                    className="flex justify-center items-center border border-green-500 py-2 px-4 inline-flex justify-center text-md font-medium text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-0"
                  >
                    <VideoCameraIcon className="h-6 w-6 text-white mr-2" />
                    Record {recorded ? "again" : "review"}
                  </button>
                )}
                {recorded && (
                  <button
                    type="submit"
                    className="bg-purple border border-transparent shadow-sm py-2 px-8 inline-flex justify-center text-md font-medium text-white hover:bg-purple-extradark focus:outline-none focus:ring-0"
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
