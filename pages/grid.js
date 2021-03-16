export default function Grid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-6mc md:grid-rows-3mc gap-4">
      <div className="bg-gray-300 h-40 p-4 order-1 md:order-1">title-1</div>
      <div className="bg-gray-300 h-40 p-4 order-2 md:order-2">title-2</div>
      <div className="bg-gray-300 h-40 p-4 order-7 md:order-3">title-3</div>
      <div className="bg-gray-300 h-40 p-4 order-8 md:order-4">title-4</div>
      <div className="bg-gray-300 h-40 p-4 order-3 md:order-5">mid-1</div>
      <div className="bg-gray-300 h-40 p-4 order-4 md:order-6">mid-2</div>
      <div className="bg-gray-300 h-40 p-4 order-9 md:order-7">mid-3</div>
      <div className="bg-gray-300 h-40 p-4 order-10 md:order-8">mid-4</div>
      <div className="bg-gray-300 h-40 p-4 order-5 md:order-9">end-1</div>
      <div className="bg-gray-300 h-40 p-4 order-6 md:order-10">end-2</div>
      <div className="bg-gray-300 h-40 p-4 order-11 md:order-11">end-3</div>
      <div className="bg-gray-300 h-40 p-4 order-12 md:order-12">end-4</div>
    </div>
  );
}
