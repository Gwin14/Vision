import {
  Handle,
  Position,
  type NodeProps,
  NodeResizeControl,
} from "@xyflow/react";

import { type FileNode } from "./types";

const controlStyle = {
  background: "transparent",
  border: "none",
};

export function FileNode({ data }: NodeProps<FileNode>) {
  return (
    <div className="react-flow__node-default">
      <NodeResizeControl style={controlStyle} minWidth={100} minHeight={50}>
        <ResizeIcon />
      </NodeResizeControl>
      <img
        style={{ width: 50 }}
        src="https://m.media-amazon.com/images/I/51fBoQXGnIL.png"
        alt=""
      />
      <div>
        <strong>{data.label}</strong>
      </div>
      {/* <div>Size: {data.size} bytes</div>
      <div>Modified: {data.modified}</div> */}
      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Top} />
    </div>
  );
}

function ResizeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="10"
      height="10"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="#000"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ position: "absolute", right: 5, bottom: 5 }}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <polyline points="16 20 20 20 20 16" />
      <line x1="14" y1="14" x2="20" y2="20" />
      <polyline points="8 4 4 4 4 8" />
      <line x1="4" y1="4" x2="10" y2="10" />
    </svg>
  );
}
