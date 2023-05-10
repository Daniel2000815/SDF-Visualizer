import React from "react";
import { Color, ColorResult, RGBColor, ChromePicker } from "react-color";

export function ColorPicker(props:{handleChange: Function, initialRGB?: number[]}) {
  const [color, setColor] = React.useState<RGBColor>(props.initialRGB! ?
    {r: props.initialRGB[0]*255, g: props.initialRGB[1]*255, b: props.initialRGB[2]*255, a:0} : 
    {r: 0, g: 0, b: 0, a: 0}
  );

  const [displayColorPicker, setDisplayColorPicker] = React.useState(false);

  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  const handleChange = (color: ColorResult) => {
    setColor(color.rgb);
    props.handleChange([color.rgb.r/255.0, color.rgb.g/255.0, color.rgb.b/255.0]);
  };

  return (
    <div>
      <div
        style={{
          padding: "5px",
          background: `rgb(${color.r},${color.g},${color.b})`,
          borderRadius: "1px",
          boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
          display: "inline-block",
          cursor: "pointer",
        }}
        onClick={handleClick}
      >
        <div
          style={{
            width: "36px",
            height: "14px",
            borderRadius: "2px",
            background: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,
          }}
        />
      </div>
      {displayColorPicker ? (
        <div style={{ position: "absolute", zIndex: "2" }}>
          <div
            style={{
              position: "fixed",
              top: "0px",
              right: "0px",
              bottom: "0px",
              left: "0px",
            }}
            onClick={handleClose}
          />
          <ChromePicker
            color={color}
            onChange={(color: ColorResult) => handleChange(color)}
          />
        </div>
      ) : null}
    </div>
  );
}
