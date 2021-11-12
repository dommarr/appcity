import { getSinglePost, getPosts, getSixPosts } from "../../lib/posts";
import Head from "../../components/global/head";
import Link from "next/link";

export default function PostPage({ post, morePosts }) {
  let author = post.primary_author;
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  let date = new Intl.DateTimeFormat("en-US", options).format(new Date(post.published_at));

  console.log(post);
  return (
    <>
      <Head title={`${post.title} | AppCity`} description={post.excerpt} ogImage={post.feature_image} url={`https://www.appcity.com/blog/${post.slug}`} />
      <div className="relative py-16 bg-white overflow-hidden">
        <div className="hidden lg:block lg:absolute lg:inset-y-0 lg:h-full lg:w-full">
          <div className="relative h-full text-lg max-w-prose mx-auto" aria-hidden="true">
            <svg className="absolute top-12 left-full transform translate-x-32" width={404} height={384} fill="none" viewBox="0 0 404 384">
              <defs>
                <pattern id="74b3fd99-0a6f-4271-bef2-e80eeafdf357" x={0} y={0} width={20} height={20} patternUnits="userSpaceOnUse">
                  <rect x={0} y={0} width={4} height={4} className="text-gray-200" fill="currentColor" />
                </pattern>
              </defs>
              <rect width={404} height={384} fill="url(#74b3fd99-0a6f-4271-bef2-e80eeafdf357)" />
            </svg>
            <svg className="absolute top-1/2 right-full transform -translate-y-1/2 -translate-x-32" width={404} height={384} fill="none" viewBox="0 0 404 384">
              <defs>
                <pattern id="f210dbf6-a58d-4871-961e-36d5016a0f49" x={0} y={0} width={20} height={20} patternUnits="userSpaceOnUse">
                  <rect x={0} y={0} width={4} height={4} className="text-gray-200" fill="currentColor" />
                </pattern>
              </defs>
              <rect width={404} height={384} fill="url(#f210dbf6-a58d-4871-961e-36d5016a0f49)" />
            </svg>
            <svg className="absolute bottom-12 left-full transform translate-x-32" width={404} height={384} fill="none" viewBox="0 0 404 384">
              <defs>
                <pattern id="d3eb07ae-5182-43e6-857d-35c643af9034" x={0} y={0} width={20} height={20} patternUnits="userSpaceOnUse">
                  <rect x={0} y={0} width={4} height={4} className="text-gray-200" fill="currentColor" />
                </pattern>
              </defs>
              <rect width={404} height={384} fill="url(#d3eb07ae-5182-43e6-857d-35c643af9034)" />
            </svg>
          </div>
        </div>

        <div className="relative px-4 sm:px-6 lg:px-8 divide-y">
          <div>
            <div className="text-lg max-w-prose mx-auto">
              <h1>
                <span className="block text-base text-center text-indigo-600 font-semibold tracking-wide">{post.reading_time} min read</span>
                <span className="mt-2 block text-3xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">{post.title}</span>
              </h1>
              <div className="mt-2 flex space-x-1 text-sm text-gray-500 items-center justify-center">
                <img className="h-10 w-10 rounded-full mr-1" src={author.profile_image} alt="" />
                <span>{author.name}</span>
                <span aria-hidden="true">&middot;</span>
                <time dateTime={post.datetime}>{date}</time>
              </div>
            </div>
            <div className="mt-6 mb-20 prose prose-indigo prose-lg text-gray-500 mx-auto" dangerouslySetInnerHTML={{ __html: post.html }} />
          </div>
          {/* more from the blog */}
          <div className="pt-16 pb-20 lg:pt-24 lg:pb-28">
            <div className="relative max-w-7xl mx-auto">
              <div className="text-center">
                <h2 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl">More from the blog</h2>
              </div>
              <div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
                {morePosts.map((post) => {
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
        </div>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  const posts = await getPosts();

  // Get the paths we want to create based on posts
  const paths = posts.map((post) => ({
    params: { slug: post.slug },
  }));

  // { fallback: false } means posts not found should 404.
  return { paths, fallback: "blocking" };
}

// Pass the page slug over to the "getSinglePost" function
// In turn passing it to the posts.read() to query the Ghost Content API
export async function getStaticProps(context) {
  const post = await getSinglePost(context.params.slug);
  const morePosts = await getSixPosts(context.params.slug);

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: { post, morePosts },
    revalidate: 60,
  };
}
