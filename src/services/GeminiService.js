const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

/**
 * Analyze a waste item image using Google Gemini Vision API.
 * @param {string} base64Image - Base64 encoded image data (without data URI prefix)
 * @param {string} mimeType - MIME type of the image (e.g., 'image/jpeg')
 * @returns {Promise<Object>} Parsed analysis result
 */
export async function analyzeWaste(base64Image, mimeType = 'image/jpeg') {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('API_KEY_MISSING');
  }

  const prompt = `Analisis gambar ini secara mendalam. Kamu adalah ahli pengelolaan sampah di Indonesia.

Berikan respons HANYA dalam format JSON berikut (tanpa markdown code block, tanpa teks tambahan):

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

  const requestBody = {
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inline_data: {
              mime_type: mimeType,
              data: base64Image
            }
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.3,
      topK: 32,
      topP: 1,
      maxOutputTokens: 1024,
    }
  };

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('RATE_LIMIT');
    }
    if (response.status === 403) {
      throw new Error('API_KEY_INVALID');
    }
    throw new Error(`API_ERROR_${response.status}`);
  }

  const data = await response.json();

  // Extract text from response
  const textContent = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!textContent) {
    throw new Error('EMPTY_RESPONSE');
  }

  // Parse JSON from response (handle potential markdown code blocks)
  let jsonString = textContent.trim();
  
  // Remove markdown code block wrapper if present
  if (jsonString.startsWith('```')) {
    jsonString = jsonString.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
  }

  try {
    const result = JSON.parse(jsonString);

    // Validate required fields
    const requiredFields = ['object', 'material', 'category', 'steps', 'eco_fact'];
    for (const field of requiredFields) {
      if (!result[field]) {
        throw new Error(`Missing field: ${field}`);
      }
    }

    // Normalize category
    const categoryMap = {
      'organik': 'Organik',
      'anorganik': 'Anorganik',
      'b3': 'B3'
    };
    result.category = categoryMap[result.category.toLowerCase()] || result.category;

    // Ensure steps is array of 3
    if (!Array.isArray(result.steps)) {
      result.steps = [result.steps];
    }
    while (result.steps.length < 3) {
      result.steps.push('Buang ke tempat sampah yang sesuai');
    }
    result.steps = result.steps.slice(0, 3);

    return result;
  } catch (parseError) {
    console.error('Failed to parse AI response:', textContent);
    throw new Error('PARSE_ERROR');
  }
}
