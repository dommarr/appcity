import { supabase } from "../../../utils/initSupabase";

export default async (req, res) => {
  let { data: reviews, error } = await supabase.from("reviews").select("*").eq("product", req.query.id).eq("video_available", true);
  if (error) return res.status(401).json({ error: error.message });
  return res.status(200).json(reviews);
};
