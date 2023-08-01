import { ReactFlowProvider } from "reactflow";
import { defaultMaterial } from "../Shader/defaultMaterial";
import { Grid, Text, Collapse, Switch, Row, Col } from "@nextui-org/react";
import { SizeMe } from "react-sizeme";
import { Shader } from "../Shader/Shader";
import { FiSave } from "react-icons/fi";
import { EquationInput } from "../Components/EquationInput";
import ShadertoyReact from "shadertoy-react";
import { fsp } from "../Shader/fragmentShaderPerformance";
import { Slider } from "../Components/Slider";
import { useEffect, useState } from "react";
import { CiDark, CiLight, CiGrid41, CiPlay1, CiSun } from "react-icons/ci";

import {
  CircularInput,
  CircularTrack,
  CircularProgress,
  CircularThumb,
  useCircularInputContext,
} from "react-circular-input";
import React from "react";
import { Color, ColorResult, RGBColor, ChromePicker } from "react-color";



const theme = {
  light: "#ABDEFF",
  primary: "#498CFF",
  dark: "#005EFF",
  accent: "#004AC9",
};

export function ColorPicker(props) {
  const [color, setColor] = React.useState({
    r: props.initialRGB[0] * 255,
    g: props.initialRGB[1] * 255,
    b: props.initialRGB[2] * 255,
    a: 1,
  });

  const handleChange = (color) => {
    setColor(color.rgb);
    props.handleChange([
      color.rgb.r / 255.0,
      color.rgb.g / 255.0,
      color.rgb.b / 255.0,
    ]);
  };

  return (
    <ChromePicker color={color} onChange={(color) => handleChange(color)} />
  );
}

function MySwitch({ label, iconText, value, onChange, iconOn, iconOff }) {
  return (
    <Grid.Container justify="center" alignContent="center" alignItems="center" direction="column">
      <Grid>
        <Text h1 b>
          {label}
        </Text>
      </Grid>
      <Grid>
        <Switch
        
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          iconOff={iconOff}
          iconOn={iconOn}
          icon={
          iconOn ? 
            <Text b h1>
              {iconText}
            </Text> : null
          }
          
        />
      </Grid>
    </Grid.Container>
  );
}
function CustomComponent({ label, max }) {
  const { getPointFromValue, value } = useCircularInputContext();
  const point = getPointFromValue();
  if (!point) return null;
  return (
    <>
      <text
        {...point}
        textAnchor="middle"
        dy="0.35em"
        fill="rgb(61, 153, 255)"
        style={{ pointerEvents: "none", fontWeight: "bold" }}
      >
        {Math.round(value * max)}
      </text>
      <text x={60} y={65} textAnchor="middle" fontWeight="bold">
        {label}
      </text>
    </>
  );
}

export function Playground() {
  const [zoom, setZoom] = useState(2.5);
  const [lightsPos, setLightsPos] = useState([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);

  const [lightsColor, setLightsColor] = useState([
    0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.3, 0.0, 0.1, 0.55, 0.55, 0.55,
  ]);
  const [lightsInputs, setLightsInputs] = useState([
    0.66, 0.75, 0.55, 0.45, 0.1, 0, 0.75, 0.66,
  ]);
  const [lightsSize, setLightsSize] = useState([0.1, 0.5, 0.8, 0.2]);
  const [enableAO, setEnableAO] = useState(true);
  const [enableShadows, setEnableshadows] = useState(true);
  const [enableAA, setEnableAA] = useState(1);
  const [enableLights, setEnableLights] = useState([true, true, false, false]);
  const [enableLightsUniform, setEnableLightsUniform] = useState([1, 1, 0, 0]);
  const [animate, setAnimate] = useState(true);

  const [sphereMat, setSphereMat] = useState({
    ambient: [0.8392, 0.7216, 0.8667],
    ka: 0.4,
    diffuse: [1.3, .0, 0.7],
    kd: 2,
    specular: [1.3, 1, 0.7],
    ks: 30,
    emission: [0.02, 0.02, 0.02],
    smoothness: 100,
  });
  const [boxMat, setBoxMat] = useState({
    ambient: [0.0118, 0.2235, 0.302],
    ka: 1,
    diffuse: [0.1216, 0.2824, 0.5608],
    kd: 5,
    specular: [0.4431, 0.4314, 0.5098],
    ks: 10,
    emission: [0,0,0],
    smoothness: 15,
  });
  const [fs, setFs] = useState(fsp(enableAA, enableAO, enableShadows));

  const uniforms = {
    u_zoom: { type: "1f", value: zoom }, // float
    u_lightsPos: { type: "1fv", value: lightsPos },
    u_lightsColor: { type: "1fv", value: lightsColor },
    u_lightsSize: { type: "1fv", value: lightsSize },
    u_lightsEnable: { type: "1iv", value: enableLightsUniform },
    
    u_sphere_ambient: { type: "3fv", value: sphereMat.ambient }, 
    u_sphere_ka: { type: "1f", value: sphereMat.ka },         
    u_sphere_diffuse: { type: "3fv", value: sphereMat.diffuse },    
    u_sphere_kd: { type: "1f", value: sphereMat.kd },         
    u_sphere_specular: { type: "3fv", value: sphereMat.specular },
    u_sphere_ks: { type: "1f", value: sphereMat.ks },         
    u_sphere_emission: { type: "3fv", value: sphereMat.emission },   
    u_sphere_smoothness: { type: "1f", value: sphereMat.smoothness },

    u_box_ambient: { type: "3fv", value: boxMat.ambient }, 
    u_box_ka: { type: "1f", value: boxMat.ka },         
    u_box_diffuse: { type: "3fv", value: boxMat.diffuse },    
    u_box_kd: { type: "1f", value: boxMat.kd },         
    u_box_specular: { type: "3fv", value: boxMat.specular },
    u_box_ks: { type: "1f", value: boxMat.ks },         
    u_box_emission: { type: "3fv", value: boxMat.emission },   
    u_box_smoothness: { type: "1f", value: boxMat.smoothness },

    u_animate: {type: "1i", value: animate}
    // uLightInputArrayFloats : {type: '1fv', value: [0.2, 0.4, 0.5, 0.5, 0.6] }, // Array of float
    // uLightInputArrayVecs2 : {type: '2fv', value: [0.2, 0.4, 0.5, 0.5] }, // 2 vec2 passed as a flat array
    // uLightInputMatrix : {
    //     type: 'Matrix2fv',
    //     value: [0., 1., 2., 3.] // 2x2 Matrix
    // }
  };

  useEffect(() => {
    console.log(fsp(enableAA, enableAO, enableShadows));
    setFs(fsp(enableAA, enableAO, enableShadows));
  }, [enableAA, enableAO, enableShadows]);

  useEffect(() => {
    setEnableLightsUniform(enableLights.map((e) => Number(e)));
  }, [enableLights]);

  useEffect(() => {
    let newPos = [];
    for (let i = 0; i < lightsInputs.length / 2; i++) {
      const theta = 2 * Math.PI * lightsInputs[2 * i];
      const gamma = Math.PI * lightsInputs[2 * i + 1];

      newPos[3 * i + 1] = 100 * Math.sin(theta) * Math.cos(gamma);
      newPos[3 * i + 2] = 100 * Math.sin(theta) * Math.sin(gamma);
      newPos[3 * i] = 100 * Math.cos(theta);
    }
    setLightsPos(newPos);
  }, [lightsInputs]);

  const editVal = (idx, v) => {
    const newArray = [...lightsInputs];

    // Modifica la componente 1 (índice 1) del nuevo array
    newArray[idx] = v; // Cambia 100 por el valor que deseas asignar

    // Actualiza el estado con el nuevo array modificado
    setLightsInputs(newArray);
  };

  const editEnable = (idx, v) => {
    const newArray = [...enableLights];

    // Modifica la componente 1 (índice 1) del nuevo array
    newArray[idx] = v; // Cambia 100 por el valor que deseas asignar

    // Actualiza el estado con el nuevo array modificado
    setEnableLights(newArray);
  };

  const editSize = (idx, v) => {
    const newArray = [...lightsSize];

    // Modifica la componente 1 (índice 1) del nuevo array
    newArray[idx] = v; // Cambia 100 por el valor que deseas asignar

    // Actualiza el estado con el nuevo array modificado
    setLightsSize(newArray);
  };

  const editColor = (idx, v) => {
    const newArray = [...lightsColor];

    // Modifica la componente 1 (índice 1) del nuevo array
    newArray[idx] = v[0];
    newArray[idx + 1] = v[1];
    newArray[idx + 2] = v[2];

    // Actualiza el estado con el nuevo array modificado
    setLightsColor(newArray);
  };

  function LightInput(idx) {
    return (
      <Grid.Container
        style={{ minHeight: "200px" }}
        alignItems="center"
        justify="space-around"
        alignContent="center"
        gap={2}
      >
        <Grid xs={2}>
          <CircularInput
            value={lightsInputs[2 * idx]}
            onChange={(v) => editVal(2 * idx, v)}
            radius={60}
          >
            <CircularTrack />
            <CircularProgress />
            <CircularThumb />
            <CustomComponent max={360} label="Angle X" />
          </CircularInput>
        </Grid>
        <Grid xs={2}>
          <CircularInput
            value={lightsInputs[2 * idx + 1]}
            onChange={(v) => editVal(2 * idx + 1, v)}
            radius={60}
          >
            <CircularTrack />
            <CircularProgress />
            <CircularThumb />
            <CustomComponent max={160} label="Angle Y" />
          </CircularInput>
        </Grid>
        <Grid xs={2}>
          <CircularInput
            value={lightsSize[idx]}
            onChange={(v) => editSize(idx, v)}
            radius={60}
          >
            <CircularTrack />
            <CircularProgress />
            <CircularThumb />
            <CustomComponent max={20} label="Size" />
          </CircularInput>
        </Grid>
        <Grid xs={3}>
          <ColorPicker
            initialRGB={[1, 0, 0]}
            handleChange={(c) => editColor(3 * idx, c)}
          />
        </Grid>
      </Grid.Container>
    );
  }

  const editMat = (prop, obj, val) => {
    if(obj===0){
      setSphereMat(prevState => ({
        ...prevState,
        [prop]: val
      }));
    }
    else if(obj===1){
      setBoxMat(prevState => ({
        ...prevState,
        [prop]: val
      }));
    }
    // else if(obj===2){
    //   setSphereMat(prevState => ({
    //     ...prevState,
    //     [prop]: val
    //   }));
    // }
  }

  function MaterialInput(idx) {
    return (
      <Grid.Container
        style={{ minHeight: "200px" }}
        alignItems="center"
        justify="center"
        alignContent="center"
        gap={2}
      >
        <Grid xs={3}><Text  size={20}>Ambient</Text></Grid>
        <Grid xs={3}><Text  size={20}>Diffuse</Text></Grid>
        <Grid xs={3}><Text  size={20}>Specular</Text></Grid>
        <Grid xs={3}><Text  size={20}>Emission</Text></Grid>
        <Grid xs={3}>
          <ColorPicker
            initialRGB={idx==0 ? sphereMat.ambient : boxMat.ambient}
            handleChange={(c) => editMat("ambient", idx, c)}
          />
        </Grid>
        <Grid xs={3}>
          <ColorPicker
            initialRGB={idx==0 ? sphereMat.diffuse : boxMat.diffuse}
            handleChange={(c) =>editMat("diffuse", idx, c)}
          />
        </Grid>
        <Grid xs={3}>
          <ColorPicker
            initialRGB={idx==0 ? sphereMat.specular : boxMat.specular}
            handleChange={(c) => editMat("specular", idx, c)}
          />
        </Grid>
        <Grid xs={3}>
          <ColorPicker
            initialRGB={idx==0 ? sphereMat.emission : boxMat.emission}
            handleChange={(c) => editMat("emission", idx, c)}
          />
        </Grid>
        <Grid xs={3}>
          <Slider value={idx==0 ? sphereMat.ka : boxMat.ka} label={"ka"} step="0.1" precision={1} theme={theme} onChange={v=>editMat("ka", idx, v)}/>
        </Grid>
        <Grid xs={3}>
          <Slider value={idx==0 ? sphereMat.kd : boxMat.kd} label={"kd"} step="0.1" precision={1} theme={theme} onChange={v=>editMat("kd", idx, v)}/>
        </Grid>
        <Grid xs={3}>
          <Slider max="200" value={idx==0 ? sphereMat.ks : boxMat.ks} label={"ks"} step="0.1" precision={1} theme={theme} onChange={v=>editMat("ks", idx, v)}/>
        </Grid>
        <Grid xs={3}/>
        <Grid xs={3}/>
        <Grid xs={3}/>
        <Grid xs={3}>
          <Slider max="500" value={idx==0 ? sphereMat.smoothness : boxMat.smoothness} label={"smoothness"} step="0.1" precision={1} theme={theme} onChange={v=>editMat("smoothness", idx, v)}/>
        </Grid>
        <Grid xs={3}/>
        


        
      </Grid.Container>
    );
  }

  return (
    <Grid.Container>
      <SizeMe monitorWidth>
        {({ size }) => (
          <Grid xs={6} gap={6} direction="column">
            <ShadertoyReact
              key={fs}
              fs={fs}
              uniforms={uniforms}
              style={{ height: `${Math.round(0.5*size.width)}px` }}
            />
            <Text h1 b>
              Resolution: {Math.round(size.width)}px x {Math.round(0.5*size.width)}px
            </Text>
          </Grid>
        )}
      </SizeMe>

      <Grid xs={6}>
        <Grid.Container direction="column" gap={2}>
          <Grid.Container gap={5}>
            <Grid xs={3}>
              <Slider
                value={zoom}
                min={0}
                max={10}
                step="0.1"
                onChange={setZoom}
                label="Distance"
                theme={theme}
                bold
                precision={1}
              />
              </Grid>
              <Grid xs={2}>
              <Slider
                value={enableAA}
                min={1}
                max={4}
                step="1"
                onChange={setEnableAA}
                label="AA"
                precision={0}
                theme={theme}
                iconOn={<CiGrid41/>}
                bold
              />
            </Grid>
            <Grid xs={3}>
              <MySwitch
                label={"Ambient oclusion"}
                iconText={"AO"}
                value={enableAO}
                onChange={(v) => setEnableAO(v)}
                
              />
            </Grid>
            <Grid xs={1}>
              <MySwitch
                label={"Shadows"}
                iconText={"S"}
                value={enableShadows}
                onChange={(v) => setEnableshadows(v)}
              />
            </Grid>
            <Grid xs={2}>
              <MySwitch
                label={"Animation"}
                iconText={"S"}
                value={animate}
                onChange={(v) => setAnimate(v)}
              />
            </Grid>
          </Grid.Container>
          <Grid>
            <Collapse.Group shadow>
              <Collapse
                contentLeft={
                  <MySwitch
                    label={""}
                    iconText={""}
                    value={enableLights[0]}
                    onChange={(v) => editEnable(0, v)}
                    iconOn={<CiLight/>}
                    iconOff={<CiDark/>}
                  />
                }
                title={
                  <Text size={20} b>
                    Light 1
                  </Text>
                }
              >
                {LightInput(0)}
              </Collapse>
              <Collapse
                contentLeft={
                  <MySwitch
                    label={""}
                    iconText={""}
                    value={enableLights[1]}
                    onChange={(v) => editEnable(1, v)}
                    iconOn={<CiLight/>}
                    iconOff={<CiDark/>}
                  />
                }
                title={
                  <Text size={20} b>
                    Light 2
                  </Text>
                }
              >
                {LightInput(1)}
              </Collapse>
              <Collapse
                contentLeft={
                  <MySwitch
                    label={""}
                    iconText={""}
                    value={enableLights[2]}
                    onChange={(v) => editEnable(2, v)}
                    iconOn={<CiLight/>}
                    iconOff={<CiDark/>}
                  />
                }
                title={
                  <Text size={20} b>
                    Light 3
                  </Text>
                }
              >
                {LightInput(2)}
              </Collapse>
              <Collapse
                contentLeft={
                  <MySwitch
                    label={""}
                    iconText={""}
                    value={enableLights[3]}
                    onChange={(v) => editEnable(3, v)}
                    iconOn={<CiLight/>}
                    iconOff={<CiDark/>}
                  />
                }
                title={
                  <Text size={20} b>
                    Light 4
                  </Text>
                }
              >
                {LightInput(3)}
              </Collapse>
            </Collapse.Group>
          </Grid>
          <Grid>
            <Collapse.Group shadow>
              <Collapse
                title={
                  <Text size={20} b>
                    Sphere
                  </Text>
                }
              >
                {MaterialInput(0)}
              </Collapse>
              <Collapse
                title={
                  <Text size={20} b>
                    Cube
                  </Text>
                }
              >
                {MaterialInput(1)}
              </Collapse>

            </Collapse.Group>
          </Grid>
        </Grid.Container>
      </Grid>
    </Grid.Container>
  );
}
