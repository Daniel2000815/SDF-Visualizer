#ifdef GL_ES
precision mediump float;
#endif

// Constants
const int MAX_MARCHING_STEPS=255;
const float MIN_DIST=0.;
const float MAX_DIST=100.;
const float PRECISION=.0001;
const float EPSILON=.0005;
const float PI=3.14159265359;

const vec3 u_specular=vec3(1.,0.,1.);
const vec3 u_diffuse=vec3(1.,0.,0.);
const vec3 u_ambient=vec3(.2);
const float u_smoothness=10.;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
const float u_zoom=5.;

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
  float s=sin(theta),c=cos(theta);
  return mat2(c,-s,s,c);
}

// Rotation matrix around the X axis.
mat3 rotateX(float theta){
  float c=cos(theta);
  float s=sin(theta);
  return mat3(
    vec3(1.,0.,0.),
    vec3(0.,c/(c*c+s*s),s/(c*c+s*s)),
    vec3(0.,-s/(c*c+s*s),c/(c*c+s*s))
  );
}

// Rotation matrix around the Y axis.
mat3 rotateY(float theta){
  float c=cos(theta);
  float s=sin(theta);
  return mat3(
    vec3(c/(c*c+s*s),0.,-s/(c*c+s*s)),
    vec3(0.,1.,0.),
    vec3(s/(c*c+s*s),0.,c)
  );
}

// Rotation matrix around the Z axis.
mat3 rotateZ(float theta){
  float c=cos(theta);
  float s=sin(theta);
  return mat3(
    vec3(c/(c*c+s*s),s/(c*c+s*s),0.),
    vec3(-s/(c*c+s*s),c/(c*c+s*s),0.),
    vec3(0.,0.,1.)
  );
}

// Identity matrix.
mat3 identity(){
  return mat3(
    vec3(1,0,0),
    vec3(0,1,0),
    vec3(0,0,1)
  );
}

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
vec3 sdfRepeat(in vec3 p,in float s,in vec3 lim)
{
  return p-s*clamp(floor(p/s+.5),-lim,lim);
}

float sdfUnion(float d1,float d2){
  
  return min(d1,d2);
}

float sdfSmoothUnion(float d1,float d2,float k){
  float h=clamp(.5+.5*(d2-d1)/k,0.,1.);
  return mix(d2,d1,h)-k*h*(1.-h);
}

float sdfDifference(float d1,float d2){
  
  return max(d1,-d2);
}

float sdfSmoothDifference(float d1,float d2,float k){
  float h=clamp(.5-.5*(d2+d1)/k,0.,1.);
  return mix(d1,-d2,h)+k*h*(1.-h);
}

float sdfIntersection(float d1,float d2){
  
  return max(d1,d2);
}

vec2 smin(float a,float b,float k)
{
  float h=max(k-abs(a-b),0.)/k;
  float m=h*h*.5;
  float s=m*k*(1./2.);
  return(a<b)?vec2(a-s,m):vec2(b-s,1.-m);
}

vec2 smax(float a,float b,float k)
{
  return-smin(-a,-b,k);
  
}

vec2 sdif(float a,float b,float k)
{
  return smax(a,-b,k);
}

float sdfSmoothIntersection(float d1,float d2,float k){
  float h=clamp(.5-.5*(d2-d1)/k,0.,1.);
  return mix(d2,d1,h)+k*h*(1.-h);
}

// https://stackoverflow.com/questions/34050929/3d-point-rotation-algorithm
vec3 sdfRotate(vec3 p,vec3 ang){
  float pitch=ang.x;
  float roll=ang.y;
  float yaw=ang.z;
  
  float cosa=cos(yaw);
  float sina=sin(yaw);
  
  float cosb=cos(pitch);
  float sinb=sin(pitch);
  
  float cosc=cos(roll);
  float sinc=sin(roll);
  
  float Axx=cosa*cosb;
  float Axy=cosa*sinb*sinc-sina*cosc;
  float Axz=cosa*sinb*cosc+sina*sinc;
  
  float Ayx=sina*cosb;
  float Ayy=sina*sinb*sinc+cosa*cosc;
  float Ayz=sina*sinb*cosc-cosa*sinc;
  
  float Azx=-sinb;
  float Azy=cosb*sinc;
  float Azz=cosb*cosc;
  
  float px=p.x;
  float py=p.y;
  float pz=p.z;
  
  p.x=Axx*px+Axy*py+Axz*pz;
  p.y=Ayx*px+Ayy*py+Ayz*pz;
  p.z=Azx*px+Azy*py+Azz*pz;
  
  return p;
}

vec3 sdfTranslate(vec3 p,vec3 t){
  return p-t;
}

vec3 sdfScale(vec3 p,vec3 s)
{
  return(p/s)*s;
}

Surface minWithColor(Surface obj1,Surface obj2){
  if(obj2.sd<obj1.sd)return obj2;
  return obj1;
}

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

vec3 Finite_Repeat(in vec3 p,in float s,in vec3 lim)
{
  return p-s*clamp(floor(p/s+.5),-lim,lim);
}

vec3 Ininite_Repeat(in vec3 p,in float s)
{
  return mod(p+.5*s,s)-.5*s;
}

Surface map(vec3 p){
  Material mat=Material(u_specular,u_diffuse,u_ambient,u_smoothness);
  // vec3 newP=Ininite_Repeat(p,10.);
  vec3 newP=p;
  float sphere=sphere(newP-vec3(.5),1.);
  float cyl=cylinder(newP,1.,.5);
  
  float m=smax(sphere,cyl,.5).x;
  
  vec2 dist_mat=smin(sphere,cyl,.5);
  float interpolation=clamp(.5+.5*(sphere-cyl)/.5,0.,1.);
  Material m1=Material(vec3(1.),vec3(1.,0.,0.),vec3(.2),10.);
  Material m2=Material(vec3(1.),vec3(0.,1.,0.),vec3(.2),10.);
  Material mBlend=Material(vec3(1.),mix(m1.diffuse,m2.diffuse,dist_mat.y),vec3(.2),10.);
  
  // vec3 newP=sdfRepeat(p,3.,vec3(30.,20.,2.));
  
  float ang=1.7;
  //newP=rotateZ(ang)*rotateX(ang)*p;
  Surface co=Surface(dist_mat.x,mBlend);
  // co=Surface(sdfUnion(box,sphere),mat);
  // co=Surface(sdfSmoothIntersection(sphere,box,.2),mat);
  // co=Surface(sdfIntersection(box,sphere),mat);
  // co=Surface(sdfSmoothDifference(box,sphere,.1),mat);
  // co=Surface(sdfDifference(box,sphere),mat);
  
  // Surface co=Surface(plane(p,vec3(0.,1.,0.),0.),mat);
  
  return co;
}

vec3 grad(in vec3 p)
{
  return vec3(
    map(vec3(p.x+EPSILON,p.y,p.z)).sd-map(vec3(p.x-EPSILON,p.y,p.z)).sd,
    map(vec3(p.x,p.y+EPSILON,p.z)).sd-map(vec3(p.x,p.y-EPSILON,p.z)).sd,
    map(vec3(p.x,p.y,p.z+EPSILON)).sd-map(vec3(p.x,p.y,p.z-EPSILON)).sd
  );
}

mat3 camera(vec3 cameraPos,vec3 lookAtPoint){
  vec3 cd=normalize(lookAtPoint-cameraPos);// camera direction
  vec3 cr=normalize(cross(vec3(0.,1.,0.),cd));// camera right
  vec3 cu=normalize(cross(cd,cr));// camera up
  
  return mat3(-cr,cu,-cd);
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

vec3 lighting(vec3 p,vec3 n,vec3 eye,Material mat){
  vec3 ambient=vec3(.5);
  
  vec3 lights_pos[2];
  lights_pos[0]=vec3(4.,2.,2.);
  lights_pos[1]=vec3(-4.,-2.,-2.);
  
  vec3 lights_color[2];
  lights_color[0]=vec3(1.,1.,1.);
  lights_color[1]=vec3(1.,1.,1.);
  
  vec3 Ip=mat.ambient*ambient;
  
  for(int i=0;i<2;i++){
    vec3 Lm=normalize(lights_pos[i]-p);
    vec3 Rm=normalize(2.*(dot(Lm,n))*n-Lm);// reflect(-Lm, n)
    vec3 V=normalize(eye-p);
    
    float LN=dot(Lm,n);
    float RV=dot(Rm,V);
    
    if(LN<0.)// Light not visible
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
      map(vec3(p.x+EPSILON,p.y,p.z)).sd-map(vec3(p.x-EPSILON,p.y,p.z)).sd,
      map(vec3(p.x,p.y+EPSILON,p.z)).sd-map(vec3(p.x,p.y-EPSILON,p.z)).sd,
      map(vec3(p.x,p.y,p.z+EPSILON)).sd-map(vec3(p.x,p.y,p.z-EPSILON)).sd
    ));
  }
  
  void main()
  {
    vec2 uv=(gl_FragCoord.xy-.5*u_resolution.xy)/u_resolution.y;
    // gl_FragColor = vec4(uv.xy, 0.0, 1.0);
    // return;
    // uv = gl_FragCoord.xy/u_resolution.xy - vec2(0.5);
    vec2 mouseUV=vec2(.5);
    
    if(u_mouse.x>0.||u_mouse.y>0.)
    mouseUV=u_mouse.xy/u_resolution.xy;// [0,1]
    
    vec3 backgroundColor=vec3(.835,1.,1.);
    vec3 col=vec3(0.);
    
    vec3 lookAt=vec3(0.);
    vec3 eye=vec3(0,5,0);
    
    float cameraRadius=u_zoom;
    
    eye.yz=eye.yz*cameraRadius*rotate2d(mix(PI,0.,mouseUV.y));
    eye.xz=eye.xz*rotate2d(mix(-PI,PI,mouseUV.x))
    +vec2(lookAt.x,lookAt.z);
    
    vec3 rayDir=camera(eye,lookAt)*normalize(vec3(uv,-1));// ray direction
    
    Surface co=rayMarch(eye,rayDir,MIN_DIST,MAX_DIST);// closest object
    
    if(co.sd>MAX_DIST){
      col=backgroundColor;// ray didn't hit anything
    }
    else{
      vec3 p=eye+rayDir*co.sd;// point from ray marching
      vec3 normal=calcNormal(p);
      
      col=lighting(p,normal,eye,co.mat);
    }
    
    gl_FragColor=vec4(col,1.);
    return;
  }