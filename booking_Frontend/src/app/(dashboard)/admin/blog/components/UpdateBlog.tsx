"use client";
import React, { useState } from "react";
import Modal from "react-modal";
import type { BlogPost } from "./TableBlog";
import Image from "next/image";
import PreviewButton from "./PreviewButton";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";
import Mutate from "@/hook/Mutate";
import { URL_API } from "@/lib/fetcher";
import RichTextEditor from "./RichTextEditor";

Modal.setAppElement("#root");
interface IUpdateProps {
  data: BlogPost;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const UpdateBlog: React.FC<IUpdateProps> = ({ data, isOpen, setIsOpen }) => {
  const [form, setForm] = useState({
    title: data.title,
    summary: data.summary,
    content: data.content,
    coverImage: data.coverImage,
  });

  // Cập nhật giá trị field khi thay đổi
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  console.log("data", form);

  // Gửi dữ liệu cập nhật lên parent hoặc API
  const submitUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsOpen(false);
    try {
      const res = await axiosInstance.put(`/api/blog/update/${data.id}`, form);
      if (res.status === 200) {
        toast.success("Bạn đã thay đổi bài viết thành công");
        Mutate(`${URL_API}/api/blog`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        className=" absolute top-1/2 left-1/2 transform -translate-x-[45%] -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg w-full max-w-7xl max-h-[90vh] overflow-y-auto"
        overlayClassName="fixed inset-0 bg-black/10 "
      >
        <form className="space-y-4" onSubmit={submitUpdate}>
          <div>
            <label className="block mb-1 font-semibold">Tiêu đề</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-10">
            {" "}
            <div>
              {form.coverImage && (
                <Image
                  src={form.coverImage}
                  width={450}
                  height={450}
                  alt="cover"
                  className="mt-2  w-auto rounded"
                />
              )}
            </div>
            <div>
              <label className="block mb-1 font-semibold">Mô tả tóm tắt</label>
              <textarea
                name="summary"
                value={form.summary}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                rows={5}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between">
              <label className="block mb-1 font-semibold">Nội dung</label>
              <PreviewButton postData={form} />
            </div>
            <RichTextEditor
              value={form.content}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, content: value }))
              }
            />
          </div>

          <div className="flex gap-2 justify-end mt-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 rounded"
              onClick={() => setIsOpen(false)}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default UpdateBlog;
