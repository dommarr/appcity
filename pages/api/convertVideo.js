// import { supabase } from "../../utils/initSupabase";
// import CloudConvert from "cloudconvert";

// const cloudKey =
//   "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiOWI4OGJhOWFhMGExNWUxNmZmMzcxYmE0MzkzYjVkZTY5OTdmMWVkZGJhMGUxM2VlNzhkMDU2NDQ3ZGY1YWVmMjI0OGY1YzkwZDJkZjg4ODciLCJpYXQiOjE2MjI4Mjc4NTYuNjM4NzY2LCJuYmYiOjE2MjI4Mjc4NTYuNjM4NzY4LCJleHAiOjQ3Nzg1MDE0NTYuNjAyNDUsInN1YiI6IjUxNTQ5NzQ1Iiwic2NvcGVzIjpbInVzZXIucmVhZCIsInVzZXIud3JpdGUiLCJ0YXNrLnJlYWQiLCJ0YXNrLndyaXRlIiwid2ViaG9vay5yZWFkIiwid2ViaG9vay53cml0ZSIsInByZXNldC5yZWFkIiwicHJlc2V0LndyaXRlIl19.q8uqeDkfLg6ineSFQ3sINWczgYAGnY2D9OUIiFJPdmWOAVKMvLUA6-UAGmNRa9sKnxKg46rVnc4xJpxu3S0pI_2F1Kg-LBeBLgHXtIWRjYuTujjdi86o8w3yA6Xw7cJ0A75ZuYy7vyu2ctVsoknW2RhDqaZgwLPVzsmnMR-5bLHOTMsmOTGTPdsx1-7hEf0wuW7_X-fEwv93oZnmZVgszU9lWzipy8GUyHZsgboqzXG6RCegZITYtQPgqthLSVW2B0t4RBDbHayo8jmtnWAki78GvnXrqgUkC7Z156memmm6RT14RAinAeG96eVKolaGJhiI3OC3jrj_ejQ1UeSBB8VBLyUEb1mKb98SMe0I5M-mfppRh22Rt0qP03LyBr8Z26LCWwNCAO1rC6nA0yYj55lqJjO-E66ygnCd526OWJK1YNXuh_sdVR6iaLDlbLkJSusbB3d_TeHii6D9KcYzapYFm1go7X7LOXc78oT0sP21uflFAVz2khtWuD4rPRceczTe86_kUF_XWKoHkM0cw-iOn3unaeQkw0HVkJ9QnrdcDQBnaRqZ6NQkD5rEhbxi_k814w6syS3S5RcmAZYu5BAYqlEF0pTSnyUXs4KT30EG2lnzkOeUqNL4C1wwy0EFZjJA7F6tbebf5gmQtEPShC0GPIiiFtNsckikUgde_cE";

// const cloudConvert = new CloudConvert(cloudKey);

// const uploadVideo = async (file, path) => {
//   const { data, error } = await supabase.storage.from("reviews").upload(`${path}`, file);
//   if (error) {
//     handleFailure(error);
//     throw error;
//   }
//   return data;
// };

// export default async (req, res) => {
//   let path = req.query.path;
//   let file = req.query.file;

//   console.log(file);
//   console.log(path);

//   let job = "";

//   try {
//     job = await cloudConvert.jobs.create({
//       tasks: {
//         "task-1": {
//           operation: "convert",
//           input: [file],
//           output_format: "mp4",
//         },
//         "export-1": {
//           operation: "export/url",
//           input: ["task-1"],
//           inline: false,
//           archive_multiple_files: false,
//         },
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }

//   //console.log(job);

//   //   if (error) return res.status(401).json({ error: error.message });
//   //   return res.status(200).json(job);
//   return;
// };
