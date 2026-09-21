import React from "react";
import BeanHotel from "./components/main/BeanHotel";
import ShearchRoomPage from "./components/main/SearchRoom";
import BannerServer from "./components/main/fetchBannerImages";

import dynamic from "next/dynamic";

// Keep the generated home page available while external content is refreshed.
export const revalidate = 21600;

// 👇 Chỉ import động các UI nặng nằm xa hoặc không cần hiển thị liền
const RoomTypeShowcase = dynamic(
  () => import("./components/main/RoomTypeShowcase"),
);
const HotelShow = dynamic(() => import("./components/main/HotelShow"));
const HotelHighlightsServer = dynamic(
  () => import("./components/main/HotelHighlightsServer"),
);
const TestimonialCarousel = dynamic(
  () => import("./components/common/CustomerReviewed"),
);
const HotelShowcaseSection = dynamic(
  () => import("./components/main/Hotelshowcasesection"),
);
const ChatBoxAL = dynamic(() => import("./components/main/ChatBoxAl"));
const ChatBox = dynamic(() => import("./components/main/ChatBox"));
const Footer2 = dynamic(() => import("./components/footer/foorter2"));
// Map Wrapper bạn đã dynamic ngầm rồi nhưng nhúng dynamic ở đây giúp tách code ra riêng rẻ hẳn
const HotelMapWrapper = dynamic(
  () => import("./components/main/HotelMapWrapper"),
);

const Page = () => {
  return (
    <div className="">
      {/* KHÔNG DYNAMIC - Hiển thị ngay */}
      <BannerServer />
      <ShearchRoomPage />
      <BeanHotel />

      {/* DYNAMIC - Quá trình tải tách biệt khỏi giao diện ban đầu */}
      <RoomTypeShowcase />
      <HotelShowcaseSection />
      <HotelShow />
      <HotelHighlightsServer />
      <ChatBoxAL />
      <ChatBox />
      <HotelMapWrapper />
      <TestimonialCarousel />
      <Footer2 />
    </div>
  );
};

export default Page;
