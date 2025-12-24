import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const featuresData = [
  {
    id: 1,
    icon: "mdi:cart-outline",
    title: "FREE DELIVERY",
    description: "Consectetur adipi elit lorem ipsum dolor sit amet.",
  },
  {
    id: 2,
    icon: "simple-line-icons:badge",
    title: "QUALITY GUARANTEE",
    description: "Dolor sit amet orem ipsu mcons ectetur adipi elit.",
  },
  {
    id: 3,
    icon: "mdi-light:tag",
    title: "DAILY OFFERS",
    description: "Amet consectetur adipi elit loreme ipsum dolor sit.",
  },
  {
    id: 4,
    icon: "ion:shield-checkmark-outline",
    title: "100% SECURE PAYMENT",
    description: "Rem Lopsum dolor sit amet, consectetur adipi elit.",
  },
];

const swiper = () => {
  return (
    <div className="flex justify-around mt-[150px]">
      {featuresData.map((feature) => (
        <div key={feature.id} className="flex">
          <div className="mt-1 mr-2">
            <Icon icon={feature.icon} className="size-7 text-primary-100" />
          </div>
          <div>
            <h3 className="feature-title jost text-[20px] font-normal w-[247px] text-dark100_light500">
              {feature.title}
            </h3>
            <p className="w-[247px] font-light text-[16px] text-dark450_light850">
              {feature.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default swiper;