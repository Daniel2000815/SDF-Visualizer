import React, { useEffect } from "react";
import { shallow } from "zustand/shallow";
import { useStore } from "../../graphStore";
import {Slider} from "../../Components/Slider";
import {CustomNode} from "./CustomNode";
import { BooleanOperations } from "../../Types/NodeOperations";

const selector = (id: any) => (store: any) => ({
  needsToUpdate: store.needsToUpdate[id],
  updateSdf: (sdf: string) => store.updateNode(id, { sdf: sdf }),
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
  const { finishUpdate, updateSdf, needsToUpdate } = useStore(
    selector(props.id),
    shallow
  );

  const [operation, setOperation] = React.useState(BooleanOperations.Union);
  const [smooth, setSmooth] = React.useState("0.0");

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
      newSdf = `sdfSmooth${operation}(${it.next().value}, ${it.next().value}, ${smooth})`;

      // Add the rest of inputs
      for (let i = 0; i < keys - 2; i++) {
        console.log("new");
        newSdf = `sdfSmooth${operation}(${
          it.next().value
        }, ${newSdf}, ${smooth})`;
      }
    }

    console.log("res ", newSdf);
    updateSdf(newSdf);
  };

  useEffect(() => {
    computeSdf();
  }, [operation, smooth]);

  useEffect(() => {
    if (needsToUpdate) {
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
      onChangeDropdownOption={setOperation}
      nInputs={Math.max(2, props.data.inputs.size + 1)}
      theme={theme}
    >
      {/* UPDATE: {needsToUpdate?.toString()} */}
        {/* SDF: {props.data.sdf} */}
        {/* INPUTS: {JSON.stringify(props.data.inputs)} */}
        Amount: {smooth}
      <Slider value={smooth} onChange={setSmooth} theme={theme} />
    </CustomNode>
  );
}
