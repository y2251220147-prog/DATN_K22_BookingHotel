import React from "react";
import ArticleDetail from "../components/ArticleDetail";
import CardBlogRelation from "../components/CardBlogRelation";
import { Article } from "../page";
import axiosInstance from "@/lib/axios";

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const res = await axiosInstance.get("/api/blog");
  const data = res.data.data as Article[];

  return (
    <div className=" grid grid-cols-1 md:grid-cols-4 ">
      <div className="col-span-3">
        <ArticleDetail slug={slug} />
      </div>
      <div className="my-15 flex flex-col gap-10 md:gap-0">
        <h1 className="text-2xl lg:text-4xl text-center font-bold text-red-600 mb-6">
          Bài viết liên quan
        </h1>
        {data
          ?.filter((item) => item.slug !== slug)
          .map((article) => (
            <CardBlogRelation article={article} key={article.slug} />
          ))}
      </div>
    </div>
  );
};

export default Page;
