import { connectCurrentRefinements } from "react-instantsearch-dom";

const ClearRefinementsTemplate = ({ items, refine, filter, filterHandler, handleClear }) => {
  const handleClick = (e) => {
    e.preventDefault;
    refine(items);
    handleClear();
    filterHandler("NOT _tags:hidden");
  };

  return (
    <div className="w-full flex items-center justify-center mb-5">
      <button
        onClick={handleClick}
        disabled={!items.length && filter === "NOT _tags:hidden"}
        className={`${!items.length && filter === "NOT _tags:hidden" ? "bg-purple-extralight cursor-not-allowed" : "bg-purple hover:bg-purple-dark"} py-2 px-4 text-xs text-white`}
      >
        Clear all filters
      </button>
    </div>
  );
};

const CustomClearRefinements = connectCurrentRefinements(ClearRefinementsTemplate);

export default CustomClearRefinements;
