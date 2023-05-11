import { Input } from "@nextui-org/react";
import { nanoid } from "nanoid";


export function FloatInput(props: {
  initialVal: string | number;
  onChange: (n: number) => void;
  label: string;
  errorMsg?: string;
  adornment?: string;
  adornmentPos: "right" | "left";
  step?: number;
  min?: number;
  max?: number;
}) {
  return (
    <Input
      fullWidth
      initialValue={props.initialVal.toString()}
      defaultValue={props.initialVal.toString()}
      onChange={(e) => props.onChange(parseFloat(e.target.value))}
      type="number"
      min={props.min || 0}
      max={props.max || 100}
      id={props.label}
      status={props.errorMsg !== undefined && props.errorMsg!=="" ? "error" : "default"}
      color={props.errorMsg !== undefined && props.errorMsg!=="" ? "error" : "default"}
      helperText={props.errorMsg}
      helperColor={props.errorMsg !== undefined && props.errorMsg!=="" ? "error" : "default"}
      labelRight={props.adornmentPos === "right" ? props.adornment : null}
      labelLeft={props.adornmentPos === "left" ? props.adornment : null}
      placeholder={props.label}
      aria-label={props.label}
      step={props.step || 0.1}
    />
  );
}
