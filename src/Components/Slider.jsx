import { useState } from "react";
import { Grid, Text, Collapse, Switch, Row, Col } from "@nextui-org/react";

import "./styles.css";


export function Slider({value, onChange, theme, label="", min="0", max="5", step="0.1", precision=4, bold=false}) {

  const getStyle = () => {
    return { backgroundSize: `${((value-min) * 100) / (max-min)}% 100%`, '--light-color': theme.light, '--primary-color': theme.primary, '--dark-color': theme.dark, '--accent-color': theme.accent };
  };

  return (
    <Grid.Container direction="column" justify="center" alignContent="center" alignItems="center" >
      <Grid>
      
    <Text h1 b={bold}>{label} {label!="" ? ":" : ""} {value.toFixed(precision)}</Text> 
    </Grid>
    <Grid>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={getStyle()}
        value={value}
      />
      </Grid>
      </Grid.Container>
  );
}
