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
  const { finishUpdate, updateSdf, needsToUpdate } = useStore(selector(props.id), shallow);
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
      console.log("la operacopm es ", operation);
      if(operation===DeformOperations.Elongation){
        console.log("asi que entro aqui")
        newSdf = input ? input.replaceAll("p,", `${operation}(p, vec3(${elong[0].toFixed(4)},${elong[1].toFixed(4)},${elong[2].toFixed(4)})),`) : "";
      }
      else{
        newSdf = input ? input.replaceAll("p,", `${operation}(p, ${k.toFixed(4)}),`) : "";
      }
    }

    console.log("ACT ", newSdf);
    updateSdf(newSdf);
  }
  
  useEffect(() => {
    computeSdf();
  }, [operation, elong, k]);

  useEffect(() => {
    if (needsToUpdate) {
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
      defaultDropdpwnOption={DeformOperations.Twist}
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
