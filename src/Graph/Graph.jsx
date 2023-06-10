import React, { useEffect } from "react";
import ReactFlow, {
  Background,
  Panel,
  useUpdateNodeInternals 
} from "reactflow";
import { shallow } from "zustand/shallow";
import { useStore } from "../graphStore";
import { tw } from "twind";
import { CustomEdge } from "./nodes/parts/CustomEdge";
import { PrimitiveNode } from "./nodes/PrimitiveNode";
import { DeformNode } from "./nodes/DeformNode";
import { BooleanNode } from "./nodes/BooleanNode";
import { TransformNode } from "./nodes/TransformNode";
import { RepeatNode } from "./nodes/RepeatNode";
import { useContextMenu } from "react-contexify";
import { ContextMenu } from "../Components/GraphPage/ContextMenu";

import "react-contexify/dist/ReactContexify.css";
import "reactflow/dist/style.css";

const nodeTypes = {
  primitive: PrimitiveNode,
  deform: DeformNode,
  boolean: BooleanNode,
  transform: TransformNode,
  repeat: RepeatNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

const selector = (store) => ({
  nodes: store.nodes,
  edges: store.edges,
  onNodesChange: store.onNodesChange,
  onNodesDelete: store.onNodesDelete,
  onEdgesChange: store.onEdgesChange,
  onEdgesDelete: store.onEdgesDelete,
  addEdge: store.addEdge,
  
  addNode: (type, x, y) => store.createNode(type, x, y),
  saveToLocalStorage: () => store.saveToLocalStorage()
});



export function Graph(props) {
  
  const { show } = useContextMenu({
    id: "node_context_menu",
  });
  
  const store = useStore(selector, shallow);

  const [rfInstance, setRfInstance] = React.useState(null);
  const updateNodeInternals = useUpdateNodeInternals();

  const createAddNodeMousePos = (nodeType, e) => {
    const { x, y } = rfInstance.project({ x: e.clientX, y: e.clientY });
    console.log(e);
    store.addNode(nodeType, x, y);
    localStorage.setItem("exampleNodes",JSON.stringify(store.nodes) );
    console.log(JSON.stringify(store.nodes));
  };

  const handleNewConnect = (con) => {
    store.addEdge(con);
    updateNodeInternals(con.target);
  }

  useEffect(()=>{
    console.log(store.nodes);
  },[])

  return (
    <div
      style={{ width: "100%", height: "100%" }}
      onContextMenu={(e) => show({ event: e })}
    >
      {/* {JSON.stringify(store.edges)} */}
      <ContextMenu newNode={createAddNodeMousePos} />
      
      <ReactFlow
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        nodes={store.nodes}
        edges={store.edges}
        onNodesChange={store.onNodesChange}
        onNodesDelete={store.onNodesDelete}
        onEdgesChange={store.onEdgesChange}
        onEdgesDelete={store.onEdgesDelete}
        onConnect={handleNewConnect}
        onInit={setRfInstance}
        isValidConnection={(connection) =>
          !store.nodes
            .find((n) => n.id === connection.target)
            .data.inputs.has(connection.source)
        }
        fitView
      >
        <Panel onClick={()=>store.saveToLocalStorage()} className={tw("space-x-4")} position="top-right">
          {/* <button
            className={tw("px-2 py-1 rounded bg-white shadow")}
          >
            Save
          </button>
          <button
            className={tw("px-2 py-1 rounded bg-white shadow")}
          >
            Restore
          </button>
          <button
            className={tw("px-2 py-1 rounded bg-white shadow")}
          >
            Example
          </button> */}
        </Panel>
        <Background />
      </ReactFlow>
    </div>
  );
}
