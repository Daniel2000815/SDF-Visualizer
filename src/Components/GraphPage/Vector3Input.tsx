import { useEffect, useState } from "react";
import { Grid, Card, Text, Input } from "@nextui-org/react";
import {FloatInput} from "../FloatInput";

const headerStyke: any = {
  textAlign: "center",
  borderRadius: "3px 3px 3px 3px",
};

export function Vector3Input(props: {
  handleChange: (newFields: string[]) => void;
}) {
  const [x, setX] = useState("0.0");
  const [y, setY] = useState("0.0");
  const [z, setZ] = useState("0.0");

  useEffect(() => {
    props.handleChange([x, y, z]);
  }, [x, y, z]);

  return (
    
    <Grid.Container direction="column" gap={0.5}>

      <Grid  key="xInput">
      <FloatInput
         initialVal={"0.0"}
          onChange={(e) => setX(e.toFixed(4))}
          label="inputX"
          adornment="X"
          adornmentPos="left"
          />
      </Grid>
      <Grid  key="yInput">
        <FloatInput
         initialVal={"0.0"}
          onChange={(e) => setY(e.toFixed(4))}
          label="inputY"
          adornment="Y"
          adornmentPos="left"
          />

      </Grid>
      <Grid  key="zInput">
      <FloatInput
         initialVal={"0.0"}
          onChange={(e) => setZ(e.toFixed(4))}
          label="inputZ"
          adornment="Z"
          adornmentPos="left"
          />
      </Grid>
    </Grid.Container>
    
  );
}
