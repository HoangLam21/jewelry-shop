"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import "@fortawesome/fontawesome-svg-core/styles.css";
import Image from "next/image";
import { sidebarLinks } from "@/constants";
import { usePathname } from "next/navigation";
import Theme from "../navbar/Theme";
import { Icon } from "@iconify/react/dist/iconify.js";
import { SignedIn, useUser } from "@clerk/nextjs";
import AdminUserButton from "@/components/auth/AdminUserButton";

const Sidebar = () => {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    if (!isLoaded || !user) {
      setUserName("");
      return;
    }

    // Ưu tiên lấy từ Clerk user (firstName + lastName)
    if (user.firstName || user.lastName) {
      const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
      if (fullName) {
        setUserName(fullName);
        return;
      }
    }

    // Fallback: Lấy từ localStorage userData (cho customer)
    try {
      const userDataStr = localStorage.getItem("userData");
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        if (userData.fullName) {
          setUserName(userData.fullName);
          return;
        }
      }
    } catch (error) {
      console.error("[Sidebar] Error parsing userData:", error);
    }

    // Fallback cuối cùng: dùng email hoặc username
    if (user.emailAddresses?.[0]?.emailAddress) {
      setUserName(user.emailAddresses[0].emailAddress.split("@")[0]);
    } else if (user.username) {
      setUserName(user.username);
    } else {
      setUserName("User");
    }
  }, [user, isLoaded]);

  return (
    <nav className=" h-screen z-50 w-64 p-6 fixed">
      <div className="flex flex-col items-center gap-4 ">
        <div className="w-[70px] h-[70px] flex items-center justify-center">
          <SignedIn>
            <AdminUserButton />
          </SignedIn>
        </div>

        <Link href="/" className="text-dark400_primary100">
          <p className="hidden md:block text-center text-sm font-medium">
            {userName || "ALPACA"}
          </p>
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
