import { getPosts } from "../../lib/posts";
import Link from "next/link";
import Head from "../../components/global/head";
import Page from "../../components/global/defaultPage";

let description = "Best software picks + tips and tricks from the experts at AppCity.";

export default function IndexPage(props) {
  let posts = props.posts;
  return (
    <Page title={"Blog"} description={description} url="https://www.appcity.com/blog">
      <div className="max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none pb-4">
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
    </Page>
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
