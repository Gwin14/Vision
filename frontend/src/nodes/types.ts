import type { Node, BuiltInNode } from "@xyflow/react";

export type PositionLoggerNode = Node<{ label: string }, "position-logger">;
export type FileNode = Node<
  {
    label: string;
    size: number;
    modified: string;
    downloadUrl: string; // Added this property
  },
  "file"
>;
export type AppNode = BuiltInNode | PositionLoggerNode | FileNode;
