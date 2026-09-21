import { UploadButton } from "@/utils/uploadthing";
import axios from "axios";

import React from "react";
import toast from "react-hot-toast";
import Mutate from "@/hook/Mutate";

interface AddImageToRoomProps {
  roomId: string;
}
const AddImageToRoom = ({ roomId }: AddImageToRoomProps) => {
  return (
    <div className="flex flex-col mt-5 gap-2">
      <div className="flex items-center justify-center gap-3">
        {/* Nút tải ảnh */}
        <UploadButton
          className="ut-button:bg-blue-700 ut-button:hover:bg-blue-800
                 ut-button:text-white ut-button:rounded-lg
                 ut-button:px-5 ut-button:py-3 ut-button:text-sm ut-button:font-medium
                 ut-allowed-content:hidden"
          endpoint="imageUploader"
          onClientUploadComplete={async (res) => {
            if (res && res.length > 0) {
              const urls = res.map((file) => file.ufsUrl);
              try {
                const response = await axios.post(
                  `${process.env.NEXT_PUBLIC_URL_API}/api/room/images/${roomId}`,
                  { imageUrls: urls },
                );
                if (response.data) {
                  toast.success("Ảnh đã được lưu!");
                  Mutate(`${process.env.NEXT_PUBLIC_URL_API}/api/room`);
                }
              } catch (error) {
                toast.error("Lưu ảnh thất bại!");
                console.error("Lỗi lưu ảnh:", error);
              }
            }
          }}
          onUploadError={(error) => {
            toast.error(error.message || "Tải lên không thành công!");
          }}
          content={{
            button({ isUploading }) {
              return isUploading ? (
                <span className="flex items-center gap-2 border border-gray-300 rounded-lg px-5 py-3 text-sm font-medium">
                  <svg
                    className="animate-spin w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Đang tải lên...
                </span>
              ) : (
                <span className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg px-5 py-3 text-sm font-medium">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  Tải ảnh mới
                </span>
              );
            },
          }}
        />
      </div>

      {/* Helper text */}
      <p className="text-xs text-gray-400 text-center leading-relaxed">
        Tải lên hình ảnh với định dạng *.png, *.jpg, *.jpeg.
        <br />
        Kích thước không quá 5Mb (600x600px)
      </p>
    </div>
  );
};

export default AddImageToRoom;
