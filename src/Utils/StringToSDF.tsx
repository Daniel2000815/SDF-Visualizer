import nerdamer from "nerdamer";
import nerdamerTS from "nerdamer-ts";

require("nerdamer/Calculus");

export function StringToSDF (node: any, parametersInput: Parameter[], evaluate: boolean = false) : string {
    // console.log(parametersInput);
    const parametersSymbols = Object.keys(parametersInput).map(
      (val, key) => parametersInput[key].symbol
    );

    if (node) {
      // console.log("ES NO LO SE");
      // console.log(node);
      if (node.type === "VARIABLE_OR_LITERAL") {
        const isVariable = ["x", "y", "z"].includes(
          node.value
        );
        const isParam = [...parametersSymbols].includes(
          node.value
        );
        // console.log("ES LITERAL");
        // console.log("SYMBOLS");
        // console.log(parametersSymbols);
        // console.log(isVariable);
        // console.log(node.value);

        
        if(isVariable || isParam){

          if(isParam && evaluate){
            let p = parametersInput.find(p=>p.symbol===node.value);

            if(p) return p.defaultVal.toFixed(4);
            
            throw new Error (`Parameter ${node.value} not found`);
          }
            
          return node.value;
        }
        else if(!isNaN(node.value)){
          return parseFloat(node.value).toFixed(4);}
        else{
          throw new Error(`${node.value} is not a symbol`);
        }
      }
      if (node.type === "OPERATOR") {
        let left = StringToSDF(node.left, parametersInput);
        let right = StringToSDF(node.right, parametersInput);
        // console.log("RIGHT, LEFT");
        // console.log(right);
        // console.log(left);

        if (node.value === "^") {
          // console.log("ES OPERATOR");
          // console.log(node);
          return `pow(${left}, ${right})`;
        } else {
          if (right && left) return `(${left})${node.value}(${right})`;
          else if (left) return `${node.value}(${left})`;
          else return "????";
        }

        // return node.toString();
      }
      if (node.type === "FUNCTION") {
        let left = StringToSDF(node.left, parametersInput);
        let right = StringToSDF(node.right, parametersInput);

        if (node.value === "^") {
          // console.log("ES F");
          // console.log(node);
          return `pow(${left}, ${right})`;
        } else {
          if (right) return `${node.value}(${right})`;
          else return "????";
        }
      }
    }

    return "";
  };

export function ImplicitToSDF(implicit: string, parameters: Parameter[], evaluate: boolean = false) : string{
  let f: string | null = null; // Parsed string by nerdamer
  let res = "";

  try {
    f = nerdamerTS(implicit).toString();
  } catch (error: any) {
    error = error.message.split("at ")[0];

    throw new Error(`ERROR PARSING EQUATION ${implicit}`);
  }

  const dfdx = nerdamer.diff(f, "x", 1);
  const dfdy = nerdamer.diff(f, "y", 1);
  const dfdz = nerdamer.diff(f, "z", 1);
  const norm = nerdamer(`sqrt((${dfdx})^2 + (${dfdy})^2 + (${dfdz})^2)`);
  if (norm.toString() === "0") {
    throw new Error("NORM CAN'T BE 0");
  }
  else{
    let sdf = nerdamer(`(${f})/(${norm})`);
    var x = nerdamerTS.tree(sdf.toString());
    res = StringToSDF(x, parameters, evaluate);
  }

  return res;
}