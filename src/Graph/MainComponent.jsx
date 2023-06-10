import { ReactFlowProvider } from "reactflow";
import { Graph } from "./Graph";
import { shallow } from "zustand/shallow";
import { defaultMaterial } from "../Shader/defaultMaterial";
import { Grid, Button } from "@nextui-org/react";
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
    const e = {
      id: id,
      name: saveName,
      inputMode: InputMode.SDF,
      input: [selectedSdf, "", ""],
      parsedInput: selectedSdf,
      parameters: [],
      fHeader: `${id}(vec3 p)`,
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
    <Grid.Container fluid>
      <Grid xs={8}>
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
          >
            <Grid style={{margin: "10px", marginTop: "50px"}}>
              <Shader
                sdf={selectedSdf}
                primitives=""
                material={defaultMaterial}
                width={0.6 * size.width}
                height={0.6 * size.width}
                onError={() => {}}
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
