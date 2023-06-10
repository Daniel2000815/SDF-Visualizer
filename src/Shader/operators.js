export const operators = () => `
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
vec3 FiniteRepeat(in vec3 p,in float s,in vec3 lim)
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

vec3 Rotate(vec3 p, vec3 ang){
    return RotateX(RotateY(RotateZ(p,ang.z), ang.y), ang.x);
}

vec3 Translate(vec3 p,vec3 t){
  return p-t;
}

// === REPEAT OPERATORS ===

vec3 SimetryX(vec3 p){
  return vec3(abs(p.x),p.yz);
}

vec3 SimetryY(vec3 p){
  return vec3(p.x,abs(p.y),p.z);
}

vec3 SimetryZ(vec3 p){
  return vec3(p.xy,abs(p.z));
}

vec3 SimetryXY(vec3 p){
  return vec3(abs(p.xy),p.z);
}
vec3 SimetryXZ(vec3 p){
  return vec3(abs(p.x),p.y,abs(p.z));
}

vec3 SimetryYZ(vec3 p){
  return vec3(p.x,abs(p.yz));
}

vec3 SimetryXYZ(vec3 p){
  return abs(p);
}

`