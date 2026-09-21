import { test } from "node:test";
import assert from "node:assert/strict";
import { generateBlogDraft, parseTopic, selectPhotos, renderDraft, validateDraft } from "./blog-draft.js";

const draft = () => ({
  title: "Kinh nghiệm Cầu Rồng", summary: "Tóm tắt", introduction: "Mở đầu", conclusion: "Kết luận",
  sections: Array.from({ length: 6 }, (_, i) => ({ heading: `Mục ${i}`, paragraphs: ["hướng dẫn cụ thể ".repeat(30), "lưu ý thực tế ".repeat(30)], bullets: [] })),
  faq: Array.from({ length: 3 }, () => ({ question: "Đi khi nào?", answer: "Kiểm tra lịch trước khi đi." })),
  imageQueries: ["Dragon Bridge Da Nang"],
});

test("legacy topics and plain topics are supported; invalid input rejected", () => {
  assert.deepEqual(parseTopic("cầu rồng | Đà Nẵng về đêm | 2"), { subject: "Đà Nẵng về đêm", imageHint: "cầu rồng" });
  assert.equal(parseTopic("Bài về Đà Nẵng").subject, "Bài về Đà Nẵng");
  assert.throws(() => parseTopic({}));
});

test("short articles fail quality validation and HTML is escaped", () => {
  const d = draft();
  assert.ok(validateDraft(d) >= 1200);
  d.introduction = '<script>alert("x")</script>';
  assert.ok(!renderDraft(d, []).includes("<script>"));
  d.sections = d.sections.map((s) => ({ ...s, paragraphs: ["Ngắn", "Ngắn"] }));
  assert.throws(() => validateDraft(d), /ít nhất 1200/);
});

test("unknown, low confidence and duplicate photo choices are rejected", () => {
  const candidates = [{ id: "a" }, { id: "b" }];
  assert.deepEqual(selectPhotos([{ id: "unknown", score: 99, section: 0 }, { id: "a", score: 40, section: 0 }, { id: "b", score: 90, section: 1 }, { id: "b", score: 95, section: 2 }], candidates, 6), [{ id: "b", section: 1 }]);
});

test("image outage preserves detailed text and leaves cover blank", async () => {
  const result = await generateBlogDraft("Cầu Rồng", { complete: async () => JSON.stringify(draft()), searchImages: async () => { throw new Error("unavailable"); } });
  assert.equal(result.coverImage, "");
  assert.ok(result.warnings.length >= 1);
  assert.ok(result.wordCount >= 1200);
  assert.ok(!result.content.includes("<img"));
});

test("one bounded rewrite follows a short response", async () => {
  let calls = 0;
  const result = await generateBlogDraft("Cầu Rồng", { complete: async () => { calls++; return JSON.stringify(calls === 1 ? {} : draft()); }, searchImages: async () => [] });
  assert.equal(calls, 2);
  assert.ok(result.wordCount >= 1200);
});

test("malformed JSON is repaired with the original draft in context", async () => {
  let calls = 0;
  const broken = '{"title":"Đà Nẵng", "sections":["a" "b"]}';
  const result = await generateBlogDraft("Đà Nẵng về đêm", {
    complete: async (prompt) => {
      calls++;
      if (calls === 1) return broken;
      assert.ok(prompt.includes(broken));
      return JSON.stringify(draft());
    },
    searchImages: async () => [],
  });
  assert.equal(calls, 2);
  assert.ok(result.wordCount >= 1200);
});

test("repeated malformed JSON produces a readable error and bounded retries", async () => {
  let calls = 0;
  await assert.rejects(generateBlogDraft("Đà Nẵng", {
    complete: async () => { calls++; return '{"title":'; },
    searchImages: async () => [],
  }), /AI trả về bản nháp sai định dạng/);
  assert.equal(calls, 2);
});

test("a usable shorter article survives the final length check with a warning", async () => {
  const d = draft();
  d.sections = d.sections.map((s) => ({ ...s, paragraphs: ["lưu ý thực tế ".repeat(15), "hướng dẫn cụ thể ".repeat(15)] }));
  let calls = 0;
  const result = await generateBlogDraft("Đà Nẵng về đêm", {
    complete: async () => { calls++; return JSON.stringify(d); },
    searchImages: async () => [],
  });
  assert.equal(calls, 2);
  assert.ok(result.wordCount >= 600 && result.wordCount < 1200);
  assert.ok(result.warnings.some((warning) => warning.includes("ngắn hơn")));
  assert.ok(result.content.includes("<h2>"));
});
