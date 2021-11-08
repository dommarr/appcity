import { useState, useRef } from "react";
import { VideoCameraIcon } from "@heroicons/react/solid";
import Tooltip from "../../components/global/tooltip";
import MobileRecorder from "./mobileRecorder";
import DesktopRecorder from "./desktopRecorder";
import { isMobile } from "react-device-detect";
import { PencilAltIcon, PencilIcon } from "@heroicons/react/outline";
import ReviewForm from "./reviewForm";

export default function ReviewRecorder({ user, product }) {
  const [showReview, setShowReview] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState();
  const [closingCamera, setClosingCamera] = useState(false);

  // const handleClose = (e) => {
  //   e.preventDefault();
  //   if (!isMobile) {
  //     setClosingCamera(true);
  //     stopStream();
  //     setTimeout(() => {
  //       desktopCloseComplete();
  //     }, 2000);
  //   } else {
  //     setShowReview(false);
  //   }
  // };

  const handleClose = (e) => {
    e.preventDefault();
    setShowReview(false);
  };

  // const desktopCloseComplete = () => {
  //   setReview(false);
  //   setClosingCamera(false);
  // };

  // const stopStream = () => {
  //   if (mediaRecorder) {
  //     mediaRecorder.stream.getTracks().forEach(function (track) {
  //       track.stop();
  //     });
  //   }
  // };

  return (
    <div className="self-center mt-8 mb-12 flex">
      {!showReview && !success && (
        <div className="flex-col items-center space-y-2">
          <button
            type="button"
            onClick={() => setShowReview(true)}
            className="bg-purple border border-transparent shadow-sm py-2 px-4 inline-flex justify-center text-md font-medium text-white hover:bg-purple-dark focus:outline-none focus:ring-0"
          >
            {/* <VideoCameraIcon className="h-6 w-6 text-white mr-2" />
            Leave a video review */}
            <PencilAltIcon className="h-6 w-6 text-white mr-2" />
            Leave a review
          </button>
          {/* <Tooltip text="Why only video?" caption="Video reviews are more trustworthy. When someone puts their face and name on a video, you can better trust its authenticity." /> */}
        </div>
      )}
      {showReview && (
        <div className="flex flex-col">
          {/* {isMobile ? (
            <MobileRecorder user={user} product={product} setReview={setReview} setSuccess={setSuccess} handleClose={handleClose} />
          ) : (
            <DesktopRecorder
              user={user}
              product={product}
              setReview={setReview}
              setSuccess={setSuccess}
              handleClose={handleClose}
              mediaRecorder={mediaRecorder}
              setMediaRecorder={setMediaRecorder}
              stopStream={stopStream}
              closingCamera={closingCamera}
            />
          )} */}
          <ReviewForm user={user} product={product} setShowReview={setShowReview} setSuccess={setSuccess} handleClose={handleClose} />
          {/* <div className="w-full border-t border-gray-300 mt-8" /> */}
        </div>
      )}
      {success && (
        <div className="flex flex-col justify-center items-center">
          <div className="text-green-600 text-lg font-medium">Review submitted successfully.</div>
          <div className="text-green-600 text-lg font-medium">Thank you!</div>
        </div>
      )}
    </div>
  );
}
