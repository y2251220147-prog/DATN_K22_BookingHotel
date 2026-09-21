import React from "react";
import { Article } from "../page";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/formatDate";
import { ArrowRightCircle } from "lucide-react";

interface CardBlogSub {
  article: Article;
}

const CardBlogSub = ({ article }: CardBlogSub) => {
  return (
    <Link href={`blog/${article.slug}`}>
      <div className="flex flex-col md:flex-row gap-3">
        {" "}
        <Image
          alt={article.slug}
          src={article.coverImage}
          height={200}
          width={300}
          className="bg-cover  md:w-60 md:h-40 w-full h-full"
        />
        <div className="w-full xl:w-60">
          <p className="text-black font-semibold text-sm text-start mb-1 line-clamp-3">
            {article.title}
          </p>
          <p className="text-base text-gray-600 ">
            {formatDate(article.publishedAt)}
          </p>
          <button className="group flex items-center gap-2 mt-3 cursor-pointer">
            <ArrowRightCircle className="w-5 h-5 -rotate-45 text-gray-400 transition-transform duration-300 group-hover:rotate-0 group-hover:text-red-500" />
            <span className="font-bold text-base text-gray-600 transition-colors duration-300 group-hover:text-red-500">
              xem thêm
            </span>
          </button>
        </div>
      </div>
    </Link>
  );
};

export default CardBlogSub;
