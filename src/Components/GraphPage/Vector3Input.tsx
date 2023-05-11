import { useEffect, useState } from "react";
import { Grid, Card, Text, Input } from "@nextui-org/react";
import {FloatInput} from "../FloatInput";

const headerStyke: any = {
  textAlign: "center",
  borderRadius: "3px 3px 3px 3px",
};

export function Vector3Input(props: {
  handleChange: (newFields: string[]) => void;
  step?: number;
  min?: number;
  max?: number;
  defaultX?: string;
  defaultY?: string;
  defaultZ?: string;
}) {
  const [x, setX] = useState(props.defaultX || "0.0");
  const [y, setY] = useState(props.defaultY || "0.0");
  const [z, setZ] = useState(props.defaultZ || "0.0");

  useEffect(() => {
    props.handleChange([x, y, z]);
  }, [x, y, z]);

  return (
    
    <Grid.Container direction="column" gap={0.5}>

      <Grid  key="xInput">
      <FloatInput
         initialVal={props.defaultX|| "0.0"}
          onChange={(e) => setX(e.toFixed(4))}
          label="inputX"
          adornment="X"
          adornmentPos="left"
          step={props.step || 0.1}
          min={props.min || 0.0}
          max={props.max || 100.0}
          />
      </Grid>
      <Grid  key="yInput">
        <FloatInput
         initialVal={props.defaultY || "0.0"}
          onChange={(e) => setY(e.toFixed(4))}
          label="inputY"
          adornment="Y"
          adornmentPos="left"
          step={props.step || 0.1}
          min={props.min || 0.0}
          max={props.max || 100.0}
          />

      </Grid>
      <Grid  key="zInput">
      <FloatInput
         initialVal={props.defaultZ || "0.0"}
          onChange={(e) => setZ(e.toFixed(4))}
          label="inputZ"
          adornment="Z"
          adornmentPos="left"
          step={props.step || 0.1}
          min={props.min || 0.0}
          max={props.max || 100.0}
          />
      </Grid>
    </Grid.Container>
    
  );
}
