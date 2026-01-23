"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { Sheet, SheetClose } from "@/components/ui/sheet";
import { navbarLinks } from "@/constants";
import { usePathname } from "next/navigation";
import Theme from "./Theme";
import MobileNav from "./MobileNav";
import UserModal from "@/components/form/user/UserModal";
import { fetchProducts } from "@/lib/services/product.service";
import SearchModal from "@/components/form/search/SearchModal";
import { ShoppingCart, Search, User } from "lucide-react";

import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import SafeUserButton from "@/components/auth/SafeUserButton";

const Navbar = () => {
  const pathname = usePathname();
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [productsData, setProductsData] = useState<any[]>([]);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        setUser(parsedData);
      } catch (error) {
        console.error("Failed to parse user data from localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const getAllProducts = async () => {
      try {
        const data = await fetchProducts();
        if (isMounted) {
          setProductsData(data);
        }
      } catch (error) {
        console.error("Error loading posts:", error);
      }
    };
    getAllProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <nav className="flex-between background-light700_dark300 fixed z-50 h-[79px] w-full gap-5 border-b p-6 dark:border-transparent sm:px-5">
      <Link href="/" className="flex items-center gap-1 pl-5">
        <p className="text-dark100_light500 text-3xl jost">JewelryStore</p>
        <p className="text-primary-100 text-3xl">.</p>
      </Link>

      {/* Sidebar links */}
      <div className="hidden w-auto sm:flex ml-[15%]">
        <Sheet>
          {navbarLinks.map((item) => {
            const isActive = pathname === item.route;
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
                  <p className={`${isActive ? "font-medium" : ""}`}>
                    {item.label}
                  </p>
                </Link>
              </SheetClose>
            );
          })}
        </Sheet>
      </div>

      <div className="flex-between w-auto pr-5 gap-4">
        <Theme />

        {/* Search Icon - Lucide */}
        <button
          onClick={() => setIsSearchModalOpen(true)}
          className="cursor-pointer"
          aria-label="Search"
        >
          <Search className="w-5 h-5 text-dark100_light500 hover:text-primary-100 transition-colors" />
        </button>

        {isSearchModalOpen && (
          <SearchModal
            onClose={() => setIsSearchModalOpen(false)}
            productsData={productsData}
          />
        )}

        {/* Auth Buttons */}
        <SignedIn>
          <SafeUserButton />
        </SignedIn>
        <SignedOut>
          <SignInButton>
            <div className="text-dark100_light500 text-[16px] font-medium cursor-pointer hover:text-primary-100 transition-colors">
              Login
            </div>
          </SignInButton>
        </SignedOut>

        {/* User Icon - Lucide */}
        {/* <button
          onClick={() => setIsUserModalOpen(true)}
          className="cursor-pointer"
          aria-label="User menu"
        >
          <User className="w-5 h-5 text-dark100_light500 hover:text-primary-100 transition-colors" />
        </button>

        <UserModal
          isOpen={isUserModalOpen}
          onClose={() => setIsUserModalOpen(false)}
        /> */}

        {/* Cart Icon - Lucide */}
        <Link
          href="/cart"
          className="cursor-pointer relative"
          aria-label="Shopping cart"
        >
          <ShoppingCart className="w-5 h-5 text-dark100_light500 hover:text-primary-100 transition-colors" />
        </Link>
        {/* Mobile Menu */}
        <div className="flex w-auto sm:hidden">
          <MobileNav />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
