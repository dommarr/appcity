module.exports = {
  images: {
    domains: ["global-uploads.webflow.com", "dnlvkovcawtkzuvpmmgr.supabase.co", "dnlvkovcawtkzuvpmmgr.supabase.in", "assets.brandfetch.io"],
  },
  async redirects() {
    return [
      {
        source: "/firstbase",
        destination: "/kits/firstbase",
        permanent: true,
      },
      {
        source: "/fieldx",
        destination: "/kits/field-x-y",
        permanent: true,
      },
      {
        source: "/fieldy",
        destination: "/kits/field-x-y",
        permanent: true,
      },
    ];
  },
};
