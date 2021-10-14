export default function Tag({ tag }) {
  let colorClass = "";

  if (tag.type === "positive") {
    colorClass = `m-0.5 inline-flex items-center px-2 py-1 text-xs font-medium focus:outline-none focus:ring-0 text-green-600 bg-green-50 shadow-sm border border-green-100`;
  } else if (tag.type === "negative") {
    colorClass = `m-0.5 inline-flex items-center px-2 py-1 text-xs font-medium focus:outline-none focus:ring-0 text-red-600 bg-red-50 shadow-sm border border-red-100`;
  } else {
    colorClass = `m-0.5 inline-flex items-center px-2 py-1 text-xs font-medium focus:outline-none focus:ring-0 text-indigo-600 bg-indigo-50 shadow-sm border border-indigo-100`;
  }

  return <div className={colorClass}>{tag.name}</div>;
}
