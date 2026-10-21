import {
  AlertCircle,
  WifiOff,
  KeyRound,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";

const errorMessages = {
  API_KEY_MISSING: {
    icon: KeyRound,
    title: "API Key Belum Dikonfigurasi",
    message:
      "Tambahkan VITE_OPENAI_API_KEY di file .env, lalu restart server (npm run dev).",
  },
  API_KEY_INVALID: {
    icon: KeyRound,
    title: "API Key Tidak Valid",
    message:
      "Periksa kembali API key OpenAI Anda di file .env. Pastikan key aktif dan kredit/billing belum habis.",
  },
  RATE_LIMIT: {
    icon: AlertCircle,
    title: "Batas Penggunaan Tercapai",
    message:
      "Anda telah mencapai batas permintaan API. Coba lagi dalam beberapa menit.",
  },
  PARSE_ERROR: {
    icon: AlertCircle,
    title: "Gagal Memproses Hasil",
    message:
      "AI tidak dapat menganalisis gambar ini dengan benar. Coba ambil foto yang lebih jelas.",
  },
  EMPTY_RESPONSE: {
    icon: AlertCircle,
    title: "Tidak Ada Hasil",
    message:
      "AI tidak mengenali objek dalam gambar. Pastikan objek terlihat jelas dan coba lagi.",
  },
  NETWORK_ERROR: {
    icon: WifiOff,
    title: "Tidak Ada Koneksi Internet",
    message: "Periksa koneksi internet Anda dan coba lagi.",
  },
};

export default function ErrorView({ errorCode, onRetry, onHome }) {
  // Map any API_ERROR_<status> to a generic message with the code visible
  let config = errorMessages[errorCode];
  if (!config && errorCode?.startsWith?.("API_ERROR_")) {
    config = {
      icon: AlertCircle,
      title: "Layanan AI Bermasalah",
      message: `Server OpenAI mengembalikan error (${errorCode.replace("API_ERROR_", "HTTP ")}). Coba lagi sebentar.`,
    };
  }
  if (!config) {
    config = {
      icon: AlertCircle,
      title: "Terjadi Kesalahan",
      message: "Sesuatu yang tidak terduga terjadi. Silakan coba lagi.",
    };
  }
  const Icon = config.icon;

  return (
    <div
      className="screen-enter flex flex-col safe-top safe-bottom"
      style={{ minHeight: "100dvh", padding: "20px 24px" }}>
      <button
        onClick={onHome}
        className="btn-press flex items-center justify-center"
        style={{
          width: 40,
          height: 40,
          borderRadius: 14,
          background: "white",
          border: "1px solid #e2e8f0",
          color: "#334155",
        }}>
        <ArrowLeft className="w-5 h-5" />
      </button>

      <div
        className="flex flex-col items-center justify-center text-center"
        style={{ flex: 1, padding: "0 8px" }}>
        <div
          className="scale-in flex items-center justify-center"
          style={{
            width: 88,
            height: 88,
            borderRadius: 24,
            background: "#fef2f2",
            border: "1px solid #fecaca",
            marginBottom: 24,
          }}>
          <Icon className="w-10 h-10" style={{ color: "#f43f5e" }} />
        </div>
        <h2
          className="fade-in-up"
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "#0f172a",
            marginBottom: 10,
          }}>
          {config.title}
        </h2>
        <p
          className="fade-in-up"
          style={{
            fontSize: 14,
            color: "#64748b",
            lineHeight: 1.55,
            maxWidth: 300,
            marginBottom: 36,
          }}>
          {config.message}
        </p>
        <div
          className="flex gap-3 fade-in-up"
          style={{ width: "100%", maxWidth: 320 }}>
          <button
            onClick={onHome}
            className="btn-press"
            style={{
              flex: 1,
              padding: "14px 0",
              borderRadius: 16,
              background: "white",
              border: "1px solid #e2e8f0",
              color: "#334155",
              fontWeight: 700,
              fontSize: 14,
            }}>
            Beranda
          </button>
          <button
            onClick={onRetry}
            className="btn-press flex items-center justify-center gap-2"
            style={{
              flex: 1.4,
              padding: "14px 0",
              borderRadius: 16,
              background: "linear-gradient(135deg, #10b981, #047857)",
              color: "white",
              fontWeight: 700,
              fontSize: 14,
              boxShadow: "0 12px 28px -8px rgba(16,185,129,0.5)",
            }}>
            <RefreshCw className="w-4 h-4" />
            Coba Lagi
          </button>
        </div>
      </div>
    </div>
  );
}
