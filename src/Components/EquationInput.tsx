// import Grid from "@mui/material/Unstable_Grid2";
import {Grid} from "@nextui-org/react";
import { Input } from "@nextui-org/react";

// export default function EquationInput(idx: number, val: string, label: string, setVal: Function, validEq: boolean, errorMsg: string, adornmentPos: "end"|"start", adornment: string) {
//   return <Input onChange={(e) => setVal(e.target.value, idx)} placeholder="Next UI" />;
// }

export function EquationInput(
  idx: number,
  val: string,
  label: string,
  setVal: Function,
  errorMsg: string,
  adornmentPos: "right" | "left",
  adornment: string,
  clearable: boolean = true
) {
  return (
    <Input
      initialValue={val}
      defaultValue=""
      clearable={clearable}
      onChange={(e) => setVal(e.target.value, idx)}
      id={label}
      status={errorMsg !== "" ? "error" : "default"}
      color={errorMsg !== "" ? "error" : "default"}
      helperText={errorMsg}
      labelRight={adornmentPos === "right" ? adornment : null}
      helperColor={errorMsg !== "" ? "error" : "default"}
      labelLeft={adornmentPos === "left" ? adornment : null}
      placeholder={label}
      fullWidth
      aria-label={label}
    />
  );
}
// export default function EquationInput(
//   val: string,
//   label: string,
//   setVal: Function,
//   errorMsg: string,
//   adornmentPos: "left" | "right",
//   adornment: string
// ) {
//   return (
//     <TextField
//       sx={{ width: "100%" }}
//       value={val}
//       defaultValue=""
//       label={label}
//       onChange={(e) => setVal(e.target.value)}
//       id={label}
//       error={errorMsg!==""}
//       helperText={errorMsg}
//       InputProps={{
//         endAdornment: (
//           <InputAdornment position={"start"}>{adornment}</InputAdornment>
//         ),
//       }}
//     />
//   );
// }

export function ImplicitInput(
  value: string[],
  onChange: Function,
  errorMsg: string
) {
  return EquationInput(
    0,
    value[0],
    "Implicit",
    (e: string) => onChange([e, value[1], value[2]]),
    errorMsg,
    "right",
    "=0",
    false
  );
}

export function SDFInput(
  value: string[],
  onChange: Function,
  errorMsg: string
) {
  return EquationInput(
    0,
    value[0],
    "Surface SDF",
    (e: string) => onChange([e, value[1], value[2]]),
    errorMsg,
    "left",
    "",
    false
  );
}

export function ParametricInput(
  value: string[],
  onChange: Function,
  errorMsg: string[]
) {

  return (
    <Grid.Container gap={4}>
      <Grid xs={12}>
        {EquationInput(
          0,
          value[0],
          "Equation x",
          (e: string, idx: number) => onChange([e, value[1], value[2]], idx),
          errorMsg[0],
          "left",
          "x=",
          false
        )}
      </Grid>
      <Grid xs={12}>
        {EquationInput(
          1,
          value[1],
          "Equation y",
          (e: string, idx: number) => onChange([value[0], e, value[2]], idx),
          errorMsg[1],
          "left",
          "y=",
          false
        )}
      </Grid>
      <Grid xs={12}>
        {EquationInput(
          2,
          value[2],
          "Equation z",
          (e: string, idx: number) => onChange([value[0], value[1], e], idx),
          errorMsg[2],
          "left",
          "z=",
          false
        )}
      </Grid>
    </Grid.Container>
  );
}
