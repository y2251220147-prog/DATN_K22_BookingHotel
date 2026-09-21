import { CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Article } from "../page";
import { ArrowRightCircle } from "lucide-react";
import Link from "next/link";

interface CardBlogProps {
  data: Article[];
}

const CardBlog = ({ data }: CardBlogProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 my-10">
      {data.map((item) => (
        <Link href={`blog/${item.slug}`} key={item.id}>
          <div className="border border-gray-200 bg-[#E7E7E7] md:h-100 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 group relative">
            {/* Phần hình ảnh */}
            <div className="relative  w-full overflow-hidden cursor-pointer">
              <Image
                src={
                  item.coverImage ||
                  "/placeholder.svg?height=200&width=300&query=blog post"
                }
                alt={item.title}
                width={500}
                height={600}
                className="object-cover group-hover:scale-110 transition-transform duration-300 w-full h-full  lg:h-50"
              />
              <div className="absolute top-3 left-3">
                <Badge className="bg-blue-600 text-white text-xs">
                  {item?.content || "Blog"}
                </Badge>
              </div>
              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* Phần nội dung */}
            <CardHeader className="p-6">
              <CardTitle className="text-lg font-bold line-clamp-2 text-gray-900  transition-colors duration-200 text-balance">
                {item.title}
              </CardTitle>
              <div className="flex items-center justify-between text-xs text-gray-500 mt-4">
                <span>
                  {new Date(item.publishedAt).toLocaleDateString("vi-VN")}
                </span>
              </div>
            </CardHeader>

            {/* Phần footer với nút xem thêm */}
            <CardFooter className="p-6 pt-0">
              <button className="group flex items-center gap-2 mt-3 cursor-pointer">
                <ArrowRightCircle className="w-5 h-5 -rotate-45 text-gray-400 transition-transform duration-300 group-hover:rotate-0 group-hover:text-red-500" />
                <span className="font-bold text-base text-gray-600 transition-colors duration-300 group-hover:text-red-500">
                  xem thêm
                </span>
              </button>
            </CardFooter>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CardBlog;
