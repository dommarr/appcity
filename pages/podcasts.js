import Footer from "../components/global/footer";
import Header from "../components/global/header";
import Container from "../components/global/fullContainer";
import Link from "next/link";
import Head from "../components/global/head";

export default function Home() {
  return (
    <>
      <Header style="dark" />
      <Head title="Podcast Starter Kit" description="The best apps to run your podcast business." url="shopappcity.com/podcasts" />
      <Container>
        <div className="bg-white">
          <div className="max-w-7xl mx-auto py-10 px-4 sm:py-12 sm:px-6 lg:px-8">
            <div className="text-center">
              {/* <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Pricing</h2> */}
              <h1 className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">Podcast Starter Kit</h1>
              <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">The best apps to run your podcast business.</p>
            </div>
          </div>
        </div>
        <section className="py-10">
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-start">
              <span className="pr-3 bg-white text-3xl font-medium text-gray-900">Recording</span>
            </div>
          </div>
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Link href="/product/1019?tier=1060">
              <a>
                <li className="col-span-1 bg-white shadow divide-x divide-gray-200 flex p-4">
                  <img className="w-28 h-28 mr-4" src="https://assets.brandfetch.io/b2151ba927bb42e.png" alt="Riverside Logo" />
                  <div className="flex items-center justify-center text-2xl font-medium pl-4">Riverside.FM</div>
                </li>
              </a>
            </Link>
            <Link href="/product/1021">
              <a>
                <li className="col-span-1 bg-white shadow divide-x divide-gray-200 flex p-4">
                  <img className="w-28 h-28 mr-4" src="https://assets.brandfetch.io/a6c740900a504b2.png" alt="Squadcast Logo" />
                  <div className="flex items-center justify-center text-2xl font-medium pl-4">SquadCast.fm</div>
                </li>
              </a>
            </Link>
            <Link href="/product/1020">
              <a>
                <li className="col-span-1 bg-white shadow divide-x divide-gray-200 flex p-4">
                  <img className="w-28 h-28 mr-4" src="https://assets.brandfetch.io/0083c38b256a4ff.png" alt="Zencastr Logo" />
                  <div className="flex items-center justify-center text-2xl font-medium pl-4">Zencastr</div>
                </li>
              </a>
            </Link>
          </ul>
        </section>
        <section className="py-10">
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-start">
              <span className="pr-3 bg-white text-3xl font-medium text-gray-900">Editing</span>
            </div>
          </div>
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Link href="/product/1022">
              <a>
                <li className="col-span-1 bg-white shadow divide-x divide-gray-200 flex p-4">
                  <img className="w-28 h-28 mr-4" src="https://assets.brandfetch.io/a495cd2a2242446.png" alt="Descript Logo" />
                  <div className="flex items-center justify-center text-2xl font-medium pl-4">Descript</div>
                </li>
              </a>
            </Link>
            <Link href="/product/1023">
              <a>
                <li className="col-span-1 bg-white shadow divide-x divide-gray-200 flex p-4">
                  <img className="w-28 h-28 mr-4" src="https://assets.brandfetch.io/474604458c44473.png" alt="Avid Logo" />
                  <div className="flex items-center justify-center text-2xl font-medium pl-4">Avid Pro Tools</div>
                </li>
              </a>
            </Link>
            <Link href="/product/1024">
              <a>
                <li className="col-span-1 bg-white shadow divide-x divide-gray-200 flex p-4">
                  <img className="w-28 h-28 mr-4" src="https://assets.brandfetch.io/24a65c0921e547e.png" alt="Adobe Logo" />
                  <div className="flex items-center justify-center text-2xl font-medium pl-4">Adobe Audition</div>
                </li>
              </a>
            </Link>
          </ul>
        </section>
        <section className="py-10">
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-start">
              <span className="pr-3 bg-white text-3xl font-medium text-gray-900">Hosting</span>
            </div>
          </div>
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Link href="/product/1025">
              <a>
                <li className="col-span-1 bg-white shadow divide-x divide-gray-200 flex p-4">
                  <img className="w-28 h-28 mr-4" src="https://assets.brandfetch.io/9001f85ea408464.png" alt="Anchor Logo" />
                  <div className="flex items-center justify-center text-2xl font-medium pl-4">Anchor</div>
                </li>
              </a>
            </Link>
            <Link href="/product/1026">
              <a>
                <li className="col-span-1 bg-white shadow divide-x divide-gray-200 flex p-4">
                  <img className="w-28 h-28 mr-4" src="https://assets.brandfetch.io/4baf828b49164ac.png" alt="Transistor Logo" />
                  <div className="flex items-center justify-center text-2xl font-medium pl-4">Transistor.fm</div>
                </li>
              </a>
            </Link>
            <Link href="/product/1027">
              <a>
                <li className="col-span-1 bg-white shadow divide-x divide-gray-200 flex p-4">
                  <img className="w-28 h-28 mr-4" src="https://assets.brandfetch.io/78f54b7a65a14eb.png" alt="Buzzsprout Logo" />
                  <div className="flex items-center justify-center text-2xl font-medium pl-4">Buzzsprout</div>
                </li>
              </a>
            </Link>
          </ul>
        </section>
        <section className="py-10 mb-20">
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-start">
              <span className="pr-3 bg-white text-3xl font-medium text-gray-900">Social Media</span>
            </div>
          </div>
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Link href="/product/1028">
              <a>
                <li className="col-span-1 bg-white shadow divide-x divide-gray-200 flex p-4">
                  <img className="w-28 h-28 mr-4" src="https://assets.brandfetch.io/8114e729036f496.png" alt="Wavve Logo" />
                  <div className="flex items-center justify-center text-2xl font-medium pl-4">Wavve</div>
                </li>
              </a>
            </Link>
            <Link href="/product/1029">
              <a>
                <li className="col-span-1 bg-white shadow divide-x divide-gray-200 flex p-4">
                  <img className="w-28 h-28 mr-4" src="https://assets.brandfetch.io/3bb26eb4c57546e.png" alt="Buffer Logo" />
                  <div className="flex items-center justify-center text-2xl font-medium pl-4">Buffer</div>
                </li>
              </a>
            </Link>
            <Link href="/product/1030">
              <a>
                <li className="col-span-1 bg-white shadow divide-x divide-gray-200 flex p-4">
                  <img className="w-28 h-28 mr-4" src="https://assets.brandfetch.io/f29bbc187961468.png" alt="Hootsuite Logo" />
                  <div className="flex items-center justify-center text-2xl font-medium pl-4">Hootsuite</div>
                </li>
              </a>
            </Link>
          </ul>
        </section>
      </Container>
      <Footer dark={true} />
    </>
  );
}
