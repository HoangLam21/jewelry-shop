import { useRouter } from "next/navigation";
import React from "react";

const Collections = () => {
  const router = useRouter();

  // Function to handle navigation
  const handleNavigate = (collectionName: string) => {
    router.push(`/collection/${collectionName.toLowerCase()}`);
  };
  return (
    <div className="mt-[150px] mx-auto bg-[#EDF1F3] dark:bg-dark-200 pb-16">
      <div className="flex w-[95%] mx-auto pt-2">
        <p className="jost text-[30px] font-normal text-dark100_light500">
          COLLECTIONS
        </p>
      </div>

      <div className="flex flex-wrap gap-[22px] justify-center w-full mx-auto">
        <div className="w-full flex justify-center">
          <div className="flex justify-center items-center w-[522px] h-[200px] bg-white dark:bg-dark-400">
            <div
              onClick={() => handleNavigate("spring")}
              className="w-[502px] cursor-pointer h-[180px] relative bg-[#EDF1F3] dark:bg-dark-200 flex justify-center items-center group"
            >
              <span className="text-dark100_light500 jost text-4xl group-hover:opacity-0 transition-opacity duration-300">
                Spring<span className="text-primary-100 text-3xl">.</span>
              </span>
              <img
                src="https://i.pinimg.com/736x/aa/28/a4/aa28a40a8548353ab3c8f1013bfcddfd.jpg"
                alt="Spring"
                className="absolute top-0 left-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          </div>
          <div className="flex justify-center items-center w-[522px] ml-[22px] h-[200px] bg-white dark:bg-dark-400">
            <div
              onClick={() => handleNavigate("summer")}
              className="w-[502px] cursor-pointer h-[180px] relative bg-[#EDF1F3] dark:bg-dark-200 flex justify-center items-center group"
            >
              <span className="text-dark100_light500 jost text-4xl group-hover:opacity-0 transition-opacity duration-300">
                Summer<span className="text-primary-100 text-3xl">.</span>
              </span>
              <img
                src="https://i.pinimg.com/736x/b9/d5/68/b9d5685caf6af544eadbdbad1fa438fa.jpg"
                alt="Summer"
                className="absolute top-0 left-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          </div>
        </div>

        <div className="w-full flex justify-center">
          <div className="flex justify-center items-center w-[522px] h-[200px] bg-white dark:bg-dark-400">
            <div
              onClick={() => handleNavigate("autumn")}
              className="w-[502px] cursor-pointer h-[180px] relative bg-[#EDF1F3] dark:bg-dark-200 flex justify-center items-center group"
            >
              <span className="text-dark100_light500 jost text-4xl group-hover:opacity-0 transition-opacity duration-300">
                Autumn<span className="text-primary-100 text-3xl">.</span>
              </span>
              <img
                src="https://i.pinimg.com/736x/bb/8d/53/bb8d53497b7bc15cc4b6d32dc72545a7.jpg"
                alt="Autumn"
                className="absolute top-0 left-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          </div>

          <div className="flex justify-center items-center w-[522px] ml-[22px] h-[200px] bg-white dark:bg-dark-400">
            <div
              onClick={() => handleNavigate("winter")}
              className="w-[502px] cursor-pointer h-[180px] relative bg-[#EDF1F3] dark:bg-dark-200 flex justify-center items-center group"
            >
              <span className="text-dark100_light500 jost text-4xl group-hover:opacity-0 transition-opacity duration-300">
                Winter<span className="text-primary-100 text-3xl">.</span>
              </span>
              <img
                src="https://i.pinimg.com/736x/39/ff/69/39ff69c18e7a2d059dc355794001c466.jpg"
                alt="Winter"
                className="absolute top-0 left-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collections;