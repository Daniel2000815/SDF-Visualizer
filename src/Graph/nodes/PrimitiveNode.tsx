import React, { useEffect, useState } from "react";
import { Handle } from "reactflow";
import { shallow } from "zustand/shallow";
import { tw } from "twind";
// import { useStore } from "../../graphStore";
import { usePrimitiveStore } from "../../primitiveStore";
import { useStore } from "../../graphStore";
import { useTheme } from '@nextui-org/react';
import {Slider} from "../../Components/Slider";

import {CustomNode} from "./CustomNode";
import {FloatInput} from "../../Components/FloatInput";

const primitiveSelector = (id: any) => (store: any) => ({
  primitives: store.primitives,
});

const graphSelector = (id: any) => (store: any) => ({
  changePrimitive: (newP: string, mat: Material) => store.updateNode(id, { sdf: newP, material:  mat}),
});

const theme : Theme = {
  light:    "#ABDEFF",
  primary:  "#498CFF",
  dark:     "#005EFF",
  accent:   "#004AC9"
}


export function PrimitiveNode(props: { id: string; data: any }) {
  const { primitives } = usePrimitiveStore(primitiveSelector(props.id), shallow);
  const { changePrimitive } = useStore(graphSelector(props.id), shallow);

  const [inputs, setInputs] = React.useState([1.0, 1.0, 1.0]);
  const [inputLabels, setInputLabels] = React.useState(["Radius", "", ""]);
  const [primitive, setPrimitive] = useState(
    primitives.find((p: any) => p.id === props.data.id)
  );

  const [dropdownOptions, setDropdownOptions] = React.useState<string[]>(primitives.map((p: any) => p.name));
  const [dropdownKeys, setDropdownKeys] = React.useState<string[]>(primitives.map((p: any) => p.id));

  useEffect(()=>{
    setDropdownOptions(primitives.map((p: any) => p.name))
    setDropdownKeys(primitives.map((p: any) => p.id));
  }, [primitives])

  
  const handleChangePrimitive = (newP: string) => {
    console.log("NEW PRIM ", newP);
    const newPrimitive = primitives.find((p: any) => p.id === newP);
    const parameters: Parameter[] = newPrimitive.parameters;
    // if (inputs.length < parameters.length)
    //   setInputs(
    //     inputs.concat(new Array(parameters.length - inputs.length).fill("0.0"))
    //   );

    const newInputs = Object.keys(parameters).map((_, idx: number) => parameters[idx].defaultVal);
    setInputs(newInputs);

    const sdf = `${newP}(p${parameters.length > 0 ? "," : ""}${parameters
      .map((p, idx) => `${newInputs[idx].toFixed(4)}`)
      .join(",")})`;

    setPrimitive(newPrimitive);

    setInputLabels(
      Object.keys(parameters).map((_, idx: number) => parameters[idx].label)
    );

    console.log("pARAM ", parameters);


    
    
    changePrimitive(sdf, newPrimitive.material);
  };

  const handleInputChange = (newVal: number, idx: number) => {
    console.log(newVal, typeof(newVal));
    const newInputs = [...inputs];
    newInputs[idx] = newVal;

    setInputs(newInputs);

    const parameters: Parameter[] = primitive.parameters;
    if (newInputs.length < parameters.length)
      setInputs(
        newInputs.concat(new Array(parameters.length - newInputs.length).fill(0))
      );

    console.log("param:", parameters);

    const sdf = `${primitive.id}(p${parameters.length > 0 ? "," : ""}${parameters
      .map((p, idx) => `${newInputs[idx].toFixed(4)}`)
      .join(",")})`;
      
    changePrimitive(sdf, primitive.material);
  };

  return (
    <CustomNode
      id={props.id}
      data={props.data}
      nInputs={0}
      title="Primitive"
      dropdownKeys={dropdownKeys}
      dropdownOptions={dropdownOptions}
      defaultDropdpwnOption={dropdownKeys[2]}
      onChangeDropdownOption={(newP: string) => handleChangePrimitive(newP)}
      theme={theme}
      currDropddownOption={primitive?.name}
    >
      {primitive &&
        primitive.parameters.map((p: Parameter, idx: number) => p.type==="number" ?( 
          <FloatInput
            key={`${props.id}_${idx}`}
            initialVal={inputs[idx]}
            val={inputs[idx].toString()}
            onChange={(newVal) => handleInputChange(newVal, idx)}
            label={inputLabels[idx]}
            adornment={inputLabels[idx]}
            adornmentPos="left"
          />
        ) : 
        <Slider value={inputs[idx]} label={inputLabels[idx]} onChange={(newVal: number) => handleInputChange(newVal, idx)} theme={theme}/>
        )}
        {/* {JSON.stringify(props.data.children)} */}
    </CustomNode>
  );
}
