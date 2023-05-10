import React from "react";
import { getBezierPath, useUpdateNodeInternals } from "reactflow";
import { shallow } from "zustand/shallow";
import { tw } from "twind";
import { useStore } from "../../../graphStore";
import "./edgeStyles.css";

const foreignObjectSize = 40;

const selector = (id) => (store) => ({
  deleteEdge: (source, target) => store.deleteEdge(id, source, target),
});

export function CustomEdge({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const updateNodeInternals = useUpdateNodeInternals();

  const { deleteEdge } = useStore(selector(id), shallow);
  
  const handleDeleteEdge = (source, target) => {
    deleteEdge(source, target);
    updateNodeInternals(target);
  }

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <foreignObject
        width={foreignObjectSize}
        height={foreignObjectSize}
        x={labelX - foreignObjectSize / 2}
        y={labelY - foreignObjectSize / 2}
        className="edgebutton-foreignobject"
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <div>
          <button
            className="edgebutton"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteEdge(source, target);
            }}
          >
            ×
          </button>
        </div>
      </foreignObject>
    </>
  );
}
