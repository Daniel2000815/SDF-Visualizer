import { operators } from "./operators";

export const fs = (sdf, primitives) => {
  return `
    precision mediump float;
    
    #define AO  
    #define SHADOWS
    #define AA 2

    // Constants
    const int MAX_MARCHING_STEPS=255;
    const float MIN_DIST=0.;
    const float MAX_DIST=100.;
    const float PRECISION=.0001;
    const float EPSILON=.0005;
    const float PI=3.14159265359;

    // === APP UNIFORMS ===
    uniform vec3  u_ambient;
    uniform vec3  u_specular;
    uniform vec3  u_diffuse;
    uniform vec3  u_emission;
    uniform float u_ka;
    uniform float u_ks;
    uniform float u_kd;
    uniform float u_smoothness;
    uniform vec3  u_ambientEnv;
    uniform vec2  u_cameraAng;
    uniform float u_zoom;
    uniform vec2  u_resolution;
    uniform float u_lightsPos[12];
    uniform float u_lightsColor[12];
    uniform vec4  u_lightsSize;
    
    // == TYPE DECLARATIONS ==
    struct Material
    {
      vec3 ambient;
      float ka;
      vec3 diffuse;
      float kd;
      vec3 specular;
      float ks;
      vec3 emission;
      float smoothness;
    };

    struct Surface{
      float sd;
      Material mat;
    };

    // == TO ROTATE VIEW ==
    mat3 RotateX(float theta){
      float c=cos(theta);
      float s=sin(theta);
      return mat3(
        vec3(1.,0.,0.),
        vec3(0.,c,-s),
        vec3(0.,s,c)
      );
    }
    
    mat3 RotateY(float theta){
      float c=cos(theta);
      float s=sin(theta);
      return mat3(
        vec3(c,0.,s),
        vec3(0.,1.,0.),
        vec3(-s,0.,c)
      );
    }

    ${operators()}
    ${primitives}

    float sdf(vec3 p){
      float x = p.x;
      float y = p.y;
      float z = p.z;
      float interp;
      
      return ${sdf};
    }

    Surface map(vec3 p){
      Material mat = Material(
        u_ambient,    // ambient
        u_ka,         // ka
        u_diffuse,    // diffuse
        u_kd,         // kd
        u_specular,   // specular
        u_ks,         // ks
        u_emission,   // emission
        u_smoothness  // smoothness
      );
      float d = sdf(p);
      
      return Surface(d, mat);      
    }

    Surface rayMarch(vec3 ro,vec3 rd,float start,float end){
      float depth=start;
      Surface co;
      
      for(int i=0;i<MAX_MARCHING_STEPS;i++){
        vec3 p=ro+depth*rd;
        co=map(p);
        depth+=co.sd;
        if(co.sd<PRECISION||depth>end)break;
      }
      
      co.sd=depth;
      
      return co;
    }
    
    
    float calcAO(in vec3 pos, in vec3 norm){
      const float OCC_SAMPLES = 4.0;
      const float s = -OCC_SAMPLES;
      const float increment = 1.0/OCC_SAMPLES;
    
      float ao = 1.0;
    
      for(float i = increment; i < 1.0; i+=increment)
      {
        ao -= pow(2.0,i*s)*(i-map(pos+i*norm).sd);
      }
    
      return ao;
    }
    
    // https://iquilezles.org/articles/rmshadows
    float calcSoftshadow(in vec3 ro,in vec3 rd,in float mint,in float tmax, float w)
    {
      // bounding volume
      float tp=(.8-ro.y)/rd.y;if(tp>0.)tmax=min(tmax,tp);
      
      float res =1.0;
      float t = mint;
    
      for(int i=0;i<24;i++)
      {
        float h=map(ro+rd*t).sd;
        float s=clamp(w*h/t,0.,1.);
        res=min(res,s);
        t+=clamp(h,.01,.2);
        if(res<.004||t>tmax)break;
      }
      
      return smoothstep(-1.0, 1.0, res);
    }
    
    vec3 lighting(vec3 pos, vec3 rd, vec3 nor, Surface s){    
      vec3 result = u_ambientEnv;
    
      float occ = 1.0;
      #ifdef AO
      occ= calcAO(pos,nor);
      #endif
    
      for(int i=0; i<4; i++){
        vec3 Li=normalize(vec3(u_lightsPos[3*i], u_lightsPos[3*i+1], u_lightsPos[3*i+2]));
        vec3 lColor = vec3(u_lightsColor[3*i], u_lightsColor[3*i+1], u_lightsColor[3*i+2]);
        vec3 h=normalize(Li-rd);
        float NLi=max(0.,dot(nor,Li));
        float NH=max(0.,dot(nor,h));
    
        float shadow = 1.0;
        #ifdef SHADOWS
        shadow=calcSoftshadow(pos,Li,.02,2.5,u_lightsSize[i]);
        #endif
        vec3 amb = s.mat.ka*s.mat.ambient;
        vec3 dif=NLi*s.mat.kd*s.mat.diffuse;
        vec3 spe=NLi*s.mat.ks*s.mat.specular*pow(NH,s.mat.smoothness);
    
        spe*=.04+.96*pow(clamp(1.-dot(h,Li),0.,1.),5.);
    
        result += lColor*(amb+dif + spe)*occ*shadow;
      }
    
      return result;
    }
    
    vec3 calcNormal(in vec3 p){
      return normalize(vec3(
        map(vec3(p.x+EPSILON,p.y,p.z)).sd-map(vec3(p.x-EPSILON,p.y,p.z)).sd,
        map(vec3(p.x,p.y+EPSILON,p.z)).sd-map(vec3(p.x,p.y-EPSILON,p.z)).sd,
        map(vec3(p.x,p.y,p.z+EPSILON)).sd-map(vec3(p.x,p.y,p.z-EPSILON)).sd
      ));
    }
      
    mat3 camera(vec3 cameraPos,vec3 lookAtPoint){
      vec3 cd=normalize(lookAtPoint-cameraPos);
      vec3 cr=normalize(cross(vec3(0.,1.,0.),cd));
      vec3 cu=normalize(cross(cd,cr));
      
      return mat3(-cr,cu,-cd);
    }
    
    void main()
    {
      const vec3 backgroundColor=vec3(0.6784, 0.8824, 0.9333);
      const vec3 lookAt=vec3(0.);
    
      vec3 col=vec3(0.);
      vec3 eye=vec3(3.,3.,5.);
      mat3 rot=(RotateY(u_cameraAng.x)*RotateX(u_cameraAng.y));
      eye=rot*eye*u_zoom;
      mat3 cam = camera(eye,lookAt);
    
      #if AA>1
        for( int m=0; m<AA; m++ )
        for( int n=0; n<AA; n++ )
        {
          vec2 o = vec2(float(m),float(n)) / float(AA) - vec2(0.25);
          vec2 uv=((gl_FragCoord.xy+o) - 0.5*u_resolution.xy) / u_resolution.y;
      # else
        vec2 uv = (gl_FragCoord.xy - 0.5*u_resolution.xy) / u_resolution.y;
      #endif
      
      vec3 rayDir=cam*normalize(vec3(uv,-1));
      Surface co=rayMarch(eye,rayDir,MIN_DIST,MAX_DIST);
      
      if(co.sd>MAX_DIST){
        col+=backgroundColor;
      }
      else{
        vec3 p=eye+rayDir*co.sd;
        vec3 normal=calcNormal(p);
        
        col += lighting(p, rayDir, normal, co);
      }
      
      #if AA>1
        }
        col /= float(AA*AA);
      #endif
      
      gl_FragColor=vec4(col,1.);
      return;
    }

    `;
};