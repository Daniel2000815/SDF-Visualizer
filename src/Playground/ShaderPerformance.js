import React from "react";
import ReactDOM from "react-dom";
import ShadertoyReact from "shadertoy-react";
import { fsp } from "../Shader/fragmentShaderPerformance";
import { useFps } from '@sethwebster/react-fps-counter';

/**
 * Playground shadertoy-react:
 * https://www.npmjs.com/package/shadertoy-react
 *
 * Built-in uniforms (Can be used directly in your shader)
 * float iTime -- shader playback time (in seconds).
 * float iTimeDelta -- Render time (in seconds).
 * int iFrame -- Shader playback frame.
 * vec2 iResolution -- viewport resolution (in pixels).
 * vec4 iDate -- (year, month, day, time in seconds).
 * vec4 iMouse -- mouse pixel coords. xy: current (if MLB down), zw: click.
 * sampler2D iChannel^n -- The textures input channel you've passed; numbered in the same order as the textures passed as prop in your react component.
 * vec3 iChannelResolution[n] -- An array containing the texture channel resolution (in pixels).
 * vec4 iDeviceOrientation -- Raw data from device orientation where respectively x: Alpha, y: Beta, z: Gamma and w: window.orientation.
 */

// Classic glsl syntax
const fragmentShader = fsp()

// Same shader with Shadertoy Syntax
// const fragmentShader = `
//   void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
//     vec2 uv = fragCoord.xy/iResolution.xy;
//     vec3 col = 0.5 + 0.5*cos(iTime+uv.xyx+vec3(0,2,4));
//     fragColor = vec4(col ,1.0);
//   }
// `;

export function ShaderPerformance () {
    const fps = useFps({samplePeriod:100, numberOfFramesForAverage: 100});

    return <div style={{width:"640px", height: "400px"}}><ShadertoyReact fs={fragmentShader} />
    <span>fps: {fps.fps}</span>
    {" "} 
    <span>avg: {fps.avg}</span></div>}
