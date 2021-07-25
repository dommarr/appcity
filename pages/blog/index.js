import { getPosts } from "../../lib/posts";
import Link from "next/link";
import Footer from "../../components/global/footer";
import Header from "../../components/global/header";
import Head from "../../components/global/head";
import Banner from "../../components/global/banner";

export default function IndexPage(props) {
  let posts = props.posts;
  return (
    <>
      <Banner />
      <Head title={`Blog`} description="Resources to help you get the most out of your business apps." url="shopappcity.com/blog" />
      <Header style="dark" />
      <div className="relative bg-gray-50 pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8">
        <div className="absolute inset-0">
          <div className="bg-white h-1/3 sm:h-2/3" />
        </div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl">From the blog</h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">Resources to help you get the most out of your business apps.</p>
          </div>
          <div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
            {posts.map((post) => {
              let author = post.primary_author;
              const options = {
                year: "numeric",
                month: "short",
                day: "numeric",
              };
              let date = new Intl.DateTimeFormat("en-US", options).format(new Date(post.published_at));
              let description = "";
              if (post.excerpt.length > 200) {
                description = post.excerpt.substring(0, 200).concat("...");
              } else {
                description = post.excerpt;
              }

              return (
                <Link key={post.title} href={`/blog/${post.slug}`}>
                  <div className="flex flex-col shadow-lg overflow-hidden hover:cursor-pointer">
                    <div className="flex-shrink-0">
                      <img className="h-48 w-full object-cover" src={post.feature_image} alt="" />
                    </div>
                    <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                      <div className="flex-1">
                        {/* <p className="text-sm font-medium text-indigo-600">
                    <a href={post.category.href} className="hover:underline">
                      {post.category.name}
                    </a>
                  </p> */}

                        <a className="block mt-2">
                          <p className="text-xl font-semibold text-gray-900">{post.title}</p>
                          <p className="mt-3 text-base text-gray-500">{description}</p>
                        </a>
                      </div>
                      <div className="mt-6 flex items-center">
                        <div className="flex-shrink-0">
                          <a href="/blog">
                            <span className="sr-only">{author.name}</span>
                            <img className="h-10 w-10 rounded-full" src={author.profile_image} alt="" />
                          </a>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            <a href="/blog" className="hover:underline">
                              {author.name}
                            </a>
                          </p>
                          <div className="flex space-x-1 text-sm text-gray-500">
                            <time dateTime={post.datetime}>{date}</time>
                            <span aria-hidden="true">&middot;</span>
                            <span>{post.reading_time} min read</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      <Footer dark={true} />
    </>
  );
}

export async function getStaticProps(context) {
  const posts = await getPosts();

  if (!posts) {
    return {
      notFound: true,
    };
  }

  return {
    props: { posts },
    revalidate: 60,
  };
}
