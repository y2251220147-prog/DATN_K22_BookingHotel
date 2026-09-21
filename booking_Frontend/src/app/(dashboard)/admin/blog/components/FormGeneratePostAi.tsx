"use client";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { PostData } from "../add/page";
import { Button } from "@/components/ui/button";
import AiLoadingOverlay from "./AiLoadingOverlay";
import axiosInstance from "@/lib/axios";

interface PostProps {
  setPostData: React.Dispatch<React.SetStateAction<PostData>>;
}

const FormGeneratePostAi = ({ setPostData }: PostProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [topic, setTopic] = useState("");
  const [imageHint, setImageHint] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  useEffect(() => { Modal.setAppElement("#root"); }, []);

  const handleGenerate = async () => {
    if (loading) return;
    if (!topic.trim()) { setError("Vui lòng nhập chủ đề bài viết."); return; }
    const input = imageHint.trim() ? imageHint.trim() + " | " + topic.trim() : topic.trim();
    if (input.length > 5000) { setError("Chủ đề và gợi ý ảnh tối đa 5000 ký tự."); return; }
    setLoading(true);
    setError(null);
    setNotice("");
    try {
      const res = await axiosInstance.post("/api/chatai/generate-post", { topic: input }, { timeout: 360000 });
      if (!res.data?.success || !res.data?.data) throw new Error("AI chưa trả về bản nháp hợp lệ.");
      const draft = res.data.data;
      setPostData({ title: draft.title, summary: draft.summary, content: draft.content, coverImage: draft.coverImage });
      const warnings = Array.isArray(draft.warnings) ? draft.warnings.filter((v: unknown) => typeof v === "string") : [];
      setNotice([
        "Đã tạo bản nháp" + (draft.wordCount ? " khoảng " + draft.wordCount + " từ." : "."),
        ...warnings,
        "Hãy xem trước, kiểm tra thông tin và ảnh trước khi đăng. Ảnh tự chọn dựa trên mô tả của nguồn ảnh.",
      ].join(" "));
      setIsOpen(false);
    } catch (err) {
      const failure = err as { response?: { data?: { error?: string; message?: string } }; message?: string };
      setError(failure.response?.data?.error || failure.response?.data?.message || failure.message || "Không tạo được bài viết. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button type="button" onClick={() => setIsOpen(true)}>Tạo bài viết bằng AI</Button>
      {notice && <p role="status" className="mt-3 max-w-3xl text-sm text-amber-800">{notice}</p>}
      {!loading && (
        <Modal
          isOpen={isOpen}
          onRequestClose={() => setIsOpen(false)}
          contentLabel="Tạo bản nháp bài viết bằng AI"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto"
          overlayClassName="fixed inset-0 bg-black/30 z-50"
        >
          <h2 className="text-xl font-semibold mb-2">Tạo bài viết chuyên sâu</h2>
          <p className="text-sm text-gray-600 mb-5">
            Bản nháp hướng tới 1.600–2.200 từ, có các mục chi tiết, lưu ý thực tế và câu hỏi thường gặp.
            Quá trình tạo có thể mất vài phút.
          </p>
          <label htmlFor="ai-blog-topic" className="block font-medium mb-2">Chủ đề và yêu cầu bài viết</label>
          <textarea id="ai-blog-topic" rows={7} maxLength={4500}
            placeholder="Ví dụ: Kinh nghiệm tham quan Cầu Rồng Đà Nẵng cho gia đình. Phân tích cách di chuyển, chọn điểm ngắm, lịch trình gợi ý, lưu ý khi đi cùng trẻ nhỏ. Không khẳng định lịch hoạt động khi chưa kiểm chứng."
            value={topic} onChange={(event) => setTopic(event.target.value)}
            className="w-full p-3 border rounded-md mb-4" />
          <label htmlFor="ai-blog-image" className="block font-medium mb-2">Gợi ý chủ thể ảnh (không bắt buộc)</label>
          <input id="ai-blog-image" maxLength={300} value={imageHint}
            onChange={(event) => setImageHint(event.target.value)}
            placeholder="Ví dụ: Dragon Bridge Da Nang at night"
            className="w-full p-3 border rounded-md" />
          <p className="text-sm text-gray-600 mt-2 mb-4">
            Ghi rõ địa danh hoặc đối tượng cần minh họa. Khi chưa tìm được ảnh phù hợp, bạn có thể tải ảnh lên bản nháp.
          </p>
          {error && <p role="alert" className="text-sm text-red-600 mb-3">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Đóng</Button>
            <Button type="button" onClick={handleGenerate} disabled={loading || !topic.trim()}>Tạo bản nháp</Button>
          </div>
        </Modal>
      )}
      {loading && <AiLoadingOverlay loading={loading} />}
    </div>
  );
};
export default FormGeneratePostAi;
