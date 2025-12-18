import React from "react";

const Footer = () => {
  return (
    <footer className="background-light800_dark400 py-8">
      <div className="mx-auto px-4">
        <div className="flex justify-between space-x-12">
          <div className="w-1/4">
            <div className="flex gap-1">
              <p className="text-dark100_light500 text-3xl logo">
                JewelryStore
              </p>
              <p className="text-primary-100 text-3xl">.</p>
            </div>
            <p className="text-sm mt-2 text-[#3A3A3A]">
              Nisi, purus vitae, ultrices nunc. Sit ac sit suscipit hendrerit.
              Gravida massa volutpat aenean odio erat nullam fringilla.
            </p>
          </div>

          <div className="w-1/4">
            <h3 className="font-normal text-[20px] mb-2 jost text-dark100_light500">
              QUICK LINKS
            </h3>
            <ul>
              <li>
                <a
                  href="/"
                  className="text-[14px] text-dark100_light500 font-medium hover:text-gray-400"
                >
                  HOME
                </a>
              </li>
              <li className="mt-1">
                <a
                  href="/about-us"
                  className="text-[14px] text-dark100_light500 font-medium hover:text-gray-400"
                >
                  ABOUT US
                </a>
              </li>
              <li className="mt-1">
                <a
                  href="/product"
                  className="text-[14px] text-dark100_light500 font-medium hover:text-gray-400"
                >
                  PRODUCT
                </a>
              </li>
              <li className="mt-1">
                <a
                  href="/contact"
                  className="text-[14px] text-dark100_light500 font-medium hover:text-gray-400"
                >
                  CONTACT
                </a>
              </li>
            </ul>
          </div>

          <div className="w-1/4">
            <h3 className="font-normal text-[20px] mb-2 jost text-dark100_light500">
              HELP & INFO
            </h3>
            <ul>
              <li>
                <a
                  href="#"
                  className="text-[14px] text-dark100_light500 font-medium hover:text-gray-400"
                >
                  TRACK YOUR ORDER
                </a>
              </li>
              <li className="mt-1">
                <a
                  href="#"
                  className="text-[14px] text-dark100_light500 font-medium hover:text-gray-400"
                >
                  SHIPING + DELIVERY
                </a>
              </li>
              <li className="mt-1">
                <a
                  href="#"
                  className="text-[14px] text-dark100_light500 font-medium hover:text-gray-400"
                >
                  CONTACT US
                </a>
              </li>
              <li className="mt-1">
                <a
                  href="#"
                  className="text-[14px] text-dark100_light500 font-medium hover:text-gray-400"
                >
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          <div className="w-1/4">
            <h3 className="font-normal text-[20px] mb-2 jost text-dark100_light500">
              CONTACT US
            </h3>
            <p className="text-sm mb-3 text-[#3A3A3A]">
              Do you have any queries or suggestions?
            </p>
            <p className="text-sm text-dark100_light500">yourinfo@gmail.com</p>
            <p className="text-sm mt-2 text-[#3A3A3A] ">
              If you need support? Just give us a call.
            </p>
            <p className="text-sm text-dark100_light500">+55 111 222 333 44</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
