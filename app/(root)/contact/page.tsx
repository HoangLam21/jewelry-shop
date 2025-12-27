import Image from "next/image";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import React from "react";

export default function Page() {
  return (
    <div className="text-dark100_light500">
      <div className="bg-[#EDF1F3]  dark:bg-dark-200 h-[250px] flex justify-center items-center">
        <div>
          <h1 className="text-dark100_light500 font-light text-[84px]">
            CONTACT
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
            <Link href="/contact">
              <span className="text-primary-100">Contact</span>
            </Link>
          </div>
        </div>
      </div>
      {/* <div className="lg:flex mx-5 block justify-between items-center p-10">
        <div className="lg:w-1/2 w-full space-y-6">
          <h2 className="text-[30px] jost font-normal">CHAT WITH STAFF</h2>
          <p>
            For product inquiries or any questions, feel free to reach out to us
            directly!
          </p>
        </div>

        <div className="lg:w-1/2 w-full space-y-6">
          <div className="border w-[80%] h-[800px] rounded-lg border-gray-200"></div>
        </div>
      </div> */}
      <div className="lg:flex mx-5 mt-10 block justify-between p-10">
        <div className="lg:w-1/2 w-full space-y-6">
          <h2 className="text-[30px] jost font-normal">CONTACT INFO</h2>
          <p>
            Tortor dignissim convallis aenean et tortor at risus viverra
            adipiscing.
          </p>

          <div className="lg:flex block">
            <div className="space-y-3">
              <h3 className="font-nomal jost text-[20px] underline">OFFICE</h3>
              <p className="font-normal text-[16px] pt-2">
                730 Glenstone Ave 65802, Springfield, US
              </p>
              <p className="font-normal text-[16px]">+123 222 333 44</p>
              <p className="font-normal text-[16px]">+123 666 777 88</p>
              <p className="font-normal text-[16px]">ministore@yourinfo.com</p>
            </div>
            <div className="space-y-3 lg:ml-5">
              <h3 className="font-nomal jost text-[20px] underline">
                MANAGEMENT
              </h3>
              <p className="font-normal text-[16px] pt-2">
                730 Glenstone Ave 65802, Springfield, US
              </p>
              <p className="font-normal text-[16px]">+123 222 333 44</p>
              <p className="font-normal text-[16px]">+123 666 777 88</p>
              <p className="font-normal text-[16px]">ministore@yourinfo.com</p>
            </div>
          </div>
        </div>

        <div className="lg:w-1/2 w-full space-y-6">
          <h2 className="text-[30px] jost font-normal">ANY QUESTIONS?</h2>
          <p>Use the form below to get in touch with us.</p>

          <form className="space-y-4">
            <div>
              {/* <label htmlFor="full-name" className="block text-sm">
                Your full name *
              </label> */}
              <input
                type="text"
                id="full-name"
                placeholder="Enter your full name"
                className="w-full p-3 border border-gray-300 rounded-none"
                required
              />
            </div>
            <div>
              {/* <label htmlFor="email" className="block text-sm">
                Write your email here *
              </label> */}
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="w-full p-3 border border-gray-300 rounded-none"
                required
              />
            </div>
            <div>
              {/* <label htmlFor="phone" className="block text-sm">
                Phone number
              </label> */}
              <input
                type="tel"
                id="phone"
                placeholder="Enter your phone number"
                className="w-full p-3 border border-gray-300 rounded-none"
              />
            </div>
            <div>
              {/* <label htmlFor="subject" className="block text-sm">
                Write your subject here
              </label> */}
              <input
                type="text"
                id="subject"
                placeholder="Enter the subject"
                className="w-full p-3 border border-gray-300 rounded-none"
              />
            </div>
            <div>
              {/* <label htmlFor="message" className="block text-sm">
                Write your message here *
              </label> */}
              <textarea
                id="message"
                placeholder="Write your message"
                className="w-full p-3 border border-gray-300 rounded-none"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-primary-100 text-white py-2 px-6 rounded-none"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
      <div className="lg:flex mx-5 block justify-between items-center p-10 mt-10">
        <div className="lg:w-1/2 w-full space-y-6">
          <Image
            src="/assets/images/d1c6a1dc3661feb5c2e1be79bdb0a6e8 (1).jpg"
            alt=""
            width={640}
            height={529}
            className="w-[640px] h-[529px] object-cover"
          />
        </div>
        <div className="lg:w-1/2 w-full space-y-6">
          <h2 className="text-[30px] jost font-normal">OUR STORES</h2>
          <p>You can also directly buy products from our stores.</p>

          <div className="lg:flex block">
            <div className="space-y-3">
              <h3 className="font-nomal jost text-[20px] underline">USA</h3>
              <p className="font-normal text-[16px] pt-2">
                730 Glenstone Ave 65802, Springfield, US
              </p>
              <p className="font-normal text-[16px]">+123 222 333 44</p>
              <p className="font-normal text-[16px]">+123 666 777 88</p>
              <p className="font-normal text-[16px]">ministore@yourinfo.com</p>
            </div>
            <div className="space-y-3 lg:ml-5">
              <h3 className="font-nomal jost text-[20px] underline">FRANCE</h3>
              <p className="font-normal text-[16px] pt-2">
                730 Glenstone Ave 65802, Springfield, US
              </p>
              <p className="font-normal text-[16px]">+123 222 333 44</p>
              <p className="font-normal text-[16px]">+123 666 777 88</p>
              <p className="font-normal text-[16px]">ministore@yourinfo.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
