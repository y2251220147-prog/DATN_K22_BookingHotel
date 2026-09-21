import { LLM } from "@langchain/core/language_models/llms";

export class ModelAi extends LLM {
  constructor(fields = {}) {
    super(fields);
    this.apiKey = process.env.API_KEY_AI;
  }
  //GPT-4o mini
  //GPT-5.3 mini
  //grok-4.1-fast
  //gpt-5.4-mini-2026-03-17
  _llmType() {
    return "gpt-4o-mini";
  }

  async _call(prompt, options = {}) {
    const url = `https://gpt4.shupremium.com/v1/chat/completions`;
    try {
      const response = await fetch(url, {
        method: "POST",
        signal: AbortSignal.timeout(options.timeoutMs || 60000),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          ...(options.maxTokens ? { max_tokens: options.maxTokens } : {}),
          ...(options.json ? { response_format: { type: "json_object" } } : {}),
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`API error: ${errText}`);
      }

      const data = await response.json();

      if (data.choices?.[0]?.finish_reason === "length") {
        throw new Error("Bài viết vượt giới hạn phản hồi của AI. Vui lòng thử lại với chủ đề cụ thể hơn.");
      }
      const content = data.choices?.[0]?.message?.content;
      if (typeof content !== "string" || !content.trim()) throw new Error("AI không trả về nội dung.");
      return content;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }
}
