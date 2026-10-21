# ♻️ RecycleCheck

PWA pintar untuk membantu memilah sampah rumah tangga menggunakan kamera HP dan **Google Gemini Vision AI**. Dirancang mobile-first, ringan, dan terasa seperti aplikasi native.

![Powered by Gemini](https://img.shields.io/badge/AI-Gemini%20Vision-10b981) ![React 19](https://img.shields.io/badge/React-19-61dafb) ![PWA](https://img.shields.io/badge/PWA-ready-5a0fc8) ![Tailwind v4](https://img.shields.io/badge/Tailwind-v4-38bdf8)

---

## ✨ Fitur

- 📸 **Kamera Full-Screen** — akses kamera belakang via `getUserMedia`, dengan toggle **flash (torch)** dan **pindah kamera** depan/belakang
- 🖼️ **Image Preview** — review foto sebelum dianalisis (ambil ulang / lanjut)
- 🤖 **Gemini Vision AI** — identifikasi benda, material, kategori (Organik/Anorganik/B3), 3 langkah pembersihan, dan eco-fact
- 🎨 **UI Card-based** — badge berwarna (Organik / Anorganik / B3) + checklist interaktif
- ✨ **Loading "Smart"** — scan-line animasi + shimmer skeleton saat AI bekerja
- 📊 **Impact Tracker** — total sampah dipilah & estimasi pengurangan CO₂ (LocalStorage)
- 💬 **Share ke WhatsApp** — auto-generate teks keberhasilan
- 📱 **PWA Installable** — manifest + service worker via `vite-plugin-pwa`
- 🛡️ **Error Handling** ramah pengguna (kamera ditolak, API limit, tanpa internet, dst.)

---

## 🚀 Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Konfigurasi API Key Gemini

Dapatkan API key gratis dari **[Google AI Studio](https://aistudio.google.com/apikey)**, lalu:

```bash
cp .env.example .env
```

Edit `.env` dan isi key Anda:

```env
VITE_GEMINI_API_KEY=AIzaSy....your_key_here
```

> ⚠️ Jangan commit file `.env` ke git. File `.env.example` sudah disediakan sebagai template.

### 3. Jalankan development server

```bash
npm run dev
```

Buka `http://localhost:5173`. Untuk uji kamera di HP, gunakan jaringan lokal:

```bash
npm run dev -- --host
```

Lalu akses dari HP via `https://<ip-laptop>:5173` (kamera butuh HTTPS atau `localhost`).

### 4. Build production

```bash
npm run build
npm run preview
```

---

## 📂 Struktur Proyek

```
RecycleCheck/
├── public/icons/               # icon PWA (192, 512, favicon)
├── src/
│   ├── App.jsx                 # router state-machine (home/camera/preview/loading/result/error)
│   ├── main.jsx                # entry point React
│   ├── index.css               # Tailwind v4 + animasi (shimmer, scan-line, glass-card)
│   ├── components/
│   │   ├── CameraScanner.jsx   # akses kamera + canvas capture + flash/switch
│   │   ├── ImagePreview.jsx    # preview foto sebelum dianalisis
│   │   ├── LoadingOverlay.jsx  # animasi scanning + shimmer
│   │   ├── ResultCard.jsx      # hasil AI: badge, checklist, eco-fact, share
│   │   ├── ImpactDashboard.jsx # tracker LocalStorage (total + CO₂)
│   │   └── ErrorView.jsx       # tampilan error ramah user
│   ├── services/GeminiService.js  # POST ke Gemini Vision API + parsing JSON
│   └── utils/storage.js           # LocalStorage + WhatsApp share link
├── .env.example
├── index.html
├── vite.config.js              # Vite + React + Tailwind v4 + PWA
└── package.json
```

---

## 🎨 Desain & UX

- **Palet warna:** Emerald `#10b981` (utama) di atas Slate-50 `#f8fafc`
- **Tipografi:** Inter (Google Fonts)
- **Mobile-first:** kontainer maksimum **480px** di desktop agar terlihat seperti HP
- **Native-like:** safe-area inset, tap-highlight off, `active:scale` feedback, glassmorphism cards

---

## 🤖 Format Output AI

`GeminiService.js` mengirim prompt ke `gemini-2.0-flash` dan menerima JSON:

```json
{
  "object": "Botol Air Mineral",
  "material": "Plastik PET",
  "category": "Anorganik",
  "steps": ["Bilas hingga bersih", "Lepas label & tutup", "Pipihkan botol"],
  "eco_fact": "Botol PET butuh ratusan tahun untuk terurai di alam."
}
```

Validasi otomatis: `category` di-normalize ke `Organik`/`Anorganik`/`B3`, dan `steps` dipastikan tepat 3 item.

---

## 📊 Rumus Impact

```
carbonReduced (kg) = totalScanned × 0.5
```

Disimpan di `localStorage` dengan key `recyclecheck_impact`.

---

## 🐛 Troubleshooting

| Masalah             | Solusi                                                                                          |
| ------------------- | ----------------------------------------------------------------------------------------------- |
| Kamera tidak muncul | Pastikan akses HTTPS atau `localhost`, izinkan permission di browser                            |
| Flash tidak ada     | Browser/perangkat tidak mendukung `MediaTrackCapabilities.torch` (umumnya hanya Android Chrome) |
| `API_KEY_MISSING`   | Cek file `.env`, restart `npm run dev` setelah mengubahnya                                      |
| `RATE_LIMIT`        | Tunggu beberapa menit; tier gratis Gemini punya limit per menit                                 |
| Foto blur           | Gunakan tombol "Ambil Ulang" pada layar preview                                                 |

---

MIT © 2025 RecycleCheck — Powered by Google Gemini AI 💚
