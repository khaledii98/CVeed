import OpenAI from "openai";

/**
 * Lazily-created OpenAI client. Server-side only — never import in a Client
 * Component. Created on first use (not at module load) so production builds
 * don't fail when the key is only present at runtime.
 */
let _client: OpenAI | null = null;
function client(): OpenAI {
  if (!_client) _client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return _client;
}

export const MODELS = {
  chat: process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini",
  screening: process.env.OPENAI_SCREENING_MODEL || "gpt-4o",
  embedding: process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small",
};

/**
 * Calls a model and returns parsed JSON. We force JSON output and keep
 * temperature low so the same input yields the same structure (governance rule:
 * "same CV = same extraction"). Throws if the response is not valid JSON.
 */
export async function callJSON<T>(opts: {
  system: string;
  user: string;
  model?: string;
  temperature?: number;
}): Promise<T> {
  const completion = await client().chat.completions.create({
    model: opts.model || MODELS.chat,
    temperature: opts.temperature ?? 0.1,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: opts.system },
      { role: "user", content: opts.user },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";
  return JSON.parse(raw) as T;
}

/** Creates an embedding vector for a piece of text (used for vector search). */
export async function embed(text: string): Promise<number[]> {
  const res = await client().embeddings.create({
    model: MODELS.embedding,
    input: text.slice(0, 8000),
  });
  return res.data[0].embedding;
}
