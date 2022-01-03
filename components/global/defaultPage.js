import Head from "./head";

export default function DefaultPage({ title, description, url, children }) {
  return (
    <div className="bg-white">
      <Head title={`${title} | AppCity`} description={description} url={url} />
      <main className="pb-24">
        <div className="text-center py-16 px-4 sm:px-6 lg:px-8">
          <h1 className="pb-4 text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-l from-purple-extralight via-purple to-purple-extradark">{title}</h1>
          <p className="max-w-3xl mx-auto text-sm sm:text-base text-gray-500">{description}</p>
        </div>
        <section className="max-w-7xl mx-auto overflow-hidden px-4 sm:px-6 lg:px-8">{children}</section>
      </main>
    </div>
  );
}
