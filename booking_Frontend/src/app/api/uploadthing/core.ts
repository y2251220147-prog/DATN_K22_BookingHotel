import { createUploadthing, type FileRouter } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 10, // ⚠️ Cho phép chọn nhiều ảnh!
    },
  }).onUploadComplete(async ({ file }) => {
    console.log("Upload complete", file);
    // bạn có thể lưu vào DB tại đây nếu muốn
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
