import React, { useState } from "react";
import { PostData } from "../add/page";
import Image from "next/image";
import Modal from "react-modal";
import MarkDown from "@/hook/MarkDown";
import { cn } from "@/lib/utils";

interface PreviewButtonProps {
  postData: PostData;
  className?: string;
}

// Set app element cho accessibility

Modal.setAppElement("body");

const PreviewButton: React.FC<PreviewButtonProps> = ({
  postData,
  className,
}) => {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <>
      {/* Nút xem trước */}
      <button
        onClick={() => setShowPreview(true)}
        type="button"
        className={cn(
          `flex gap-2 items-center px-4 py-2 bg-gray-400 text-white rounded cursor-pointer hover:bg-gray-500 transition-colors mb-4`,
          className
        )}
      >
        <svg
          className="w-5 h-5 group-hover:scale-110 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
        Xem trước
      </button>

      {/* Modal Preview */}
      <Modal
        isOpen={showPreview}
        onRequestClose={() => setShowPreview(false)}
        contentLabel="Preview bài viết"
        closeTimeoutMS={200}
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
        className="absolute top-1/2 left-1/2 transform -translate-x-[40%] -translate-y-1/2 bg-white p-0 z-50 rounded-lg shadow-lg w-full max-w-7xl max-h-[90vh] flex flex-col"
        overlayClassName="fixed inset-0 bg-black/30"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 ">
          <h3 className="text-lg font-semibold">Bản xem trước</h3>
          <button
            onClick={() => setShowPreview(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Content cuộn được */}
        <div className="p-6 overflow-y-auto flex-1">
          {postData.coverImage && (
            <div className="relative w-full h-96 mb-6 rounded-xl overflow-hidden shadow-lg">
              <Image
                src={postData.coverImage}
                alt={postData.title || "Cover image"}
                fill
                className="object-cover"
                sizes="(max-width: 900px) 100vw, 900px"
                priority
              />
            </div>
          )}

          <h1 className="text-xl font-bold text-gray-900 mb-4">
            {postData.title}
          </h1>

          {postData.summary && (
            <div className="mb-8 border-l-4 border-blue-500 py-3 bg-blue-50 rounded-r-lg">
              <p className="text-lg text-gray-700 italic">{postData.summary}</p>
            </div>
          )}

          <MarkDown>{postData.content}</MarkDown>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={() => setShowPreview(false)}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors shadow-sm"
          >
            Đóng
          </button>
        </div>
      </Modal>
    </>
  );
};

export default PreviewButton;
