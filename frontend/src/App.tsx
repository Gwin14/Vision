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
  const reactFlowWrapper = useRef(null); // Reference to the ReactFlow wrapper
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes); // State for nodes
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges); // State for edges
  const { screenToFlowPosition } = useReactFlow(); // Function to convert screen position to flow position
  const [type] = useDnD(); // Get the current drag-and-drop type
  const [selectedNode, setSelectedNode] = useState<SelectedNode>(null); // State for the selected node

  // Function to generate unique IDs for nodes
  const getId = useCallback(() => {
    return `dndnode_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Function to handle edge connections
  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Function to handle drag over event
  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // Function to handle drop event
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

  // Function to handle node click event
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    event.preventDefault();
    event.stopPropagation();

    if (node.type === "file") {
      setSelectedNode(node);
    } else {
      setSelectedNode(null);
    }
  }, []);

  // Function to close the floating sidebar
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
        <div className="floating-sidebar" onClick={(e) => e.stopPropagation()}>
          <button type="button" onClick={closeSidebar} className="close-button">
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
