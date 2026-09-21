import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import Mutate from "@/hook/Mutate";
import axiosInstance from "@/lib/axios";
import { URL_API } from "@/lib/fetcher";
import React from "react";
import toast from "react-hot-toast";

interface IPublishedBlog {
  id: string;
  published: boolean;
  
}
const PublishedBlog = ({ id, published }: IPublishedBlog) => {
  const handlePublish = async () => {
    try {
      const res = await axiosInstance.put(`/api/blog/${id}`);
      if (res.data) {
        toast.success(
          `${published === false ? "Xuất bản" : "Hủy xuất bản"} thành công!`,
        );
        Mutate(`${URL_API}/api/blog/employee`);
      }
    } catch (error: any) {
      toast.error(error?.reponse?.data.message);
    }
  };
  return (
    <DropdownMenuItem onClick={handlePublish}>
      {published === false ? "Xuất Bản" : "Hủy Xuất Bản"}
    </DropdownMenuItem>
  );
};

export default PublishedBlog;
