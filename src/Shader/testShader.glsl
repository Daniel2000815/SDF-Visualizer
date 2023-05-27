#ifdef GL_ES
precision mediump float;
#endif

#define AO  
#define SHADOWS
#define AA 3

// Constants
const int MAX_MARCHING_STEPS=255;
const float MIN_DIST=0.;
const float MAX_DIST=100.;
const float PRECISION=.0001;
const float EPSILON=.0005;
const float PI=3.14159265359;

// === APP UNIFORMS ===
// uniform vec3  u_ambient;
// uniform vec3  u_specular;
// uniform vec3  u_diffuse;
// uniform vec3  u_emission;
// uniform float u_ka;
// uniform float u_ks;
// uniform float u_kd;
// uniform float u_smoothness;
// uniform vec2  u_cameraAng;
// uniform float u_zoom;
// uniform vec2  u_resolution;
// uniform vec2  u_mouse;
// uniform vec3 lightsPos[4];
// uniform vec3 lightsColor[4];

// === TEST UNIFORMS ===
uniform vec2 u_resolution;
uniform vec2 u_mouse;
const vec3 u_specular=vec3(1.30,1.,.70);
const vec3 u_diffuse=vec3(1.30,0.0,0.70);
const vec3 u_emission=vec3(.02);
const vec3 u_ambient = vec3(0.8392, 0.7216, 0.8667);
const float u_ka = 0.4;
const float u_ks = 15.0;
const float u_kd = 2.0;
const float u_smoothness=100.;
const float u_zoom=1.5;
const vec2 u_cameraAng=vec2(1.4,0.2);

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
  float sd;// signed distance value
  Material mat;
};

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

// === DEFORM OPERATORS ===
vec3 sdfTwist(in vec3 p,in float k)
{
  float c=cos(k*p.y);
  float s=sin(k*p.y);
  mat2 m=mat2(c,-s,s,c);
  vec3 q=vec3(m*p.xz,p.y);
  return q;
}

vec3 sdfBend(in vec3 p,in float k)
{
  float c=cos(k*p.x);
  float s=sin(k*p.x);
  mat2 m=mat2(c,-s,s,c);
  vec3 q=vec3(m*p.xy,p.z);
  return q;
}

// === REPEAT OPERATORS ===
vec3 sdfRepeat(in vec3 p,in float s,in vec3 lim)
{
  return p-s*clamp(floor(p/s+.5),-lim,lim);
}

vec3 sdfInfiniteRepeat(in vec3 p,in float s)
{
  return mod(p+.5*s,s)-.5*s;
}

// === BOOLEAN OPERATORS ===

Surface sdfSurfaceUnion(Surface s1,Surface s2){
  if(s1.sd<s2.sd)
  return s1;
  
  return s2;
}

float sdfSmoothUnion(float a,float b,float k,float n,out float interp)
{
  if(k==0.){
    return min(a,b);
  }
  float h=max(k-abs(a-b),0.)/k;
  float m=pow(h,n)*.5;
  float s=m*k/n;
  
  interp=a<b?m:1.-m;
  return(a<b)?a-s:b-s;
}

float sdfIntersection(float a,float b){
  return max(a,b);
}

float sdfSmoothIntersection(float a,float b,float k,float n,out float interp)
{
  return-sdfSmoothUnion(-a,-b,k,n,interp);
}

float sdfDifference(float a,float b){
  return min(a,-b);
}

float sdfSmoothDifference(float a,float b,float k,float n,out float interp)
{
  return sdfSmoothUnion(a,-b,k,n,interp);
}

// === TRANSFORM OPERATORS ===
vec3 sdfRotateX(vec3 p,float theta){
  float c=cos(theta);
  float s=sin(theta);
  
  return mat3(
    vec3(1.,0.,0.),
    vec3(0.,c/(c*c+s*s),s/(c*c+s*s)),
    vec3(0.,-s/(c*c+s*s),c/(c*c+s*s))
  )*p;
}

vec3 sdfRotateY(vec3 p,float theta){
  float c=cos(theta);
  float s=sin(theta);
  
  return mat3(
    vec3(c/(c*c+s*s),0.,-s/(c*c+s*s)),
    vec3(0.,1.,0.),
    vec3(s/(c*c+s*s),0.,c)
  )*p;
}

vec3 sdfRotateZ(vec3 p,float theta){
  float c=cos(theta);
  float s=sin(theta);
  
  return mat3(
    vec3(c/(c*c+s*s),s/(c*c+s*s),0.),
    vec3(-s/(c*c+s*s),c/(c*c+s*s),0.),
    vec3(0.,0.,1.)
  )*p;
}

vec3 sdfTranslate(vec3 p,vec3 t){
  return p-t;
}

vec3 sdfScale(vec3 p,vec3 s)
{
  return(p/s)*s;
}

// === REPEAT OPERATORS ===
vec3 sdfSimX(vec3 p){
  return vec3(abs(p.x),p.yz);
}

vec3 sdfSimY(vec3 p){
  return vec3(p.x,abs(p.y),p.z);
}

vec3 sdfSimZ(vec3 p){
  return vec3(p.xy,abs(p.z));
}

vec3 sdfSimXY(vec3 p){
  return vec3(abs(p.xy),p.z);
}
vec3 sdfSimXZ(vec3 p){
  return vec3(abs(p.x),p.y,abs(p.z));
}

vec3 sdfSimYZ(vec3 p){
  return vec3(p.x,abs(p.yz));
}

vec3 sdfSimXYZ(vec3 p){
  return abs(p);
}

// === PRIMITIVES ===
float sphere(vec3 p,float radius)
{
  return length(p)-radius;
}

float box(vec3 p,vec3 size)
{
  vec3 q=abs(p)-size;
  return length(max(q,0.))+min(max(q.x,max(q.y,q.z)),0.);
}

float torus(vec3 p,vec2 size)
{
  vec2 q=vec2(length(p.xz)-size.x,p.y);
  return length(q)-size.y;
}

float cylinder(vec3 p,float h,float r)
{
  vec2 d=abs(vec2(length(p.xz),p.y))-vec2(r,h);
  return min(max((abs(vec2(length(p.xz),p.y))-vec2(r,h)).x,(abs(vec2(length(p.xz),p.y))-vec2(r,h)).y),0.)+length(max(abs(vec2(length(p.xz),p.y))-vec2(r,h),0.));
}

float line(in vec3 p,in vec3 start,in vec3 end,in float thickness){
  vec3 ba=end-start;
  vec3 pa=p-start;
  float h=clamp(dot(pa,ba)/dot(ba,ba),0.,1.);
  return length(pa-h*ba)-thickness;
}

float infCylinder(vec3 p,vec3 c)
{
  return length(p.xz-c.xy)-c.z;
}

float plane(vec3 p,vec3 n,float h)
{
  // n must be normalized
  return dot(p,n)+h;
}

float sdf(vec3 p){
  float interp;
  float esfera=sphere(p-vec3(.5),1.);
  float cilindro=cylinder(p,1.,.5);

  return sdfSmoothUnion(esfera,cilindro,.5,3.,interp);
}

float checkersGradBox( in vec2 p, in vec2 dpdx, in vec2 dpdy )
{
    // filter kernel
    vec2 w = abs(dpdx)+abs(dpdy) + 0.001;
    // analytical integral (box filter)
    vec2 i = 2.0*(abs(fract((p-0.5*w)*0.5)-0.5)-abs(fract((p+0.5*w)*0.5)-0.5))/w;
    // xor pattern
    return 0.5 - 0.5*i.x*i.y;                  
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

  vec3 col = mod(p.x, 5.0)>0.3 && mod(p.z, 5.0) > 0.3 ? vec3(0.4392, 0.4275, 0.4275) : vec3(0.2471, 0.2392, 0.2392);
  Surface suelo=Surface(
    plane(sdfTranslate(p,vec3(0.,-0.5,0.)),vec3(0.,1.,0.),.5),
    Material(vec3(1.0, 1.0, 1.0),0.,col,3.,vec3(1.0, 1.0, 1.0),15.,vec3(.1),50.)
  );

  Surface auricular=Surface(
    sdf(p),
    mat
  );
  
  Surface final=sdfSurfaceUnion(suelo,auricular);
  
  return final;
}
  
Surface rayMarch(vec3 ro,vec3 rd,float start,float end){
  float depth=start;
  Surface co;// closest object
  
  for(int i=0;i<MAX_MARCHING_STEPS;i++){
    vec3 p=ro+depth*rd;
    co=map(p);
    depth+=co.sd;
    if(co.sd<PRECISION||depth>end)break;
  }
  
  co.sd=depth;
  
  return co;
}

float calcAO(in vec3 pos,in vec3 nor)
{
  float occ=0.;
  float sca=1.;
  for(int i=0;i<5;i++)
  {
    float h=.01+.12*float(i)/4.;
    float d=map(pos+h*nor).sd;
    occ+=(h-d)*sca;
    sca*=.95;
    if(occ>.35)break;
  }
  return clamp(1.-3.*occ,0.,1.)*(.5+.5*nor.y);
}

// https://iquilezles.org/articles/rmshadows
float calcSoftshadow(in vec3 ro,in vec3 rd,in float mint,in float tmax)
{
  // bounding volume
  float tp=(.8-ro.y)/rd.y;if(tp>0.)tmax=min(tmax,tp);
  
  float res=1.;
  float t=mint;
  for(int i=0;i<24;i++)
  {
    float h=map(ro+rd*t).sd;
    float s=clamp(8.*h/t,0.,1.);
    res=min(res,s);
    t+=clamp(h,.01,.2);
    if(res<.004||t>tmax)break;
  }
  res=clamp(res,0.,1.);
  return res*res*(3.-2.*res);
}

vec3 lighting(vec3 pos, vec3 rd, vec3 nor, Surface s){
  float lightPos[6], lightColor[6], lightSize[2];
  lightPos[0] = 0.5; lightPos[1] = 0.4; lightPos[2] = -0.6;
  lightPos[3] = 0.0; lightPos[4] = 1.0; lightPos[5] = 0.0;
  lightColor[0] = 0.4; lightColor[1] = 0.4; lightColor[2] = 0.4;
  lightColor[3] = 0.4; lightColor[4] = 0.4; lightColor[5] = 0.4;
  lightSize[0] = 2.5; lightSize[1] = 2.5;

  const int nLights = 2;

  vec3 result = vec3(0.0);

  float occ = 1.0;
  #ifdef AO
  occ= calcAO(pos,nor);
  #endif

  for(int i=0; i<2; i++){
    vec3 Li=normalize(vec3(lightPos[3*i], lightPos[3*i+1], lightPos[3*i+2]));
    vec3 lColor = vec3(lightColor[3*i], lightColor[3*i+1], lightColor[3*i+2]);
    vec3 h=normalize(Li-rd);
    float NLi=max(0.,dot(nor,Li));
    float NH=max(0.,dot(nor,h));

    float shadow = 1.0;
    #ifdef SHADOWS
    shadow=calcSoftshadow(pos,Li,.02,2.5);
    #endif
    vec3 amb = s.mat.ka*s.mat.ambient;
    vec3 dif=NLi*s.mat.kd*s.mat.diffuse;
    vec3 spe=NLi*s.mat.ks*s.mat.specular*pow(NH,s.mat.smoothness);

    spe*=.04+.96*pow(clamp(1.-dot(h,Li),0.,1.),5.);// NO SE POR QUE

    result += lColor*(amb+dif + spe)*occ*shadow;
  }

  return result;
}

vec3 lightingBlinnPhong(vec3 p,vec3 n,vec3 ro,vec3 rd,Material mat){
  vec3 lightsPos[1];
  lightsPos[0]=vec3(4.,2.,2.);
  
  vec3 lightsColor[1];
  lightsColor[0]=vec3(1.,1.,1.);
  float ambientOcc=calcAO(p,n);
  
  // return vec3(shadows, 0.0,0.0);
  vec3 ambient=vec3(.03);
  vec3 emission=mat.emission;
  vec3 result=ambient+emission;
  
  for(int i=0;i<1;i++){
    
    vec3 Li=normalize(lightsPos[i]-p);
    vec3 H=normalize(Li-rd);// - porque v va del ojo a p, y rd al reves
    float LiN=dot(Li,n);
    float shadows=calcSoftshadow(p,Li,.02,2.5);
    
    vec3 ambientReflection=mat.ka*mat.ambient;
    vec3 diffuseReflection=max(0.,LiN)*mat.kd*mat.diffuse*ambientOcc;
    vec3 specularReflection=max(0.,LiN)*pow(max(0.,dot(n,H)),mat.smoothness)*mat.ks*mat.specular*shadows;
    
    result+=ambientReflection+diffuseReflection+specularReflection;
  }
  
  return result;
}
  
vec3 lightingPhong(vec3 p,vec3 n,vec3 eye,Material mat){
  vec3 ambient=vec3(.1);
  
  vec3 lightsPos[2];
  lightsPos[0]=vec3(4.,2.,2.);
  
  vec3 lightsColor[2];
  lightsColor[0]=vec3(1.,1.,1.);
  
  vec3 ambientComponent=mat.ambient*ambient;
  vec3 Ip=mat.ambient*ambient;
  
  for(int i=0;i<2;i++){
    vec3 Lm=normalize(lightsPos[i]-p);
    vec3 Rm=normalize(2.*(dot(Lm,n))*n-Lm);// reflect(-Lm, n)
    vec3 V=normalize(eye-p);
    
    float LN=dot(Lm,n);
    float RV=dot(Rm,V);
    
    if(LN<0.)// Light not visible
    Ip+=mat.emission;
    else if(RV<0.)// opposite direction as viewer, apply only diffuse
    Ip+=lightsColor[i]*(mat.diffuse*LN);
    else
    Ip+=lightsColor[i]*(mat.diffuse*LN+mat.specular*pow(RV,mat.smoothness));
  }
  
  return Ip;
}
  
vec3 calcNormal(in vec3 p){
  return normalize(vec3(
    map(vec3(p.x+EPSILON,p.y,p.z)).sd-map(vec3(p.x-EPSILON,p.y,p.z)).sd,
    map(vec3(p.x,p.y+EPSILON,p.z)).sd-map(vec3(p.x,p.y-EPSILON,p.z)).sd,
    map(vec3(p.x,p.y,p.z+EPSILON)).sd-map(vec3(p.x,p.y,p.z-EPSILON)).sd
  ));
}
  

mat3 camera(vec3 cameraPos,vec3 lookAtPoint){
  vec3 cd=normalize(lookAtPoint-cameraPos);// camera direction
  vec3 cr=normalize(cross(vec3(0.,1.,0.),cd));// camera right
  vec3 cu=normalize(cross(cd,cr));// camera up
  
  return mat3(-cr,cu,-cd);
}

void main()
{
  const vec3 backgroundColor=vec3(.835,1.,1.);
  const vec3 lookAt=vec3(0.);

  vec3 col=vec3(0.);
  vec3 eye=vec3(3.,3.,5.);
  mat3 rot=(rotateY(u_cameraAng.x)*rotateX(u_cameraAng.y));
  eye=rot*eye*u_zoom;
  mat3 cam = camera(eye,lookAt);
  

  #if AA>1
    for( int m=0; m<AA; m++ )
    for( int n=0; n<AA; n++ )
    {
      // pixel coordinates
      vec2 o = vec2(float(m),float(n)) / float(AA) - 0.5;
      vec2 uv = (-u_resolution.xy + 2.0*(gl_FragCoord.xy+o))/u_resolution.y;
      // vec2 uv=(gl_FragCoord.xy-.5*u_resolution.xy)/u_resolution.y;
  # else
    vec2 uv = (-u_resolution.xy + 2.0*(gl_FragCoord.xy))/u_resolution.y;
  #endif
  
  vec3 rayDir=cam*normalize(vec3(uv,-1));// ray direction  

  Surface co=rayMarch(eye,rayDir,MIN_DIST,MAX_DIST);// closest object
  
  if(co.sd>MAX_DIST){
    col+=backgroundColor;// NO HIT
  }
  else{
    vec3 p=eye+rayDir*co.sd;// HIT POINT
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