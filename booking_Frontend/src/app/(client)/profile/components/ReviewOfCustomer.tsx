import Image from "next/image";
import React from "react";
interface IReview {
  id: string;
  rating: number;
  comment: string;
  reviewDate: Date;
  booking: {
    bookingItems: [
      {
        room: {
          roomNumber: string;
          floor: number;
          images: [{ imageUrl: string }];
        };
      }
    ];
  };
}

const ReviewOfCustomer = ({ review }: { review: IReview[] }) => (
  <div className=" overflow-auto  mx-auto lg:max-h-screen lg:max-w-7xl">
    <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">
      Lịch sử đánh giá của tôi
    </h1>

    {review.length === 0 ? (
      <div className="flex flex-col items-center justify-center py-16">
        <span className="text-5xl mb-4">📝</span>
        <p className="text-gray-500 text-lg">
          Bạn chưa có đánh giá nào. Hãy thêm đánh giá cho các phòng đã đặt của
          bạn!
        </p>
      </div>
    ) : (
      <div className="space-y-8">
        {review.map((item) => (
          <div
            key={item.id}
            className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row gap-6">
              {/* LEFT */}
              <div className="md:w-1/3 w-full shrink-0">
                <div className="relative h-48 md:h-40 mb-4 rounded-lg overflow-hidden">
                  <Image
                    fill
                    priority
                    src={item.booking.bookingItems[0].room.images[0].imageUrl}
                    alt={`Room ${item.booking.bookingItems[0].room.roomNumber}`}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Phòng {item.booking.bookingItems[0].room.roomNumber}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Tầng {item.booking.bookingItems[0].room.floor}
                  </p>
                </div>
              </div>

              {/* RIGHT */}
              <div className="w-full md:w-2/3 flex-1 min-w-0">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-xl ${
                          i < item.rating ? "text-yellow-400" : "text-gray-200"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 flex-shrink-0">
                    {new Date(item.reviewDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-700 mb-2">
                    Đánh giá của bạn:
                  </h4>
                  <p className="text-gray-600 leading-relaxed break-words break-all">
                    {item.comment}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default ReviewOfCustomer;
