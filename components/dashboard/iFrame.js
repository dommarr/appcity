const iFrameContainerStyle = {
  position: "relative",
  "padding-bottom": "54.0625%",
  height: 0,
};

const iFrameStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
};

export default function Iframe({ video_id }) {
  if (!video_id) {
    return <div className="animate-pulse text-sm">Loading...</div>;
  }

  const src = `https://www.loom.com/embed/${video_id}`;
  return (
    <div style={iFrameContainerStyle} className="m-2">
      <iframe src={src} frameBorder="0" allowFullScreen={true} webkitallowfullscreen="true" mozallowfullscreen="true" style={iFrameStyle}></iframe>
    </div>
  );
}
