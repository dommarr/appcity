import { useState } from "react";
import Iframe from "./iFrame";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/solid";

export default function FormTip({ video_id }) {
  const [show, setShow] = useState(false);

  if (!show)
    return (
      <div className="flex space-x-1 cursor-pointer mt-2" onClick={() => setShow(!show)}>
        <span className="text-xs text-blue-600 underline">Show video tip</span>
        <ChevronDownIcon className="h-4 w-4 text-blue-600" />
      </div>
    );

  return (
    <div className="flex flex-col mt-2">
      <div className="flex space-x-1 cursor-pointer" onClick={() => setShow(!show)}>
        <span className="text-xs text-blue-600 underline">Hide video tip</span>
        <ChevronUpIcon className="h-4 w-4 text-blue-600" />
      </div>
      <Iframe video_id={video_id} />
    </div>
  );
}
