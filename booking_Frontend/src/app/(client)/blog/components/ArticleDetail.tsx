import Image from "next/image";
import { formatDate } from "@/lib/formatDate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Calendar, ChevronRight } from "lucide-react";
import MarkDown from "@/hook/MarkDown";
import axiosInstance from "@/lib/axios";
import Link from "next/link";

interface Props {
  slug: string;
}

interface Article {
  id: string;
  title: string;
  publishedAt: string;
  content: string;
  coverImage: string;
  summary: string;
  category?: string;
  readTime?: number;
}

const ArticleDetail = async ({ slug }: Props) => {
  const article = await axiosInstance
    .get<Article>(`/api/blog/${slug}`)
    .then((res) => res.data);
  const firstSegment = "blog";
  const shareUrl = `/blog/${slug}`;

  if (!article) {
    return (
      <div className="  flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Bài viết không tồn tại
          </h2>
          <Link href="/blog">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="  lg:overflow-auto lg:max-h-screen">
      <article className=" mx-auto px-4 lg:px-10 py-4 ">
        <div className="text-base md:text-xl text-gray-700 font- gap-2 cursor-pointer my-4 md:my-8 flex items-center ">
          <Link className="hover:underline ml-4" href="/blog">
            {firstSegment}
          </Link>
          <ChevronRight className="w-7 h-7" />
          <p className="truncate ">{article.title}</p>
        </div>
        {/* Metadata */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Badge className="bg-blue-600 text-white">
              {article.category || "Blog"}
            </Badge>
            <div className="flex items-center text-gray-500 text-sm gap-4">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(article.publishedAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{article.readTime || 5} phút đọc</span>
              </div>
            </div>
          </div>

          <h1 className="text-2xl md:text-5xl font-bold text-gray-900 mb-6 text-balance leading-tight">
            {article.title}
          </h1>
        </div>

        {/* Hình ảnh cover */}
        {article.coverImage && (
          <div className="relative h-64 md:h-96 w-full mb-8 rounded-2xl overflow-hidden shadow-lg">
            <Image
              src={article.coverImage || "/placeholder.svg"}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              priority
            />
          </div>
        )}

        {/* Tóm tắt */}
        <div className="mb-8 px-4 py-2 bg-blue-50 rounded-2xl border-l-4 border-blue-600">
          <h2 className="font-semibold text-blue-900 mb-2">Tóm tắt</h2>
          <p className="text-blue-800 leading-relaxed text-lg">
            {article.summary}
          </p>
        </div>

        {/* Nội dung bài viết */}
        <div className="bg-white rounded-2xl ">
          <MarkDown>{article.content}</MarkDown>
        </div>

        {/* Call to action */}
        <div className="mt-12 p-8 bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl text-center text-white">
          <h3 className="text-2xl font-bold mb-4">
            Bạn thấy bài viết này hữu ích?
          </h3>
          <p className="mb-6 text-blue-100">
            Chia sẻ với bạn bè hoặc đăng ký nhận thông báo về những bài viết mới
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              className="text-white  hover:text-blue-200 cursor-pointer"
              href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
            >
              Chia Sẻ Lên Facebook
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
};

export default ArticleDetail;
