import Footer from "../components/global/footer";
import Header from "../components/global/header";
import Container from "../components/global/fullContainer";

export default function Review() {
  return (
    <>
      <Header style="dark" />
      <Container>
        <div className="bg-white">
          <div className="max-w-7xl mx-auto py-10 px-4 sm:py-12 sm:px-6 lg:px-8">
            <div className="text-center">
              {/* <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Pricing</h2> */}
              <h1 className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">Leave a review</h1>
              <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">Help out your fellow creators by leaving a review.</p>
            </div>
          </div>
        </div>
        <section className="py-10"></section>
      </Container>

      <Footer dark={true} />
    </>
  );
}
