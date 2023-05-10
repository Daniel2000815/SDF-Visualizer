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
    vec3 sdfRepeat( in vec3 p, in float s, in vec3 lim )
    {
        return p-s*clamp(floor(p/s+0.5),-lim,lim);
    }

    float sdfUnion( float d1, float d2 ) {
        
        return min(d1,d2);
    }

    float sdfSmoothUnion( float d1, float d2, float k ) {
        float h = clamp( 0.5 + 0.5*(d2-d1)/k, 0.0, 1.0 );
        return mix( d2, d1, h ) - k*h*(1.0-h); 
    }

    float sdfDifference( float d1, float d2 ) {
        
        return max(d1,-d2);
    }

    float sdfSmoothDifference( float d1, float d2, float k ) {
        float h = clamp( 0.5 - 0.5*(d2+d1)/k, 0.0, 1.0 );
        return mix( d1, -d2, h ) + k*h*(1.0-h); 
    }

    float sdfIntersection( float d1, float d2 ) {
        
        return max(d1,d2);
    }

    float sdfSmoothIntersection( float d1, float d2, float k ) {
        float h = clamp( 0.5 - 0.5*(d2-d1)/k, 0.0, 1.0 );
        return mix( d2, d1, h ) + k*h*(1.0-h); 
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
    vec3 sdfRotateX(vec3 p, float theta){
    float c=cos(theta);
    float s=sin(theta);
    return mat3(
        vec3(1.,0.,0.),
        vec3(0.,c/(c*c+s*s),s/(c*c+s*s)),
        vec3(0.,-s/(c*c+s*s),c/(c*c+s*s))
    ) * p;
    }

    // Rotation matrix around the Y axis.
    vec3 sdfRotateY(vec3 p,float theta){
    float c=cos(theta);
    float s=sin(theta);
    return mat3(
        vec3(c/(c*c+s*s),0.,-s/(c*c+s*s)),
        vec3(0.,1.,0.),
        vec3(s/(c*c+s*s),0.,c)
    ) * p;
    }

    // Rotation matrix around the Z axis.
    vec3 sdfRotateZ(vec3 p,float theta){
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