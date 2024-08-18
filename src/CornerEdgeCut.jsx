import React from 'react';

const CornerEdgeCut = () => {
  return (
    <div className="relative w-full h-screen bg-black flex items-center justify-center text-white">
      <div className="text-center">
        <h1 className="text-4xl">THANKS FOR SCROLLING</h1>
        <div className="mt-4">
          <div className="barcode"></div>
        </div>
      </div>
      <div className="corner top-0 left-0"></div>
      <div className="corner top-0 right-0"></div>
      <div className="corner bottom-0 left-0"></div>
      <div className="corner bottom-0 right-0"></div>
    </div>
  );
};

export default CornerEdgeCut;
