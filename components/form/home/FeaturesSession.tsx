import { ShoppingCart, Award, Tag, ShieldCheck } from "lucide-react";
import React from "react";

const featuresData = [
  {
    id: 1,
    icon: ShoppingCart,
    title: "FREE DELIVERY",
    description: "Consectetur adipi elit lorem ipsum dolor sit amet.",
  },
  {
    id: 2,
    icon: Award,
    title: "QUALITY GUARANTEE",
    description: "Dolor sit amet orem ipsu mcons ectetur adipi elit.",
  },
  {
    id: 3,
    icon: Tag,
    title: "DAILY OFFERS",
    description: "Amet consectetur adipi elit loreme ipsum dolor sit.",
  },
  {
    id: 4,
    icon: ShieldCheck,
    title: "100% SECURE PAYMENT",
    description: "Rem Lopsum dolor sit amet, consectetur adipi elit.",
  },
];

const FeaturesSession = () => {
  return (
    <div className="flex flex-wrap justify-around mt-[150px] gap-6 px-4">
      {featuresData.map((feature) => (
        <div key={feature.id} className="flex max-w-[280px]">
          <div className="mt-1 mr-3 flex-shrink-0">
            <feature.icon className="w-7 h-7 text-primary-100" />
          </div>
          <div>
            <h3 className="feature-title jost text-[20px] font-normal text-dark100_light500 mb-2">
              {feature.title}
            </h3>
            <p className="font-light text-[16px] text-dark450_light850 leading-relaxed">
              {feature.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeaturesSession;
