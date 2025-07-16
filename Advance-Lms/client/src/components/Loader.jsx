import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="relative w-12 h-12">
        {/* Outer ring */}
        <div className="absolute w-full h-full rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
        {/* Inner ring */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-4 border-blue-300 border-b-transparent animate-spin animation-delay-200"></div>
        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-600"></div>
      </div>
    </div>
  );
};

export default Loader;
