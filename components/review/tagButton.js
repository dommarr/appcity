import { useState } from "react";

export default function TagButton({ tag, add, remove }) {
  const [selected, setSelected] = useState(false);

  let buttonClass = "";

  const handleTag = () => {
    if (selected) {
      remove(tag.id);
    } else {
      add(tag.id);
    }
    setSelected(!selected);
  };

  if (tag.type === "positive") {
    buttonClass = `m-1 inline-flex items-center px-2.5 py-1.5 border text-xs font-medium focus:outline-none focus:ring-0 ${
      selected ? "text-green-50 bg-green-600 border-green-600" : "text-green-600 bg-green-50 border-green-600 hover:text-green-600 hover:bg-green-200"
    }`;
  } else if (tag.type === "negative") {
    buttonClass = `m-1 inline-flex items-center px-2.5 py-1.5 border text-xs font-medium focus:outline-none focus:ring-0 ${
      selected ? "text-red-50 bg-red-600 border-red-600" : "text-red-600 bg-red-50 border-red-600 hover:text-red-600 hover:bg-red-200"
    }`;
  } else {
    buttonClass = `m-1 inline-flex items-center px-2.5 py-1.5 border text-xs font-medium focus:outline-none focus:ring-0 ${
      selected ? "text-indigo-50 bg-indigo-600 border-indigo-600" : "text-indigo-600 bg-indigo-50 border-indigo-600 hover:text-indigo-600 hover:bg-indigo-200"
    }`;
  }

  return (
    <button type="button" className={buttonClass} onClick={(e) => handleTag()}>
      {tag.name}
    </button>
  );
}
