const siteUrl = "https://www.appcity.com";

module.exports = {
  siteUrl: siteUrl,
  generateRobotsTxt: true,
  exclude: ["/server-sitemap.xml", "/customLogin"],
  robotsTxtOptions: {
    additionalSitemaps: [`${siteUrl}/server-sitemap.xml`],
  },
};
