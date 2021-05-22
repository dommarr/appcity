export default function Button({ text }) {
  return (
    <button
      type="button"
      className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium text-white bg-purple hover:bg-purple-dark focus:outline-none focus:ring-0"
    >
      {text}
    </button>
  );
}
