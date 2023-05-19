import { applyNodeChanges, applyEdgeChanges } from "reactflow";
import { nanoid } from "nanoid";
import { create } from "zustand";
import { InputMode } from "./Types/InputMode";
import { NodeTypes } from "./Types/NodeOperations";
import {
  BooleanOperations,
  DeformOperations,
  TransformOperations,
} from "./Types/NodeOperations";
import { defaultMaterial } from "./Shader/defaultMaterial";

// import {
//   isRunning,
//   toggleAudio,
//   createAudioNode,
//   updateAudioNode,
//   removeAudioNode,
//   connect,
//   disconnect,
// } from "./Graph/audio";

const defaultNodes = [
  {
    id: "primitive",
    type: "primitive",
    position: { x: -150, y: 200 },
    data: { sdf: "cube(p,1.0)", inputs: {}, children: [], material: defaultMaterial },
  },
  {
    id: "primitive2",
    type: "primitive",
    position: { x: -150, y: -200 },
    data: { sdf: "cube(p,1.0)", inputs: new Map(), children: [] , material: defaultMaterial },
  },
  {
    id: "deform",
    type: "deform",
    position: { x: 150, y: 300 },
    data: { sdf: "", inputs: new Map(), children: [] , material: defaultMaterial },
  },
  {
    id: "boolean",
    type: "boolean",
    position: { x: 150, y: -75 },
    data: { sdf: "", inputs: new Map(), children: [], material: defaultMaterial },
  },
  {
    id: "transform",
    type: "transform",
    position: { x: 150, y: -400 },
    data: { sdf: "", inputs: new Map(), children: [], material: defaultMaterial },
  },
  {
    id: "repeat",
    type: "repeat",
    position: { x: 150, y: -700 },
    data: { sdf: "", inputs: new Map(), children: [], material: defaultMaterial },
  },
];

const examlpeCSG = [
  {
    id: "primitive",
    type: "primitive",
    position: { x: -240.95929203539822, y: 355.7522123893806 },
    data: {
      sdf: "sphere(p,1.2000)",
      inputs: {},
      children: ["9dG7S9jg1KmEShVrcVUhV"],
    },
    width: 200,
    height: 294,
    selected: false,
    positionAbsolute: { x: -240.95929203539822, y: 355.7522123893806 },
    dragging: false,
  },
  {
    id: "primitive2",
    type: "primitive",
    position: { x: -201.08672566371683, y: -224.92035398230087 },
    data: {
      sdf: "cylinder(p,1.0000,0.5000)",
      inputs: {},
      children: ["DBjo2BqO_G4u1e1RRZYCT", "pCcaWSsaKELGac4sD0B-T", "boolean"],
    },
    width: 200,
    height: 342,
    selected: false,
    positionAbsolute: { x: -201.08672566371683, y: -224.92035398230087 },
    dragging: false,
  },
  {
    id: "boolean",
    type: "boolean",
    position: { x: 355.5929203539823, y: -185.97522123893805 },
    data: {
      sdf: "sdfSmoothUnion(cylinder(p,1.0000,0.5000), sdfSmoothUnion(cylinder(sdfRotateX(p, 1.5200),1.0000,0.5000), cylinder(sdfRotateZ(p, 1.5200),1.0000,0.5000), 0.0000), 0.0000)",
      inputs: {},
      children: ["Y984AbcFFNLkKqK11DOG4"],
    },
    width: 200,
    height: 294,
    selected: false,
    positionAbsolute: { x: 355.5929203539823, y: -185.97522123893805 },
    dragging: false,
  },
  {
    id: "transform",
    type: "transform",
    position: { x: 150, y: -400 },
    data: { sdf: "", inputs: {}, children: [] },
    width: 200,
    height: 52,
    selected: false,
    dragging: false,
  },
  {
    id: "DBjo2BqO_G4u1e1RRZYCT",
    type: "transform",
    data: {
      sdf: "cylinder(sdfRotateX(p, 1.5200),1.0000,0.5000)",
      inputs: {},
      children: ["boolean"],
    },
    position: { x: 91.2778761061947, y: -200.58053097345137 },
    width: 200,
    height: 294,
    selected: false,
    positionAbsolute: { x: 91.2778761061947, y: -200.58053097345137 },
    dragging: false,
  },
  {
    id: "pCcaWSsaKELGac4sD0B-T",
    type: "transform",
    data: {
      sdf: "cylinder(sdfRotateZ(p, 1.5200),1.0000,0.5000)",
      inputs: {},
      children: ["boolean"],
    },
    position: { x: 93.76991150442475, y: 112.16991150442473 },
    width: 200,
    height: 294,
    selected: false,
    positionAbsolute: { x: 93.76991150442475, y: 112.16991150442473 },
    dragging: false,
  },
  {
    id: "LDtDK8WAFBCUEydaI8duw",
    type: "primitive",
    data: {
      sdf: "cube(p,1.0000)",
      inputs: {},
      children: ["F793JYIbziQ4X9acfDMZn"],
    },
    position: { x: -443.26371681415935, y: 671.6318584070798 },
    width: 200,
    height: 294,
    selected: false,
    positionAbsolute: { x: -443.26371681415935, y: 671.6318584070798 },
    dragging: false,
  },
  {
    id: "9dG7S9jg1KmEShVrcVUhV",
    type: "boolean",
    data: {
      sdf: "sdfSmoothIntersection(sphere(p,1.2000), cube(sdfTwist(p, 0.8000),1.0000), 0.0)",
      inputs: {},
      children: ["Y984AbcFFNLkKqK11DOG4"],
    },
    position: { x: 144.85663716814162, y: 532.0778761061947 },
    width: 200,
    height: 294,
    selected: false,
    dragging: false,
    positionAbsolute: { x: 144.85663716814162, y: 532.0778761061947 },
  },
  {
    id: "F793JYIbziQ4X9acfDMZn",
    type: "deform",
    data: {
      sdf: "cube(sdfTwist(p, 0.8000),1.0000)",
      inputs: {},
      children: ["9dG7S9jg1KmEShVrcVUhV"],
    },
    position: { x: -171.63185840707968, y: 685.3380530973451 },
    width: 200,
    height: 294,
    selected: false,
    positionAbsolute: { x: -171.63185840707968, y: 685.3380530973451 },
    dragging: false,
  },
  {
    id: "Y984AbcFFNLkKqK11DOG4",
    type: "boolean",
    data: {
      sdf: "sdfSmoothDifference(sdfSmoothIntersection(sphere(p,1.2000), cube(sdfTwist(p, 0.8000),1.0000), 0.0), sdfSmoothUnion(cylinder(p,1.0000,0.5000), sdfSmoothUnion(cylinder(sdfRotateX(p, 1.5200),1.0000,0.5000), cylinder(sdfRotateZ(p, 1.5200),1.0000,0.5000), 0.0000), 0.0000), 0.0000)",
      inputs: {},
      children: [],
    },
    position: { x: 661.7879308240998, y: 32.988656913334864 },
    width: 200,
    height: 294,
    selected: false,
    positionAbsolute: { x: 661.7879308240998, y: 32.988656913334864 },
    dragging: false,
  },
];


const getInitialLoggedIn = () => {
  // localStorage.clear();
  if (localStorage.getItem("graph_storage") !== null) {
    console.log(
      "ALGO HAY: ",
      JSON.parse(localStorage.getItem("graph_storage"))
    );

    return JSON.parse(localStorage.getItem("graph_storage"));
  }

  return defaultNodes;
};

export const useStore = create((set, get) => ({
  nodes: getInitialLoggedIn(),
  edges: [],
  needsToUpdate: {
    primitive: false,
    deform: false,
    boolean: false,
    primitive2: false,
    transform: false,
  },

  onNodesChange(changes) {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  createNode(type, x, y) {
    const id = nanoid();
    const data = { sdf: "", inputs: new Map(), children: [], material: defaultMaterial };
    const position = { x: x, y: y };

    set({ nodes: [...get().nodes, { id, type, data, position }] });
    set({ needsToUpdate: { ...get().needsToUpdate, id: false } });
    // switch (type) {
    //   case "osc": {
    //     const data = { frequency: 440, type: "sine" };
    //     const position = { x: 0, y: 0 };

    //     set({ nodes: [...get().nodes, { id, type, data, position }] });

    //     break;
    //   }

    //   case "amp": {
    //     const data = { gain: 0.5 };
    //     const position = { x: 0, y: 0 };

    //     set({ nodes: [...get().nodes, { id, type, data, position }] });

    //     break;
    //   }

    // }
  },

  saveToLocalStorage() {
    localStorage.setItem("graph_storage", JSON.stringify(get().nodes));
  },

  updateNode(id, data) {
    // update node logic -> update data
    var sourceNode = null;

    // Update and find source
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === id) {
          sourceNode = node;
          return { ...node, data: Object.assign(node.data, data) };
        } else {
          return node;
        }
      }),
    });

    // Update its children
    set({
      nodes: get().nodes.map((node) => {
        if (sourceNode.data.children.includes(node.id)) {
          var newInputs = node.data.inputs;
          newInputs.set(sourceNode.id, sourceNode.data.sdf);
          // newInputs[`${sourceNode.id}`] = sourceNode.data.sdf;
          // console.log("ACTUALIZANDO ",  node.id, " INPUTS: ", newInputs);
          get().setNeedsUpdate(node.id, true);
          return {
            ...node,
            data: Object.assign(node.data, {
              inputs: newInputs,
            }),
          };
        } else {
          return node;
        }
      }),
    });

    // const node = get().nodes.find(n => n.id === id);
    // node.data.children.forEach(c => {
    //   const child = get().nodes.find(n => n.id === child);
    //     switch(child.type){
    //       case "primitive":
    //         // imposible
    //         break;

    //       case "boolean":
    //         break;

    //       case "deform":

    //         break;

    //       case "transform":
    //         break;
    //     }
    // });
  },

  onNodesDelete(deleted) {
    for (const { id, data } of deleted) {
      console.log("DATA:", data.children);
      data.children.forEach((c) => get().removeChild(id, c));

      //   // Update its children
      // set({
      //   nodes: get().nodes.map((node) => {
      //     if (data.children.includes(node.id)) {
      //       var newInputs = node.data.inputs;
      //       newInputs[`${sourceNode.id}`] = sourceNode.data.sdf;
      //       console.log("ACTUALIZANDO ",  node.id, " INPUTS: ", newInputs);
      //       get().setNeedsUpdate(node.id, true);
      //       return {
      //         ...node,
      //         data: Object.assign(node.data, {
      //           inputs: newInputs,
      //         }),
      //       };
      //     } else {
      //       return node;
      //     }
      //   }),
      // });
    }
  },

  onEdgesChange(changes) {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  addEdge(data) {
    const id = nanoid(6);
    const edge = { id, type: "custom", ...data };

    const { source, target } = data;

    // connect logic
    set({ edges: [edge, ...get().edges] });

    // añadir hijo al padre
    const sourceNode = get().nodes.find((n) => n.id === source);
    const targetNode = get().nodes.find((n) => n.id === target);

    get().updateNode(source, {
      children: sourceNode.data.children.concat(target),
    });

    // actualizar inputs del hijo
    var newInputs = targetNode.data.inputs;
    // newInputs[`${source}`] = sourceNode.data.sdf;
    newInputs.set(source, sourceNode.data.sdf);
    get().updateNode(target, { inputs: newInputs });
    get().setNeedsUpdate(target, true);
  },

  setNeedsUpdate(id, val) {
    set({ needsToUpdate: { ...get().needsToUpdate, [id]: val } });
  },

  /*
  var newInputs = node.data.inputs;
  newInputs[`${sourceNode.id}`] = sourceNode.data.sdf;
  console.log("ACTUALIZANDO ",  node.id, " INPUTS: ", newInputs);
  get().setNeedsUpdate(node.id, true);
  return {
    ...node,
    data: Object.assign(node.data, {
      inputs: newInputs,
    }),
  };

  ----

  get().updateNode(source, {
      children: sourceNode.data.children.concat(target),
    });

  */

  removeChild(parent, child) {
    set({
      nodes: get().nodes.filter((node) => {
        if (node.id === parent) {
          return {
            ...node,
            data: Object.assign(node.data, {
              children: node.data.children.filter((c) => c !== child),
            }),
          };
        } else if (node.id === child) {
          var newInputs = node.data.inputs;
          newInputs.delete(parent);
          // newInputs[`${parent}`] = "";
          // console.log("ACTUALIZANDO ",  node.id, " INPUTS: ", newInputs);
          get().setNeedsUpdate(node.id, true);
          return {
            ...node,
            data: Object.assign(node.data, {
              inputs: newInputs,
            }),
          };
        } else {
          return node;
        }
      }),
    });
  },

  deleteEdge(id, source, target) {
    console.log("new edges: ", get().edges);
    get().removeChild(source, target);
    console.log("DELETING EDGE WITH TARGET ", target);

    const sourceNode = get().nodes.find((n) => n.id === source);
    const targetNode = get().nodes.find((n) => n.id === target);
    var newEdges = [];

    if (targetNode.type === NodeTypes.Boolean) {
      let found = false;

      const otherInputEdges = get().edges.filter((e) => e.target === target).sort((a,b)=> a.targetHandle >= b.targetHandle ? 1 : -1);
      newEdges = get().edges.filter((e) => e.target !== target);

      let length = otherInputEdges.length;

      console.log("MY ID: ", id, " OTHER IDS: ", otherInputEdges);
      for (let i = 0; i < length; i++) {
        if (otherInputEdges[i].id === id) {
          found = true;
          console.log("FOUND");
        }

        if (found) {
          if (i < length - 1) {
            var newEdge = otherInputEdges[i];
            newEdge.source = otherInputEdges[i + 1].source;
            newEdge.targetHandle = otherInputEdges[i].targetHandle;
            // length--;
            newEdges.push(newEdge);
          }
        } else {
          newEdges.push(otherInputEdges[i]);
        }
      }
    } else {
      newEdges = get().edges.filter((e) => e.id !== id);
    }

    console.log("OLD EDGES: ", get().edges);
    console.log("NEW EDGES: ", newEdges);

    set({
      edges: newEdges,
    });
  },

  onEdgesDelete(deleted) {
    for (const { source, target } of deleted) {
      get().removeChild(source, target);
    }

    console.log("se han borrado edges:", get().edges);
  },
}));
