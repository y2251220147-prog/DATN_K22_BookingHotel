/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import { Building2, Users, Sparkles } from "lucide-react";
import Image from "next/image";

// Định nghĩa kiểu dữ liệu cho tab
type TabType = "hotel" | "meeting" | "beautiful";

const HotelShow = () => {
  const [hotel, setHotel] = React.useState<TabType>("hotel");
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  const handleTabChange = (newTab: TabType) => {
    if (newTab === hotel) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setHotel(newTab);
      setIsTransitioning(false);
    }, 150);
  };

  const tabData: Record<
    TabType,
    {
      title: string;
      description: string;
      image: string;
      image1?: string;
      icon: React.ReactNode;
      gradient: string;
    }
  > = {
    hotel: {
      title: "KHÁCH SẠN",
      description:
        "Chúng tôi mang lại không gian thư giản và tiện nghi đáp ứng mọi nhu cầu cho bạn. Là khách sạn 5 sao đẳng cấp quốc tế, tọa lạc tại giao điểm của bốn quận chính, nơi được xem như trái tim và trung tâm của TP. Hồ Chí Minh. Với hệ thống phòng tiêu chuẩn và phòng hạng sang thiết kế đẹp mắt và trang nhã được chú trọng tới từng chi tiết sẽ đem lại sự tiện nghi và thoải mái tối đa cho quý khách dù là thời gian nghỉ ngơi thư giãn hay trong chuyến công tác...",
      image:
        "https://bizweb.dktcdn.net/100/472/947/themes/888072/assets/banner1_tab1.jpg?1732756636207",
      image1:
        "https://bizweb.dktcdn.net/100/472/947/themes/888072/assets/banner2_tab1.jpg?1732756636207",
      icon: <Building2 className="w-5 h-5" />,
      gradient: "from-amber-400 to-orange-500",
    },
    meeting: {
      title: "PHÒNG HỌP",
      description:
        "Không gian hội nghị chuyên nghiệp với trang thiết bị hiện đại và dịch vụ hoàn hảo. Các phòng họp được thiết kế linh hoạt, phù hợp cho mọi quy mô sự kiện từ cuộc họp nhỏ đến hội nghị lớn. Đội ngũ nhân viên chuyên nghiệp sẵn sàng hỗ trợ 24/7 để đảm bảo sự kiện của bạn diễn ra thành công tốt đẹp. Hệ thống âm thanh, ánh sáng và công nghệ tiên tiến tạo nên môi trường làm việc lý tưởng...",
      image:
        "https://bizweb.dktcdn.net/100/472/947/themes/888072/assets/banner1_tab2.jpg?1732756636207",
      image1:
        "https://bizweb.dktcdn.net/100/472/947/themes/888072/assets/banner2_tab2.jpg?1732756636207",
      icon: <Users className="w-5 h-5" />,
      gradient: "from-blue-400 to-indigo-500",
    },
    beautiful: {
      title: "LÀM ĐẸP",
      description:
        "Trung tâm spa và làm đẹp đẳng cấp với các liệu pháp chăm sóc sức khỏe và sắc đẹp toàn diện. Đội ngũ chuyên gia giàu kinh nghiệm sử dụng các sản phẩm cao cấp và công nghệ tiên tiến nhất. Không gian thư giãn yên tĩnh giúp bạn tái tạo năng lượng và lấy lại sự cân bằng. Từ massage thư giãn đến các liệu pháp chăm sóc da chuyên sâu, chúng tôi mang đến trải nghiệm làm đẹp hoàn hảo...",
      image:
        "https://bizweb.dktcdn.net/100/472/947/themes/888072/assets/banner1_tab3.jpg?1732756636207",
      image1:
        "https://bizweb.dktcdn.net/100/472/947/themes/888072/assets/banner2_tab3.jpg?1732756636207",
      icon: <Sparkles className="w-5 h-5" />,
      gradient: "from-pink-400 to-rose-500",
    },
  };

  const currentTab = tabData[hotel];

  return (
    <div className=" bg-linear-to-br from-slate-50 to-slate-100 py-4 md:py-8 ">
      <div className="flex flex-col lg:flex-row gap-5  justify-center space-x-2 mb-8  lg:max-w-6xl mx-auto">
        {(Object.keys(tabData) as TabType[]).map((tabKey) => {
          const tab = tabData[tabKey];
          const isActive = hotel === tabKey;
          return (
            <button
              key={tabKey}
              onClick={() => handleTabChange(tabKey)}
              className={`group relative px-8 py-4 rounded-2xl font-semibold uppercase tracking-wide transition-all duration-500 transform hover:scale-105 ${
                isActive
                  ? `bg-linear-to-r ${tab.gradient} text-white shadow-2xl shadow-black/20`
                  : "bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-xl border border-gray-200/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`transition-all duration-300 ${
                    isActive
                      ? "text-white"
                      : "text-gray-500 group-hover:text-gray-700"
                  }`}
                >
                  {tab.icon}
                </div>
                <span className="text-sm font-bold">
                  {tabKey === "hotel"
                    ? "Khách Sạn"
                    : tabKey === "meeting"
                      ? "Phòng Họp"
                      : "Làm Đẹp"}
                </span>
              </div>
              {isActive && (
                <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-white/20 to-transparent opacity-50"></div>
              )}
            </button>
          );
        })}
      </div>

      <div className=" mx-auto rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
        <div
          className={`transition-all duration-500 ${
            isTransitioning
              ? "opacity-0 transform translate-y-4"
              : "opacity-100 transform translate-y-0"
          }`}
        >
          <div className="flex flex-col lg:flex-row gap-8 px-1">
            <div className="flex-1 group">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <Image
                  width={700}
                  height={700}
                  src={currentTab.image || "/placeholder.svg"}
                  alt={currentTab.title}
                  className="w-full md:h-200 object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div
                  className={`absolute top-6 left-6 px-4 py-2 rounded-full bg-linear-to-r ${currentTab.gradient} text-white font-bold text-sm shadow-lg`}
                >
                  Tiện Nghi Sang Trọng
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <div className="bg-white rounded-2xl shadow-xl py-10 p-2 border border-gray-100 relative overflow-hidden h-full lg:h-150">
                <div
                  className={`absolute top-0 left-0 w-full h-1 bg-linear-to-r ${currentTab.gradient}`}
                ></div>
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className={`p-3 rounded-full bg-linear-to-r ${currentTab.gradient} text-white shadow-lg`}
                  >
                    {currentTab.icon}
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
                    {currentTab.title}
                  </h2>
                </div>
                <div className="prose prose-gray max-w-none">
                  <p
                    className="text-gray-600 leading-relaxed text-base font-medium line-clamp-15
                  "
                    title={currentTab.description}
                  >
                    {currentTab.description}
                  </p>
                </div>
                <div
                  className={`mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-linear-to-r ${currentTab.gradient} text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer`}
                >
                  <span>Tìm hiểu thêm</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex-1 group">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src={currentTab.image1 || "/placeholder.svg"}
                  alt={currentTab.title}
                  className="w-full md:h-200 object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelShow;
