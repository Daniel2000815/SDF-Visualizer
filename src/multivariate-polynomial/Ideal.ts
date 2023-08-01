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
      this.generators = Polynomial.buchbergerReduced(generators);
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
        if(!gen.hasVariable("t")){
          res.push(gen);
        }
      })
  
      return res;
    }
  
  }
  