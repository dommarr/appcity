import { useState, useEffect } from "react";
import { supabase } from "../../utils/initSupabase";

export default function Favorites({ user }) {
  const [profile, setProfile] = useState(null);

  async function getProfile(user) {
    try {
      let response = await supabase.from("users").select("*").eq("id", user);
      return response.data;
    } catch (err) {
      alert(err);
    }
  }

  // Fetch on load
  useEffect(() => {
    async function fetchProfile() {
      const profileData = await getProfile(user.id);
      console.log(profileData);
      setProfile(profileData[0]);
    }
    fetchProfile();
  }, []);

  if (!profile) return <div>Loading...</div>;

  return (
    <section className="py-4 space-y-2">
      <div>These are your favorites</div>
    </section>
  );
}
