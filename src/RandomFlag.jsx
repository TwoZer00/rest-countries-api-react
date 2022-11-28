import React, { useEffect } from "react";
import { useRef } from "react";
import { useSpring, animated } from "react-spring";
import FlagTransition from "./FlagTransition";

export default function RandomFlag({ flag }) {
  const flagElement = (
    <FlagTransition
      key={flag.ccn3}
      flag={flag}
    />
  );
  return (
    <div
      className={`w-[500px] h-[250px] overflow-hidden`}
    >
      <FlagTransition
      key={flag.ccn3}
      flag={flag}
    />
    </div>
  );
}
