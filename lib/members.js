import GhostContentAPI from "@tryghost/admin-api";

const ghostUrl = process.env.NEXT_PUBLIC_GHOST_URL;
const ghostKey = process.env.NEXT_PUBLIC_GHOST_KEY;
const ghostAdminKey = process.env.NEXT_PUBLIC_GHOST_ADMIN;

// Create API instance with site credentials
const api = new GhostAdminAPI({
  url: ghostUrl,
  key: ghostAdminKey,
  version: "v3",
});

export async function getMembers() {
  return await api.members().catch((err) => {
    console.error(err);
  });
}

export async function createMember() {
  return await api.members({ params }).catch((err) => {
    console.error(err);
  });
}

export async function subscribe() {
  return await api.members({ params }).catch((err) => {
    console.error(err);
  });
}

export async function unsubscribe() {
  return await api.members({ params }).catch((err) => {
    console.error(err);
  });
}
