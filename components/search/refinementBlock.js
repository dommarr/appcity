export default function RefinementBlock({ header, children }) {
  return (
    <div className="p-2 border">
      <h5 className="uppercase font-semibold text-sm ml-1 mb-2">{header}</h5>
      {children}
    </div>
  );
}
