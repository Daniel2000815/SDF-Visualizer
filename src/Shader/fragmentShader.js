import { operators } from "./operators";

export const fs = (sdf, primitives) => {
  return `
    precision mediump float;
    varying vec2 uv;


    // Constants
    const int MAX_MARCHING_STEPS=255;
    const float MIN_DIST=0.;
    const float MAX_DIST=100.;
    const float PRECISION=.0001;
    const float EPSILON=.0005;
    const float PI=3.14159265359;
    const float DEG_TO_RAD = PI / 180.0;

    // Camera control
    // vec2 cameraAng = vec2(0.5, 0.5);
    // bool isDragging = false;
    // vec2 startDraggingPos;

    uniform vec3 u_specular;
    uniform vec3 u_diffuse;
    uniform vec3 u_ambient;
    uniform float u_smoothness;

    uniform vec2 u_resolution;
    // uniform vec2 u_mouse;
    uniform vec2 u_cameraAng;
    uniform float u_zoom;

    struct Material
    {
    vec3 specular;
    vec3 diffuse;
    vec3 ambient;
    float smoothness;
    };

    struct Surface{
    float sd;// signed distance value
    Material mat;
    };

    // Rotate around a circular path
    mat2 rotate2d(float theta){
        float s = sin(theta),c=cos(theta);
        return mat2(c,-s,s,c);
    }

    

    // Identity matrix.
    mat3 identity(){
        return mat3(
            vec3(1,0,0),
            vec3(0,1,0),
            vec3(0,0,1)
        );
    }

    mat3 rotateX(float theta){
        float c=cos(theta);
        float s=sin(theta);
        return mat3(
            vec3(1.,0.,0.),
            vec3(0.,c,-s),
            vec3(0.,s,c)
        );
    }

    // Rotation matrix around the Y axis.
    mat3 rotateY(float theta){
        float c=cos(theta);
        float s=sin(theta);
        return mat3(
            vec3(c,0.,s),
            vec3(0.,1.,0.),
            vec3(-s,0.,c)
        );
    }

    // Rotation matrix around the Z axis.
    mat3 rotateZ(float theta){
        float c=cos(theta);
        float s=sin(theta);
        return mat3(
            vec3(c,-s,0.),
            vec3(s,c,0.),
            vec3(0.,0.,1.)
        );
    }

    ${operators()}
    ${primitives}

  
    Surface minWithColor(Surface obj1,Surface obj2){
        if(obj2.sd<obj1.sd)return obj2;
        return obj1;
    }
    
    float sdf(vec3 p){
        float x = p.x;
        float y = p.y;
        float z = p.z;
        
        return ${sdf};
    }
  
  Surface map(vec3 p){
    Material mat = Material(u_specular, u_diffuse, u_ambient, u_smoothness);
    float d = sdf(p);
    
    Surface co = Surface(d, mat);
    
    return co;
    }
    
    vec3 grad( in vec3 p )
    {
    return vec3(
        map(vec3(p.x+EPSILON,p.y,p.z)).sd - map(vec3(p.x-EPSILON,p.y,p.z)).sd,
        map(vec3(p.x,p.y+EPSILON,p.z)).sd - map(vec3(p.x,p.y-EPSILON,p.z)).sd,
        map(vec3(p.x,p.y,p.z+EPSILON)).sd - map(vec3(p.x,p.y,p.z-EPSILON)).sd
    );
    }
    
    mat3 camera(vec3 cameraPos,vec3 lookAtPoint){
    vec3 cd = normalize(lookAtPoint-cameraPos);      // camera direction
    vec3 cr = normalize(cross(vec3(0.,1.,0.),cd)); // camera right
    vec3 cu = normalize(cross(cd,cr));               // camera up
    
    return mat3(-cr,cu,-cd);
    }
    
    Surface rayMarch(vec3 ro,vec3 rd,float start,float end){
        float depth = start;
        Surface co; // closest object
        
        for(int i=0; i<MAX_MARCHING_STEPS; i++){
            vec3 p = ro + depth*rd;
            co = map(p);
            depth += co.sd;
            if(co.sd<PRECISION||depth>end)  break;
        }
        
        co.sd = depth;
        
        return co;
    }
  
    vec3 lighting(vec3 p,vec3 n,vec3 eye,Material mat){
      vec3 ambient = vec3(.5);
      
      vec3 lights_pos[2];
      lights_pos[0] = vec3(4.,2.,2.);
      lights_pos[1] = vec3(-4.,-2.,-2.);
      
      vec3 lights_color[2];
      lights_color[0] = vec3(1.,1.,1.);
      lights_color[1] = vec3(1.,1.,1.);
      
      vec3 Ip = mat.ambient*ambient;
      
      for(int i=0;i<2;i++){
          //vec3 Lm = normalize(lights_pos[i] - p);
          vec3 Lm = normalize(lights_pos[i]);
          vec3 Rm = normalize(2.0*(dot(Lm,n))*n - Lm); // reflect(-Lm, n)
          vec3 V  = normalize(eye - p);
          
          float LN = dot(Lm,n);
          float RV = dot(Rm,V);
          
          if(LN<0.) // Light not visible
          Ip+=vec3(0.,0.,0.);
          else if(RV<0.)// opposite direction as viewer, apply only diffuse
          Ip+=lights_color[i]*(mat.diffuse*LN);
          else
          Ip+=lights_color[i]*(mat.diffuse*LN+mat.specular*pow(RV,mat.smoothness));
      }
      
      return Ip;
      }
  
      vec3 calcNormal(in vec3 p){
        return normalize(vec3(
            map(vec3(p.x+EPSILON,p.y,p.z)).sd - map(vec3(p.x-EPSILON,p.y,p.z)).sd,
            map(vec3(p.x,p.y+EPSILON,p.z)).sd - map(vec3(p.x,p.y-EPSILON,p.z)).sd,
            map(vec3(p.x,p.y,p.z+EPSILON)).sd - map(vec3(p.x,p.y,p.z-EPSILON)).sd
        ));
        }

        vec3 ray_dir( float fov, vec2 size, vec2 pos ) {
          vec2 xy = pos - size * 0.5;
      
          float cot_half_fov = tan( ( 90.0 - fov * 0.5 ) * DEG_TO_RAD );	
          float z = size.y * 0.5 * cot_half_fov;
          
          return normalize( vec3( xy, -z ) );
      }
  
void main()
    {
        vec2 uv = (gl_FragCoord.xy - 0.5*u_resolution.xy) / u_resolution.y;
        // vec2 mouseUV = vec2(0.5);
        // mouseUV = u_mouse.xy/u_resolution.xy;  // [0,1]


        vec3 backgroundColor = vec3(.835, 1.0, 1.0);
        vec3 col    = vec3(0.0);
        vec3 lookAt = vec3(0.0);
        vec3 eye    = vec3(0,0,5.0);
        // default ray dir
        vec3 dir = ray_dir( 45.0, u_resolution.xy, gl_FragCoord.xy );
        dir=camera(eye,lookAt)*normalize(vec3(uv,-1));
        // default ray origin
        

        // ray marching
       

        float cameraRadius = 10.0;
        // rotate camera
        mat3 rot = (rotateY(u_cameraAng.x)*rotateX(u_cameraAng.y));
        dir = rot * dir;
        eye = rot * eye * u_zoom;
        //eye = (rotateY(cameraAng.x)*rotateX(cameraAng.y)) * eye * cameraRadius + lookAt;
        //eye =  eye * cameraRadius + lookAt;
        // eye.yz =   rotate2d( u_cameraAng.x ) * eye.yz * cameraRadius + vec2(lookAt.y, lookAt.z);
        // eye.xz =  rotate2d( u_cameraAng.y ) * eye.xz + vec2(lookAt.x, lookAt.z);
        
        //vec3 rayDir = camera(eye, lookAt) * normalize(vec3(uv,-1));// ray direction
        
        Surface co = rayMarch(eye, dir, MIN_DIST, MAX_DIST);// closest object
        
        if(co.sd > MAX_DIST){
            col = backgroundColor;  // ray didn't hit anything
        }
        else{
            vec3 p = eye + dir*co.sd;  // point from ray marching
            vec3 normal = calcNormal(p);
            
            col = lighting(p, normal, eye, co.mat);
        }
        
        gl_FragColor = vec4(col, 1.0);
        return;
    }
    `;
};