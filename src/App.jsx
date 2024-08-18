// // // // // import React, { useEffect, useRef, useState } from "react";
// // // // // import { Canvas } from "@react-three/fiber";
// // // // // import { Environment, PresentationControls } from "@react-three/drei";
// // // // // import MouseFlowmapDeformation from "./MouseFlowDeformation";
// // // // // import Model from "./Model";
// // // // // import envMap from "./assets/envMap/potsdamer_platz_0.256k.hdr";
// // // // // import gsap from "gsap";
// // // // // import model1 from "./assets/models/Monster_energy-Ultra.glb?url";
// // // // // import model2 from "./assets/models/black_monster_energy_drink.glb?url";

// // // // // import Background from "./Background";
// // // // // import Unleashed from "./Unleashed";
// // // // // import ScrollEndMessage from "./ScrollEndMessage";
// // // // // import ProductFinal from "./ProuductFinal";
// // // // // import FlowmapDemo from "./FlowmapDemo";
// // // // // import CornerEdgeCut from "./CornerEdgeCut";
// // // // // import Vision from "./Vision";
// // // // // import WavyImage from "./WavyImage";
// // // // // import Footer from "./Footer";

// // // // // const App = () => {
// // // // //   const [modelUrl, setModelUrl] = useState(model1);
// // // // //   const modelRef = useRef();

// // // // //   // useEffect(() => {
// // // // //   //   // const handleScroll = () => {
// // // // //   //   //   const scrollY = window.scrollY || window.pageYOffset;
// // // // //   //   //   const rotation = scrollY / 200; // Adjust the divisor to control rotation speed
// // // // //   //   //   const position = -scrollY / 50; // Adjust the divisor to control descent speed
// // // // //   //   //   gsap.to(modelRef.current.rotation, {
// // // // //   //   //     y: rotation,
// // // // //   //   //     duration: 0.5,
// // // // //   //   //     ease: "power2.out",
// // // // //   //   //   });
// // // // //   //   //   gsap.to(modelRef.current.position, {
// // // // //   //   //     y: position,
// // // // //   //   //     duration: 0.5,
// // // // //   //   //     ease: "power2.out",
// // // // //   //   //   });
// // // // //   //   // };

// // // // //   //   //  gsap.to('.canvas-div',{
// // // // //   //   //   y:"100px",
// // // // //   //   //   x:"50%",
// // // // //   //   //   // rotate:"360deg",
// // // // //   //   //   scrollTrigger:{
// // // // //   //   //     trigger:".canvas-div",
// // // // //   //   //     start:"top top",
// // // // //   //   //     end:"bottom top",
// // // // //   //   //     markers:true,
// // // // //   //   //     scrub:true
// // // // //   //   //   }
// // // // //   //   //  })
// // // // //   //   // window.addEventListener("scroll", handleScroll);

// // // // //   //   return () => {
// // // // //   //     window.removeEventListener("scroll", handleScroll);
// // // // //   //   };
// // // // //   // }, []);

// // // // //   const handleClick = () => {
// // // // //     setModelUrl((prevModelUrl) => (prevModelUrl === model1 ? model2 : model1));
// // // // //   };

// // // // //   return (
// // // // //     <div className="w-full">
// // // // //       <div className="w-full relative h-screen bg-black overflow-hidden max-sm:h-[80vh]">
// // // // //         {/* <img className="w-full h-full object-cover" src="https://web-assests.monsterenergy.com/mnst/c7f9a0e3-280b-4247-9c6d-107af55a6343.png" alt="" /> */}
// // // // //         <div className="w-1/2 h-full top-0 absolute z-[9]">
// // // // //           <MouseFlowmapDeformation />
// // // // //         </div>
// // // // //       </div>
// // // // //       <div className="p-10 bg-black">
// // // // //         <ScrollEndMessage>
// // // // //           <div className="w-full flex bg-black items-center justify-center h-screen">
// // // // //             <Vision />
// // // // //           </div>
// // // // //         </ScrollEndMessage>
// // // // //       </div>
// // // // //       {/* <Unleashed /> */}
// // // // //       <div className="w-full flex items-center justify-center h-screen bg-black"></div>
// // // // //       <ProductFinal />
// // // // //       <div className="w-full flex p-[20%] relative items-center justify-center h-screen bg-black">
// // // // //         <CornerEdgeCut />
// // // // //       </div>
// // // // //       <div className="w-full flex items-center justify-center h-screen bg-black"></div>
// // // // //       <Footer/>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default App;

// // // // // import React from "react";
// // // // // import WavyImage from './WavyImage'
// // // // // import Unleashed from "./Unleashed";

// // // // // const App = () => {
// // // // //   return (
// // // // //     <>
// // // // //       <div className="w-full h-screen">
// // // // //         <WavyImage src="/F046F4A0DA4659470BF37E7ECA45DB9C_video_dashinit.mp4"/>
// // // // //       </div>
// // // // //     </>
// // // // //   );
// // // // // };

// // // // // export default App;

// // // // import React from "react";
// // // // import MouseFlowmapDeformation from "./MouseFlowDeformation";

// // // // const App = () => {
// // // //   return (
// // // //     <div className="w-full">
// // // //        <div className="h-screen w-full bg-black"></div>
// // // //        <div className="h-screen w-full"></div>
// // // //       <MouseFlowmapDeformation />
// // // //       <div className="h-screen w-full bg-black"></div>
// // // //       <div className="h-screen w-full"></div>
// // // //       <div className="h-screen w-full"></div>
// // // //       <div className="h-screen w-full"></div>
// // // //       <div className="h-screen w-full"></div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default App;

// // // import gsap from "gsap";
// // // import React, { useEffect, useRef } from "react";

// // // const App = () => {
// // //   const divRef = useRef(null);

// // //   const handleMouseMove = (e) => {
// // //     const { clientX, clientY } = e;
// // //     gsap.to(".mousefollower", {
// // //       x: clientX,
// // //       y: clientY,
// // //     });
// // //   };

// // //   useEffect(() => {
// // //     const divElement = divRef.current;

// // //     const handleMouseEnter = () => {
// // //       gsap.to(".mousefollower", {
// // //         scale: 10,
// // //       });
// // //     };

// // //     const handleMouseLeave = (e) => {
// // //         gsap.to(".mousefollower", {
// // //           scale: 1,
// // //         });
// // //       console.log(e.target.id === "div" ? "true" : "false");
// // //     };

// // //     divElement.addEventListener("mouseenter", handleMouseEnter);
// // //     divElement.addEventListener("mouseleave", handleMouseLeave);

// // //     // return () => {
// // //     //   divElement.removeEventListener("mouseenter", handleMouseEnter);
// // //     //   divElement.removeEventListener("mouseleave", handleMouseLeave);
// // //     // };
// // //   }, []);

// // //   return (
// // //     <div className="relative" onMouseMove={handleMouseMove}>
// // //       <div className="absolute h-2 w-2 mousefollower bg-white rounded-full"></div>
// // //       <div className="h-screen w-full bg-black">
// // //         <div id="div" ref={divRef} className="h-[60vh] w-[40%] bg-red-500"></div>
// // //       </div>
// // //       <div className="h-screen w-full bg-black"></div>
// // //     </div>
// // //   );
// // // };

// // // export default App;

// // // const Button = ({ children }) => {
// // //   return (
// // //     <div className="px-10 w-fit hover:scale-[1.15] duration-[.4s] flex items-center justify-center gap-5 py-5 rounded-full bg-red-500 text-white">
// // //       <span>s</span>
// // //       {children}
// // //     </div>
// // //   );
// // // };

// // import gsap from "gsap";
// // import React, { useEffect, useRef } from "react";

// // const App = () => {
// //   const divRef = useRef(null);

// //   const handleMouseMove = (e) => {
// //     const { clientX, clientY } = e;
// //     gsap.to(".mousefollower", {
// //       x: clientX,
// //       y: clientY,
// //       duration: 0.2, // You can adjust the duration as needed
// //     });
// //   };

// //   useEffect(() => {
// //     const divElement = divRef.current;

// //     const handleMouseEnter = () => {
// //       gsap.to(".mousefollower", {
// //         scale: 10,
// //         duration: 0.3, // You can adjust the duration as needed
// //       });
// //     };

// //     const handleMouseLeave = () => {
// //       gsap.to(".mousefollower", {
// //         scale: 1,
// //         duration: 0.3, // You can adjust the duration as needed
// //       });
// //     };

// //     divElement.addEventListener("mouseenter", handleMouseEnter);
// //     divElement.addEventListener("mouseleave", handleMouseLeave);

// //     // Cleanup event listeners on component unmount
// //     return () => {
// //       divElement.removeEventListener("mouseenter", handleMouseEnter);
// //       divElement.removeEventListener("mouseleave", handleMouseLeave);
// //     };
// //   }, []);

// //   return (
// //     <div className="relative" onMouseMove={handleMouseMove}>
// //       <div className="absolute h-2 w-2 mousefollower bg-white rounded-full"></div>
// //       <div className="h-screen w-full bg-black">
// //         <div ref={divRef} className="h-[60vh] w-[40%] bg-red-500"></div>
// //       </div>
// //       <div className="h-screen w-full bg-black"></div>
// //     </div>
// //   );
// // };

// // export default App;

// import gsap from "gsap";
// import React, { useEffect, useRef, useState } from "react";

// const App = () => {
//   const divRef = useRef(null);
//   const [isInsideDiv, setIsInsideDiv] = useState(false);
//   console.log(isInsideDiv);

//   const handleMouseMove = (e) => {
//     const { clientX, clientY } = e;
//     gsap.to(".mousefollower", {
//       x: clientX,
//       y: clientY,
//       duration: 0.5,
//     });
//   };

//   return (
//     <div className="relative" onMouseMove={handleMouseMove}>
//       <div className="absolute h-2 w-2 mousefollower bg-white rounded-full"></div>
//       <div className="h-screen w-full bg-black">
//         <div ref={divRef} className="h-[60vh] w-[40%] bg-red-500"></div>
//       </div>
//       <div className="h-screen w-full bg-black"></div>
//     </div>
//   );
// };

// export default App;

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
const App = () => {
  const data = [
    [
      {
        title: "rffh",
        para: "jnhk",
      },
      [
        "REPORTing",
        "REPORTibtgng",
        "REPORgfsgTing",
        "REPORffTing",
        "REfPORTing",
      ],
    ],
    [
      {
        title: "rffh",
        para: "jnhk",
      },
      [
        "REPORTing",
        "REPORTibtgng",
        "REPORgfsgTing",
        "REPORffTing",
        "REfPORTing",
      ],
    ],
    [
      {
        title: "rffh",
        para: "jnhk",
      },
      [
        "REPORTing",
        "REPORTibtgng",
        "REPORgfsgTing",
        "REPORffTing",
        "REfPORTing",
      ],
    ],
  ];
  return (
    <div className="h-[600vh] w-full bg-red-500">
      <div className="sticky top-0 flex items-center justify-between h-screen overflow-hidden w-full bg-black">
        <div>
            <Card it={data[0]} key={idx} />
        </div>
      </div>
    </div>
  );
};

export default App;

const Card = ({ it }) => {
  return (
    <div className="w-[40%] flex-shrink-0 h-[60vh] text-white ">
      <div className="h-[20%] px-10 w-full bg-zinc-700 flex justify-between items-center">
        <div className="px-10 text-sm rounded-lg py-2 bg-[#0038ff]">
          {it[0].title}
        </div>
        <h1 className="text-2xl"> {it[0].para}</h1>
      </div>
      {it[1].map((item, index) => (
        <CardCol item={item} index={index} />
      ))}
    </div>
  );
};

const CardCol = ({ item, index }) => {
  return (
    <div className="w-full h-[15%] px-2 border-b-[1px] flex justify-between items-center border-white">
      <div className="px-3 py-1 text-center rounded-full border-[1px] border-white">
        {index + 1}
      </div>
      <h1 className="uppercase text-2xl">{item}</h1>
    </div>
  );
};
