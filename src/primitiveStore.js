import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { InputMode } from './Types/InputMode';

const defaultPrimitives = [
    {
      id: "sphere",
      name: "Sphere",
      inputMode: InputMode.Implicit,
      input: ["x^2 + y^2 + z^2 - r", "", ""],
      parsedInput: "length(p)-r",
      parameters: [{ symbol: "r", label: "Radius", defaultVal: 1.0, type: "range", range:[0,100] }],
      fHeader: "sphere(vec3 p, float r)",
      material: {
        specular: [1.0, 1.0, 1.0],
        diffuse: [0.0, 1.0, 0.0],
        ambient: [0.2, 0.2, 0.2],
        smoothness: 10.0
      }
    },
    {
      id: "torus",
      name: "Torus",
      inputMode: InputMode.SDF,
      input: ["length(vec2(length(p.xz)-R,p.y)) - r", "", ""],
      parsedInput: "length(vec2(length(p.xz)-R,p.y)) - r",
      parameters: [
        { symbol: "R", label: "Radius 1", defaultVal: 2.0, type: "number", range:[0,100] },
        { symbol: "r", label: "Radius 2", defaultVal: 1.0, type: "number", range:[0,100,] },
      ],
      fHeader: "torus(vec3 p, float R, float r)",
      material: {
        specular: [1.0, 1.0, 1.0],
        diffuse: [1.0, 0.0, 0.0],
        ambient: [0.2, 0.2, 0.2],
        smoothness: 10.0
      }
    },
    {
      id: "cube",
      name: "Cube",
      inputMode: InputMode.SDF,
      input: [
        "length(max(abs(p) - vec3(l),0.0)) + min(max(abs(p.x) - l,max(abs(p.y) - l,abs(p.z) - l)),0.0)",
        "",
        "",
      ],
      parsedInput:
        "length(max(abs(p) - vec3(l),0.0)) + min(max(abs(p.x) - l,max(abs(p.y) - l,abs(p.z) - l)),0.0)",
      parameters: [{ symbol: "l", label: "side", defaultVal: 1.0, type: "number", range:[0,100] }],
      fHeader: "cube(vec3 p, float l)",
      material: {
        specular: [1.0, 1.0, 1.0],
        diffuse: [0.0, 0.0, 1.0],
        ambient: [0.2, 0.2, 0.2],
        smoothness: 10.0
      }
  
    },
    {
      id: "ellipsoid",
      name: "Ellipsoid",
      inputMode: InputMode.Parametric,
      input: ["s", "t", "s^2+t^2"],
      parsedInput:
        "(-z + pow(x, 2.0000) + pow(y, 2.0000)) * pow(sqrt(1.0000 + 4.0000 * pow(x, 2.0000) + 4.0000 * pow(y, 2.0000)), -1.0000)",
      parameters: [],
      fHeader: "ellipsoid(vec3 p)",
      material: {
        specular: [1.0, 1.0, 1.0],
        diffuse: [1.0, 1.0, 0.0],
        ambient: [0.2, 0.2, 0.2],
        smoothness: 10.0
      }
  
    },
    {
      id: "cylinder",
      name: "Cylinder",
      inputMode: InputMode.SDF,
      input: [
        "min(max((abs(vec2(length(p.xz),p.y))-vec2(r,h)).x, (abs(vec2(length(p.xz),p.y))-vec2(r,h)).y),0.)+length(max(abs(vec2(length(p.xz),p.y))-vec2(r,h),0.))",
        "",
        "",
      ],
      parsedInput:
        "min(max((abs(vec2(length(p.xz),p.y))-vec2(r,h)).x, (abs(vec2(length(p.xz),p.y))-vec2(r,h)).y),0.)+length(max(abs(vec2(length(p.xz),p.y))-vec2(r,h),0.))",
      parameters: [
        { symbol: "h", label: "height", defaultVal: 1.0, type: "number", range:[0,100] },
        { symbol: "r", label: "radius", defaultVal: 0.5, type: "number", range:[0,100] },
      ],
      fHeader: "cylinder(vec3 p, float h, float r)",
      material: {
        specular: [1.0, 1.0, 1.0],
        diffuse: [0.0, 1.0, 1.0],
        ambient: [0.2, 0.2, 0.2],
        smoothness: 10.0
      }
  
    },
  ];

  
export const usePrimitiveStore = create()(
  persist(
    (set, get) => ({
        primitives: JSON.parse(JSON.stringify(defaultPrimitives)),
      bears: 0,
      addBear: () => set({ bears: get().bears + 1 }),
      updatePrimitive(id, data) {
        // Update and find source
        set({
          primitives: get().primitives.map((p) => {
            if (p.id === id) {
              return Object.assign(p, data);
            } else {
              return p;
            }
          }),
        });
      },
    
      deletePrimitive(id) {
        set({ primitives: get().primitives.filter((p) => p.id !== id) });
      },
    
      addPrimitive(prim) {
        set({ primitives: [...get().primitives, prim] });
      },
    
      restorePrimitives() {
        set({ primitives: JSON.parse(JSON.stringify(defaultPrimitives)) });
        console.log("restored", defaultPrimitives);
      },
    }),
    {
      name: 'user-primitives', // name of the item in the storage (must be unique)
    //   storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
)