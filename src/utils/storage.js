const STORAGE_KEY = "recyclecheck_impact";
const HISTORY_KEY = "recyclecheck_history";
const MAX_HISTORY = 30;

export function getImpactStats() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.warn("Failed to read impact stats:", e);
  }
  return {
    totalScanned: 0,
    categories: { Organik: 0, Anorganik: 0, B3: 0 },
    carbonReduced: 0,
  };
}

export function saveAction(category) {
  const stats = getImpactStats();
  stats.totalScanned += 1;
  if (stats.categories[category] !== undefined) {
    stats.categories[category] += 1;
  }
  stats.carbonReduced = parseFloat((stats.totalScanned * 0.5).toFixed(1));
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (e) {
    console.warn("Failed to save impact stats:", e);
  }
  return stats;
}

/* ---------------- HISTORY ---------------- */

export function getHistory() {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.warn("Failed to read history:", e);
  }
  return [];
}

export function saveHistoryEntry(result, thumbnailDataUrl) {
  const history = getHistory();
  const entry = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    object: result.object,
    material: result.material,
    category: result.category,
    steps: result.steps,
    eco_fact: result.eco_fact,
    thumbnail: thumbnailDataUrl || null,
  };
  history.unshift(entry);
  const trimmed = history.slice(0, MAX_HISTORY);
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
  } catch (e) {
    console.warn("History save failed, retrying without old thumbnails:", e);
    const compact = trimmed.map((h, i) =>
      i === 0 ? h : { ...h, thumbnail: null },
    );
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(compact));
    } catch (e2) {
      console.warn("History save still failed:", e2);
    }
  }
  return entry;
}

export function clearHistory() {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (e) {
    console.warn("Failed to clear history:", e);
  }
}

/**
 * Compress a dataURL by re-rendering at a smaller size for storage.
 */
export async function compressDataUrl(dataUrl, maxSize = 240, quality = 0.7) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const ratio = Math.min(maxSize / img.width, maxSize / img.height, 1);
      const w = Math.round(img.width * ratio);
      const h = Math.round(img.height * ratio);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

/* ---------------- SHARE ---------------- */

export function generateWhatsAppLink(result, stats) {
  const text = `♻️ *RecycleCheck - Aksi Hijau!*

Saya baru saja memilah sampah menggunakan RecycleCheck! 🌱

📦 *Benda:* ${result.object}
🏷️ *Material:* ${result.material}
📂 *Kategori:* ${result.category}

📊 *Total Sampah Dipilah:* ${stats.totalScanned} item
🌿 *Estimasi Pengurangan Karbon:* ${stats.carbonReduced} kg CO₂

🌍 ${result.eco_fact}

Yuk mulai pilah sampahmu juga! 💚`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export function resetAll() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(HISTORY_KEY);
  } catch (e) {
    console.warn("Failed to reset:", e);
  }
}

export function formatRelativeTime(iso) {
  const date = new Date(iso);
  const diff = (Date.now() - date.getTime()) / 1000;
  if (diff < 60) return "Baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} hari lalu`;
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
