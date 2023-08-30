import { ReactFlowProvider } from "reactflow";
import { Graph } from "./Graph";
import { shallow } from "zustand/shallow";
import { defaultMaterial } from "../Shader/defaultMaterial";
import { Grid, Button, Text } from "@nextui-org/react";
import { useStore } from "../graphStore";
import { SizeMe } from "react-sizeme";
import { Shader } from "../Shader/Shader";
import { FiSave } from "react-icons/fi";
import { EquationInput } from "../Components/EquationInput";
import "reactflow/dist/style.css";
import { useState } from "react";
import { InputMode } from "../Types/InputMode";
import { TransformToValidName } from "../Utils/transformToValidName";
import { usePrimitiveStore } from "../primitiveStore";
const selector = () => (store) => ({
  selectedSdf: store.selectedSdf,
  
});

const primitiveSelector = () => (store) => ({
  primitives: store.primitives,
  createPrimitive: (prim) => store.addPrimitive(prim),
  updatePrimitive: (id, data) =>store.updatePrimitive(id, data),
})

export function MainComponent() {
  const { selectedSdf } = useStore(selector(), shallow);
  const { primitives, updatePrimitive, createPrimitive } = usePrimitiveStore(primitiveSelector(), shallow);

  const [saveError, setSaveError] = useState("Introduce name");
  const [saveName, setSaveName] = useState("");
  
  function nameInUse(name) {
    const id = TransformToValidName(name);
    return primitives.some((p) => p.id === id);
  }

  const handleNewSaveName = (newName) => {
    setSaveName(newName);
    if(newName === ""){
      setSaveError("Introduce name");
      return;
    }

    
    if(nameInUse(newName)){
      setSaveError("Name already in use");
      return;
    }

    setSaveError("");
  }

  const handleSave = () => {
    const id = TransformToValidName(saveName);

    let newParsedInput = selectedSdf.sdf;
    console.log("EING 1 ", newParsedInput);
    const params = Array.from(selectedSdf.uniforms, function (item) {
      let paramKey = item[0].split("_")[1];
      newParsedInput = newParsedInput.replaceAll(item[0], paramKey);
        return {symbol: `${paramKey}`, label: `${paramKey}`, defaultVal: item[1], type: "number", range:[0,100]  }
    });
    console.log("EING 2 ", newParsedInput);
    console.log("EING 3 ", params)

    let inputParameters = Array.from(selectedSdf.uniforms, function (item) {
      return item[0].split("_")[1]
    });
    const e = {
      id: id,
      name: saveName,
      inputMode: InputMode.SDF,
      input: [newParsedInput, "", "", "", "", ""],
      parsedInput: newParsedInput,
      parameters: params,
      fHeader: `${id}(vec3 p ${
        inputParameters.length > 0 ? "," : ""
      }${inputParameters.map((p) => `float ${p}`).join(",")})`,
      material: defaultMaterial
    };

    if(!nameInUse(saveName)){
      console.log("sobreescribineod");
      createPrimitive(e);  
    }
    else{
      updatePrimitive(id, e);  
    }

  };

  return (
    <Grid.Container gap={1} fluid>
      <Grid  xs={8}>
        <ReactFlowProvider>
          <div style={{ width: "100vw", height: "90vh" }}>
            <Graph />
          </div>
        </ReactFlowProvider>
      </Grid>
      <SizeMe monitorWidth>
        {({ size }) => (
          <Grid
          
            gap={6}
            direction="column"
            alignContent="flex-start"
            alignItems="center"
            justify="flex-start"
            xs={4}
            style={{borderLeft: "2px solid grey"}}
          >
            <Grid gap={20}><Text b size={40}>Preview and Save</Text></Grid>
            <Grid style={{margin: "10px", marginTop: "50px", border: "1px solid black"}}>
              <Shader
                sdf={selectedSdf.sdf}
                uniforms={selectedSdf.uniforms}
                primitives=""
                material={defaultMaterial}
                width={0.8 * size.width}
                height={0.6 * size.width}
                onError={() => {}}
                errorMsg="Double click a header node to preview"
              />
            </Grid>
            <Grid.Container direction="row" gap={3}>
              <Grid xs={12}>
              {selectedSdf!=="" && EquationInput(
                        0,
                        saveName,
                        "Name",
                        (n) => {handleNewSaveName(n)},
                        saveError,
                        "left",
                        "Name",
                        true,

                      )}
                      </Grid>
                      <Grid xs={12}>
              <Button
                fluid
                icon={<FiSave size={24} />}
                css={{ width: size.width }}
                onClick={() => handleSave()}
                auto
                disabled={selectedSdf === "" || saveError!==""}
                color="primary"
              >
                Save
                </Button>
              </Grid>
            </Grid.Container>
          </Grid>
        )}
      </SizeMe>
    </Grid.Container>
  );
}
