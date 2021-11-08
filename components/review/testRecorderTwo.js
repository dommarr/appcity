document.querySelector("button").addEventListener("click", (evt) => {
  document.querySelector("[camera]").setAttribute("animation", {
    property: "rotation",
    to: "0 360 0",
    dur: 10000,
    easing: "linear",
  });

  var stream = document.querySelector("canvas").captureStream(25);
  var recorder = new MediaRecorder(stream, { mimeType: "video/webm;codecs=h264" });
  var frames = [];
  console.log(recorder.mimeType);
  recorder.ondataavailable = function (evt) {
    if (evt.data) frames.push(evt.data);
  };

  recorder.onstop = function () {
    var fileBlob = new Blob(frames, { type: "video/webm;codecs=h264" });

    var reader = new FileReader();
    reader.onload = function (evt) {
      var mp4 = ffmpeg({
        MEMFS: [{ name: "test.webm", data: evt.target.result }],
        arguments: ["-i", "test.webm", "-vcodec", "copy", "-qscale", "0", "test.mp4"],
        stdin: function () {},
      });

      var mp4blob = new Blob([mp4.MEMFS[0].data], { type: "video/mp4" });
      console.log(mp4blob);
      var dataUrl = window.URL.createObjectURL(mp4blob);
      var link = document.createElement("a");
      link.href = dataUrl;
      link.download = "recording-ftw.mp4";
      link.click();
    };
    reader.readAsArrayBuffer(fileBlob);

    var dataUrl = window.URL.createObjectURL(fileBlob);
    var link = document.createElement("a");
    link.href = dataUrl;
    link.download = "recording.webm";
    link.click();
  };

  recorder.start(100);
  setTimeout(() => {
    recorder.stop();
  }, 10000);
});
