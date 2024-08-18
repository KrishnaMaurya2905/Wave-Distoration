import React, { useRef } from "react";
import DescramblerText from "./DescramblerText";
import ScrollEndMessage from "./ScrollEndMessage";


const ProductFinal = () => {
  const ProductData = [
    {
      image: "/src/assets/Cans/1.jpg",
      title: "ORIGINAL GREEN MONSTER ENERGY",
    },
    {
      image: "/src/assets/Cans/2.png",
      title: "ZERO ULTRA A.K.A. THE WHITE MONSTER",
    },
    {
      image: "/src/assets/Cans/3.png",
      title: "JAVA MONSTER SALTED CARAMEL",
    },
    {
      image: "/src/assets/Cans/4.png",
      title: "JUICE MONSTER MANGO LOCO",
    },
    {
      image: "/src/assets/Cans/5.png",
      title: "REHAB MONSTER TEA & LEMONADE",
    },
    {
      image: "/src/assets/Cans/7.png",
      title: "ZERO-SUGAR ULTRA FANTASY RUBY RED",
    },
    {
      image: "/src/assets/Cans/8.png",
      title: "JAVA MONSTER IRISH CRÈME",
    },
    {
      image: "/src/assets/Cans/10.png",
      title: "ZERO ULTRA A.K.A. THE WHITE MONSTER",
    },
    {
      image: "/src/assets/Cans/6.png",
      title: "ORIGINAL LO-CARB MONSTER ENERGY",
    },
  ];

  return (
    <div className="h-fit w-full bg-black py-[10vh]">
      <div className="main h-full w-full gap-5 items-center justify-center flex flex-wrap">
        <BoxComponent className={"max-sm:w-full max-sm:h-[20vh]"} />
        <ScrollEndMessage>
        <BoxComponent image={ProductData[0].image} text={ProductData[0].title} />
        </ScrollEndMessage>
        
        <BoxComponent image={ProductData[1].image} text={ProductData[1].title} />
        <BoxComponent image={ProductData[8].image} text={ProductData[1].title} />
        <BoxComponent image={ProductData[2].image} text={ProductData[2].title} />
        <BoxComponent image={ProductData[3].image} text={ProductData[3].title} />
        <BoxComponent image={ProductData[4].image} text={ProductData[4].title} />
        <BoxComponent image={ProductData[5].image} text={ProductData[5].title} />
        <Content />
        <BoxComponent hidden={"true"} image={ProductData[6].image} text={ProductData[6].title} />
        <BoxComponent hidden={"true"} image={ProductData[7].image} text={ProductData[7].title} />
      </div>
    </div>
  );
};

export default ProductFinal;

const BoxComponent = ({ image, text, hidden, className }) => {
  const descramblerRef = useRef(null);

  return (
    <div
      className={`group ${hidden === "true" ? "max-sm:hidden" : ""} ${className} h-[40vh] w-[45vh] max-sm:h-[30vh] max-sm:w-[45%]`}
      onMouseEnter={() => descramblerRef.current && descramblerRef.current.triggerDescramble()}
    >
      {image ? (
        <div className="h-full w-full relative">
          <img className="h-full w-full object-cover" src={image} alt="" />
          <h1 className="opacity-0 w-full group-hover:opacity-100 transition-opacity duration-150 absolute text-[1.7vh] text-white bottom-0 pl-4 left-0 max-sm:pl-2">
            <DescramblerText
              ref={descramblerRef}
              className={"whitespace-nowrap max-sm:whitespace-normal max-sm:text-xs w-full h-full font-['Roboto']"}
              text={text}
              overlayClassName={"hidden"}
            />
          </h1>
        </div>
      ) : (
        <h1 className="text-3xl font-['Bebas'] text-white pt-2 max-sm:text-5xl px-2 text-center">
          Taste the difference and experience the rush with Monster.
        </h1>
      )}
    </div>
  );
};

const Content = () => {
  const descramblerRef = useRef(null);

  return (
    <div className="h-[40vh] w-[45%] text-white max-sm:w-[100%] max-sm:h-[30vh] flex justify-end py-4">
      <div className="h-full w-[100%] max-sm:w-full flex flex-col pl-4 justify-between max-sm:flex max-sm:items-center max-sm:text-center">
        <p className="text-sm w-[70%] max-sm:w-[80%] font-['Roboto'] uppercase leading-none">
          Monster Energy Drink stands out not only for its energy-boosting properties but also for its incredible taste. From the classic original flavor to the many exciting variants, there's a Monster for everyone.
        </p>
        <button className=" h-[7vh] w-fit px-3 max-sm:text-center bg-red-400 whitespace-nowrap" onMouseEnter={() => descramblerRef.current && descramblerRef.current.triggerDescramble()}>
          <DescramblerText
            ref={descramblerRef}
            className={"h-[7vh] w-[20vw]"}
            text={"GRAB YOURS"}
            textClassName={"text-3xl font-['Bebas']"}
            overlayClassName={"hidden"}
          />
        </button>
      </div>
    </div>
  );
};