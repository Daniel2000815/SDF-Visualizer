//@flow
import React, { useState, useEffect, memo, useRef } from "react";

// import { useStore } from "../graphStore";
import { usePrimitiveStore } from "../primitiveStore";
import { shallow } from "zustand/shallow";
import UseAnimations from "react-useanimations";
import alertCircle from "react-useanimations/lib/alertCircle";
import ReactScrollWheelHandler from "react-scroll-wheel-handler";
import { Shaders, Node, GLSL, Visitor, ShaderIdentifier } from "gl-react";
import { Surface } from "gl-react-dom";
import { fs } from "./fragmentShader";
import { defaultMaterial } from "./defaultMaterial";

const defaultShader = Shaders.create({
  helloGL: {
    frag: GLSL`
      precision highp float;

      uniform vec3 u_specular;
      uniform vec3 u_diffuse;
      uniform vec3 u_ambient;
      uniform float u_smoothness;
  
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform vec2 u_cameraAng;
      uniform float u_zoom;
      
      varying vec2 uv;
      void main() {
        gl_FragColor = vec4(uv.x, uv.y, 0.5, 1.0);
      }
    `,
  },
});

const selector = () => (store: any) => ({
  savedPrimitives: store.primitives
    .map(
      (p: any) => `
    float ${p.fHeader}{
      float x = p.r;
      float y = p.g;
      float z = p.b;

      return ${p.parsedInput};
    }\n
  `
    )
    .join("\n"),
});


// const visitor = new Visitor();

// visitor.onSurfaceDrawError = (e: Error) => {
//   // if (props.onError) props.onError(e.message);

//   // console.warn(`ERROR COMPILING SHADER ${props.sdf}`);
//   // setCompileError(true);
//   return true;
// };


// visitor.onSurfaceDrawEnd = () => {
//   console.log("as");
//   // setCompileError(false);
// };
function MyShader(props: {
  sdf: string;
  primitives: string;
  width: number | null;
  height: number | null;
  onError?: (e: string) => void;
  uniforms?: any[];
  material: Material;
}) {
  const { savedPrimitives } = usePrimitiveStore(selector(), shallow);

  const [zoom, setZoom] = useState(0.5);
  const zoomIncrement = 0.05;

  const dragging = useRef(false);
  const draggingLastPos = useRef([0, 0]);
  const mousePos = useRef([0,0]);
  const [angle, setAngle] = useState([10, 0]);
  
  const [compileError, setCompileError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [shader, setShader] = useState<ShaderIdentifier>(
    CreateShader(props.sdf, props.primitives).helloGL
  );


    const visitor = new Visitor();

    visitor.onSurfaceDrawError = (e: Error) => {
      if (props.onError) props.onError(e.message);

      console.warn(`ERROR COMPILING SHADER ${props.sdf}: `, e.message);
      console.log(fs(props.sdf, String(savedPrimitives).concat(props.primitives)));
      setCompileError(true);
      setErrorMsg(e.message);
      return true;
    };


    visitor.onSurfaceDrawEnd = () => {
      if(compileError === false)
        return;

      console.log("as");
      setCompileError(false);
    };

  
 

  useEffect(() => {
    setCompileError(false);
    setShader(CreateShader(props.sdf, props.primitives).helloGL);

    console.log("HELLO ", props.material)
  }, [props.sdf, props.primitives]);

  useEffect(()=>{
    console.log("zoom:" , zoom);
  }, [zoom])
  

  function CreateShader(sdf: string, primitives: string) {
    console.log(" creating shader with ", primitives);
    return Shaders.create({
      helloGL: {
        frag: GLSL`${fs(sdf, String(savedPrimitives).concat(primitives))}`,
      },
    });
  }

  const handleMouseMove = (e: any) => {
    // return;
    let rect = e.currentTarget.getBoundingClientRect();
      let x = (e.clientX - rect.left) / rect.width;
      let y = (e.clientY - rect.top) / rect.height;
    mousePos.current = [x,y];

    if (dragging.current === true) {
      const clamp = (num: number, min: number, max: number) =>
        Math.min(Math.max(num, min), max);

      

      // setMousePos([x, y]);
      let difX = x - draggingLastPos.current[0];
      let difY = y - draggingLastPos.current[1];
      difX *= 2.0;

      const newAng = [angle[0] + difX, clamp(angle[1] + 2*difY, -1.5, 1.5)];
      setAngle(newAng);
      draggingLastPos.current = mousePos.current;
    }
  };

  const handleMouseDown = (e: any) => {
    console.log(e);

    if (e.button === 0) {
      //left click
      dragging.current = true;
      draggingLastPos.current = mousePos.current;
      // setDraggingLastPos(mousePos.current);
    } else if (e.button === 2) {
      // right click
    }
  };

  const handleMouseUp = (e: any) => {
    dragging.current = false;
  };

  const handleMouseLeave = (e: any) => {
    dragging.current = false;
  };


  const handleWheelDown = (e:any) => {
    console.log(e);
    if(zoom > zoomIncrement) setZoom(zoom - zoomIncrement);
  }

  const handleWheelUp = (e:any) => {
    console.log(e);
    if(zoom < 100) setZoom(zoom + zoomIncrement);
  }

  return <div>
    {compileError && 
    <UseAnimations
          size={props.width ? 0.6 * props.width : 24}
          animation={alertCircle}
        />}
    {!compileError && <div
        // ref={ref}
        style={{ height: "100%", width: "100%" }}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <ReactScrollWheelHandler
          timeout={-1}
          preventScroll={true}
          disableSwipeWithMouse={true}
          upHandler={(e)=>handleWheelUp(e)}
          downHandler={(e) => handleWheelDown(e)}>
          <Surface
            
            visitor={visitor}
            width={props.width || 100}
            height={props.height || 100}
          >
            <Node
            
            
              shader={shader}
              uniforms={{
                u_ambient: props.material.ambient,
                u_specular: props.material.specular,
                u_diffuse: props.material.diffuse,
                u_emission: [0.02, 0.02, 0.02],
                u_ka: 0.4,
                u_ks: 30,
                u_kd: 2,
                u_smoothness: props.material.smoothness,
                u_ambientEnv: [0.01, 0.01, 0.01],
                u_cameraAng: angle,
                u_zoom: zoom,
                u_resolution: [props.width, props.height],                
                u_lightsPos: [0.5, 0.4, -0.6, -1.0, 1.0,-2.0, 0,0,0,0,0,0],
                u_lightsColor: [0.4, 0.4,0.4,0.4, 0.4,0.4,0,0,0,0,0,0],
                u_lightsSize: [1.5, 10],
              }}
            />
          </Surface>
        </ReactScrollWheelHandler>
      </div>}
    </div>;
}

// export default Shader;
// export default memo(Shader);
export const Shader = memo(MyShader);