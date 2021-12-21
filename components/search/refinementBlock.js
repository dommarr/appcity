import Tooltip from "../global/questionMarkTooltip";

export default function RefinementBlock({ header, children, tooltip, subheader }) {
  return (
    <div className="p-2 border">
      <div className="flex space-x-1 items-center ml-1 mb-2">
        <h5 className="uppercase font-semibold text-sm">{header}</h5>
        {subheader && <p className="text-xs text-gray-500">{subheader}</p>}
        {tooltip && <Tooltip caption={tooltip} />}
      </div>

      {children}
    </div>
  );
}
