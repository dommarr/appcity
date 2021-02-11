import Footer from "../../components/footer";
import Header from "../../components/header";
import { useState } from "react";

export default function Product(props) {
  const [tier, setTier] = useState(props.tier);

  return (
    <>
      <Header dark="true" />
      <div className="block md:flex md:flex-row">
        {/* Left */}
        <div className="bg-purple h-96 w-full md:w-1/2"></div>
        {/* Right */}
        <div className="bg-gray-200 h-96 w-full md:w-1/2"></div>
      </div>
      <Footer />
    </>
  );
}
