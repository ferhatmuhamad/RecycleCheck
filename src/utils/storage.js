const STORAGE_KEY = 'recyclecheck_impact';

/**
 * Get the current impact statistics from localStorage.
 * @returns {{ totalScanned: number, categories: { Organik: number, Anorganik: number, B3: number }, carbonReduced: number }}
 */
export function getImpactStats() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Failed to read impact stats:', e);
  }
  return {
    totalScanned: 0,
    categories: { Organik: 0, Anorganik: 0, B3: 0 },
    carbonReduced: 0
  };
}

/**
 * Save a new scan action and update impact statistics.
 * @param {string} category - One of 'Organik', 'Anorganik', 'B3'
 */
export function saveAction(category) {
  const stats = getImpactStats();
  stats.totalScanned += 1;

  if (stats.categories[category] !== undefined) {
    stats.categories[category] += 1;
  }

  // Simple carbon reduction formula: each sorted item = 0.5kg CO2 saved
  stats.carbonReduced = parseFloat((stats.totalScanned * 0.5).toFixed(1));

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (e) {
    console.warn('Failed to save impact stats:', e);
  }

  return stats;
}

/**
 * Generate a WhatsApp share message for a scanned waste item.
 * @param {Object} result - The AI analysis result
 * @param {Object} stats - The current impact stats
 * @returns {string} WhatsApp share URL
 */
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

/**
 * Reset all impact statistics.
 */
export function resetStats() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Failed to reset stats:', e);
  }
}
