export const operators = () => `
    vec3 sdfTwist( in vec3 p, in float k )
    {
        float c = cos(k*p.y);
        float s = sin(k*p.y);
        mat2  m = mat2(c,-s,s,c);
        vec3  q = vec3(m*p.xz,p.y);
        return q;
    }

    vec3 sdfBend(in vec3 p, in float k )
    {
        float c = cos(k*p.x);
        float s = sin(k*p.x);
        mat2  m = mat2(c,-s,s,c);
        vec3  q = vec3(m*p.xy,p.z);
        return q;
    }
    vec3 Finite_Repeat( in vec3 p, in float s, in vec3 lim )
    {
        return p-s*clamp(floor(p/s+0.5),-lim,lim);
    }

    vec3 Infinite_Repeat( in vec3 p, in float s )
    {
        return mod(p+0.5*s,s)-0.5*s;
    }

    float sdfSmoothUnion( float a, float b, float k, float n ) {
        float h = max( k-abs(a-b), 0.0 )/k;
        float m = pow(h, n)*0.5;
        float s = m*k/n; 
        return (a<b) ? a-s : b-s;
    }

    float sdfSmoothIntersection( float d1, float d2, float k, float n ) {
        return -sdfSmoothUnion(-d1,-d2,k,n);
    }

    float sdfSmoothDifference( float d1, float d2, float k, float n ) {
        return sdfSmoothIntersection(d1, -d2, k, n);
    }

    vec3 Simetry_X(vec3 p){
        return vec3(abs(p.x), p.yz);
      }
      
      vec3 Simetry_Y(vec3 p){
        return vec3(p.x, abs(p.y), p.z);
      }
      
      vec3 Simetry_Z(vec3 p){
        return vec3(p.xy, abs(p.z));
      }
      
      vec3 Simetry_XY(vec3 p){
        return vec3(abs(p.xy), p.z);
      }
      vec3 Simetry_XZ(vec3 p){
        return vec3(abs(p.x), p.y, abs(p.z));
      }
      
      vec3 Simetry_YZ(vec3 p){
        return vec3(p.x, abs(p.yz));
      }
      
      vec3 Simetry_XYZ(vec3 p){
        return abs(p);
      }
    

    // https://stackoverflow.com/questions/34050929/3d-point-rotation-algorithm
    vec3 sdfRotate(vec3 p, vec3 ang) {
        float pitch = ang.x;
        float roll = ang.y;
        float yaw = ang.z;

        float cosa = cos(yaw);
        float sina = sin(yaw);

        float cosb = cos(pitch);
        float sinb = sin(pitch);

        float cosc = cos(roll);
        float sinc = sin(roll);

        float Axx = cosa*cosb;
        float Axy = cosa*sinb*sinc - sina*cosc;
        float Axz = cosa*sinb*cosc + sina*sinc;

        float Ayx = sina*cosb;
        float Ayy = sina*sinb*sinc + cosa*cosc;
        float Ayz = sina*sinb*cosc - cosa*sinc;

        float Azx = -sinb;
        float Azy = cosb*sinc;
        float Azz = cosb*cosc;

        float px = p.x;
        float py = p.y;
        float pz = p.z;

        p.x = Axx*px + Axy*py + Axz*pz;
        p.y = Ayx*px + Ayy*py + Ayz*pz;
        p.z = Azx*px + Azy*py + Azz*pz;
        
        return p;
    }

    // Rotation matrix around the X axis.
    vec3 sdfRotate_X(vec3 p, float theta){
    float c=cos(theta);
    float s=sin(theta);
    return mat3(
        vec3(1.,0.,0.),
        vec3(0.,c/(c*c+s*s),s/(c*c+s*s)),
        vec3(0.,-s/(c*c+s*s),c/(c*c+s*s))
    ) * p;
    }

    // Rotation matrix around the Y axis.
    vec3 sdfRotate_Y(vec3 p,float theta){
    float c=cos(theta);
    float s=sin(theta);
    return mat3(
        vec3(c/(c*c+s*s),0.,-s/(c*c+s*s)),
        vec3(0.,1.,0.),
        vec3(s/(c*c+s*s),0.,c)
    ) * p;
    }

    // Rotation matrix around the Z axis.
    vec3 sdfRotate_Z(vec3 p,float theta){
    float c=cos(theta);
    float s=sin(theta);
    return mat3(
        vec3(c/(c*c+s*s),s/(c*c+s*s),0.),
        vec3(-s/(c*c+s*s),c/(c*c+s*s),0.),
        vec3(0.,0.,1.)
    ) * p;
    }

    vec3 sdfTranslate(vec3 p, vec3 t) {
        return p-t;
    }

    vec3 sdfScale( vec3 p, vec3 s )
    {
        return (p/s)*s;
    }

`