"use client";

import { HoverCardContent } from "@/components/ui/hover-card";
import { useRoomTypeStore } from "@/hook/roomTypeStore";
import { HoverCard, HoverCardTrigger } from "@radix-ui/react-hover-card";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";

interface IListHeader {
  id: number;
  link: string;
  title: string;
  hasDropdown?: boolean;
}

interface IRoomtype {
  id: string;
  name: string;
}

const ListItems: IListHeader[] = [
  { id: 1, link: "/", title: "Trang Chủ" },
  { id: 2, link: "#", title: "Phòng", hasDropdown: true },
  { id: 3, link: "/blog", title: "Bài viết " },
  { id: 4, link: "/about", title: "Giới Thiệu" },
  { id: 5, link: "/gallery", title: "Thư Viện ảnh" },
];

const ListItem = () => {
  const pathname = usePathname();
  const { setRoomTypes } = useRoomTypeStore();
  const { data, isLoading } = useSWR(`/api/roomtype/dropdown/list`);

  useEffect(() => {
    if (data) setRoomTypes(data);
  }, [data]);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const toggleMobileDropdown = () => {
    setIsMobileDropdownOpen((prev) => !prev);
  };

  return (
    <div className="flex items-center md:flex-row flex-col text-nowrap md:space-x-2 space-y-2 md:space-y-0 w-full md:w-auto">
      {ListItems.map((item) =>
        item.hasDropdown ? (
          <div key={item.id} className="relative w-full md:w-auto ">
            {/* Desktop: HoverCard for md and larger */}
            <HoverCard>
              <HoverCardTrigger asChild className="hidden md:block">
                <div
                  className={`px-6 py-2 text-white text-base font-medium cursor-pointer hover:text-teal-500 transition-colors duration-200 ${pathname === item.link ? "bg-teal-500 rounded-full" : ""
                    }`}
                >
                  <div className="flex  items-center gap-1">
                    <p>{item.title}</p>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </HoverCardTrigger>
              <HoverCardContent
                align="center"
                className="w-85 mt-2 p-2 bg-white shadow-lg rounded-lg border hidden md:block "
              >
                {isLoading && (
                  <p className="text-gray-500 text-sm">Loading...</p>
                )}
                {data && data?.length > 0 ? (
                  <ul className="grid grid-cols-2">
                    {data?.map((item: IRoomtype) => (
                      <li key={item.id}>
                        <Link
                          href={`/rooms/${item.id}`}
                          className={`block ${pathname.startsWith(`/rooms/${item.id}`)
                            ? "text-red-500 font-semibold"
                            : ""
                            } text-gray-700 hover:bg-gray-50 p-2 rounded hover:border-l-4 text-center hover:border-amber-400 transition-all duration-150`}
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  !isLoading && (
                    <p className="text-gray-500 text-sm">No rooms available.</p>
                  )
                )}
              </HoverCardContent>
            </HoverCard>

            {/* Mobile: Clickable dropdown for sm and smaller */}
            <div className="md:hidden w-full">
              <button
                onClick={toggleMobileDropdown}
                className={`w-full px-6 py-3 text-base font-medium rounded-lg transition-colors duration-200 flex items-center justify-center ${pathname === item.link
                  ? "bg-teal-500 text-white"
                  : "text-white hover:text-teal-500 hover:bg-white/10"
                  }`}
              >
                <span>{item.title}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200  ${isMobileDropdownOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {isMobileDropdownOpen && (
                <div className="mt-2 w-full bg-white/80 shadow-lg rounded-lg border overflow-hidden">
                  {isLoading && (
                    <div className="p-4">
                      <p className="text-gray-500 text-sm">Loading...</p>
                    </div>
                  )}
                  {data && data?.length > 0 ? (
                    <ul className="grid grid-cols-2">
                      {data?.map((romType: IRoomtype) => (
                        <li key={romType.id}>
                          <Link
                            href={`/rooms/${romType.id}`}
                            className={`block ${pathname.startsWith(`/rooms/${romType.id}`)
                              ? "text-red-500 font-semibold"
                              : ""
                              } hover:bg-gray-50 px-4 text-center py-3 hover:border-l-4  transition-all duration-150`}
                            onClick={() => setIsMobileDropdownOpen(false)}
                          >
                            {romType.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    !isLoading && (
                      <div className="p-4">
                        <p className="text-gray-500 text-sm">
                          No rooms available.
                        </p>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <Link
            href={item.link}
            key={item.id}
            className={`w-full md:w-auto px-6 py-3 md:py-2 text-base font-medium rounded-lg md:rounded-full transition-colors duration-200 text-center md:text-left ${pathname === item.link
              ? "bg-teal-400/60 text-white font-bold"
              : "text-white hover:text-teal-300 hover:bg-white/10 md:hover:bg-transparent font-medium"
              }`}
          >
            {item.title}
          </Link>
        ),
      )}
    </div>
  );
};

export default ListItem;
