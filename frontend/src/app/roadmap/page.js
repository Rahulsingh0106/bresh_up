"use client";
import React, { useCallback, useState } from "react";
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import useRoadmapStore from "@/components/roadmapStore";

export default function Roadmap() {
    const { nodes, setNodes, edges, setEdges, addNewNode } = useRoadmapStore();
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [selectedNodeId, setSelectedNodeId] = useState(null);
    const [editLabel, setEditLabel] = useState("");
    const [roadmapTitle, setRoadmapTitle] = useState("");

    const onNodeClick = useCallback((event, node) => {
        event.preventDefault();
        setSelectedNodeId(node.id);
        setEditLabel(node.data.label || "");
    }, []);

    const onNodesChange = useCallback((changes) => {
        setNodes((nds) => applyNodeChanges(changes, nds));
    }, [setNodes]);

    const onEdgesChange = useCallback((changes) => {
        setEdges((eds) => applyEdgeChanges(changes, eds));
    }, [setEdges]);

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();
            const type = event.dataTransfer.getData("application/reactflow");
            if (!type || !reactFlowInstance) return;

            const position = reactFlowInstance.project({
                x: event.clientX - 260,
                y: event.clientY - 110,
            });

            addNewNode(type, position);
        },
        [reactFlowInstance, addNewNode]
    );

    const saveRoadmap = async () => {
        if (!roadmapTitle.trim()) {
            alert("Please enter a roadmap title before saving.");
            return;
        }

        const roadmapData = {
            title: roadmapTitle.trim(),
            nodes,
            edges,
            createdBy: "user123",
            createdAt: new Date().toISOString(),
        };

        console.log("📦 Roadmap JSON:", roadmapData);
    };

    return (
        <div className="h-[90vh] flex">
            {/* Left Sidebar */}
            <div className="w-1/5 p-4 border-r space-y-4 bg-gray-50">
                <h2 className="text-lg font-semibold mb-4">Drag to add steps</h2>
                {[
                    "Title", "Topic", "Sub Topic", "Paragraph", "Label", "Button", "Legend", "Todo",
                    "Checklist", "Links Group", "Horizontal Line", "Vertical Line", "Resource Button", "Section"
                ].map((label) => (
                    <div
                        key={label}
                        className="p-2 bg-white border rounded cursor-grab hover:bg-blue-100"
                        draggable
                        onDragStart={(e) =>
                            e.dataTransfer.setData("application/reactflow", label)
                        }
                    >
                        {label}
                    </div>
                ))}
            </div>

            {/* Canvas */}
            <div className="flex-1 p-4 h-full">
                {/* <div className="flex items-center gap-4 mb-4">
                    <input
                        type="text"
                        value={roadmapTitle}
                        onChange={(e) => setRoadmapTitle(e.target.value)}
                        placeholder="Enter roadmap title..."
                        className="border px-3 py-2 rounded w-1/3"
                    />
                    <button
                        onClick={saveRoadmap}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Save Roadmap
                    </button>
                </div> */}

                <div
                    className="border rounded-md h-full"
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                >
                    <ReactFlowProvider>
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onNodeClick={onNodeClick}
                            onConnect={onConnect}
                            onInit={setReactFlowInstance}
                            fitView
                        >
                            <MiniMap />
                            <Controls />
                            <Background />
                        </ReactFlow>
                    </ReactFlowProvider>
                </div>
            </div>

            {/* Right Sidebar */}
            {selectedNodeId && (
                <div className="top-0 right-0 w-1/5 h-full bg-white border-l p-4 shadow-lg z-50">
                    <h2 className="text-lg font-bold mb-4">Edit Node</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Label</label>
                            <input
                                value={editLabel}
                                onChange={(e) => setEditLabel(e.target.value)}
                                className="w-full border rounded px-3 py-2 mt-1"
                            />
                        </div>

                        <div className="flex gap-2">
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                onClick={() => {
                                    setNodes((nds) =>
                                        nds.map((node) =>
                                            node.id === selectedNodeId
                                                ? { ...node, data: { ...node.data, label: editLabel } }
                                                : node
                                        )
                                    );
                                    setSelectedNodeId(null);
                                    setEditLabel("");
                                }}
                            >
                                Save
                            </button>

                            <button
                                className="text-gray-600 px-4 py-2 rounded border hover:bg-gray-100"
                                onClick={() => {
                                    setSelectedNodeId(null);
                                    setEditLabel("");
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
