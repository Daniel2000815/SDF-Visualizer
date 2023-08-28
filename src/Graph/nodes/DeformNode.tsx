import React, { useEffect, useState } from "react";
import { Edge, Handle } from "reactflow";
import { shallow } from "zustand/shallow";
import { tw } from "twind";
import { useStore } from "../../graphStore";
import {Slider} from "../../Components/Slider";
import {CustomNode} from "./CustomNode";
import { DeformOperations } from "../../Types/NodeOperations";
import {Vector3Input} from "../../Components/GraphPage/Vector3Input";
import { comboSort } from "nerdamer-ts/dist/Core/Utils";

const selector = (id: any) => (store: any) => ({
  needsToUpdate: store.needsToUpdate[id],
  updateSdf: (sdf: string) => store.updateNode(id, {sdf: sdf}), 
  updateUniforms: (shaderUniforms: Map<string,number>, dropdownSelection: string) => store.updateNode(id, { uniforms: shaderUniforms, dropdownSelection: dropdownSelection}),
  finishUpdate: () => store.setNeedsUpdate(id, false),
});

const dropdownOptions = Object.values(DeformOperations);

const theme : Theme = {
  light:    "#BAFFBD",
  primary:  "#00F708",
  dark:     "#00BD06",
  accent:   "#009705"
}

//create a subscriber


export function DeformNode(props: { id: string; data: any }) {
  const { finishUpdate, updateSdf, updateUniforms, needsToUpdate } = useStore(selector(props.id), shallow);
  const [operation, setOperation] = React.useState(DeformOperations.Bend);
  const [elong, setElong] = React.useState([0.0, 0.0, 0.0]);
  const [k, setK] = React.useState(0.5);
  

  useStore.subscribe((newValue, oldValue) => {
   
    // console.log("NEWWW: ", newValue.needsToUpdate);
    // const oldEdges = oldValue.edges.find((e:Edge) => e.target === props.id);
    // const newEdges = newValue.edges.find((e:Edge) => e.target === props.id);

    // const oldInputs = oldValue.edges.find((e:Edge) => e.target === props.id);
    // const newInputs = newValue.edges.find((e:Edge) => e.target === props.id);
    // if(oldEdges !== newEdges){
    //   console.log(
    //     "new Value " + JSON.stringify(newEdges) + ", old Value:" + JSON.stringify(oldEdges)
    //   );
    // }
  });

  const computeSdf = () => {
    let input = props.data.inputs.values().next().value;
    let newSdf = "";

    if(operation===DeformOperations.Round){
      newSdf = input ? `${operation}(${input}, ${k.toFixed(4)})` : "";
    }
    else{
      if(operation===DeformOperations.Elongation){
        newSdf = input ? input.replaceAll("p,", `${operation}(p, vec3(${props.id}_elongX,${props.id}_elongY,${props.id}_elongZ)),`) : "";
      }
      else{
        newSdf = input ? input.replaceAll("p,", `${operation}(p, ${props.id}_k),`) : "";
      }
    }

    updateSdf(newSdf);
  }

  const handleUniforms = () => {
    let newUniforms = new Map<string,number>(props.data.uniforms);
    newUniforms.set(`${props.id}_elongX`, elong[0]);
    newUniforms.set(`${props.id}_elongY`, elong[1]);
    newUniforms.set(`${props.id}_elongZ`, elong[2]);
    newUniforms.set(`${props.id}_k`, k);

    updateUniforms(newUniforms, operation)
  }
  
  useEffect(() => {
    handleUniforms()
    computeSdf();

    
  }, [operation, elong, k]);

  useEffect(() => {
    if (needsToUpdate) {
      handleUniforms()
      computeSdf();
      finishUpdate();
    }
  }, [needsToUpdate]);

  useEffect(() => {
    console.log("WHAT X3 ", dropdownOptions);
  }, [dropdownOptions]);

  const handleChange = (val: string) => {
    // setK(val.toFixed(4));
  };


  return (
    <CustomNode
      title={"Deform"}
      id={props.id}
      data={props.data}
      dropdownOptions={dropdownOptions}
      dropdownKeys={dropdownOptions}
      defaultDropdpwnOption={props.data.dropdownSelection || DeformOperations.Twist}
      onChangeDropdownOption={setOperation}
      nInputs={1}
      theme={theme}
      currDropddownOption={operation}
    >

        {/* UPDATE: {needsToUpdate.toString()}
        SDF: {props.data.sdf}
        INPUTS: {JSON.stringify(props.data.inputs)} */}
        {operation === DeformOperations.Elongation ? 
        (<Vector3Input handleChange={setElong} step={1}/>) :
        (<Slider value={k} label={"Amount"} onChange={setK} theme={theme}/>)
      }

        
       
    </CustomNode>
  );
}
