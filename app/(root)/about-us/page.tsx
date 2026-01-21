import FeaturesSession from "@/components/form/home/FeaturesSession";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import React from "react";

export default function Page() {
  return (
    <div>
      {/* Hero Section */}
      <div className="bg-[#EDF1F3] dark:bg-dark-200 h-[250px] flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-dark100_light500 font-light text-5xl sm:text-6xl md:text-7xl lg:text-[84px]">
            ABOUT US
          </h1>
          <div className="flex justify-center items-center gap-2 mt-4">
            <Link href="/" className="hover:text-primary-100 transition-colors">
              <span className="text-dark100_light500">Home</span>
            </Link>
            <ChevronRight className="w-5 h-5 text-dark100_light500" />
            <Link href="/about-us">
              <span className="text-primary-100">About Us</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="mt-10 md:mt-16 text-dark100_light500 px-[5%] sm:px-[10%] md:px-[15%] lg:px-[20%]">
        {/* Why We Do */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold jost text-center">
            WHY WE DO
          </h2>
          <div className="flex justify-center items-center mt-5 text-center">
            <p className="font-normal text-sm sm:text-base leading-relaxed">
              We live in a world full of stereotypes and expectations. But at
              our jewelry brand, we believe each individual is unique, and true
              beauty is reflected through confidence and connection with
              oneself. That`&apos;s why we create jewelry collections that honor
              not just outer beauty but also reflect each person`&apos;s inner
              character. We believe in individuality and respect the unique
              values that you bring.
            </p>
          </div>

          <div className="flex justify-center mt-5 items-center text-center">
            <p className="font-normal text-sm sm:text-base leading-relaxed">
              Our jewelry brand was born with the goal of inspiring people to
              express their unique identities, take pride in themselves, and
              cross any boundaries. We aspire not only to be a brand but also a
              community where everyone can find the perfect pieces to shine in
              their own way.
            </p>
          </div>

          <div className="relative w-full max-w-[728px] mx-auto mt-10 aspect-[728/603]">
            <Image
              src="/assets/images/92433.jpg"
              alt="Why we do - Jewelry collection"
              fill
              className="object-cover rounded-lg shadow-lg"
              sizes="(max-width: 768px) 100vw, 728px"
            />
          </div>
        </div>

        {/* Who We Are */}
        <div className="mt-16 md:mt-20">
          <h2 className="text-2xl sm:text-3xl font-bold jost text-center">
            WHO WE ARE
          </h2>
          <div className="flex justify-center mt-2 items-center text-center">
            <p className="font-normal text-primary-100 text-sm sm:text-base">
              our Jewelry Brand – Shine Your Light
            </p>
          </div>
          <div className="flex justify-center items-center mt-5 text-center">
            <p className="font-normal text-sm sm:text-base leading-relaxed">
              We are a jewelry brand dedicated to those who appreciate
              sophistication and personalization. Our products are not merely
              jewelry items; they are symbols of personality and confidence.
              With a minimalist yet elegant design, we bring high-quality
              jewelry suitable for all ages and every style.
            </p>
          </div>

          <div className="flex justify-center mt-5 items-center text-center">
            <p className="font-normal text-sm sm:text-base leading-relaxed">
              Our brand is more than just a jewelry label; it is a movement for
              those passionate about freely expressing themselves and living
              authentically. We value individuality in modern aesthetics and
              encourage everyone to connect and share their stories through each
              piece of jewelry.
            </p>
          </div>

          <div className="relative w-full max-w-[728px] mx-auto mt-10 aspect-[728/952]">
            <Image
              src="/assets/images/123560770.avif"
              alt="Who we are - Brand identity"
              fill
              className="object-cover rounded-lg shadow-lg"
              sizes="(max-width: 768px) 100vw, 728px"
            />
          </div>
        </div>

        {/* What We Want - Our Mission */}
        <div className="mt-16 md:mt-20">
          <h2 className="text-2xl sm:text-3xl font-bold jost text-center">
            WHAT WE WANT{" "}
            <span className="text-primary-100">&lt; OUR MISSION &gt;</span>
          </h2>

          <div className="mt-8 space-y-6 max-w-3xl mx-auto">
            <div className="bg-gray-50 dark:bg-dark-300 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2 text-primary-100">
                Self-Expression
              </h3>
              <p className="font-normal text-sm sm:text-base leading-relaxed">
                Inspiring each individual to freely express themselves and their
                unique values through each piece of jewelry.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-dark-300 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2 text-primary-100">
                Quality Jewelry
              </h3>
              <p className="font-normal text-sm sm:text-base leading-relaxed">
                Providing high-quality jewelry at affordable prices, suitable
                for every style and personality.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-dark-300 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2 text-primary-100">
                Responsibility
              </h3>
              <p className="font-normal text-sm sm:text-base leading-relaxed">
                Building a jewelry brand that is responsible to both the
                community and the environment.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-16 md:mt-20 mb-10">
        <FeaturesSession />
      </div>
    </div>
  );
}
