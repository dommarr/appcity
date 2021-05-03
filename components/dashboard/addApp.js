import { useState, useEffect } from "react";
import { supabase } from "../../utils/initSupabase";
import Loading from "./sectionLoading";

export default function AddApp(props) {
  //   const [loading, setLoading] = useState(true);

  //   const [vendorname, setVendorname] = useState("");
  //   const [vendorwebsite, setVendorwebsite] = useState("");
  // const [vendorlogo, setVendorlogo] = useState("");

  // //   // Fetch on load
  // //   useEffect(() => {
  // //     fetchData(props.user.id);
  // //   }, []);

  // //   const fetchData = async (user_id) => {
  // //     try {
  // //       let vendorData = await supabase
  // //         .from("users")
  // //         .select(
  // //           `
  // //             vendors:vendor_id (*)
  // //             `
  // //         )
  // //         .eq("id", user_id);
  // //       setVendorname(vendorData.body[0].vendors.name);
  // //       setVendorwebsite(vendorData.body[0].vendors.website);
  // //       // setVendorlogo(vendorData.body[0].vendors.logo);
  // //     } catch (error) {
  // //       alert(error);
  // //     }
  // //     setLoading(false);
  // //   };

  //   if (loading) return <Loading />;

  return (
    <section className="py-4 space-y-4">
      <form>
        <div className="shadow sm:overflow-hidden">
          <div className="bg-white py-6 px-4 sm:p-6">
            <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSdO8mlmArC-PYx5__sa4FT4URIjphMquXvTna8HlTnd4coDkg/viewform?embedded=true" width="100%" height="1300" frameborder="0" marginheight="0" marginwidth="0">
              Loading…
            </iframe>
          </div>
        </div>
      </form>
    </section>
  );
}
