module.exports = {
  images: {
    domains: ["global-uploads.webflow.com", "dnlvkovcawtkzuvpmmgr.supabase.co", "dnlvkovcawtkzuvpmmgr.supabase.in", "assets.brandfetch.io"],
  },
  async redirects() {
    return [
      {
        source: "/firstbase",
        destination: "/kits/Firstbase",
        permanent: true,
      },
    ];
  },
};
