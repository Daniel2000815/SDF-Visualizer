import React, { useEffect, useState } from "react";
import { shallow } from "zustand/shallow";
import { useStore } from "../../graphStore";
import {CustomNode} from "./CustomNode";
import { RepeatOperations } from "../../Types/NodeOperations";
import {Vector3Input} from "../../Components/GraphPage/Vector3Input";
import {FloatInput} from "../../Components/FloatInput";

const selector = (id: any) => (store: any) => ({
  needsToUpdate: store.needsToUpdate[id],
  updateSdf: (sdf: string) => store.updateNode(id, { sdf: sdf }),
  finishUpdate: () => store.setNeedsUpdate(id, false),
});

const dropdownOptions = Object.values(RepeatOperations).map(v => v.replace("_", " "));

const theme: Theme = {
  light: "#DBA5FF",
  primary: "#AD33FF",
  dark: "#7200BF",
  accent: "#49007B",
};

export function RepeatNode(props: { id: string; data: any }) {
  const { finishUpdate, updateSdf, needsToUpdate } = useStore(
    selector(props.id),
    shallow
  );

  const [operation, setOperation] = React.useState(
    RepeatOperations.Finite_Repeat
  );
  const [repeatVal, setRepeatVal] = React.useState(["1.0", "1.0", "1.0"]);
  const [separation, setSeparation] = React.useState("5.0");

  const computeSdf = () => {
    console.log("REPEAT NODE SE ACTUALIZA CON ", props.data.inputs);
    console.log(operation);
    const keys = Object.keys(props.data.inputs);
    let newSdf = "";
    let input = props.data.inputs.values().next().value;
    // let input = props.data.inputs[Object.keys(props.data.inputs)[0]];

    if (input) {
      if (operation.includes("Simetry")) {

        newSdf = input.replace("p," , `${operation}(p),` );
        
      } 
      else if(operation === RepeatOperations.Finite_Repeat){
        newSdf = input.replace(
            "p,",
            `${operation}(p, ${separation}, vec3(${repeatVal[0]}, ${repeatVal[1]}, ${repeatVal[2]})),`
        );
      } 
      else if(operation === RepeatOperations.Infinite_Repeat){
        console.log("inf");
        newSdf = input.replace(
            "p,",
            `${operation}(p, ${separation}),`
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

  useEffect(() => {
    computeSdf();
  }, [operation, repeatVal, separation]);

  useEffect(() => {
    if (needsToUpdate) {
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
      defaultDropdpwnOption={RepeatOperations.Infinite_Repeat}
      onChangeDropdownOption={(v:string) => setOperation(v.replace(" ", "_"))}
      nInputs={1}
      theme={theme}
    >
      {/* UPDATE: {needsToUpdate.toString()} */}
      {/* SDF: {props.data.sdf} */}
      {/* INPUTS: {JSON.stringify(props.data.inputs)} */}
      {[RepeatOperations.Finite_Repeat, RepeatOperations.Infinite_Repeat].includes(
        operation
      ) && 
        <FloatInput
          initialVal={"5.0"}
          
          onChange={(e) => setSeparation(e.toFixed(4))}
          step={1.0}
          label={operation}
          adornment="separation"
          adornmentPos="left"
        />
        
      }
      {operation === RepeatOperations.Finite_Repeat && 
        <Vector3Input defaultX="1.0" defaultY="1.0" defaultZ="1.0" min={0} step={1.0} handleChange={setRepeatVal} />
      }
    </CustomNode>
  );
}
