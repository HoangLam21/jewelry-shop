"use client";
import Footer from "@/components/shared/footer/Footer";
import Navbar from "@/components/shared/navbar/Navbar";
import Sidebar from "@/components/shared/sidebar/Sidebar";
import { usePathname } from "next/navigation";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  const links = isAdmin ? true : false;
  return (
    <main className="background-light800_dark400 relative overflow-x-hidden w-screen h-screen">
      {links ? (
        <>
          <div className=" bg-white">
            <Sidebar />
          </div>

          <div className={` ml-64 `}>
            <section className="h-screen w-full   ">
              <div className="">{children}</div>
            </section>
          </div>
        </>
      ) : (
        <>
          <Navbar />
          <div className="flex flex-col h-full">
            <section className="flex flex-1 mt-[80px] pb-16">
              <div className="mx-auto w-full">{children}</div>
            </section>
            <Footer />
          </div>
        </>
      )}
    </main>
  );
};

export default Layout;
