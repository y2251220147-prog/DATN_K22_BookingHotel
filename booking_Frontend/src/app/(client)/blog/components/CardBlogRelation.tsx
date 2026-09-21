"use client";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { Article } from "../page";
import { formatDate } from "@/lib/formatDate";
import { ArrowRightCircle } from "lucide-react";

interface CardBlogProps {
  article: Article;
}

const CardBlogRelation = ({ article }: CardBlogProps) => {
  return (
    <Link href={`/blog/${article.slug}`}>
      <div className=" xl:flex gap-5 mx-4 md:mx-0 lg:my-5">
        {" "}
        <Image
          alt={article.slug}
          src={article.coverImage}
          height={200}
          width={300}
          className="bg-contain lg:bg-cover h-70 w-full lg:w-50 lg:h-40 w-36 rounded-2xl mb-2"
        />
        <div className="w-full top-5 lg:w-60 ">
          <p className="text-black font-semibold text-sm text-start mb-1 line-clamp-3">
            {article.title}
          </p>
          <p className="text-base text-gray-600 mt-3">
            {formatDate(article.publishedAt)}
          </p>
          <button className="group flex items-center gap-2 mt-3 lg:mt-8 cursor-pointer">
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

export default CardBlogRelation;
