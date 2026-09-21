"use client";
import { Button } from "@/components/ui/button";
import { User, Users, Crown } from "lucide-react";

const ItemButton = [
  {
    label: "Phòng Đơn",
    value: "Phòng Đơn",
    icon: User,
    gradient: "from-blue-500 to-cyan-500",
    hoverGradient: "from-blue-600 to-cyan-600",
  },
  {
    label: "Phòng Đôi",
    value: "Phòng Đôi",
    icon: Users,
    gradient: "from-emerald-500 to-teal-500",
    hoverGradient: "from-emerald-600 to-teal-600",
  },
  {
    label: "Phòng Vip",
    value: "Phòng Vip",
    icon: Crown,
    gradient: "from-amber-500 to-orange-500",
    hoverGradient: "from-amber-600 to-orange-600",
  },
];

interface IButton {
  setTypeRoom: (value: string) => void;
  typeRoom: string;
}

const ButtonSelectType = ({ setTypeRoom, typeRoom }: IButton) => {
  return (
    <div className="flex gap-4 items-center justify-center py-6 px-3  ">
      <div className=" flex  md:gap-3 bg-white/80 backdrop-blur-sm rounded-2xl  shadow-lg border border-gray-200/50">
        {ItemButton.map((item) => {
          const IconComponent = item.icon;
          const isSelected = item.value === typeRoom;

          return (
            <Button
              key={item.value}
              variant="ghost"
              className={`
                relative overflow-hidden group transition-all duration-300 ease-out
                px-4 md:px-6 py-3 md:py-6 rounded-xl font-medium text-sm
                ${
                  isSelected
                    ? `bg-linear-to-r ${item.gradient} text-white shadow-lg scale-105 transform`
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                }
              `}
              onClick={() => setTypeRoom(item.value)}
            >
              {/* Background gradient overlay for hover effect */}
              <div
                className={`
                absolute inset-0 bg-linear-to-r ${item.hoverGradient} 
                opacity-0 group-hover:opacity-100 transition-opacity duration-300
                ${isSelected ? "opacity-0" : ""}
              `}
              />

              {/* Content */}
              <div className="relative flex items-center gap-2 z-10 ">
                <div className="hidden md:block ">
                  <IconComponent
                    className={`
                  w-4 h-4 transition-all duration-300
                  ${
                    isSelected
                      ? "text-white"
                      : "text-gray-500 group-hover:text-white"
                  }
                `}
                  />
                </div>
                <span
                  className={`
                  transition-all duration-300
                  ${
                    isSelected
                      ? "text-white font-semibold"
                      : "group-hover:text-white"
                  }
                `}
                >
                  {item.label}
                </span>
              </div>

              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white/30 rounded-full" />
              )}

              {/* Ripple effect */}
              <div className="absolute inset-0 rounded-xl opacity-0 group-active:opacity-20 bg-white transition-opacity duration-150" />
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default ButtonSelectType;
