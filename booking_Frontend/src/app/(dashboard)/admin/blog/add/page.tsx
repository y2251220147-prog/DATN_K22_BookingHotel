"use client";

import { useState } from "react";
import FormBlog from "../components/FormBlog";
import axios from "axios";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { URL_API } from "@/lib/fetcher";
import FormGeneratePostAi from "../components/FormGeneratePostAi";

export interface PostData {
  title: string;
  summary: string;
  content: string;
  coverImage: string;
}

const PostBlog = () => {
  const route = useRouter();
  const [postData, setPostData] = useState<PostData>({
    title: "",
    summary: "",
    content: "",
    coverImage: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${URL_API}/api/blog`, postData, {
        withCredentials: true,
      });
      if (res.status === 201) {
        toast.success("Bài Viết Của Bạn Đã Được Post");
        route.push("/admin/blog");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response.data.message || "error");
    }
  };

  return (
    <div className="lg:px-10 py-5 px-4 rounded-2xl bg-white">
      <div className="flex justify-between">
        {" "}
        <h1 className="text-2xl font-bold mb-6">Tạo bài viết mới</h1>
        <FormGeneratePostAi setPostData={setPostData} />
      </div>

      <FormBlog
        handleSubmit={handleSubmit}
        postData={postData}
        setPostData={setPostData}
      />
    </div>
  );
};

export default PostBlog;
