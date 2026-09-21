import { ChevronLeft, Menu } from "lucide-react";
import React from "react";
import ListItem from "../ListHeader/ListItem";

interface INavBar {
  open: boolean;
  setOpen: (value: boolean) => void;
}

const NavBar = ({ open, setOpen }: INavBar) => {
  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden block  cursor-pointer"
      >
        <Menu size={28} />
      </button>
      <div
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      ></div>
      <div
        className={`fixed inset-y-0 right-0 w-[85%] max-w-sm bg-black/30 z-50 shadow-xl transition-transform duration-500 ease-in-out
            
            ${
              open ? "translate-x-0" : "translate-x-full"
            } flex flex-col h-full `}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b ">
          <button
            className="flex items-center space-x-1 text-white hover:text-blue-600 transition-colors cursor-pointer"
            onClick={() => setOpen(false)}
          >
            <ChevronLeft size={35} />
            <span className="font-medium ">Trở Lại</span>
          </button>
        </div>
        <div className="flex flex-col gap-5">
          <ListItem />
        </div>
      </div>
    </>
  );
};

export default NavBar;
