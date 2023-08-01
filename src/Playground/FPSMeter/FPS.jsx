import React, { useState } from "react";
import ReactDOM from "react-dom";

import useAnimationFrame from "./useAnimationFrame";
import useInterpolation from "./useInterpolation";
import { useRef } from "react";
import Ola from "ola";
export function FPS ()  {
  const [time, setTime] = useState(0);
  const ref = useRef();
  // 1s of interpolation time
  // const [fps, setFps] = useInterpolation(1000);
  useAnimationFrame(e => {
    
    setTime(e.time);

    if (ref.current) {
      ref.current.value = 1 / e.delta;
    } else {
      ref.current = new Ola(1 / e.delta, 1000);
    }
  }, []);

  return (
    <div>
      {ref.current && Math.floor(ref.current.value)} FPS
    </div>
  );
};

