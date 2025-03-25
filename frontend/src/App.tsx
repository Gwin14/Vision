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

type SelectedNode = Node | null;

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
          ? { label: type.file.name, ...type.file }
          : { label: `${type.nodeType} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, type, setNodes, getId]
  );

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.preventDefault();
      event.stopPropagation();
      
      if (node.type === "file") {
        setSelectedNode(node);
      } else {
        setSelectedNode(null);
      }
    },
    []
  );

  const closeSidebar = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setSelectedNode(null);
    },
    []
  );

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
        <div 
          className="floating-sidebar" 
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={closeSidebar}
            className="close-button"
          >
            Close
          </button>
          <h3>File Metadata</h3>
          <p>
            <strong>Name:</strong> {selectedNode.data.name}
          </p>
          <p>
            <strong>ID:</strong> {selectedNode.data.id}
          </p>
          <p>
            <strong>Size:</strong> {selectedNode.data.size}
          </p>
        </div>
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