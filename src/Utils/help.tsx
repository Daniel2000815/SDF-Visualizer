import { Text, Spacer, Grid, Badge } from "@nextui-org/react";

export const graphControls: Record<string, string> = {
  "left click + drag": "move view",
  "left click x2": "select node",
  "right click": "contextual menu",
  scrollwheel: "zoom",
  backspace: "delete selected node",
  s: "collapse/expand all nodes",
};

export const surfaceFunctions: Record<string, string> = {
  "rotate(angX, angY, angZ)": "rotation in axis Z,Y,X",
  "rotateX, rotateY, rotateZ": "rotation in the specified axis",
  "union": "select node",
  "right click": "contextual menu",
  scrollwheel: "zoom",
  backspace: "delete selected node",
  s: "collapse/expand all nodes",
};

  export function GraphHelpText() {
    return (
      
        <Text>
        Create new surfaces connecting nodes. You can use any surface defined in the Surfaces tab. To save the result of a node, select the node and click the button on the right of the screen.
        </Text>
        
    );
  }

  export function PlaygroundHelpText() {
    return (
      
        <Text>
        This is an example scene where you can play around with the lights and materials of the objects, as well as see the impact in the final image that techniques such as antialiasing or ambient oclussion have.
        </Text>
        
    );
  }

export function SurfaceHelpText() {
  return (
    <>
      <Text>
        Here you can define your own primitives through its parametric and
        implicit equations, or giving the explicit SDF in glsl syntax. You can also use any of the existing primitives by their NFD form and the following functions: 
      </Text>
      TODO
      <Spacer y={1}/>
      <Text>
        In the parameter menu, you can create specify values to be controlled in
        the Graph page with the label provided.
      </Text>
      <Spacer y={1}/>
      <Text>
        In the material menu, you can modify the material properties of the
        surface in the preview.
      </Text>
    </>
  );
}
