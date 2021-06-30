import GhostContentAPI from "@tryghost/content-api";

// Create API instance with site credentials
const api = new GhostContentAPI({
  url: "https://appcity.ghost.io",
  key: "1c87135377de34b9f7f4349c40",
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
