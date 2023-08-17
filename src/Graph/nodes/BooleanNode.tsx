import React, { useEffect } from "react";
import { shallow } from "zustand/shallow";
import { useStore } from "../../graphStore";
import {Slider} from "../../Components/Slider";
import {CustomNode} from "./CustomNode";
import { BooleanOperations } from "../../Types/NodeOperations";
import { FloatInput } from "../../Components/FloatInput";
import { Text } from "@nextui-org/react";

const selector = (id: any) => (store: any) => ({
  needsToUpdate: store.needsToUpdate[id],
  updateSdf: (sdf: string) => store.updateNode(id, { sdf: sdf }),
  updateUniforms: (shaderUniforms: Map<string,number>) => store.updateNode(id, { uniforms: shaderUniforms}),
  finishUpdate: () => store.setNeedsUpdate(id, false),
});

const dropdownOptions = Object.values(BooleanOperations);

const theme: Theme = {
  light: "#FFABAB",
  primary: "#FF5151",
  dark: "#FF0000",
  accent: "#CE0000",
};

//create a subscriber

export function BooleanNode(props: { id: string; data: any }) {
  const { finishUpdate, updateSdf, updateUniforms, needsToUpdate } = useStore(
    selector(props.id),
    shallow
  );

  const [operation, setOperation] = React.useState(BooleanOperations.Union);
  const [smooth, setSmooth] = React.useState(0.1);
  const [n, setN] = React.useState(2.0);

  const computeSdf = () => {
    console.log("BOOLEAN NODE SE ACTUALIZA CON ", props.data.inputs);

    const keys = props.data.inputs.size;
    let newSdf = "";
    let it = props.data.inputs.values();

    if(keys == 1){
      newSdf = it.next().value;
    }
    if (keys >= 2) {
      console.log("KEYS ", keys);
      newSdf = `${operation}(${it.next().value}, ${it.next().value}, ${props.id}_smooth, ${props.id}_n, interp)`;

      // Add the rest of inputs
      for (let i = 0; i < keys - 2; i++) {
        console.log("new");
        newSdf = `${operation}(${
          it.next().value
        }, ${newSdf}, ${props.id}_smooth, ${props.id}_n, interp)`;
      }
    }

    console.log("res ", newSdf);
    updateSdf(newSdf);
  };

  const handleUniforms = () => {
    let newUniforms = new Map<string,number>(props.data.uniforms);
    newUniforms.set(`${props.id}_smooth`, smooth);
    newUniforms.set(`${props.id}_n`, n);
    updateUniforms(newUniforms)
  }

  useEffect(() => {
    handleUniforms()
    computeSdf();
  }, [operation, smooth, n]);

  useEffect(() => {
    if (needsToUpdate) {
      handleUniforms();
      computeSdf();
      finishUpdate();
    }
  }, [needsToUpdate]);


  return (
    <CustomNode
      title={"Boolean"}
      id={props.id}
      data={props.data}
      dropdownOptions={dropdownOptions}
      dropdownKeys={dropdownOptions}
      defaultDropdpwnOption={BooleanOperations.Union}
      onChangeDropdownOption={setOperation}
      nInputs={Math.max(2, props.data.inputs.size + 1)}
      theme={theme}
      currDropddownOption={operation}
    >
      {/* UPDATE: {needsToUpdate?.toString()} */}
        {/* SDF: {props.data.sdf} */}
        {/* INPUTS: {JSON.stringify(props.data.inputs)} */}
       <Slider value={smooth} label="Strength" min="0.001" max="5" onChange={setSmooth} theme={theme} />
        <FloatInput
            key={`${props.id}_n`}
            val={n.toString()}
            initialVal={n}
            onChange={(newVal) => setN(newVal)}
            label="n"
            adornment="n"
            adornmentPos="left"
            min={1.0}
            step={1.0}
          />
          </CustomNode>
  );
}
