"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontalIcon } from "lucide-react";
import PublishedBlog from "./PublishedBlog";
import DeleteBlog from "./DeleteBlog";
import UpdateBlog from "./UpdateBlog";
import Image from "next/image";

// Define interfaces based on Prisma schema
interface Employee {
  user: { firstName: string; lastName: string };
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  publishedAt?: string | null;
  createdAt: string;
  employee: Employee | null;
  summary: string;
  content: string;
  coverImage: string;
}

interface TableBlogProps {
  posts: BlogPost[];
}

const TableBlog = ({ posts }: TableBlogProps) => {
  const [activePost, setActivePost] = useState<BlogPost | null>(null);

  return (
    <div className="mt-5">
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Người Đăng</TableHead>
              <TableHead className="">Tiêu Đề</TableHead>
              <TableHead>Xuất Bản</TableHead>
              <TableHead>Ngày Xuất Bản</TableHead>
              <TableHead>Hành Động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts?.map((post) => (
              <TableRow key={post.id}>
                <TableCell>
                  {(post.employee?.user.firstName || "") +
                    " " +
                    post.employee?.user.lastName || ""}
                </TableCell>
                <TableCell className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <Image
                      alt={post.title}
                      src={post.coverImage}
                      width={40}
                      height={40}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <p>{post.title}</p>
                </TableCell>
                <TableCell>
                  {post.published ? (
                    <span className=" bg-green-600 text-green-50 px-2 py-1  text-xs rounded-full">
                      Đã Xuất Bản
                    </span>
                  ) : (
                    <span className="bg-red-600 text-red-50 px-2 py-1 rounded-full text-xs">
                      Chưa Xuất Bản
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="">
                    {" "}
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString()
                      : "bản chưa được xuất"}
                  </div>
                </TableCell>

                <TableCell className="">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="ml-6">
                      <MoreHorizontalIcon />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Thực Hiện</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <PublishedBlog id={post.id} published={post.published} />
                      <DropdownMenuItem
                        className="text-blue-600"
                        onClick={() => setActivePost(post)}
                      >
                        chỉnh sửa bài viết
                      </DropdownMenuItem>

                      <DeleteBlog id={post.id} />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                {activePost && (
                  <UpdateBlog
                    data={activePost}
                    isOpen={!!activePost}
                    setIsOpen={() => setActivePost(null)}
                  />
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TableBlog;
