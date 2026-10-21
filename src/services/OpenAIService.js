const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = "gpt-4o-mini"; // vision-capable, paling murah

/**
 * Analyze a waste item image using OpenAI (ChatGPT) Vision API.
 * Throws errors with a stable code string the UI can map to a friendly message.
 *
 * Possible codes:
 *  API_KEY_MISSING | API_KEY_INVALID | RATE_LIMIT | NETWORK_ERROR
 *  EMPTY_RESPONSE | PARSE_ERROR | API_ERROR_<status>
 */
export async function analyzeWaste(base64Image, mimeType = "image/jpeg") {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey || apiKey === "your_openai_api_key_here") {
    throw new Error("API_KEY_MISSING");
  }

  const systemPrompt = `Kamu adalah ahli pengelolaan sampah di Indonesia. Kamu HANYA membalas dalam JSON yang valid sesuai schema yang diminta — tanpa markdown, tanpa teks tambahan.`;

  const userPrompt = `Analisis gambar ini secara mendalam.

Berikan respons HANYA dalam format JSON berikut:

{
  "object": "Nama benda yang teridentifikasi",
  "material": "Jenis material spesifik (contoh: Plastik PET, Alumunium, Kertas Karton, Kaca Bening, TetraPak)",
  "category": "Salah satu dari: Organik, Anorganik, atau B3",
  "steps": [
    "Langkah 1 membersihkan sebelum dibuang",
    "Langkah 2 membersihkan sebelum dibuang",
    "Langkah 3 membersihkan sebelum dibuang"
  ],
  "eco_fact": "Satu fakta singkat tentang dampak lingkungan benda ini jika tidak didaur ulang"
}

Pastikan:
- "steps" selalu berisi tepat 3 langkah singkat dan praktis
- "category" hanya boleh "Organik", "Anorganik", atau "B3"
- "eco_fact" maksimal 2 kalimat
- Semua teks dalam Bahasa Indonesia`;

  const dataUrl = `data:${mimeType};base64,${base64Image}`;

  const requestBody = {
    model: MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: [
          { type: "text", text: userPrompt },
          { type: "image_url", image_url: { url: dataUrl, detail: "low" } },
        ],
      },
    ],
    temperature: 0.3,
    max_tokens: 600,
    response_format: { type: "json_object" },
  };

  // ---- Network ----
  let response;
  try {
    response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });
  } catch (networkErr) {
    console.error("Network error contacting OpenAI:", networkErr);
    throw new Error("NETWORK_ERROR");
  }

  // ---- HTTP status ----
  if (!response.ok) {
    let serverMsg = "";
    try {
      const errBody = await response.json();
      serverMsg = errBody?.error?.message || "";
      console.error("OpenAI API error body:", errBody);
    } catch {
      // ignore
    }

    if (response.status === 429) {
      // 429 dari OpenAI bisa rate limit ATAU quota habis
      if (/quota|insufficient/i.test(serverMsg))
        throw new Error("API_KEY_INVALID");
      throw new Error("RATE_LIMIT");
    }
    if (response.status === 401) throw new Error("API_KEY_INVALID");
    if (response.status === 403) throw new Error("API_KEY_INVALID");
    if (response.status === 400 && /api[_ ]?key|invalid/i.test(serverMsg)) {
      throw new Error("API_KEY_INVALID");
    }
    throw new Error(`API_ERROR_${response.status}`);
  }

  // ---- Body ----
  let data;
  try {
    data = await response.json();
  } catch (e) {
    console.error("Failed to read JSON body:", e);
    throw new Error("PARSE_ERROR");
  }

  const choice = data?.choices?.[0];
  const finishReason = choice?.finish_reason;
  if (finishReason === "content_filter") {
    console.warn("OpenAI blocked response by content filter");
    throw new Error("EMPTY_RESPONSE");
  }

  const textContent = choice?.message?.content;
  if (!textContent) {
    console.warn("No text content from OpenAI:", data);
    throw new Error("EMPTY_RESPONSE");
  }

  // Strip markdown code fences just in case
  let jsonString = textContent.trim();
  if (jsonString.startsWith("```")) {
    jsonString = jsonString
      .replace(/^```(?:json)?\s*\n?/i, "")
      .replace(/\n?```\s*$/, "");
  }
  const firstBrace = jsonString.indexOf("{");
  const lastBrace = jsonString.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    jsonString = jsonString.slice(firstBrace, lastBrace + 1);
  }

  let result;
  try {
    result = JSON.parse(jsonString);
  } catch (e) {
    console.error("Failed to parse AI response:", textContent, e);
    throw new Error("PARSE_ERROR");
  }

  // Validate & normalize
  const required = ["object", "material", "category", "steps", "eco_fact"];
  for (const field of required) {
    if (!result[field]) {
      console.warn("Missing field in AI response:", field, result);
      throw new Error("PARSE_ERROR");
    }
  }

  const categoryMap = { organik: "Organik", anorganik: "Anorganik", b3: "B3" };
  result.category =
    categoryMap[String(result.category).toLowerCase().trim()] ||
    result.category;

  if (!Array.isArray(result.steps)) result.steps = [String(result.steps)];
  while (result.steps.length < 3)
    result.steps.push("Buang ke tempat sampah yang sesuai");
  result.steps = result.steps.slice(0, 3).map((s) => String(s));

  result.object = String(result.object);
  result.material = String(result.material);
  result.eco_fact = String(result.eco_fact);

  return result;
}
