import React, { useRef, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import DescramblerText from './DescramblerText';

const Vision = () => {
  const { ref: helloRef, inView: helloInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const leftDescramblerRef = useRef(null);
  const rightDescramblerRef = useRef(null);

  useEffect(() => {
    if (helloInView) {
      leftDescramblerRef.current && leftDescramblerRef.current.triggerDescramble();
      rightDescramblerRef.current && rightDescramblerRef.current.triggerDescramble();
    }
  }, [helloInView]);

  return (
    <div className="bg-black h-screen w-full text-white px-8 py-4">
      <div className="h-[70%] flex flex-col justify-between items-center max-sm:justify-normal max-sm:gap-20">
        <span className="inline-block px-5 py-1 border border-white rounded-xl text-xs tracking-wider max-sm:mt-5">
          OUR MISSION
        </span>
        <h1 className="text-[#90eb40]  text-8xl leading-[12vh] font-['Defused'] text-center max-sm:text-6xl">
          UNLEASH THE<br />
          <span className="text-white font-['Defused']">BEAST WITHIN</span>
        </h1>
        <p className="text-xl w-[60%] font-['Roboto'] text-center max-sm:text-lg max-sm:w-[92%]">
          / EXPERIENCE THE POWER TO GO <br /> BEYOND YOUR LIMITS WITH EVERY CAN OF MONSTER ENERGY, <br /> FUELING YOUR INNER DRIVE AND UNLEASHING UNSTOPPABLE ENERGY /
        </p>
      </div>
      <div
        ref={helloRef}
        className="hello mt-28 max-sm:mt-5 h-[30%] w-full flex justify-between text-xs"
      >
        <div className="w-[20%] max-sm:w-[40%] overflow-hidden  inline">
          <DescramblerText
            ref={leftDescramblerRef}
            text="INCLUDING A WIDE RANGE OF FLAVORS, ENERGY BOOSTING FORMULAS, AND THE ICONIC MONSTER SPIRIT TO ENERGIZE YOUR DAY"
            className="font-['Roboto'] w-full h-full text-left "
            textClassName=" text-xs "
            overlayClassName="hidden"
          />
          
        </div>
        <div className="w-[20%] text-right max-sm:w-[40%] overflow-hidden inline ">
          <DescramblerText
            ref={rightDescramblerRef}
            text="WE COMMIT TO PROVIDING HIGH-QUALITY ENERGY DRINKS TO HELP YOU CONQUER ANY CHALLENGE AND LIVE LIFE TO THE FULLEST"
            className="font-['Roboto'] "
            textClassName="text-xs "
            overlayClassName="hidden"
          />
        </div>
      </div>
    </div>
  );
};

export default Vision;