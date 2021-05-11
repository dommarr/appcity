import { useState, useEffect } from "react";
import { supabase } from "../../utils/initSupabase";
import Loading from "./sectionLoading";

export default function AddApp(props) {
  return (
    <section className="py-4 space-y-4">
      <h1 className="text-2xl font-semibold text-gray-900">Add your app</h1>
      <form>
        <div className="shadow sm:overflow-hidden">
          <div className="bg-white py-6 px-4 sm:p-6">
            <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSdO8mlmArC-PYx5__sa4FT4URIjphMquXvTna8HlTnd4coDkg/viewform?embedded=true" width="100%" height="1300" frameBorder="0" marginHeight="0" marginWidth="0">
              Loading…
            </iframe>
          </div>
        </div>
      </form>
    </section>
  );
}
