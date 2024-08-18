import React, { memo } from "react";
import { useInView } from "react-intersection-observer";

const Footer2Data = [
  {
    title: "Services",
    links: [
      { name: "Unleased", url: "" },
      { name: "Product", url: "" },
      { name: "Promotion", url: "" },
      { name: "Where To Buy", url: "" },
    ],
  },
  {
    title: "Follow us",
    links: [
      { name: "Youtube", url: "https://youtube.com" },
      { name: "Twitter", url: "https://twitter.com" },
      { name: "Facebook", url: "https://facebook.com" },
      { name: "Instagram", url: "https://instagram.com" },
    ],
  },
];

const Footer = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div className="relative h-[95vh] max-md:h-[90vh]" style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}>
      <div className="fixed top-[5%] h-[120vh] w-full">
        <div className="h-full absolute w-full flex flex-col gap-[2px]">
          <div className="w-full h-[100%] bg-transparent flex gap-[2px] max-md:flex-col text-white">
            <div className="left-part w-1/2 h-full max-md:h-1/2 max-md:w-full bg-black p-10 flex flex-col justify-between">
              <img className="w-fit" src="src/assets/monster-logo.webp" alt="Monster Logo" loading="lazy" />
              <h1 className="font-['Teko'] text-7xl">
                UNLEASH THE <br /> <span className="text-[#7BBD42]">BEAST</span>
              </h1>
              <h2 className="w-[65%] text-3xl py-4 font-['Teko']">
                Tear into a can of the meanest energy drink on the planet <span className="text-[#7BBD42]">Monster Energy</span>
              </h2>
            </div>
            <div className="right-part w-1/2 h-full max-md:h-1/2 max-md:w-full bg-black flex flex-col">
              <div className="w-full h-[85%] uppercase text-[1.6vw] font-['Teko'] flex justify-between px-20 py-10">
                {Footer2Data.map((section, index) => (
                  <div key={index}>
                    <h1 className="text-[#7BBD42]">{section.title.toUpperCase()}</h1>
                    <div className="pt-5">
                      {section.links.map((link, idx) => (
                        <h2 key={idx}>
                          <a href={link.url}>{link.name.toUpperCase()}</a>
                        </h2>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="h-[15%] font-['Teko'] w-full uppercase flex justify-between items-center px-10 text-[1.3vw]">
                <h1>© Monster Energy Company</h1>
                <h1>WEBSITE BY TEAM SPIR8</h1>
              </div>
            </div>
          </div>
          <div className="video-text banner w-full h-[70%] flex flex-col justify-center overflow-hidden items-center relative" ref={ref}>
            {inView && (
              <div className="w-full h-full">
                <video className="absolute inset-0 w-full h-full top-0 left-0 object-cover" loop muted autoPlay src="\monster-foooter.mp4"></video>
                <h1 className="text-center w-full font-['Teko'] text-white text-[15vw] tracking-wider absolute top-[-9vh] bg-black mix-blend-darken z-[999] hover:text-green-900 transition-all duration-300 hover:mix-blend-normal">
                  MONSTER ENERGY
                </h1>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Footer);