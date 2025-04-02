/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useRef, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
  type OnConnect,
  type Node,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import Sidebar from "./Sidebar";
import { DnDProvider, useDnD } from "./DnDContext";

import { initialNodes, nodeTypes } from "./nodes";
import { initialEdges, edgeTypes } from "./edges";
import FloatingSidebar from "./FloatingSidebar";

type SelectedNode = Node | null;

// Função para formatar tamanho de arquivo
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Função para formatar data
const formatDateTime = (dateString: string): string => {
  if (!dateString) return "Unknown";
  const date = new Date(dateString);
  return date.toLocaleString();
};

function DnDFlow() {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { screenToFlowPosition } = useReactFlow();
  const [type] = useDnD();
  const [selectedNode, setSelectedNode] = useState<SelectedNode>(null);

  const getId = useCallback(() => {
    return `dndnode_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (!type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: getId(),
        type: type.nodeType,
        position,
        data: type.file
          ? {
              name: type.file.name,
              label: type.file.name,
              size: type.file.size,
              createdDateTime: type.file.createdDateTime,
              lastModifiedDateTime: type.file.modifiedDateTime,
              createdBy: type.file.createdBy,
              lastModifiedBy: type.file.lastModifiedBy,
              file: type.file.file,
              folder: type.file.folder,
              parentReference: type.file.parentReference,
              webUrl: type.file.webUrl,
              "@microsoft.graph.downloadUrl":
                type.file["@microsoft.graph.downloadUrl"],
              downloadUrl: type.file["@microsoft.graph.downloadUrl"], // Added this property
            }
          : { label: `${type.nodeType} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, type, setNodes, getId]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    event.preventDefault();
    event.stopPropagation();

    if (node.type === "file") {
      setSelectedNode(node);
    } else {
      setSelectedNode(null);
    }
  }, []);

  const closeSidebar = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedNode(null);
  }, []);

  return (
    <div className="dndflow">
      <div className="reactflow-wrapper" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          edges={edges}
          edgeTypes={edgeTypes}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={onNodeClick}
          fitView
        >
          <Background />
          <MiniMap />
          <Controls />
        </ReactFlow>
      </div>
      <Sidebar />
      {selectedNode && (
        <FloatingSidebar node={selectedNode} onClose={closeSidebar} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <DnDProvider>
        <DnDFlow />
      </DnDProvider>
    </ReactFlowProvider>
  );
}
