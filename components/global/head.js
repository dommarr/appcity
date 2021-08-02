import NextHead from "next/head";
import { string } from "prop-types";
import React from "react";

const defaultDescription =
  "Shop for software like you shop for everything else with AppCity. We are the app store for business software, where creators, founders, and small business owners of any kind can find and buy the best business apps to take their business to the next level.";
const defaultOGURL = "https://www.appcity.com/";
const defaultOGImage =
  "https://dnlvkovcawtkzuvpmmgr.supabase.in/storage/v1/object/sign/website_images/sms_share_image.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ3ZWJzaXRlX2ltYWdlcy9zbXNfc2hhcmVfaW1hZ2UuanBnIiwiaWF0IjoxNjI3OTM0MzcyLCJleHAiOjE5NDMyOTQzNzJ9.AiHix8EmE3uEd6pl6xxWsLGirE5F2EhibFRs2Ggoef8";
const defaultTitle = "AppCity";
const twitterImage =
  "https://dnlvkovcawtkzuvpmmgr.supabase.in/storage/v1/object/sign/website_images/twitter_card.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ3ZWJzaXRlX2ltYWdlcy90d2l0dGVyX2NhcmQuanBnIiwiaWF0IjoxNjI3OTM1NTQwLCJleHAiOjE5NDMyOTU1NDB9.xGBbJ9Mqy2v1fO3rc4ZX4DEPqa0Doos76Nc0jXZ9DGI";

export const Head = (props) => (
  <NextHead>
    <meta charSet="UTF-8" />
    <title>{props.title || defaultTitle}</title>
    <meta name="description" content={props.description || defaultDescription} />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
    <meta name="theme-color" content="#0F0059" />
    <meta property="og:url" content={props.url || defaultOGURL} />
    <meta property="og:title" content={props.title || defaultTitle} />
    <meta property="og:description" content={props.description || defaultDescription} />
    {/* https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/summary-card-with-large-image */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content={props.url || defaultOGURL} />
    <meta name="twitter:creator" content="@dommmarr" />
    <meta name="twitter:title" content="AppCity" />
    <meta name="twitter:description" content="Shop for software like you shop for everything else." />
    <meta name="twitter:image" content={twitterImage} />
    <meta property="og:image" content={props.ogImage || defaultOGImage} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <link rel="stylesheet" href="https://unpkg.com/react-instantsearch-theme-algolia@3.0.0/style.min.css" />
    {/* <link rel="stylesheet" href="../../styles/instantsearch.css" /> */}
  </NextHead>
);

Head.propTypes = {
  title: string,
  description: string,
  url: string,
  ogImage: string,
};

{
  /* old favicon info */
}
{
  /* <link rel="icon" sizes="192x192" href="/static/touch-icon.png" />
    <link rel="apple-touch-icon" href="/static/touch-icon.png" />
    <link rel="mask-icon" href="/static/favicon-mask.svg" color="#49B882" /> */
}

export default Head;
