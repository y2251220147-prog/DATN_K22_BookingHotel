"use client";

import { useState } from "react";
import Link from "next/link";
import NavBar from "./NavBar";
import Image from "next/image";
import ListItem from "../ListHeader/ListItem";

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Navigation */}
      <header className="bg-linear-to-br from-blue-500/10 to-teal-800/90  border-b border-white/10 hidden md:block">
        <div className=" mx-auto px-4 py-1.5 ">
          <nav className="flex items-center gap-4">
            {/* Logo */}
            <div className="text-white text-xl font-bold  2xl:mx-20">
              <Link href={"/"}>
                <Image
                  alt="Logo"
                  src={"/image/logo.png"}
                  width={80}
                  height={80}
                  priority
                  className="object-contain"
                />
              </Link>
            </div>

            <ListItem />
          </nav>
        </div>
      </header>
      <div className="flex justify-between items-center px-4 py-0.5 md:hidden bg-linear-to-br from-blue-500/10 to-teal-800/90 border-b border-white/10">
        {/* Logo */}
        <Link href={"/"}>
          <Image
            alt="Logo"
            src={"/image/logo.png"}
            width={80}
            height={80}
            priority
            className="object-contain"
          />
        </Link>

        {/* Mobile NavBar (hamburger menu) */}
        <NavBar open={open} setOpen={setOpen} />
      </div>
    </>
  );
};

export default Header;
