export const exampleNodes = [
  {
    id: "primitive2",
    type: "primitive",
    position: {
      x: -339.0424051835653,
      y: -50.958621718667
    },
    data: {
      sdf: "cylinder(p,1.5000,0.5000)",
      inputs: {},
      children: [
        "transform",
        "_zHl1uB_GaaQjJJoNMyiN",
        "boolean"
      ],
      material: {
        specular: [
          1,
          1,
          1
        ],
        diffuse: [
          0,
          1,
          1
        ],
        ambient: [
          0.2,
          0.2,
          0.2
        ],
        smoothness: 10
      }
    },
    width: 200,
    height: 342,
    selected: false,
    positionAbsolute: {
      x: -339.0424051835653,
      y: -50.958621718667
    },
    dragging: false
  },
  {
    id: "boolean",
    type: "boolean",
    position: {
      x: 244.3029113752728,
      y: -84.82639803294744
    },
    data: {
      sdf: "sdfSmoothUnion(cylinder(sdfRotate_Z(p, 1.57),1.0000,0.5000), sdfSmoothUnion(cylinder(p,1.1000,0.5000), cylinder(sdfRotate_X(p, 1.57),1.0000,0.5000), 0.1, 2.0000), 0.1, 2.0000)",
      inputs: {},
      children: [
        "_OmSP2wMc3hWJ-RcNd6xm"
      ],
      material: {
        specular: [
          1,
          1,
          1
        ],
        diffuse: [
          1,
          1,
          0
        ],
        ambient: [
          0.2,
          0.2,
          0.2
        ],
        smoothness: 10
      }
    },
    width: 200,
    height: 354,
    selected: false,
    positionAbsolute: {
      x: 244.3029113752728,
      y: -84.82639803294744
    },
    dragging: false
  },
  {
    id: "transform",
    type: "transform",
    position: {
      x: -70.65619335592363,
      y: 93.7939016282739
    },
    data: {
      sdf: "cylinder(sdfRotate_X(p, 1.57),1.5000,0.5000)",
      inputs: {},
      children: [
        "boolean"
      ],
      material: {
        specular: [
          1,
          1,
          1
        ],
        diffuse: [
          1,
          1,
          0
        ],
        ambient: [
          0.2,
          0.2,
          0.2
        ],
        smoothness: 10
      }
    },
    width: 200,
    height: 294,
    selected: false,
    positionAbsolute: {
      x: -70.65619335592363,
      y: 93.7939016282739
    },
    dragging: false
  },
  {
    id: "_zHl1uB_GaaQjJJoNMyiN",
    type: "transform",
    data: {
      sdf: "cylinder(sdfRotate_Z(p, 1.57),1.5000,0.5000)",
      inputs: {},
      children: [
        "boolean"
      ],
      material: {
        specular: [
          1,
          1,
          1
        ],
        diffuse: [
          1,
          1,
          0
        ],
        ambient: [
          0.2,
          0.2,
          0.2
        ],
        smoothness: 10
      }
    },
    position: {
      x: -77.0871501988702,
      y: 416.71821576583386
    },
    width: 200,
    height: 294,
    selected: true,
    positionAbsolute: {
      x: -77.0871501988702,
      y: 416.71821576583386
    },
    dragging: false
  },
  {
    id: "IdR3Qmk3tqYR2VCZZaQrL",
    type: "primitive",
    data: {
      sdf: "sphere(p,0.9000,2.0000)",
      inputs: {},
      children: [
        "KuqThFHU_5I925rIVZ_nx"
      ],
      material: {
        specular: [
          1,
          1,
          1
        ],
        diffuse: [
          0,
          1,
          0
        ],
        ambient: [
          0.2,
          0.2,
          0.2
        ],
        smoothness: 10
      }
    },
    position: {
      x: -348.07284656110465,
      y: -424.2061116234597
    },
    width: 200,
    height: 342,
    selected: false,
    positionAbsolute: {
      x: -348.07284656110465,
      y: -424.2061116234597
    },
    dragging: false
  },
  {
    id: "q7JKAvPI5G_HNZ8fUUrr1",
    type: "primitive",
    data: {
      sdf: "cube(p,1.0000)",
      inputs: {},
      children: [
        "pmommm90jZ9XMeKcqJcEJ"
      ],
      material: {
        specular: [
          1,
          1,
          1
        ],
        diffuse: [
          0,
          0,
          1
        ],
        ambient: [
          0.2,
          0.2,
          0.2
        ],
        smoothness: 10
      }
    },
    position: {
      x: -556.3591266313665,
      y: -747.0983225813876
    },
    width: 200,
    height: 294,
    selected: false,
    positionAbsolute: {
      x: -556.3591266313665,
      y: -747.0983225813876
    },
    dragging: false
  },
  {
    id: "KuqThFHU_5I925rIVZ_nx",
    type: "boolean",
    data: {
      sdf: "sdfSmoothIntersection(sphere(p,0.9000,2.0000), cube(sdfTwist(p, 0.3000),1.0000), 0.0010, 2.0000)",
      inputs: {},
      children: [
        "_OmSP2wMc3hWJ-RcNd6xm"
      ],
      material: {
        specular: [
          1,
          1,
          1
        ],
        diffuse: [
          1,
          1,
          0
        ],
        ambient: [
          0.2,
          0.2,
          0.2
        ],
        smoothness: 10
      }
    },
    position: {
      x: 237.8851919848735,
      y: -547.5915831725875
    },
    width: 200,
    height: 354,
    selected: false,
    positionAbsolute: {
      x: 237.8851919848735,
      y: -547.5915831725875
    },
    dragging: false
  },
  {
    id: "_OmSP2wMc3hWJ-RcNd6xm",
    type: "boolean",
    data: {
      sdf: "sdfSmoothDifference(sdfSmoothIntersection(sphere(p,0.9000,2.0000), cube(sdfTwist(p, 0.3000),1.0000), 0.0010, 2.0000), sdfSmoothUnion(cylinder(sdfRotate_Z(p, 1.57),1.0000,0.5000), sdfSmoothUnion(cylinder(p,1.1000,0.5000), cylinder(sdfRotate_X(p, 1.57),1.0000,0.5000), 0.1, 2.0000), 0.1, 2.0000), 0.1, 2.0000)",
      inputs: {},
      children: [
        "qCe3MlX7tl_2OOiKiDWJX"
      ],
      material: {
        specular: [
          1,
          1,
          1
        ],
        diffuse: [
          1,
          1,
          0
        ],
        ambient: [
          0.2,
          0.2,
          0.2
        ],
        smoothness: 10
      }
    },
    position: {
      x: 583.4288822457023,
      y: -388.684426498811
    },
    width: 200,
    height: 354,
    selected: false,
    positionAbsolute: {
      x: 583.4288822457023,
      y: -388.684426498811
    },
    dragging: false
  },
  {
    id: "pmommm90jZ9XMeKcqJcEJ",
    type: "deform",
    data: {
      sdf: "cube(sdfTwist(p, 0.3000),1.0000)",
      inputs: {},
      children: [
        "KuqThFHU_5I925rIVZ_nx"
      ],
      material: {
        specular: [
          1,
          1,
          1
        ],
        diffuse: [
          1,
          1,
          0
        ],
        ambient: [
          0.2,
          0.2,
          0.2
        ],
        smoothness: 10
      }
    },
    position: {
      x: -254.56033774530238,
      y: -748.6027824899321
    },
    width: 200,
    height: 294,
    selected: false,
    positionAbsolute: {
      x: -254.56033774530238,
      y: -748.6027824899321
    },
    dragging: false
  },
  {
    id: "qCe3MlX7tl_2OOiKiDWJX",
    type: "repeat",
    data: {
      sdf: "sdfSmoothDifference(sdfSmoothIntersection(sphere(Finite_Repeat(p, 5.0000, vec3(3.0000, 1.0000, 1.0000)),0.9000,2.0000), cube(sdfTwist(p, 0.3000),1.0000), 0.0010, 2.0000), sdfSmoothUnion(cylinder(sdfRotate_Z(p, 1.57),1.0000,0.5000), sdfSmoothUnion(cylinder(p,1.1000,0.5000), cylinder(sdfRotate_X(p, 1.57),1.0000,0.5000), 0.1, 2.0000), 0.1, 2.0000), 0.1, 2.0000)",
      inputs: {},
      children: [],
      material: {
        specular: [
          1,
          1,
          1
        ],
        diffuse: [
          1,
          1,
          0
        ],
        ambient: [
          0.2,
          0.2,
          0.2
        ],
        smoothness: 10
      }
    },
    position: {
      x: 925.6221876732576,
      y: -435.5937744514113
    },
    width: 200,
    height: 446,
    selected: false,
    positionAbsolute: {
      x: 925.6221876732576,
      y: -435.5937744514113
    },
    dragging: false
  },
  {
    id: "HIFkD5QWkQ10vI-NkKNRm",
    type: "deform",
    data: {
      sdf: "",
      inputs: {},
      children: [],
      material: {
        specular: [
          1,
          1,
          1
        ],
        diffuse: [
          1,
          1,
          0
        ],
        ambient: [
          0.2,
          0.2,
          0.2
        ],
        smoothness: 10
      }
    },
    position: {
      x: 1437.984013089272,
      y: -496.53059392665546
    },
    width: 200,
    height: 296
  }
]