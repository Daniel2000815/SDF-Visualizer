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
import ShadertoyReact from "shadertoy-react";

const defaultShader = Shaders.create({
  helloGL: {
    frag: GLSL`
      
      void main() {
        gl_FragColor = vec4(1.0,1.0,1.0, 0.0);
      }
    `,
  },
});

const selector = () => (store) => ({
  savedPrimitives: store.primitives
    .map(
      (p) => `
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

function MyShader(props) {
  const { savedPrimitives } = usePrimitiveStore(selector(), shallow);

  const [zoom, setZoom] = useState(0.5);
  const zoomIncrement = 0.05;

  const dragging = useRef(false);
  const draggingLastPos = useRef([0, 0]);
  const mousePos = useRef([0, 0]);
  const [angle, setAngle] = useState([10, 0]);

  const [compileError, setCompileError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [shaderUniforms, setShaderUniforms] = useState({u_ambient: { type: "1f", value: props.material.ambient},
  u_specular: { type: "1f", value:props.material.specular},
  u_diffuse: { type: "1f", value:props.material.diffuse},
  u_emission: { type: "3f", value:[0.02, 0.02, 0.02]},
  u_ka: { type: "1f", value:0.4},
  u_ks: { type: "1f", value:30},
  u_kd: { type: "1f", value:2},
  u_smoothness: { type: "1f", value:props.material.smoothness},
  u_ambientEnv: { type: "3f", value:[0.01, 0.01, 0.01]},
  u_cameraAng: { type: "1f", value:angle},
  u_zoom: { type: "1f", value:zoom},
  u_resolution: {type: "2f", value: [props.width, props.height]},
  u_lightsPos: { type: "1fv", value:[0.5, 0.4, -0.6, -1.0, 1.0, -2.0, 0, 0, 0, 0, 0, 0]},
  u_lightsColor: { type: "1fv", value:[0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0, 0, 0, 0, 0, 0]},
  u_lightsSize: { type: "2f", value:[1.5, 10]},});
  // const [shader, setShader] = useState<ShaderIdentifier>(
  //   CreateShader(props.sdf, props.primitives).helloGL
  // );

  const [shader, setShader] = useState<ShaderIdentifier>(defaultShader.helloGL);

  

  useEffect(()=>{
    let objetoFormatoDeseado = {};
    props.uniforms.forEach((valor, clave) => {
      objetoFormatoDeseado[clave] = { type: '1f', value: valor };
    });

    console.log(objetoFormatoDeseado)
    
    let newUniforms =Object.assign({
      u_ambient: { type: "3f", value: props.material.ambient},
      u_specular: { type: "3f", value:props.material.specular},
      u_diffuse: { type: "3f", value:props.material.diffuse},
      u_emission: { type: "3f", value:[0.02, 0.02, 0.02]},
      u_ka: { type: "1f", value:0.4},
      u_ks: { type: "1f", value:30},
      u_kd: { type: "1f", value:2},
      u_smoothness: { type: "1f", value:props.material.smoothness},
      u_ambientEnv: { type: "3f", value:[0.01, 0.01, 0.01]},
      u_cameraAng: { type: "2f", value:angle},
      u_zoom: { type: "1f", value:zoom},
      u_resolution: {type: "2f", value: [props.width, props.height]},
      u_lightsPos: { type: "1fv", value:[0.5, 0.4, -0.6, -1.0, 1.0, -2.0, 0, 0, 0, 0, 0, 0]},
      u_lightsColor: { type: "1fv", value:[0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0, 0, 0, 0, 0, 0]},
      u_lightsSize: { type: "2f", value:[1.5, 10]},
      ...objetoFormatoDeseado
    }, objetoFormatoDeseado);

    console.log(newUniforms)
    setShaderUniforms(newUniforms)
  }, [props.uniforms])
    
 

  const visitor = new Visitor();

  visitor.onSurfaceDrawError = (e) => {
    console.warn(`ERROR COMPILING SHADER ${props.sdf}: `, e.message);
    const regex = /ERROR: \d+:\d+:(.*)/;

    // Aplicar la expresión regular al mensaje de error
    const match = e.message.match(regex);
    let errorMsg = "Unknown error";

    if (match) {
      errorMsg = match[1].trim();
    }
    setCompileError(true);
    setErrorMsg(errorMsg);
    if (props.onError) props.onError(errorMsg);
    return true;
  };

  visitor.onSurfaceDrawEnd = () => {
    if (compileError === false) return;

    setCompileError(false);
  };

  useEffect(() => {
    if (props.sdf === "") {
      setCompileError(true);
      return;
    }

    setCompileError(false);
    setShader(CreateShader(props.sdf, props.primitives).helloGL);

    console.log("HELLO ", props.material);
  }, [props.sdf, props.primitives]);

  useEffect(() => {
    console.log("zoom:", zoom);
  }, [zoom]);

  function CreateShader(sdf, primitives) {
    console.log(" creating shader with ", primitives);
    return Shaders.create({
      helloGL: {
        frag: GLSL`${fs(sdf, String(savedPrimitives).concat(primitives))}`,
      },
    });
  }

  const handleMouseMove = (e) => {
    // return;
    let rect = e.currentTarget.getBoundingClientRect();
    let x = (e.clientX - rect.left) / rect.width;
    let y = (e.clientY - rect.top) / rect.height;
    mousePos.current = [x, y];

    if (dragging.current === true) {
      const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

      // setMousePos([x, y]);
      let difX = x - draggingLastPos.current[0];
      let difY = y - draggingLastPos.current[1];
      difX *= 2.0;

      const newAng = [angle[0] + difX, clamp(angle[1] + 2 * difY, -1.55, 1.55)];
      setAngle(newAng);
      draggingLastPos.current = mousePos.current;
    }
  };

  const handleMouseDown = (e) => {
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

  const handleMouseUp = (e) => {
    dragging.current = false;
  };

  const handleMouseLeave = (e) => {
    dragging.current = false;
  };

  const handleWheelDown = (e) => {
    console.log(e);
    if (zoom > zoomIncrement) setZoom(zoom - zoomIncrement);
  };

  const handleWheelUp = (e) => {
    console.log(e);
    if (zoom < 100) setZoom(zoom + zoomIncrement);
  };

  const fragmentShader = `
  void main(void) {
     vec2 uv = gl_FragCoord.xy/iResolution.xy;
     vec3 col = 0.5 + 0.5*cos(iTime+uv.xyx+vec3(0,2,4));
     gl_FragColor = vec4(col.xy, col.z ,1.0);
  }
`;

  return (
    <div style={{}}>
      {compileError && (
        <UseAnimations
          size={props.width ? 0.6 * props.width : 24}
          animation={alertCircle}
        />
      )}
      {JSON.stringify()}
      {!compileError && (
        <div
          // ref={ref}
          // style={{ height: "100%", width: "100%" }}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          <ReactScrollWheelHandler
            timeout={-1}
            preventScroll={true}
            disableSwipeWithMouse={true}
            upHandler={(e) => handleWheelUp(e)}
            downHandler={(e) => handleWheelDown(e)}
          >
            <ShadertoyReact
              fs={fragmentShader}
              uniforms={shaderUniforms}
            />
          </ReactScrollWheelHandler>
        </div>
      )}
    </div>
  );
}

// export default Shader;
// export default memo(Shader);
export const Shader = memo(MyShader);
