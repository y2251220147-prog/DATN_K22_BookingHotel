"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Star } from "lucide-react";

import React, { useEffect } from "react";
import toast from "react-hot-toast";
import Modal from "react-modal";
import useSWR from "swr";
import Mutate from "../../../../hook/Mutate";
interface Booking {
  bookingId: string;
}
interface BookingReviewStatus {
  bookings: {
    reviewed: boolean;
  };
  message: string;
}
const ReviewCusTomer = ({ bookingId }: Booking) => {
  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    bookingId: bookingId,
    rating: 0,
    comment: "",
  });

  const { data } = useSWR<BookingReviewStatus>(
    `/api/review/status?bookingId=${bookingId}`,
  );

  useEffect(() => {
    Modal.setAppElement("#root");
  }, []);
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_URL_API}/api/review`,
        formData,
        { withCredentials: true },
      );
      if (res.data) {
        Mutate(`/api/review/status`);

        setModalIsOpen(false);
        setFormData({ bookingId: bookingId, rating: 0, comment: "" });
        toast.success("Cảm ơn bạn đã đánh giá dịch vụ của chúng tôi!");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại sau.",
      );
    }
  };
  if (data?.bookings.reviewed) {
    return null;
  }
  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="cursor-pointer"
        onClick={() => setModalIsOpen(true)}
      >
        <Star className="h-4 w-4 mr-2 text-yellow-500" />
        <span className="hidden md:block">Đánh Giá</span>
      </Button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Review Modal"
        className="bg-white rounded-lg shadow-lg p-6 w-[70%] max-w-4xl  mt-60 outline-none "
        overlayClassName="fixed inset-0   bg-black/20 bg-opacity-50 flex justify-center items-start z-50"
      >
        <form
          className="flex flex-col items-center"
          onSubmit={handleReviewSubmit}
        >
          <h2 className="text-xl font-semibold mb-4">Đánh Giá Dịch Vụ</h2>
          <p className="text-gray-600 mb-6">
            Chúng tôi rất mong nhận được đánh giá của bạn về trải nghiệm dịch
            vụ.
          </p>
          <div className="flex items-center mb-4">
            <span className="text-yellow-500 mr-2">Đánh giá của bạn:</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i, index) => (
                <Star
                  key={index}
                  onClick={() => setFormData({ ...formData, rating: i })}
                  className={`h-6 w-6 cursor-pointer  hover:text-yellow-500 ${
                    i <= formData.rating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-400"
                  } `}
                />
              ))}
            </div>
          </div>
          <textarea
            rows={7}
            placeholder="Viết đánh giá của bạn tại đây..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            value={formData.comment}
            onChange={(e) =>
              setFormData({ ...formData, comment: e.target.value })
            }
          ></textarea>
          <Button
            variant="default"
            className="mt-4 cursor-pointer"
            type="submit"
          >
            Gửi Đánh Giá
          </Button>
        </form>
      </Modal>
    </>
  );
};

export default ReviewCusTomer;
