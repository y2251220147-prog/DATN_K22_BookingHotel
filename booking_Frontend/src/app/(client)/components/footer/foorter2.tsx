import React from "react";
import { CounterCircle } from "../common/CounterCircle";

const Footer2 = () => {
  return (
    <div className="w-full bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Counter Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 items-center justify-items-center">
          <CounterCircle
            count="10,000+"
            label="Khách Hàng Hài Lòng"
            borderBottom
          />

          <CounterCircle count="500+" label="Phòng Cao Cấp" borderRight />

          <CounterCircle count="15+" label="Năm Kinh Nghiệm" borderLeft />

          <CounterCircle count="98%" label="Đánh Giá 5 Sao" borderTop />
        </div>

        {/* Trust Badges Section */}
        <div className="mt-16 pt-12 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center text-center">
            <div className="flex flex-col items-center">
              <div className="text-3xl mb-2">🔒</div>
              <p className="text-sm font-semibold text-gray-800">
                Thanh Toán An Toàn
              </p>
              <p className="text-xs text-gray-600">SSL 256-bit</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-3xl mb-2">⚡</div>
              <p className="text-sm font-semibold text-gray-800">
                Xác Nhận Nhanh
              </p>
              <p className="text-xs text-gray-600">Trong 5 phút</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-3xl mb-2">💳</div>
              <p className="text-sm font-semibold text-gray-800">
                Đa Dạng Thanh Toán
              </p>
              <p className="text-xs text-gray-600">Visa, Master, PayPal</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-3xl mb-2">🏆</div>
              <p className="text-sm font-semibold text-gray-800">Giải Thưởng</p>
              <p className="text-xs text-gray-600">Best Hotel 2024</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer2;
