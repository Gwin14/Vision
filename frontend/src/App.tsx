/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useRef } from "react";
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
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import Sidebar from "./Sidebar";
import { DnDProvider, useDnD } from "./DnDContext";

import { initialNodes, nodeTypes } from "./nodes";
import { initialEdges, edgeTypes } from "./edges";

export default function App() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  let id = 0;
  const getId = () => `dndnode_${id++}`;

  const DnDFlow = () => {
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const { screenToFlowPosition } = useReactFlow();
    const [type] = useDnD();

    const onConnect = useCallback(
      (params) => setEdges((eds) => addEdge(params, eds)),
      []
    );

    const onDragOver = useCallback((event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
    }, []);

    const onDrop = useCallback(
      (event) => {
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
      [screenToFlowPosition, type]
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
            fitView
          >
            <Background />
            <MiniMap />
            <Controls />
          </ReactFlow>
        </div>
        <Sidebar />
      </div>
    );
  };

  return (
    <ReactFlowProvider>
      <DnDProvider>
        <DnDFlow />
      </DnDProvider>
    </ReactFlowProvider>
  );
}
