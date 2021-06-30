import GhostContentAPI from "@tryghost/content-api";

const ghostUrl = process.env.NEXT_PUBLIC_GHOST_URL;
const ghostKey = process.env.NEXT_PUBLIC_GHOST_KEY;

// Create API instance with site credentials
const api = new GhostContentAPI({
  url: ghostUrl,
  key: ghostKey,
  version: "v3",
});

export async function getPosts() {
  return await api.posts
    .browse({
      include: "tags,authors",
      limit: "all",
    })
    .catch((err) => {
      console.error(err);
    });
}

export async function getSinglePost(postSlug) {
  return await api.posts
    .read({
      include: "tags,authors",
      slug: postSlug,
    })
    .catch((err) => {
      console.error(err);
    });
}

export async function getSixPosts(currentSlug) {
  let filter = `slug:-${currentSlug}`;
  return await api.posts
    .browse({
      include: "tags,authors",
      limit: "6",
      order: "published_at DESC",
      filter: filter,
    })
    .catch((err) => {
      console.error(err);
    });
}
