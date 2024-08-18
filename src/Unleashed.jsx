// import React from "react";
// import LocomotiveScroll from 'locomotive-scroll';

// const locomotiveScroll = new LocomotiveScroll();

// const Unleashed = () => {

//   const unleashedData = [
//     [
//       {
//         Date: "ijsdhisuj",
//         UnleashedCategory: "fgfgdfgdfg",
//         Description: "fgdfyhrt",
//         img: "https://web-assests.monsterenergy.com/mnst/5451e4e0-7ff6-4cbb-8d76-79a8b6d4c3ae.webp",
//       },
//       {
//         Date: "ijsdhisuj",
//         UnleashedCategory: "fgfgdfgdfg",
//         Description: "fgdfyhrt",
//         img: "https://web-assests.monsterenergy.com/mnst/5451e4e0-7ff6-4cbb-8d76-79a8b6d4c3ae.webp",
//       },
//       {
//         Date: "ijsdhisuj",
//         UnleashedCategory: "fgfgdfgdfg",
//         Description: "fgdfyhrt",
//         img: "https://web-assests.monsterenergy.com/mnst/5451e4e0-7ff6-4cbb-8d76-79a8b6d4c3ae.webp",
//       },
//       {
//         Date: "ijsdhisuj",
//         UnleashedCategory: "fgfgdfgdfg",
//         Description: "fgdfyhrt",
//         img: "https://web-assests.monsterenergy.com/mnst/5451e4e0-7ff6-4cbb-8d76-79a8b6d4c3ae.webp",
//       },
//     ],
//     [
//       {
//         Date: "ijsdhisuj",
//         UnleashedCategory: "fgfgdfgdfg",
//         Description: "fgdfyhrt",
//       },
//       {
//         Date: "ijsdhisuj",
//         UnleashedCategory: "fgfgdfgdfg",
//         Description: "fgdfyhrt",
//       },
//       {
//         Date: "ijsdhisuj",
//         UnleashedCategory: "fgfgdfgdfg",
//         Description: "fgdfyhrt",
//       },
//       {
//         Date: "ijsdhisuj",
//         UnleashedCategory: "fgfgdfgdfg",
//         Description: "fgdfyhrt",
//       },
//     ],
//   ];
//   return (
//     <div className="w-full bg-black h-fit flex items-center p-5 justify-center ">
//       {unleashedData.map((item, index) => (
//         <UnleashedXCol key={index} item={item} index={index} />
//       ))}
//     </div>
//   );
// };

// const UnleashedXCol = ({ item, index }) => {
//   return (
//     <div
//       className={`w-[49%] flex gap-2 ${
//         index === 1 ? "flex-col-reverse " : "flex-col"
//       } h-full`}
//     >
//       <div className="h-[40vh] bg-white w-full"></div>
//       {item.map((data, idx) => (
//         <div
//           className={`w-full py-10 px-14 h-[70vh] flex flex-col justify-between border-[#5c5c5c] overflow-hidden ${
//             index === 1 ? "border-x-[1px]" : "border-l-[1px]"
//           } border-b-[1px] bg-black scale-[1.01] rounded-sm`}
//         >
//           <div className="w-full h-[20%]"></div>
//           <div className="w-full h-[70%] overflow-hidden bg-red-200 rounded-lg ">
//             <img data-scroll data-scroll-speed='.5' className="w-full h-full object-cover" src={data.img} alt="" />
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Unleashed;

import React, { useEffect, useState } from "react";
import LocomotiveScroll from "locomotive-scroll";
import MouseFlowmapDeformation from "./MouseFlowDeformation";
const Unleashed = () => {
  const unleashedData = [
    [
      {
        Date: "08.07.24",
        UnleashedCategory: "MOTOR / 2-WHEEL",
        Description: "Hymas On Top",
        img: "https://web-assests.monsterenergy.com/mnst/1e98d39c-e38b-4877-8ddc-1a4eaecafeac.webp",
      },
      {
        Date: "28.05.24",
        UnleashedCategory: "ACTION / SKATEBOARD",
        Description: "Nyjah Back On Top",
        img: "https://web-assests.monsterenergy.com/mnst/dd95a9f5-4479-4b8c-ae96-3735acf51ebc.webp",
      },
      {
        Date: "02.05.22",
        UnleashedCategory: "MUSIC",
        Description: "BTS of GuapDad 4000's 'Black Iverson' Video",
        img: "https://web-assests.monsterenergy.com/mnst/264bc9a1-c18c-4937-a37d-12e1c783c812.webp",
      },
      {
        Date: "26.01.24",
        UnleashedCategory: "GAMING",
        Description:
          "How Team Liquid Brazil Came Together And Became A Top Game Changers Team",
        img: "https://web-assests.monsterenergy.com/mnst/9bce0ebe-5681-403d-8738-cf6ff4a5b34e.webp",
      },
    ],
    [
      {
        Date: "03.06.24",
        UnleashedCategory: "MMA",
        Description: "Sean Strickland Defeats Paulo Costa at UFC 302",
        img: "https://web-assests.monsterenergy.com/mnst/38245f09-5599-4fd0-a82d-939a741500c4.webp",
      },
      {
        Date: "31.05.24",
        UnleashedCategory: "LIFESTYLE",
        Description: "Rehab Monster Green Tea Launch",
        img: "https://web-assests.monsterenergy.com/mnst/b39100f8-7b09-4b17-8f46-f53f833d2d83.webp",
      },
      {
        Date: "29.01.18",
        UnleashedCategory: "GIRLS",
        Description:
          "Ready to kick off the fourth and final day of XGames Aspen 2018!",
        img: "/80893511_3680770891933812_267621326668164855_n.jpg",
      },
      {
        Date: "02.07.24",
        UnleashedCategory: "GAMING",
        Description: "The Golden Road: A Path Paved by Legends",
        img: "https://web-assests.monsterenergy.com/mnst/78ea620e-393a-4e90-bb77-2bdac2803ccb.webp",
      },
    ],
  ];

  const [loadMoreUnleashed, setLoadMoreUnleashed] = useState(true);

  useEffect(() => {
    const scroll = new LocomotiveScroll({
      el: document.querySelector("[data-scroll-container]"),
      smooth: true,
      lerp: 0.01,
      multiplier: 10.5,
    });

    return () => {
      scroll.destroy();
    };
  }, []);

  return (
    <div
      data-scroll-container
      className="w-full bg-black  h-fit flex max-md:flex-col items-center p-5 max-sm:p-0 justify-center"
    >
      {unleashedData.map((item, index) => (
        <UnleashedXCol
          key={index}
          item={item}
          index={index}
          loadMoreUnleashed={loadMoreUnleashed}
        />
      ))}
      <div
        onClick={() => {
          setLoadMoreUnleashed((prev) => !prev);
        }}
        className="w-[10%]  md:hidden h-[5vh] "
      ></div>
    </div>
  );
};

const UnleashedXCol = ({ item, index, loadMoreUnleashed }) => {
  return (
    <div
      className={`w-[49%]  max-md:w-full flex gap-0 ${
        index === 1 ? "flex-col-reverse " : "flex-col"
      } ${index === 1 && loadMoreUnleashed ? "max-md:hidden" : ""} h-full`}
    >
      <div
        className={`h-[50vh] w-full ${index === 1 ? "max-md:hidden" : ""}`}
      ></div>
      {item.map((data, idx) => (
        <div
          key={idx}
          className={`unleashed-container hover:bg-[#3ae1142d] w-full py-10 px-14 max-md:px-5 text-white max-md:h-[65vh] h-[80vh] flex flex-col justify-between border-[#292929b2] overflow-hidden ${
            index === 1 ? "border-x-[1px]" : "md:border-l-[1px]"
          } ${
            idx === 0 ? "border-t-[1px]" : ""
          } border-b-[1px] bg-black scale-1`}
        >
          <div className="w-full h-[20%]">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-['roboto'] ">{data.Date}</h3>
              <h4 className="text-sm w-[40%]">{data.UnleashedCategory}</h4>
            </div>
            <p className=" mt-3 max-sm:text-sm w-[70%]">{data.Description}</p>
          </div>
          <div
            // style={{
            //   clipPath:
            //     " polygon(23% 0, 27% 8%, 100% 8%, 100% 100%, 0 100%, 0% 60%, 0 0)",
            // }}
            className="w-full   h-[75%] overflow-hidden rounded-lg "
          >
            {/* <img
              data-scroll
              data-scroll-speed="-.08"
              className="w-full h-[120%] object-cover object-center"
              src={data.img}
              alt=""
            /> */}
            <MouseFlowmapDeformation/>
          
          </div>
        </div>
      ))}
    </div>
  );
};

export default Unleashed;
