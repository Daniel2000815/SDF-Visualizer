import React, { useEffect, useState } from "react";
import { Edge, Handle } from "reactflow";
import { shallow } from "zustand/shallow";
import { tw } from "twind";
import { useStore } from "../../graphStore";
import {Slider} from "../../Components/Slider";
import {CustomNode} from "./CustomNode";
import { TransformOperations } from "../../Types/NodeOperations";
import {Vector3Input} from "../../Components/GraphPage/Vector3Input";
import {FloatInput} from "../../Components/FloatInput";
const selector = (id: any) => (store: any) => ({
  needsToUpdate: store.needsToUpdate[id],
  updateSdf: (sdf: string) => store.updateNode(id, { sdf: sdf }),
  finishUpdate: () => store.setNeedsUpdate(id, false),
});

const dropdownOptions = Object.values(TransformOperations).map(v => v.replace("_", " "));

const theme: Theme = {
  light: "#FFFAA5",
  primary: "#FFAE21",
  dark: "#E89300",
  accent: "#C77E00",
};

export function TransformNode(props: { id: string; data: any }) {
  const { finishUpdate, updateSdf, needsToUpdate } = useStore(
    selector(props.id),
    shallow
  );

  const [operation, setOperation] = React.useState(
    TransformOperations.RotateX
  );
  const [transformVal, setTransformVal] = React.useState([1.0, 0.0, 0.0]);

  const computeSdf = () => {
    console.log("BOOLEAN NODE SE ACTUALIZA CON ", props.data.inputs);

    const keys = Object.keys(props.data.inputs);
    let newSdf = "";
    // let input = Object.values(props.data.inputs).find((val) => val !== "");
    // console.log(input);

    let input = props.data.inputs.values().next().value;
    // let input = props.data.inputs[Object.keys(props.data.inputs)[0]];

    if (input) {
      if (operation !== TransformOperations.Scale) {
        if (
          operation === TransformOperations.RotateXYZ ||
          operation === TransformOperations.Translate
        ) {
          newSdf = input.replaceAll(
            "p,",
            `sdf${operation}(p, vec3(${transformVal[0].toFixed(4)},${transformVal[1].toFixed(4)}, ${transformVal[2].toFixed(4)}) ),`
          );
        } else {
          newSdf = input.replaceAll(
            "p,",
            `sdf${operation}(p, ${transformVal[0].toFixed(4)}),`
          );
        }
      } else {
        // const s = `vec3(${transformVal.join(",")})`;
        const s = transformVal[0].toFixed(4);
        newSdf = input.replaceAll("p,", `(p/${s}),`).concat(`*${s}`);
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
  }, [operation, transformVal]);

  useEffect(() => {
    if (needsToUpdate) {
      computeSdf();
      finishUpdate();
    }
  }, [needsToUpdate]);

  const handleChangeOption = (v: string) => {

    setOperation(v.replace(" ", "_"));
  } 
  return (
    <CustomNode
      title={"Transform"}
      id={props.id}
      data={props.data}
      dropdownOptions={dropdownOptions}
      dropdownKeys={dropdownOptions}
      defaultDropdpwnOption={dropdownOptions[1]}
      onChangeDropdownOption={handleChangeOption}
      nInputs={1}
      theme={theme}
    >
      {/* UPDATE: {needsToUpdate.toString()} */}
      {/* SDF: {props.data.sdf} */}
      {/* INPUTS: {JSON.stringify(props.data.inputs)} */}
      {[TransformOperations.Translate, TransformOperations.RotateXYZ].includes(
        operation
      ) ? (
        <Vector3Input handleChange={setTransformVal} />
      ) : (
        <FloatInput
          initialVal={"0.0"}
          val={transformVal[0].toString()}
          onChange={(e) => setTransformVal([e,0,0])}
          label={operation}
          adornment={
            operation === TransformOperations.Scale ? "Factor" : "Angle"
          }
          adornmentPos="left"
        />
      )}
    </CustomNode>
  );
}
