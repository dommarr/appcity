import { useState } from "react";
import { Loader, Check, AlertCircle } from "react-feather";

export default function FormButton({ type, size, func, params }) {
  const [status, setStatus] = useState("");

  const runFunction = async () => {
    setStatus("loading");
    try {
      await func(params);
      setStatus("success");
      setTimeout(() => {
        setStatus("");
      }, 3000);
    } catch (error) {
      setStatus("failure");
      setTimeout(() => {
        setStatus("");
      }, 3000);
    }
  };

  const handleClick = () => {
    if (status === "") {
      if (type === "delete") {
        setStatus("confirm");
      } else {
        runFunction();
      }
    } else if (status === "confirm") {
      runFunction();
    }
  };

  if (type === "delete")
    return (
      <button
        type="button"
        onClick={() => handleClick()}
        className={`inline-flex items-center px-2.5 py-1.5 space-x-2 border border-transparent text-xs font-medium shadow-sm text-white focus:outline-none focus:ring-0 ${
          status !== "success" && status !== "failure" ? "bg-red-600 hover:bg-red-700" : ""
        } ${status === "success" ? "bg-green-600 cursor-not-allowed" : ""} ${status === "failure" ? "bg-red-600 cursor-not-allowed" : ""}`}
      >
        {status === "" && "Delete"}
        {status === "confirm" && "Are you sure?"}
        {status === "loading" && <Loader className="h-4 w-4 text-white animate-spin mx-4" />}
        {status === "success" && (
          <>
            <Check className="h-4 w-4 text-white" />
            <span>Success</span>
          </>
        )}
        {status === "failure" && (
          <>
            <AlertCircle className="h-4 w-4 text-white" />
            <span>Please try again</span>
          </>
        )}
      </button>
    );

  return (
    <button
      type="button"
      className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium text-white bg-purple hover:bg-purple-dark focus:outline-none focus:ring-0"
    >
      Submit
    </button>
  );
}
