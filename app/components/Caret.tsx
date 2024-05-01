// "use client";
// import React, { useRef } from "react";
// import { useSpring, animated } from "react-spring";
// import { useState, useMemo, useEffect } from "react";
// import { Stack } from "@mui/material";
// import jquery from "jquery";
// import { useAnimate } from "framer-motion";

// const Caret = (props: any) => {
//   const [currPos, setCurrPos] = useState(0);
//   const [scope, animate] = useAnimate();

//   const handleKeyDown3 = (event: any) => {
//     props.handleTypeKeyPress(event);
//     console.log("this is craet call", props.width);
//     console.log("hello called");
//     setCurrPos(currPos + 15);
//   };

//   useEffect(() => {
//     animate(
//       scope.current,
//       {
//         left: currPos,
//         transition: { duration: 0.5 },
//       },
//       {
//         onUpdate: () => {},
//         onComplete: () => {
//           console.log("onComplete");
//         },
//       }
//     );

//     document.addEventListener("keydown", handleKeyDown3);

//     return () => {
//       document.removeEventListener("keydown", handleKeyDown3);
//     };
//   }, [currPos]);

//   return (
//     <div></div>
//     // <span ref={scope} className="caret-pointer">
//     //   |
//     // </span>
//   );
// };

// export default Caret;
