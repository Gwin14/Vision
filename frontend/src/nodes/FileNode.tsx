import { Handle, Position, type NodeProps } from "@xyflow/react";

import { type FileNode } from "./types";

export function FileNode({ data }: NodeProps<FileNode>) {
  return (
    <div className="react-flow__node-default">
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
      <Handle type="source" position={Position.Top} />
    </div>
  );
}
