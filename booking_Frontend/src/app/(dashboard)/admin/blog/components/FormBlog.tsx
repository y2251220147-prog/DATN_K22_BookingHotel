import { UploadButton } from "@/utils/uploadthing";
import { ImageDownIcon, X } from "lucide-react";
import React from "react";
import { PostData } from "../add/page";
import Image from "next/image";
import PreviewButton from "./PreviewButton";
import RichTextEditor from "./RichTextEditor";

interface IFormBlog {
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  postData: PostData;
  setPostData: React.Dispatch<React.SetStateAction<PostData>>;
}

const FormBlog = ({ handleSubmit, postData, setPostData }: IFormBlog) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setPostData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Tiêu đề */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tiêu đề
        </label>
        <input
          type="text"
          name="title"
          value={postData.title}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nhập tiêu đề bài viết"
          required
        />
      </div>

      {/* Summary + Cover */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bảng Tóm Tắt
          </label>
          <textarea
            name="summary"
            value={postData.summary}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập mô tả ngắn"
            rows={5}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ảnh bìa
          </label>
          <div className="flex flex-col items-start">
            {postData.coverImage ? (
              <div className="relative inline-block">
                <Image
                  alt=""
                  src={postData.coverImage}
                  width={300}
                  height={300}
                />
                <button
                  type="button"
                  onClick={() =>
                    setPostData((prev) => ({ ...prev, coverImage: "" }))
                  }
                  className="absolute cursor-pointer top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
                >
                  <X />
                </button>
              </div>
            ) : (
              <UploadButton
                className="text-black py-2 px-4 rounded cursor-pointer text-2xl w-full h-[140px] border-2 border-dashed border-gray-300 hover:bg-gray-50"
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  setPostData((prev) => ({
                    ...prev,
                    coverImage: res[0].ufsUrl,
                  }));
                }}
                content={{
                  button({ isUploading }) {
                    return isUploading ? (
                      <div className="text-gray-500">Đang tải lên...</div>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-2">
                        <ImageDownIcon className="text-gray-500 w-8 h-8" />
                      </div>
                    );
                  },
                }}
              />
            )}
            {postData.coverImage && (
              <div className="mt-2 text-sm text-gray-500">
                Ảnh đã tải lên thành công!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Nội dung — dùng RichTextEditor */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium text-gray-700">
            Nội dung
          </label>
          <PreviewButton postData={postData} />
        </div>
        <RichTextEditor
          value={postData.content}
          onChange={(value) =>
            setPostData((prev) => ({ ...prev, content: value }))
          }
        />
      </div>

      <div className="flex justify-end mr-6">
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Đăng bài viết
        </button>
      </div>
    </form>
  );
};

export default FormBlog;
