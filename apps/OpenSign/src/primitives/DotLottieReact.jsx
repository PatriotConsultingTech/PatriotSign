import React from "react";
import Loader from "./Loader";

// Local spinner used in place of the remote Lottie animation.
const LottieWithLoader = () => {
  return (
    <div className="w-[120px] h-[120px] md:w-[200px] md:h-[200px] mx-auto flex items-center justify-center">
      <Loader />
    </div>
  );
};

export default LottieWithLoader;
