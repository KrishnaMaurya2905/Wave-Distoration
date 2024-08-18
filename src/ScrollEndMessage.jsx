import React from 'react';


const ScrollEndMessage = ({children}) => {
  return (
    <div className="relative  text-white p-4">
      <div className="border-effect top-0 left-0"></div>
      <div className="border-effect top-0 right-0"></div>
      <div className="border-effect bottom-0 left-0"></div>
      <div className="border-effect bottom-0 right-0"></div>
      <div className="flex flex-col items-center">
        {children}
      </div>
    </div>
  );
}

export default ScrollEndMessage;

