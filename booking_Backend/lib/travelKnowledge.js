const TRAVEL_TOPICS = {
  food: {
    keywords: ["ăn", "món", "đặc sản", "ẩm thực", "hải sản", "quán", "cà phê", "food", "eat"],
    text: "Ẩm thực nên thử: mì Quảng, bún chả cá, bánh tráng cuốn thịt heo, bánh xèo nem lụi, hải sản ven biển, chè sầu và cà phê muối. Một số quán mì Quảng nổi tiếng để tham khảo: 1) Mì Quảng Bà Mua - 19-21 Trần Bình Trọng, Hải Châu; 2) Mì Quảng Ếch Bếp Trang - 441 Ông Ích Khiêm, Hải Châu; 3) Mì Quảng Dung - 121 Đỗ Bá, Ngũ Hành Sơn. Google Maps: https://www.google.com/maps/search/?api=1&query=m%C3%AC+Qu%E1%BA%A3ng+%C4%90%C3%A0+N%E1%BA%B5ng. Có thể ưu tiên khu Hải Châu, Sơn Trà, An Thượng; nên hỏi giá trước khi gọi hải sản.",
  },
  attractions: {
    keywords: ["địa điểm", "tham quan", "đi đâu", "vui chơi", "check-in", "biển", "cầu", "bà nà", "sơn trà", "ngũ hành sơn", "attraction", "sightseeing"],
    text: "Điểm nổi bật Đà Nẵng: biển Mỹ Khê - đường Võ Nguyên Giáp, Sơn Trà; bán đảo Sơn Trà và chùa Linh Ứng - Hoàng Sa, Thọ Quang; Ngũ Hành Sơn - 81 Huyền Trân Công Chúa; cầu Rồng - đường Bạch Đằng; Bảo tàng Điêu khắc Chăm - 02 Đ. 2 Tháng 9. Bà Nà Hills - xã Hòa Ninh, Hòa Vang - phù hợp đi cả ngày; nên kiểm tra thời tiết và giá vé trước khi đi. Google Maps: https://www.google.com/maps/search/?api=1&query=Da+Nang+tourist+attractions.",
  },
  hoiAn: {
    keywords: ["hội an", "hoi an", "phố cổ", "cù lao chàm", "rừng dừa"],
    text: "Hội An phù hợp chuyến đi trong ngày từ Đà Nẵng: phố cổ - khu Châu Thượng Văn, phường Minh An; chùa Cầu - đường Nguyễn Thị Minh Khai; chợ đêm - đường Nguyễn Hoàng; rừng dừa Cẩm Thanh - xã Cẩm Thanh. Nên đi từ sau 15:00 để tham quan tối, quãng đường khoảng 30 km tùy tuyến. Google Maps: https://www.google.com/maps/search/?api=1&query=Hoi+An+Ancient+Town.",
  },
  hue: {
    keywords: ["huế", "hue", "đại nội", "lăng khải định", "lăng tự đức"],
    text: "Huế phù hợp chuyến 1 ngày nếu khách có thời gian: Đại Nội, chùa Thiên Mụ và lăng Khải Định. Cung đường qua đèo Hải Vân hoặc hầm; nên dành cả ngày và kiểm tra thời tiết.",
  },
  itinerary: {
    keywords: ["lộ trình", "lịch trình", "kế hoạch", "hành trình", "mấy ngày", "2 ngày", "3 ngày", "itinerary", "route", "plan"],
    text: "Gợi ý 3 ngày từ DAU Hotel: ngày 1 Sơn Trà - Mỹ Khê - Ngũ Hành Sơn - cầu Rồng; ngày 2 Bà Nà Hills; ngày 3 Hội An (phố cổ, chợ đêm). Nếu chỉ có 1 ngày, chọn Sơn Trà + Mỹ Khê + trung tâm Đà Nẵng; nếu thích văn hóa, thay Bà Nà bằng Hội An.",
  },
};

export function getTravelKnowledge(message) {
  const normalized = String(message || "").toLowerCase();
  const matched = Object.values(TRAVEL_TOPICS).filter(({ keywords }) =>
    keywords.some((keyword) => normalized.includes(keyword)),
  );

  if (!matched.length) return null;
  return matched.map(({ text }) => text).join("\n");
}
