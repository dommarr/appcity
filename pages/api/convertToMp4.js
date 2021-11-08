import { supabase } from "../../utils/initSupabase";
import fs from "fs";
import webmToMp4 from "webm-to-mp4";

const uploadVideo = async (path, file) => {
  console.log("uploading");
  console.log(path);
  const { data, error } = await supabase.storage.from("reviews").upload(`${path}`, file);
  if (error) {
    return error;
  }
  return data;
};

const downloadVideo = async (path) => {
  const { data, error } = await supabase.storage.from("reviews").download(path);
  if (error) {
    throw error;
  }
  return data;
};

const convertVideo = async (req, res) => {
  //let webmBlob = req.body;

  //let webmFile = new File([webmBlob], "videoReview.webm");

  //let path = `test.webm`;
  console.log(req.body);
  let webmBlob = await downloadVideo(req.body);

  const webmUrl = Buffer.from(webmBlob);

  //   let webmFile = new File(req.body, "videoReview.webm");
  //   let webmFile = req.body;
  //     let readFile = await fs.readFileSync(webm, (err) => {
  //       if (err) {
  //         console.log("readFile error");
  //         console.log(err);
  //       } else {
  //         console.log("The file was read!");
  //       }
  //     });

  let readFile = "";

  await fs.readFile(webmUrl, (err, data) => {
    if (err) {
      throw err;
    }
    readFile = data;
  });

  let mp4 = await fs.writeFile("file.mp4", Buffer.from(webmToMp4(readFile)), (err) => {
    if (err) {
      console.log("writeFile error");
      console.log(err);
    } else {
      console.log("The file was written!");
    }
  });

  let path = "testVideo.mp4";

  //let mp4 = await fs.writeFile("file.mp4", Buffer.from(webmToMp4(await fs.readFile(webmFile))));

  let response = await uploadVideo(path, mp4);

  return res.status(200).json(response);
};

export default convertVideo;

// await fs.writeFile("file.mp4", Buffer.from(webmToMp4(await fs.readFile("file.webm"))), (err) => {
//     if (err) {
//       console.log(err);
//     } else {
//         console.log("The file was written!");
//     });
