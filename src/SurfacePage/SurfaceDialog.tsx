import { useState, useEffect } from "react";

// import { useStore } from "../graphStore";
import { usePrimitiveStore } from "../primitiveStore";
import { shallow } from "zustand/shallow";
import { Modal, Grid, Row, Button, Text, Collapse } from "@nextui-org/react";

import { SizeMe } from "react-sizeme";
import { InputMode } from "../Types/InputMode";

import {
  EquationInput,
  ImplicitInput,
  ParametricInput,
  SDFInput,
} from "../Components/EquationInput";
import { MaterialInput } from "../Components/SurfacePage/MaterialInput";
import { ParameterTable } from "./ParameterTable";
// import {
//     EquationInput,
//     SDFInput,
//     ParametricInput,
//     ImplicitInput,
//   } from "../CustomComponents/MaterialPage/EquationInput";
import { defaultMaterial } from "../Shader/defaultMaterial";
import { StringToSDF, ImplicitToSDF } from "../Utils/StringToSDF";
import { TransformToValidName } from "../Utils/transformToValidName";
import { Polynomial } from "../multivariate-polynomial/Polynomial";
import { Ideal } from "../multivariate-polynomial/Ideal";

import { Shader } from "../Shader/Shader";

import "katex/dist/katex.min.css";
var Latex = require("react-latex");

const selector = () => (store: any) => ({
  primitives: store.primitives,
  createPrimitive: (prim: EquationData) => store.addPrimitive(prim),
  updatePrimitive: (id: string, data: EquationData) =>store.updatePrimitive(id, data),
});

export function SurfaceDialog(props: {
  initialID: string;
  handleClose: Function;
  open: boolean;
}) {
  const { primitives, updatePrimitive, createPrimitive } = usePrimitiveStore(
    selector(),
    shallow
  );
  const [eqData, setEqData] = useState({
    id: "",
    name: "",
    inputMode: InputMode.Implicit,
    input: "",
    parsedInput: "",
    parameters: [""],
    fHeader: "",
    material: defaultMaterial
  });

  // PREVIEW
  const [exampleSDF, setExampleSDF] = useState("");
  const [exampleShaderFunction, setExampleShaderFunction] = useState("");

  // INPUT FROM DIALOG
  const [inputMath, setInputMath] = useState(["5*t^2 + 2*s^2 - 10", "1", "s", "1", "t", "1"]);
  const [inputName, setInputName] = useState("");
  const [inputParameters, setInputParameters] = useState<Parameter[]>([]);
  const [inputMaterial, setInputMaterial] = useState<Material>(defaultMaterial);

  // VALIDATION OS INPUT FROM DIALOG
  const [mathErrorMsg, setMathErrorMsg] = useState(["", "", "", "", "", ""]);
  const [nameErrorMsg, setNameErrorMsg] = useState("");

  const [eqInputMode, setEqInputMode] = useState(InputMode.Implicit);

  useEffect(() => {
    console.log("INPUT MATH NEW ", inputMath);
    handleNewEquation();
  }, [eqInputMode, inputParameters, inputMath]);

  useEffect(() => {
    handleNewName();
  }, [inputName]);

  useEffect(() => {
    const initialSurf: EquationData = primitives.find(
      (p: EquationData) => p.id === props.initialID
    );
    if (initialSurf) {
      setEqInputMode(initialSurf.inputMode);
      console.log("TEST ", initialSurf);
      console.log("TEST ", initialSurf.input);
      setInputMath([
        initialSurf.input[0],
        initialSurf.input[1],
        initialSurf.input[2],
        initialSurf.input[3],
        initialSurf.input[4],
        initialSurf.input[5],
      ]);

      setInputName(initialSurf.name);

      setInputParameters(initialSurf.parameters);
      setInputMaterial(initialSurf.material);
      console.log("computing example sdf");
      
      computeExampleSDF(initialSurf.parsedInput);
    } else {
      setInputMath(["", "", "", "", "", ""]);
      setInputName("");
      setExampleSDF("");
      setInputParameters([]);
    }
  }, [props.open]);

  const computeExampleSDF = (parsedSDF: string) => {
    let exampleHeader = `exampleSDF(vec3 p ${
      inputParameters.length > 0 ? "," : ""
    }${inputParameters.map((p) => `float ${p.symbol}`).join(",")})`;

    let shaderFunction = `float ${exampleHeader}{
            float x = p.r;
            float y = p.g;
            float z = p.b;
      
            return ${parsedSDF};
        }\n`;

    console.log("res ", shaderFunction);
    setExampleShaderFunction(shaderFunction);
    setExampleSDF(
      `exampleSDF(p${inputParameters.length > 0 ? "," : ""}${inputParameters
        .map((p, idx) => `${p.defaultVal.toFixed(4)}`)
        .join(",")})`
    );
  };

  function nameInUse(name: string) {
    const id = TransformToValidName(name);
    if (props.initialID === "")
      return primitives.some((p: EquationData) => p.id === id);
    else {
      return (
        id !== props.initialID &&
        primitives.some((p: EquationData) => p.id === id)
      );
    }
  }

  function handleNewName() {
    if (inputName === "") setNameErrorMsg("Introduce a name");
    else if (nameInUse(inputName)) {
      setNameErrorMsg("Name already in use");
    } else {
      setNameErrorMsg("");
    }
  }
  const handleNewEquationParam = (): [string | null, string[]] => {
    console.log("HANDLING PARAMETRIC ", mathErrorMsg);
    let implicit = "";
    let newErrorMsg = ["", "", "", "", "", ""];
    let fs: Polynomial[] = [];

    // SPELL CHECK
    newErrorMsg = inputMath.map((input) =>
      input === "" ? "Introduce equation" : ""
    );

    if (newErrorMsg.some((m) => m !== "")) return [null, newErrorMsg];

    inputMath.forEach((input, idx) => {
      try {
        fs.push(
          new Polynomial(
            input,
            ["s", "t"].concat(inputParameters.map((p) => p.symbol))
          )
        );
      } catch (e: any) {
        console.log("ERROR AQUI ", idx);
        newErrorMsg[idx] = Error(e).message;
        return [null, newErrorMsg];
      }
    });

    fs.forEach((f:Polynomial, idx:number)=>console.log("f",idx, " = ", f,f.toString()))

    // PARAM -> IMPLICIT
    try {
      
      
      let abort = false;
      [1,3,5].forEach(val => {
        if(fs[val].isZero()){
          newErrorMsg[val] = "Denominator can't be 0"
          abort = true;
        }
      })

      if(abort) return [null, newErrorMsg];


   
      
      const res = Ideal.implicitateR3(
        fs[0],
        fs[2],
        fs[4],
        fs[1],
        fs[3],
        fs[5],
        inputParameters.map((p) => p.symbol)
      );
      implicit = res.toString(true);
      console.log("IMPLICITATION ", res.toString());
      console.log(
        "AQUI: ",
        fs[0].toString(),
        ",",
        fs[1].toString(),
        ",",
        fs[2].toString(),
        ",",
        implicit
      );
    } catch (error: any) {
      console.log("STEP 1")
      newErrorMsg.fill(Error(error).message);
      return [null, newErrorMsg];
    }

    // IMPLICIT -> SDF
    try {
      console.log("COMPUTING IMPLICIT SDF");
      let r = ImplicitToSDF(implicit, inputParameters);
      // setExampleSDF(ImplicitToSDF(inputMath[0], inputParameters, true));
      return [r, newErrorMsg];
    } catch (error: any) {
      console.log("error:", Error(error).message);
      newErrorMsg.fill(Error(error).message);
      return [null, newErrorMsg];
    }
  };

  const handleNewEquationImp = (): [string | null, string[]] => {
    console.log("HANDLING IMPLICIT ", inputMath[0]);
    let newErrorMsg = ["", "", ""];

    // SPELL CHECK
    try {
      new Polynomial(
        inputMath[0],
        ["x", "y", "z"].concat(inputParameters.map((p) => p.symbol))
      );
    } catch (e: any) {
      console.log("SPELL CHECK ", Error(e).message);
      newErrorMsg[0] = Error(e).message;
      return [null, newErrorMsg];
    }

    try {
      console.log("COMPUTING IMPLICIT SDF");
      let r = ImplicitToSDF(inputMath[0], inputParameters);
      console.log("HECHO", ImplicitToSDF(inputMath[0], inputParameters, true));
      // setExampleSDF(ImplicitToSDF(inputMath[0], inputParameters, true));
      return [r, newErrorMsg];
    } catch (error: any) {
      console.log("error:", Error(error).message);
      newErrorMsg.fill(Error(error).message);
      return [null, newErrorMsg];
    }
  };

  const handleNewEquationSDF = (): [string, string[]] => {
    return [inputMath[0], ["", "", ""]];
  };

  const handleNewEquation = () => {
    let res: [string | null, string[]] = [null, ["", "", ""]];
    switch (eqInputMode) {
      case InputMode.Parametric:
        res = handleNewEquationParam();
        break;
      case InputMode.Implicit:
        res = handleNewEquationImp();
        break;
      case InputMode.SDF:
        res = handleNewEquationSDF();
        break;
      default:
        break;
    }

    if (res[0] !== null) {
      setEqData({ ...eqData, parsedInput: res[0] });
      computeExampleSDF(res[0]);
    }
    setMathErrorMsg(res[1]);
    console.log("FINISH HANDLING ", exampleSDF);
  };

  const handleSave = () => {
    const id = TransformToValidName(inputName);
    const e: EquationData = {
      id: id,
      name: inputName,
      inputMode: eqInputMode,
      input: inputMath,
      parsedInput: eqData.parsedInput,
      parameters: inputParameters,
      fHeader: `${id}(vec3 p ${
        inputParameters.length > 0 ? "," : ""
      }${inputParameters.map((p) => `float ${p.symbol}`).join(",")})`,
      material: inputMaterial
    };

    if(!nameInUse(inputName)){
        if(props.initialID === ""){
            createPrimitive(e);
        }
        else{
            console.log("SI AQUI");
            updatePrimitive(props.initialID, e);
        }
    }
    else{
        if(id === props.initialID){
            updatePrimitive(props.initialID, e);
        }
    }

    props.handleClose();
  };

  function handleShaderError(e: string) {
    console.log(e);

    setMathErrorMsg([e, "", ""]);
  }

  const displayInput = () => {
    switch (eqInputMode) {
      case InputMode.Implicit:
        return ImplicitInput(
          inputMath,
          (newInputMath: string[]) => setInputMath(newInputMath),
          mathErrorMsg[0]
        );

      case InputMode.Parametric:
        return ParametricInput(
          inputMath,
          (newInputMath: string[]) => setInputMath(newInputMath),
          mathErrorMsg
        );

      case InputMode.SDF:
        return SDFInput(
          inputMath,
          (newInputMath: string[]) => setInputMath(newInputMath),
          mathErrorMsg[0]
        );

      default:
        break;
    }
  };

  const displayInputHelp = () => {
    switch (eqInputMode) {
      case InputMode.Implicit:
        return (
          <Latex>{`Write the implicit equation using variables $$ x,y,z$$.`}</Latex>
        );

      case InputMode.Parametric:
        return (
          <Latex>{`Write the parametrization of each component $$x,y,z$$ using $$s,t$$ as parameters.`}</Latex>
        );

      case InputMode.SDF:
        return (
          <Latex>{`Write the SDF of the surface at a point $$p=(x,y,z)$$. You can use any $$\\texttt{glsl}$$ function.`}</Latex>
        );

      default:
        break;
    }
  };

  return (
    <div>
      <Modal
        closeButton
        blur
        aria-labelledby="modal-title"
        open={props.open}
        onClose={() => props.handleClose()}
        width="75%"
        css={{ minHeight: "90vh" }}
      >
        <Modal.Header>
          <Text id="modal-title" size={18}>
            <Text b size={18}>
              New Surface
            </Text>
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Grid.Container
            alignItems="center"
            alignContent="space-between"
            justify="space-between"
            direction="row"
          >
            <Row align="center" justify="flex-start">
              <Button.Group auto>
                <Button
                  flat={eqInputMode === InputMode.Implicit}
                  onClick={() => setEqInputMode(InputMode.Implicit)}
                >
                  Implicit
                </Button>
                <Button
                  flat={eqInputMode === InputMode.Parametric}
                  onClick={() => setEqInputMode(InputMode.Parametric)}
                >
                  Parametric
                </Button>
                <Button
                  flat={eqInputMode === InputMode.SDF}
                  onClick={() => setEqInputMode(InputMode.SDF)}
                >
                  SDF
                </Button>
              </Button.Group>
              <Text id="modal-title" size={18}>
                <Text size={16}>{displayInputHelp()}</Text>
              </Text>
            </Row>
            <Grid xs={8}>
              <Grid.Container gap={1} direction="row">
                <Grid xs={12}>
                  <Grid.Container gap={2} direction="column">
                    <Grid>
                      {EquationInput(
                        0,
                        inputName,
                        "Name",
                        (n: string) => setInputName(n),
                        nameErrorMsg,
                        "left",
                        "Name"
                      )}
                    </Grid>
                    <Grid>{displayInput()}</Grid>
                  </Grid.Container>
                </Grid>
                <Grid.Container gap={2}>
                  <Grid xs={12}>
                    <Collapse.Group bordered>
                      <Collapse
                        title={
                          <Row align="center">
                            <Text h4>Parameters</Text>
                            <Latex>{`$$\\quad $$ ${inputParameters.map(
                              (p) => `$$ ${p.symbol} $$`
                            )}`}</Latex>
                          </Row>
                        }
                      >
                        <ParameterTable
                          params={inputParameters}
                          onEditParams={(newParams: Parameter[]) => {
                            setInputParameters(newParams.map((p) => p));
                            console.log("EDIT PARAMS", newParams);
                          }}
                        />
                      </Collapse>
                      <Collapse
                        title={
                          <Row align="center">
                            <Text h4>Material</Text>
                          </Row>
                        }
                      >
                        <MaterialInput
                        defaultValue={inputMaterial}
                          handleChange={(m: Material) => setInputMaterial(m)}
                        />
                      </Collapse>
                    </Collapse.Group>
                  </Grid>
                </Grid.Container>
              </Grid.Container>
            </Grid>
            <SizeMe monitorHeight>
              {({ size }) => (
                <Grid style={{ height: "200px" }} xs={4}>
                  <Shader
                    sdf={exampleSDF}
                    primitives={exampleShaderFunction}
                    material={inputMaterial}
                    width={size.width}
                    height={size.height}
                    onError={(e: string) => handleShaderError(e)}
                    uniforms={new Map()}
                  />
                </Grid>
              )}
            </SizeMe>
          </Grid.Container>
        </Modal.Body>
        <Modal.Footer>
          <Button auto flat color="error" onPress={() => props.handleClose()}>
            Discard
          </Button>
          <Button
            auto
            onPress={() => handleSave()}
            disabled={mathErrorMsg.some((m) => m !== "") || nameErrorMsg !== ""}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
