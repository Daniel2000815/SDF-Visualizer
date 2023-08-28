import React, { useEffect, useState } from "react";
import { shallow } from "zustand/shallow";
import { useStore } from "../../graphStore";
import {CustomNode} from "./CustomNode";
import { RepeatOperations } from "../../Types/NodeOperations";
import {Vector3Input} from "../../Components/GraphPage/Vector3Input";
import {FloatInput} from "../../Components/FloatInput";

const selector = (id: any) => (store: any) => ({
  needsToUpdate: store.needsToUpdate[id], 
  updateSdf: (sdf: string) => store.updateNode(id, { sdf: sdf}),
  updateUniforms: (shaderUniforms: Map<string,number>, dropdownSelection: string) => store.updateNode(id, { uniforms: shaderUniforms, dropdownSelection: dropdownSelection}),
  finishUpdate: () => store.setNeedsUpdate(id, false),
});

const dropdownOptions = Object.values(RepeatOperations).map(v => v.replace(" ", "_"));

const theme: Theme = {
  light: "#DBA5FF",
  primary: "#AD33FF",
  dark: "#7200BF",
  accent: "#49007B",
};

export function RepeatNode(props: { id: string; data: any }) {
  const { finishUpdate, updateSdf, updateUniforms, needsToUpdate } = useStore(
    selector(props.id),
    shallow
  );

  const [operation, setOperation] = React.useState(
    RepeatOperations.Finite_Repeat
  );
  const [repeatVal, setRepeatVal] = React.useState([1.0, 1.0, 1.0]);
  const [separation, setSeparation] = React.useState(5.0);
  
  const computeSdf = () => {
    console.log("REPEAT NODE SE ACTUALIZA CON ", props.data.inputs);
    console.log(operation);
    const keys = Object.keys(props.data.inputs);
    let newSdf = "";
    let input = props.data.inputs.values().next().value;
    // let input = props.data.inputs[Object.keys(props.data.inputs)[0]];

    if (input) {
      const op = operation.replace("_","");
      if (op.includes("Simetry")) {

        newSdf = input.replaceAll("p," , `${op}(p),` );
        
      } 
      else if(operation === RepeatOperations.Finite_Repeat){
        newSdf = input.replaceAll(
            "p,",
            `${op}(p, ${props.id}_separation, vec3(${props.id}_repeatX, ${props.id}_repeatY, ${props.id}_repeatZ)),`
        );
      } 
      else if(operation === RepeatOperations.Infinite_Repeat){
        console.log("inf");
        newSdf = input.replaceAll(
            "p,",
            `${op}(p, ${separation.toFixed(4)}),`
        );
      }
    }

    /*
      newSdf = `sdfSmooth${operation}(${props.data.inputs[keys[0]]}, ${props.data.inputs[keys[1]]}, ${smooth})`;

      // Add the rest of inputs
      for (let i = 0; i < keys.length - 2; i++) {
        console.log(props.data.inputs[keys[i + 2]]);
        newSdf = `sdfSmooth${operation}(${
          props.data.inputs[keys[i + 2]]
        }, ${newSdf}, ${smooth})`;
      }
      */

    updateSdf(newSdf);
  };

  const handleUniforms = () => {
    let newUniforms = new Map<string,number>(props.data.uniforms);
    newUniforms.set(`${props.id}_separation`, separation);
    newUniforms.set(`${props.id}_repeatX`, repeatVal[0]);
    newUniforms.set(`${props.id}_repeatY`, repeatVal[1]);
    newUniforms.set(`${props.id}_repeatZ`, repeatVal[2]);
    updateUniforms(newUniforms, operation)
  }
  useEffect(() => {
    console.log("YIJA ", props.data.uniforms)
    handleUniforms()
    
    computeSdf();
  }, [operation, repeatVal, separation]);

  useEffect(() => {
    if (needsToUpdate) {
      console.log("NEEDS UPDATE ", props.id)
      console.log(props.data)
      handleUniforms()
      computeSdf();
      finishUpdate();
    }
  }, [needsToUpdate]);

  return (
    <CustomNode
      title={"Repeat"}
      id={props.id}
      data={props.data}
      dropdownOptions={dropdownOptions}
      defaultDropdpwnOption={props.data.dropdownSelection || dropdownOptions[8]}
      dropdownKeys={dropdownOptions}
      onChangeDropdownOption={(v:string) => setOperation(v.replace(" ", "_"))}
      nInputs={1}
      theme={theme}
      currDropddownOption={operation}
    >
      {/* UPDATE: {needsToUpdate.toString()} */}
      {/* SDF: {props.data.sdf} */}
      {/* INPUTS: {JSON.stringify(props.data)} */}
      {[RepeatOperations.Finite_Repeat, RepeatOperations.Infinite_Repeat].includes(
        operation
      ) && 
        <FloatInput
          initialVal={"5.0"}
          val={separation.toString()}
          onChange={(e) => setSeparation(e)}
          step={1.0}
          label={operation}
          adornment="separation"
          adornmentPos="left"
        />
        
      }
      {operation === RepeatOperations.Finite_Repeat && 
        <Vector3Input defaultX={1.0} defaultY={1.0} defaultZ={1.0} min={0} step={1.0} handleChange={setRepeatVal} />
      }
    </CustomNode>
  );
}
