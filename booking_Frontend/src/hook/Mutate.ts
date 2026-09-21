import { mutate } from "swr";

/**
 * Hàm Mutate dùng để invalidate (làm mới) cache của SWR.
 * Nó sẽ tìm tất cả các key bắt đầu bằng `url` và yêu cầu tải lại dữ liệu.
 */
export default function Mutate(url: string) {
  // Lấy baseURL từ env để lọc bỏ nếu user truyền full URL
  const baseURL = process.env.NEXT_PUBLIC_URL_API || "";
  const relativeUrl = url.replace(baseURL, "");

  return mutate(
    (key) => {
      // Trường hợp key là string (thông dụng nhất)
      if (typeof key === "string") {
        return key.startsWith(relativeUrl);
      }

      // Trường hợp key là array (ví dụ: ['/api/user', { id: 1 }])
      if (Array.isArray(key) && typeof key[0] === "string") {
        return key[0].startsWith(relativeUrl);
      }

      return false;
    },
    undefined, // Không cập nhật data ngay (optimistic), chỉ báo revalidate
    { revalidate: true },
  );
}
