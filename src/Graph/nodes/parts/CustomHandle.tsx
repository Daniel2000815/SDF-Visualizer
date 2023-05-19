import { memo } from "react";
import { Handle, Position } from "reactflow";

function MyHandle(props: {
  nodeId: string;
  inputNumber: string;
  type: "source" | "target";
  style: any;
  theme: Theme;
}) {
  const radius = "15px";
  const margin = "-3px";

  const style = {
    ...props.style,
    width: `${radius}`,
    height: `${radius}`,
    background: `${props.theme.light}`,
    border: `1px solid ${props.theme.primary}`,
  };

  // const id = newId('handle');

  return (
    <>
    
      <Handle
        id={`${props.nodeId}_${props.type}_${props.inputNumber}`}
        type={props.type}
        style={
          props.type === "source"
            ? {
                ...style,
                marginRight: `${margin}`,
              }
            : {
                ...style,
                marginLeft: `${margin}`,
              }
        }
        position={props.type === "source" ? Position.Right : Position.Left}
      />

    </>

  );
}

export const CustomHandle = memo(MyHandle);
