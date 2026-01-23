"use client";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import Image from "next/image";
import { navbarLinks } from "@/constants";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import { ShoppingCart } from "lucide-react";

const NavContent = () => {
  const pathname = usePathname();
  return (
    <section className="flex h-full flex-col gap-4 pt-16">
      {navbarLinks.map((item) => {
        const isActive =
          (pathname?.includes(item.route) && item.route.length > 1) ||
          pathname === item.route;

        return (
          <SheetClose asChild key={item.route}>
            <Link
              href={item.route}
              className={`${
                isActive
                  ? "text-primary-100 rounded-lg"
                  : "text-dark100_light500"
              } text-[13px] w-[120px] font-medium flex h-[40px] items-center justify-center gap-4 bg-transparent p-4`}
            >
              <p className={`${isActive ? "font-medium" : "font-medium"}`}>
                {item.label}
              </p>
            </Link>
          </SheetClose>
        );
      })}
    </section>
  );
};

const MobileNav = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Image
          src="/assets/icons/hamburger.svg"
          alt="menu"
          width={30}
          height={30}
          className="invert-colors ml-3 sm:hidden"
        />
      </SheetTrigger>
      <SheetContent
        side="left"
        className="bg-white dark:bg-dark-300 border-none"
      >
        <Link href="/" className="flex items-center gap-1 pl-5">
          <p className="text-dark100_light500 text-3xl logo">JewelryStore</p>
          <p className="text-primary-100 text-3xl">.</p>
        </Link>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-4">
          <SheetClose asChild>
            <Link
              href="/cart"
              className="flex items-center justify-center gap-3 rounded-xl bg-primary-100 text-white py-3 font-medium hover:bg-primary-200 transition"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Cart</span>
            </Link>
          </SheetClose>
        </div>
        <div>
          <SheetClose asChild>
            <NavContent />
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
