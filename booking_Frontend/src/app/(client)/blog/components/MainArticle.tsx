import React from "react";
import { Article } from "../page";
import Image from "next/image";
import { formatDate } from "@/lib/formatDate";
import Link from "next/link";

interface IMainArticle {
  article: Article;
}

const MainArticle = ({ article }: IMainArticle) => {
  return (
    <Link href={`blog/${article.slug}`}>
      <div className="relative h-full xl:h-screen 2xl:h-[80vh] group overflow-hidden rounded-lg ">
        {/* Ảnh nền */}
        <Image
          alt={article.title}
          src={article.coverImage || ""}
          width={400}
          height={400}
          className="object-cover object-center w-full  transition-transform duration-500 group-hover:scale-105"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-300" />

        {/* Nội dung */}
        <div className="absolute inset-0 flex flex-col justify-end px-4 pb-5 z-10">
          {/* Ngày & tiêu đề - mặc định nằm dưới cùng, khi hover bị đẩy nhẹ lên */}
          <div
            className="
              transition-transform duration-500
              group-hover:-translate-y-4
            "
          >
            <p className="text-sm opacity-90 text-gray-300">
              {formatDate(article.publishedAt)}
            </p>
            <p className="text-base font-semibold mt-1 drop-shadow-md text-white mb-2">
              {article.title}
            </p>
          </div>
          {/* Summary (ẩn mặc định - hiện khi hover) */}
          <p
            className="
    text-sm text-gray-300 line-clamp-3
    opacity-0 translate-y-5 max-h-0
    group-hover:opacity-100 group-hover:translate-y-0 group-hover:max-h-24
    transition-all duration-500 ease-out overflow-hidden
  "
          >
            {article.summary}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default MainArticle;
