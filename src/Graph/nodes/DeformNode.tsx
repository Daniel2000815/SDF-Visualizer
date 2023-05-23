import React, { useEffect, useState } from "react";
import { Edge, Handle } from "reactflow";
import { shallow } from "zustand/shallow";
import { tw } from "twind";
import { useStore } from "../../graphStore";
import {Slider} from "../../Components/Slider";
import {CustomNode} from "./CustomNode";
import { DeformOperations } from "../../Types/NodeOperations";

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

  useEffect(() => {
    // let input = props.data.inputs[Object.keys(props.data.inputs)[0]];
    let input = props.data.inputs.values().next().value;
    const newSdf = input ? input.replaceAll("p,", `sdf${operation}(p, ${k.toFixed(4)}),`) : "";
    updateSdf(newSdf);
  }, [operation, k]);

  useEffect(() => {
    console.log("WHAT X3 ", dropdownOptions);
  }, [dropdownOptions]);


  useEffect(()=>{
    if(needsToUpdate){
      console.log("AAA ME TENGO QUE ACTUALIZAR CON ", props.data.inputs);
      // let input = props.data.inputs[Object.keys(props.data.inputs)[0]];
      let input = props.data.inputs.values().next().value;
      const newSdf = input ? input.replace("p,", `sdf${operation}(p, ${k.toFixed(4)}),`) : "";
      updateSdf(newSdf);
      finishUpdate();
    }
  }, [needsToUpdate])

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
    >

        {/* UPDATE: {needsToUpdate.toString()}
        SDF: {props.data.sdf}
        INPUTS: {JSON.stringify(props.data.inputs)} */}
        <Slider value={k} label={"Amount"} onChange={setK} theme={theme}/>

        
       
    </CustomNode>
  );
}
