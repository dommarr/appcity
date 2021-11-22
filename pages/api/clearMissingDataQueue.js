import { supabase } from "../../utils/initSupabase";

const updateTasks = async () => {
  const { data, error } = await supabase.from("tasks").update({ complete: true }).eq("name", "Missing Data").eq("complete", false);
  if (error) {
    throw error;
  }
  return data.length;
};

export default async function (req, res) {
  let update = await updateTasks();

  res.statusCode = 200;
  res.json(update);
}
