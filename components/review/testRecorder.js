// import RecordRTC from "recordrtc";

export default function TestRecorder() {
  return <div>Test</div>;
}

// export default function TestRecorder() {
//   navigator.mediaDevices
//     .getUserMedia({
//       video: true,
//       audio: true,
//     })
//     .then(async function (stream) {
//       let recorder = RecordRTC(stream, {
//         type: "video",
//         // mimeType: ''
//       });
//       recorder.startRecording();
//     });

//   const invokeSaveAsDialog = (blob) => {
//     const objectURL = URL.createObjectURL(blob);
//     const downloadEl = document.getElementById("download");
//     downloadEl.setAttribute("href", objectURL);
//   };

//   const stopRecording = (blobUrl) => {
//     alert(blobUrl);
//     setTimeout(() => {
//       alert("stopping recording");
//       recorder.stopRecording(function () {
//         let blob = recorder.getBlob();
//         invokeSaveAsDialog(blob);
//       });
//     }, 3000);
//   };

//   return (
//     <div className="flex flex-col items-center justify-center h-full w-full space-y-4">
//       <div id="videos" className="flex items-center justify-center w-full space-x-2">
//         <video id="streamPlayer" width="450" height="350" muted ref={streamRef} onCanPlay={handleCanPlay}>
//           Video stream not available.
//         </video>
//         <video id="player" width="450" height="350" autoPlay controls src={video}></video>
//       </div>
//       <div id="buttons" className="flex items-center justify-center w-full space-x-2">
//         <button>Start</button>
//         <button onClick={stopRecording}>Stop</button>
//         <a href="#" id="download">
//           Download
//         </a>
//       </div>
//     </div>
//   );
// }
