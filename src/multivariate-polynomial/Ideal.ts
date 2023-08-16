import { Monomial } from "./Monomial";
import {Polynomial} from "./Polynomial";

/**
 * Representation of an ideal generated by a set of polynomials and basic operations with ideals
 */
export class Ideal {
    private generators : Polynomial[];
  
    /**
     * 
     * @param generators Generators of the Ideal
     */
    constructor(generators: Polynomial[]){
      this.generators = Polynomial.buchbergerReduced(generators, 1000000);
    }
  
    /**
     * 
     * Generators of the ideal
     */
    getGenerators(){
      return this.generators;
    }
    /**
     * 
     * Product of this ideal with the polynomial `p`
     */
    multiply(p: Polynomial){
      const newGens = this.generators.map(f=>f.multiply(p));
      return new Ideal(newGens);
    }

    /**
     * 
     * Intersection of ideals
     */
    intersect(J: Ideal){
      const F = this.generators;
      const G = J.generators;
  
  
      const p1 = new Polynomial("t");
      const p2 = new Polynomial("1-t");
      const H = new Ideal(this.multiply(p1).generators.concat(J.multiply(p2).generators));
  
      let res : Polynomial[] = [];
      H.generators.forEach(gen => {
        if(!gen.hasVariables(["t"])){
          res.push(gen);
        }
      })
  
      return new Ideal(res);
    }
  
    /**
   * Computes the implicit equation of a variety given the parametrizations of each variable in R3
   * @param fx Numerator of the parametrization for x
   * @param fy Numerator of the parametrization for y
   * @param fz Numerator of the parametrization for z
   * @param qx Denominator of the parametrization for x
   * @param qy Denominator of the parametrization for y
   * @param qz Denominator of the parametrization for z
   * @param parameters Parameters of the parametric equations appart from the variables, if any
   * @returns Generator of the smallest variety containing the image of (`fx/qx`,`fy/qy`,`fz/qz`)
   */
  static implicitateR3(fx: Polynomial, fy: Polynomial, fz: Polynomial, qx: Polynomial, qy: Polynomial, qz: Polynomial, parameters: string[] = []){
    console.log("=================================")
    if(!fx.sameVars(fy) || !fx.sameVars(fz) || !fx.sameVars(qx) || !fx.sameVars(qy) || !fx.sameVars(qz))
      throw new Error("PARAMETRIZATIONS IN DIFFERENT RINGS")
    if(qx.isZero() || qy.isZero() || qz.isZero())
      throw new Error("DENOMINATORS CAN'T BE 0")

    // Buscamos que variables ha usado el usuario para la parametrización y que no sean x,y,z
    let elimVars = fx.getVars().filter(v => !parameters.includes(v));
    if(elimVars.some(v => ["x","y","z"].includes(v)))
      throw new Error("PARAMETRIZATIONS CAN'T USE X,Y,Z VARIABLES");

    // Buscamos variable auxiliar libre que después será eliminada
    const allLetters = elimVars.join('');
    let variableAuxiliar = 'a'
    for (let letter of 'abcdefghijklmnopqrstuvw') {
      // Check if the current letter is not present in the array
      if (!allLetters.includes(letter)) {
        variableAuxiliar = letter
        break;
      }

      throw new Error("TOO MANY VARIABLES")
    }
    let posVarAux = elimVars.push(variableAuxiliar)
   
    // Variables del ideal J del teorema. Los parámetros son tratados como variables del cuerpo
    let resVars = ["x","y","z"].concat(parameters);

    // Variables del ideal I del teorema
    const impVars = elimVars.concat(resVars);

    // Construimos generadores de I
    const x = new Polynomial("x", impVars);
    const y = new Polynomial("y", impVars);
    const z = new Polynomial("z", impVars);
    const varAuxPol = new Polynomial(variableAuxiliar, impVars)

    const variablesToAdd = [variableAuxiliar].concat(resVars);
    fx.insertVariables(variablesToAdd,2); fy.insertVariables(variablesToAdd,2); fz.insertVariables(variablesToAdd,2);
    qx.insertVariables(variablesToAdd,2); qy.insertVariables(variablesToAdd,2); qz.insertVariables(variablesToAdd,2);
    
    let expProd = impVars.map(v=>0)
    expProd[posVarAux-1] = 1  // variable auxiliar es la ultima

    

    
    // console.log("prod no minus 1 ", qx.multiply(qy).multiply(qz).multiply(varAuxPol).toString())
                    // multiply(new Polynomial([new Monomial(1,new Float64Array(expProd),impVars)], impVars));
    
    let gen1 = qx.multiply(x).minus(fx)
    let gen2 = qy.multiply(y).minus(fy)
    let gen3 = qz.multiply(z).minus(fz)
    let prod = Polynomial.one(impVars).minus(qx.multiply(qy).multiply(qz).multiply(varAuxPol))

    // Polynomial.buchbergerReduced([gen1,gen2,gen3,prod]).forEach(g => console.log(g.toString()))
    // console.log(Polynomial.buchbergerReduced([gen1,gen2,gen3,prod]).length)
    const I = new Ideal([ gen1,gen2,gen3, prod].concat());
    // I.generators.map(g => console.log(g.toString()))
    // console.log(prod.toString())
    // Los generadores de J son los de I que contengan solo las variables de resVars
    let J : Polynomial[] = [];
    
    I.getGenerators().forEach(gen => {
      if(!gen.useAnyVariables(elimVars)){
        J.push(gen);
      }
    })

    
    if(J.length == 0){
      return Polynomial.zero(resVars)
      
    }
    else if(J.length ==1){
      let intersection = J[0];
      intersection.removeVariables(elimVars);
      return intersection;
    }
    else{
      J.forEach(j => console.log(j.toString()))
      throw new Error("PARAMETRIZATION DOES NOT SATISFY AN UNIQUE IMPLICIT EQUATION")
    }

  }
  }
  