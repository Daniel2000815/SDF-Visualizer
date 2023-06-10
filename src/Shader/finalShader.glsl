#ifdef GL_ES
precision mediump float;
#endif

#define AO  
#define SHADOWS
#define AA 1

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
const vec3 u_ambientEnv = vec3(0.01);
const float u_ka = 0.4;
const float u_ks = 30.0;
const float u_kd = 2.0;
const float u_smoothness=100.;
const float u_zoom=1.5;
const vec2 u_cameraAng=vec2(1.4,0.2);
const
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

// === DEFORM OPERATORS ===

vec3 Twist(in vec3 p,in float k)
{
  float c=cos(k*p.y);
  float s=sin(k*p.y);
  mat2 m=mat2(c,-s,s,c);
  vec3 q=vec3(m*p.xz,p.y);
  return q;
}

vec3 Bend(in vec3 p,in float k)
{
  float c=cos(k*p.x);
  float s=sin(k*p.x);
  mat2 m=mat2(c,-s,s,c);
  vec3 q=vec3(m*p.xy,p.z);
  return q;
}

vec3 Elongate(in vec3 p, in vec3 h )
{
    return p - clamp( p, -h, h );
}

float Round(float p, float rad )
{
    return p-rad;
}

// === REPEAT OPERATORS ===
vec3 Repeat(in vec3 p,in float s,in vec3 lim)
{
  return p-s*clamp(floor(p/s+.5),-lim,lim);
}

vec3 InfiniteRepeat(in vec3 p,in float s)
{
  return mod(p+.5*s,s)-.5*s;
}

// === BOOLEAN OPERATORS ===

Surface SurfaceUnion(Surface s1,Surface s2){
  if(s1.sd<s2.sd)
  return s1;
  
  return s2;
}

float Union(float a,float b,float k,float n,out float interp)
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

float Intersection(float a,float b,float k,float n,out float interp)
{
  return -Union(-a,-b,k,n,interp);
}

float Difference(float a,float b,float k,float n,out float interp)
{
  return Intersection(a,-b,k,n,interp);
}

// === TRANSFORM OPERATORS ===
vec3 RotateX(vec3 p,float theta){
  float c=cos(theta);
  float s=sin(theta);
  
  return mat3(
    vec3(1.,0.,0.),
    vec3(0.,c/(c*c+s*s),s/(c*c+s*s)),
    vec3(0.,-s/(c*c+s*s),c/(c*c+s*s))
  )*p;
}

vec3 RotateY(vec3 p,float theta){
  float c=cos(theta);
  float s=sin(theta);
  
  return mat3(
    vec3(c/(c*c+s*s),0.,-s/(c*c+s*s)),
    vec3(0.,1.,0.),
    vec3(s/(c*c+s*s),0.,c)
  )*p;
}

vec3 RotateZ(vec3 p,float theta){
  float c=cos(theta);
  float s=sin(theta);
  
  return mat3(
    vec3(c/(c*c+s*s),s/(c*c+s*s),0.),
    vec3(-s/(c*c+s*s),c/(c*c+s*s),0.),
    vec3(0.,0.,1.)
  )*p;
}

vec3 Translate(vec3 p,vec3 t){
  return p-t;
}

// === REPEAT OPERATORS ===

vec3 SimX(vec3 p){
  return vec3(abs(p.x),p.yz);
}

vec3 SimY(vec3 p){
  return vec3(p.x,abs(p.y),p.z);
}

vec3 SimZ(vec3 p){
  return vec3(p.xy,abs(p.z));
}

vec3 SimXY(vec3 p){
  return vec3(abs(p.xy),p.z);
}
vec3 SimXZ(vec3 p){
  return vec3(abs(p.x),p.y,abs(p.z));
}

vec3 SimYZ(vec3 p){
  return vec3(p.x,abs(p.yz));
}

vec3 SimXYZ(vec3 p){
  return abs(p);
}

// === PRIMITIVES ===
float Sphere(vec3 p,float radius)
{
  return length(p)-radius;
}

float Box(vec3 p,vec3 size)
{
  vec3 q=abs(p)-size;
  return length(max(q,0.))+min(max(q.x,max(q.y,q.z)),0.);
}

float Cone( vec3 p, float angle, float h ){

  float s = sin(angle);
  float c = cos(angle);
  float q = length(p.xz);
  return max(dot(vec2(s,c),vec2(q,p.y)),-h-p.y);
}

float Ellipsoid( vec3 p, vec3 r )
{
  float k0 = length(p/r);
  float k1 = length(p/(r*r));
  return k0*(k0-1.0)/k1;
}

float Torus(vec3 p,vec2 size)
{
  vec2 q=vec2(length(p.xz)-size.x,p.y);
  return length(q)-size.y;
}

float Cylinder(vec3 p,float h,float r)
{
  vec2 d=abs(vec2(length(p.xz),p.y))-vec2(r,h);
  return min(max((abs(vec2(length(p.xz),p.y))-vec2(r,h)).x,(abs(vec2(length(p.xz),p.y))-vec2(r,h)).y),0.)+length(max(abs(vec2(length(p.xz),p.y))-vec2(r,h),0.));
}

float Line(in vec3 p,in vec3 start,in vec3 end,in float thickness){
  vec3 ba=end-start;
  vec3 pa=p-start;
  float h=clamp(dot(pa,ba)/dot(ba,ba),0.,1.);
  return length(pa-h*ba)-thickness;
}

float InfCylinder(vec3 p,vec3 c)
{
  return length(p.xz-c.xy)-c.z;
}

float plane(vec3 p,vec3 n,float h)
{
  return dot(p,n)+h;
}

float sdf(vec3 p){
  float interp;
  float esfera=Sphere(p-vec3(.5),1.);
  float cilindro=Cylinder(p,1.,.5);

  return Union(esfera,cilindro,.5,3.,interp);
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

  Material matBox = Material(
    vec3(0.0118, 0.2235, 0.302),
    1.0,
    vec3(0.1216, 0.2824, 0.5608),
    5.0,
    vec3(0.4431, 0.4314, 0.5098),
    10.0,
    vec3(0.0, 0.0, 0.0),
    15.0
  );

  vec3 col = mod(p.x, 5.0)>0.3 && mod(p.z, 5.0) > 0.3 ? vec3(0.4392, 0.4275, 0.4275) : vec3(0.2471, 0.2392, 0.2392);
  Surface suelo=Surface(
    plane(Translate(p,vec3(0.,-0.5,0.)),vec3(0.,1.,0.),.5),
    Material(vec3(1.0, 1.0, 1.0),0.,col,3.,vec3(1.0, 1.0, 1.0),25.,vec3(.1),50.)
  );

  Surface auricular=Surface(
    sdf(p),
    mat
  );
float interp;
  Surface esfera = Surface(Sphere(p-vec3(3.0,0.0,3.0),3.), mat);
  Surface cubo   = Surface(Round(Box(RotateY(p+vec3(5.0,-.0,5.0), -1.0), vec3(2.0)),0.2), matBox);
  Surface final=SurfaceUnion(suelo,esfera);
  final = SurfaceUnion(final, cubo);
  return final;
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
  float lightPos[6], lightColor[6], lightSize[2];
  lightPos[0] = 0.5; lightPos[1] = 0.4; lightPos[2] = -0.6;
  lightPos[3] = -1.0; lightPos[4] = 1.0; lightPos[5] = -2.0;
  lightColor[0] = 0.4; lightColor[1] = 0.4; lightColor[2] = 0.4;
  lightColor[3] = 0.4; lightColor[4] = 0.4; lightColor[5] = 0.4;
  lightSize[0] = 1.5; lightSize[1] = 10.;

  const int nLights = 2;

  vec3 result = u_ambientEnv;

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
    shadow=calcSoftshadow(pos,Li,.02,2.5,lightSize[i]);
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
      vec2 uv=2.0*((gl_FragCoord.xy+o)-.5*u_resolution.xy)/u_resolution.y;
  # else
    vec2 uv = 2.0*((gl_FragCoord.xy)-.5*u_resolution.xy)/u_resolution.y;
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