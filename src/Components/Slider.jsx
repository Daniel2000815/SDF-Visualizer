import { useState } from "react";
import "./styles.css";


export function Slider({value, onChange, theme, min="0", max="5", step="0.1"}) {

  const getStyle = () => {
    return { backgroundSize: `${(value * 100) / max}% 100%`, '--light-color': theme.light, '--primary-color': theme.primary, '--dark-color': theme.dark, '--accent-color': theme.accent };
  };

  return (
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(parseFloat(e.target.value).toFixed(4))}
        style={getStyle()}
        value={value}
      />
  );
}
