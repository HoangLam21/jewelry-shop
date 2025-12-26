import FeaturesSession from "@/components/form/home/FeaturesSession";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import React from "react";

export default function Page() {
  return (
    <div>
      <div className="bg-[#EDF1F3] dark:bg-dark-200 h-[250px] flex justify-center items-center">
        <div>
          <h1 className="text-dark100_light500 font-light text-[84px]">
            ABOUT US
          </h1>
          <div className="flex justify-center items-center">
            <Link href="/">
              <span className="text-dark100_light500">Home</span>
            </Link>
            <Icon
              icon="solar:alt-arrow-right-line-duotone"
              width="24"
              height="16"
            />
            <Link href="/about-us">
              <span className="text-primary-100">About Us</span>
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-10 text-dark100_light500 px-[10%] md:px-[20%]">
        <div>
          <h2 className="text-[30px] font-bold jost text-center">WHY WE DO</h2>
          <div className="flex justify-center items-center mt-5 text-center">
            <span className="font-normal text-[16px] text-center">
              We live in a world full of stereotypes and expectations. But at
              our jewelry brand, we believe each individual is unique, and true
              beauty is reflected through confidence and connection with
              oneself. That’s why we create jewelry collections that honor not
              just outer beauty but also reflect each person's inner character.
              We believe in individuality and respect the unique values that you
              bring.
            </span>
          </div>
          <hr className="border-transparent"></hr>
          <div className="flex justify-center mt-5 items-center text-center">
            <span className="font-normal text-[16px] text-center">
              Our jewelry brand was born with the goal of inspiring people to
              express their unique identities, take pride in themselves, and
              cross any boundaries. We aspire not only to be a brand but also a
              community where everyone can find the perfect pieces to shine in
              their own way.
            </span>
          </div>
          <img
            src="/assets/images/a4cb9d7eb1a48589b594356a91d8c6b4.jpg"
            width={728}
            height={603}
            className="mx-auto mt-10"
          />
        </div>
        <div>
          <h2 className="text-[30px] font-bold jost text-center mt-10">
            WHO WE ARE
          </h2>
          <div className="flex justify-center mt-2 items-center text-center">
            <span className="font-normal text-primary-100 text-[16px] text-center">
              our Jewelry Brand – Shine Your Light
            </span>
          </div>
          <div className="flex justify-center items-center mt-5 text-center">
            <span className="font-normal text-[16px] text-center">
              We are a jewelry brand dedicated to those who appreciate
              sophistication and personalization. Our products are not merely
              jewelry items; they are symbols of personality and confidence.
              With a minimalist yet elegant design, we bring high-quality
              jewelry suitable for all ages and every style.
            </span>
          </div>
          <hr className="border-transparent"></hr>
          <div className="flex justify-center mt-5 items-center text-center">
            <span className="font-normal text-[16px] text-center">
              Our brand is more than just a jewelry label; it is a movement for
              those passionate about freely expressing themselves and living
              authentically. We value individuality in modern aesthetics and
              encourage everyone to connect and share their stories through each
              piece of jewelry.
            </span>
          </div>
          <img
            src="/assets/images/22be75da29f1ace77a99dc4738ac5fe5.jpg"
            width={728}
            height={952}
            className="mx-auto mt-10"
          />
        </div>

        <div>
          <h2 className="text-[30px] font-bold jost text-center mt-10">
            WHAT WE WANT{" "}
            <span className="text-[30px] font-bold jost text-center mt-10 text-primary-100">
              &lt; OUR MISSION &gt;
            </span>
          </h2>

          <div className="flex justify-center mt-2 items-center text-center">
            <span className="font-normal  text-[16px] text-center">
              Self-Expression: Inspiring each individual to freely express
              themselves and their unique values through each piece of jewelry.{" "}
            </span>
          </div>
          <div className="flex justify-center mt-2 items-center text-center">
            <span className="font-normal  text-[16px] text-center">
              Quality Jewelry: Providing high-quality jewelry at affordable
              prices, suitable for every style and personality.{" "}
            </span>
          </div>
          <div className="flex justify-center mt-2 items-center text-center">
            <span className="font-normal  text-[16px] text-center">
              Responsibility: Building a jewelry brand that is responsible to
              both the community and the environment.{" "}
            </span>
          </div>
        </div>
      </div>
      <div className="mb-10">
        <FeaturesSession />
      </div>
    </div>
  );
}
