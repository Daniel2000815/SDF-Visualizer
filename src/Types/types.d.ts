import { Interface } from "readline";

export {};

declare global {

  type EquationData = {
    id: string, // identifier to save in local storage
    name: string,
    inputMode: string
    input: string[]
    parsedInput: string,
    parameters: Parameter[],
    fHeader: string,
    material: Material
  }

  type Material = {
    specular: number[],
    ambient: number[],
    diffuse: number[],
    smoothness: number
  }

  type Parameter = {
    symbol: string; 
    label: string; 
    defaultVal: number
  }

  type Theme = {
    light: string,
    primary: string,
    dark: string,
    accent: string
  }

  



}
