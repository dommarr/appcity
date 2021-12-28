export default function PriceFilter({ monthly, minYearly, maxYearly, minMonthly, maxMonthly, handleChange, handleYearlySubmit, handleMonthlySubmit }) {
  return (
    <>
      <form onSubmit={handleYearlySubmit} className={`grid grid-cols-9 gap-2 items-center justify-center ${monthly ? "hidden" : "block"}`}>
        <input type="number" name="minYearly" id="minYearly" placeholder="min" value={minYearly} onChange={handleChange} className="col-span-3 border border-gray-200 h-full text-sm"></input>
        <span className="col-span-1 text-center">to</span>
        <input type="number" name="maxYearly" id="maxYearly" placeholder="max" value={maxYearly} onChange={handleChange} className="col-span-3 border border-gray-200 h-full text-sm"></input>
        <button type="submit" className="col-span-2 bg-purple text-white text-sm p-2 uppercase hover:bg-purple-dark">
          ok
        </button>
      </form>
      <form onSubmit={handleMonthlySubmit} className={`grid grid-cols-9 gap-2 items-center justify-center ${monthly ? "block" : "hidden"}`}>
        <input type="number" name="minMonthly" id="minMonthly" placeholder="min" value={minMonthly} onChange={handleChange} className="col-span-3 border border-gray-200 h-full text-sm"></input>
        <span className="col-span-1 text-center">to</span>
        <input type="number" name="maxMonthly" id="maxMonthly" placeholder="max" value={maxMonthly} onChange={handleChange} className="col-span-3 border border-gray-200 h-full text-sm"></input>
        <button type="submit" className="col-span-2 bg-purple text-white text-sm p-2 uppercase hover:bg-purple-dark">
          ok
        </button>
      </form>
    </>
  );
}
