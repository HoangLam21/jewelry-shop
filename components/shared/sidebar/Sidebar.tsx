"use client";
import Link from "next/link";
import React from "react";
import "@fortawesome/fontawesome-svg-core/styles.css";
import Image from "next/image";
import { sidebarLinks } from "@/constants";
import { usePathname } from "next/navigation";
import Theme from "../navbar/Theme";
import { Icon } from "@iconify/react/dist/iconify.js";

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <nav className=" h-screen z-50 w-64 p-6 fixed">
      <div className="flex flex-col items-center gap-4 ">
        <div className="w-[70px] h-[70px]">
          <Image
            src="https://i.pinimg.com/736x/62/67/33/626733cb670aff420e52442cade42e5e.jpg"
            alt="Avatar"
            width={80}
            height={80}
            priority
            className="rounded-full object-cover w-full h-full"
          />
        </div>

        <Link href="/" className="text-dark400_primary100">
          <p className="hidden md:block text-center">ALPACA</p>
        </Link>
      </div>

      <div className="flex items-center justify-center mt-4 gap-5">
        <Icon
          icon="ion:search-outline"
          className="text-2xl mt-2 mr-3 text-dark400_light600"
        />
        <Link href="/notification">
          <Icon
            icon="pepicons-pencil:bell"
            className="text-2xl mt-2 text-dark400_light600"
          />
        </Link>
      </div>

      <div className="mt-4">
        <span className="text-primary-100 font-bold text-sm">Main menu</span>
      </div>

      <div className="hidden sm:block mt-2">
        {sidebarLinks.map(({ route, icon, label }) => {
          const isActive =
            // (pathname.includes(route) && route.length > 1) ||
            pathname === route;

          return (
            <Link
              key={route}
              href={route}
              className={`flex items-center gap-4 p-4 rounded-lg h-10 ${
                isActive ? "bg-primary-100 text-white" : "text-dark400_light600"
              }`}
            >
              <Icon
                icon={icon}
                className={`text-xl ml-2 ${
                  isActive ? "text-white" : "text-dark400_light600"
                }`}
              />
              <p
                className={`${
                  isActive ? "text-white" : "text-dark400_light600"
                }`}
              >
                {label}
              </p>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Sidebar;
