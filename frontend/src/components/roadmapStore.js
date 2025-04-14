import { create } from "zustand";
import { nanoid } from "nanoid";

const useRoadmapStore = create((set) => ({
    nodes: [
        {
            id: "1",
            position: { x: 250, y: 5 },
            data: { label: "Start" },
        },
    ],
    edges: [],
    setNodes: (updateFn) => set((state) => ({ nodes: updateFn(state.nodes) })),
    setEdges: (updateFn) => set((state) => ({ edges: updateFn(state.edges) })),
    addNewNode: (label = "New Node", position = { x: 100, y: 100 }) => {
        set((state) => {
            const newNode = {
                id: `${+new Date()}`,
                type: "default",
                data: { label },
                position
            };
            return {
                nodes: [...state.nodes, newNode]
            };
        });
    }

}));

export default useRoadmapStore;
