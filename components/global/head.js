import NextHead from "next/head";
import { string } from "prop-types";
import React from "react";

const defaultDescription =
  "Shop for software like you shop for everything else with AppCity. We are the app store for business software, where creators, founders, and small business owners of any kind can find and buy the best business apps to take their business to the next level.";
const defaultOGURL = "https://www.appcity.com/";
const defaultOGImage =
  "https://dnlvkovcawtkzuvpmmgr.supabase.co/storage/v1/object/sign/website_images/sms-share-image.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ3ZWJzaXRlX2ltYWdlcy9zbXMtc2hhcmUtaW1hZ2UucG5nIiwiaWF0IjoxNjIyMTQ4OTQ1LCJleHAiOjE5Mzc1MDg5NDV9.eNnIsVFGHRZ5FGFizXv0drHbSSoTjtpWXoE5weLUIAs";
const defaultTitle = "AppCity";

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
    <meta name="twitter:site" content={props.url || defaultOGURL} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content={props.ogImage || defaultOGImage} />
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
