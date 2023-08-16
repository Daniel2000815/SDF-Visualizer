// import Grid from "@mui/material/Unstable_Grid2";
import { Grid } from "@nextui-org/react";
import { Input, Text, Avatar } from "@nextui-org/react";

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
    <Grid.Container gap={1}>
      <Grid xs={12}>
        <Grid.Container
          css={{
            alignContent: "center",
            justifyContent: "center",
            justifyItems: "center",
          }}
          gap={1}
        >
          <Grid xs={1}>
            <Avatar squared text="x" />
          </Grid>
          <Grid xs={5}>
            {EquationInput(
              0,
              value[0],
              "Numerator for x parametrization",
              (e: string, idx: number) =>
                onChange(
                  [e, value[1], value[2], value[3], value[4], value[5]],
                  idx
                ),
              errorMsg[0],
              "left",
              "",
              false
            )}
          </Grid>
          <Grid xs={0.5}>
            <Text size={30} css={{ alignContent: "center" }}>
              /
            </Text>
          </Grid>
          <Grid xs={5}>
            {EquationInput(
              1,
              value[1],
              "Denominator for x parametrization",
              (e: string, idx: number) =>
                onChange(
                  [value[0], e, value[2], value[3], value[4], value[5]],
                  idx
                ),
              errorMsg[1],
              "left",
              "",
              false
            )}
          </Grid>
        </Grid.Container>
      </Grid>

      <Grid xs={12}>
        <Grid.Container
          css={{
            alignContent: "center",
            justifyContent: "center",
            justifyItems: "center",
          }}
          gap={1}
        >
          <Grid xs={1}>
            <Avatar squared text="y" />
          </Grid>
          <Grid xs={5}>
            {EquationInput(
              2,
              value[2],
              "Numerator for y parametrization",
              (e: string, idx: number) =>
                onChange(
                  [value[0], value[1], e, value[3], value[4], value[5]],
                  idx
                ),
              errorMsg[2],
              "left",
              "",
              false
            )}
          </Grid>
          <Grid xs={0.5}>
            <Text size={30} css={{ alignContent: "center" }}>
              /
            </Text>
          </Grid>
          <Grid xs={5}>
            {EquationInput(
              3,
              value[3],
              "Denominator for y parametrization",
              (e: string, idx: number) =>
                onChange(
                  [value[0], value[1], value[2], e, value[4], value[5]],
                  idx
                ),
              errorMsg[3],
              "left",
              "",
              false
            )}
          </Grid>
        </Grid.Container>
      </Grid>
      <Grid xs={12}>
        <Grid.Container
          css={{
            alignContent: "center",
            justifyContent: "center",
            justifyItems: "center",
          }}
          gap={1}
        >
          <Grid xs={1}>
            <Avatar squared text="z" />
          </Grid>
          <Grid xs={5}>
            {EquationInput(
              4,
              value[4],
              "Numerator for z parametrization",
              (e: string, idx: number) =>
                onChange(
                  [value[0], value[1], value[2], value[3], e, value[5]],
                  idx
                ),
              errorMsg[4],
              "left",
              "",
              false
            )}
          </Grid>
          <Grid xs={0.5}>
            <Text size={30} css={{ alignContent: "center" }}>
              /
            </Text>
          </Grid>
          <Grid xs={5}>
            {EquationInput(
              5,
              value[5],
              "Denominator for z parametrization",
              (e: string, idx: number) =>
                onChange(
                  [value[0], value[1], value[2], value[3], value[4], e],
                  idx
                ),
              errorMsg[5],
              "left",
              "",
              false
            )}
          </Grid>
        </Grid.Container>
      </Grid>
    </Grid.Container>
  );
}
