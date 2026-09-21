import React from "react";
import CardBlog from "./components/CardBlog";
import MainArticle from "./components/MainArticle";
import CardBlogSub from "./components/CardBlogSub";
import axiosInstance from "@/lib/axios";
import PaginationServer from "@/app/(dashboard)/components/Pagination/PaginationServer";

export interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage: string;
  published: boolean;
  publishedAt: string;
}

interface BlogPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam) || 1;
  const limit = 10;

  // Fetch song song: 5 bài đầu cố định (hero) + trang hiện tại (liên quan)
  const [heroRes, listRes] = await Promise.all([
    axiosInstance.get(`/api/blog?page=1&limit=5`, {
      headers: {
        "Cache-Control": "max-age=3600, stale-while-revalidate=86400",
      },
    }),
    axiosInstance.get(`/api/blog?page=${page}&limit=${limit}`),
  ]);

  const heroArticles = heroRes.data.data as Article[];
  const { data, totalPages } = listRes.data;
  const articles = data as Article[];

  return (
    <div className="w-full">
      {/* Hero */}
      <div className="relative h-screen px-4 text-center bg-[url(/image/bgNews.png)] bg-no-repeat bg-cover bg-center">
        <div className="absolute inset-0 bg-black/60" />
        <div className="flex justify-center items-center text-center h-full">
          <div className="relative max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 text-balance">
              Khám Phá Thế Giới
              <span className="block text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-green-600">
                Blogs
              </span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto text-pretty">
              Chia sẻ kiến thức, kinh nghiệm và những xu hướng mới nhất trong du
              lịch khách sạn
            </p>
          </div>
        </div>
      </div>

      {/* Bài viết mới nhất — luôn dùng heroArticles, không bị ảnh hưởng bởi page */}
      <section className="py-16 px-4 md:px-10 bg-white">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-red-600 mb-4">
            Bài Viết Mới Nhất
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Cập nhật những kiến thức và xu hướng mới nhất trong những chuyến du
            lịch
          </p>
        </div>

        {heroArticles && heroArticles.length > 0 && (
          <div className="grid grid-cols-1 xl:grid-cols-3 lg:gap-5">
            <div className="col-span-2 mb-5">
              <MainArticle article={heroArticles[0]} />
            </div>
            <div className="flex flex-col gap-10">
              {heroArticles.slice(1, 5).map((item, index) => (
                <CardBlogSub article={item} key={index} />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Bài viết liên quan — phân trang theo page */}
      <div className="py-10 mx-4 lg:mx-10">
        <div className="flex flex-col md:flex-row text-center md:text-start justify-between mb-5">
          <h1 className="text-red-500 text-3xl font-bold uppercase">
            Bài Viết Liên Quan
          </h1>
          <p className="text-sm lg:text-base text-gray-700 leading-relaxed lg:max-w-[600px] text-center lg:text-right">
            Khám phá xu hướng du lịch đang định hình tương lai Du lịch 2025 —
            Những trào lưu bạn không thể bỏ lỡ
          </p>
        </div>

        <CardBlog data={articles ?? []} />

        <PaginationServer
          page={page}
          totalPages={totalPages ?? 1}
          basePath="/blog"
        />
      </div>
    </div>
  );
}
