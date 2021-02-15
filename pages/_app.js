import "../styles/globals.css";
import SimpleReactLightbox from "simple-react-lightbox-pro";

function MyApp({ Component, pageProps }) {
  return (
    <SimpleReactLightbox>
      <Component {...pageProps} />
    </SimpleReactLightbox>
  );
}

export default MyApp;
