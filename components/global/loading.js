import Container from "../../components/global/mobilePaddingContainer";

export default function Loading() {
  return (
    <Container>
      <div className="animate-pulse my-20">
        <div className="grid grid-cols-3">
          <h1 className="col-start-2 text-2xl font-semibold text-gray-900 bg-gray-300 h-8"></h1>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-20 mb-40 p-4 bg-white shadow">
          <div className="bg-gray-200 col-span-1 h-6"></div>
          <div className="bg-gray-200 col-span-3 h-6"></div>
          <div className="bg-gray-200 col-span-3 h-6"></div>
          <div className="bg-gray-200 col-span-2 h-6"></div>
        </div>
      </div>
    </Container>
  );
}
