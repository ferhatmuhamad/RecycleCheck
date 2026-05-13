import { AlertCircle, WifiOff, KeyRound, RefreshCw } from 'lucide-react';

const errorMessages = {
  API_KEY_MISSING: {
    icon: KeyRound,
    title: 'API Key Belum Dikonfigurasi',
    message: 'Tambahkan VITE_GEMINI_API_KEY di file .env untuk menggunakan fitur analisis AI.',
  },
  API_KEY_INVALID: {
    icon: KeyRound,
    title: 'API Key Tidak Valid',
    message: 'Periksa kembali API key Gemini Anda. Pastikan key aktif dan memiliki akses ke Gemini API.',
  },
  RATE_LIMIT: {
    icon: AlertCircle,
    title: 'Batas Penggunaan Tercapai',
    message: 'Anda telah mencapai batas permintaan API. Coba lagi dalam beberapa menit.',
  },
  PARSE_ERROR: {
    icon: AlertCircle,
    title: 'Gagal Memproses Hasil',
    message: 'AI tidak dapat menganalisis gambar ini dengan benar. Coba ambil foto yang lebih jelas.',
  },
  EMPTY_RESPONSE: {
    icon: AlertCircle,
    title: 'Tidak Ada Hasil',
    message: 'AI tidak mengenali objek dalam gambar. Pastikan objek terlihat jelas dan coba lagi.',
  },
  NETWORK_ERROR: {
    icon: WifiOff,
    title: 'Tidak Ada Koneksi Internet',
    message: 'Periksa koneksi internet Anda dan coba lagi.',
  },
};

export default function ErrorView({ errorCode, onRetry, onHome }) {
  const config = errorMessages[errorCode] || {
    icon: AlertCircle,
    title: 'Terjadi Kesalahan',
    message: 'Sesuatu yang tidak terduga terjadi. Silakan coba lagi.',
  };

  const Icon = config.icon;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 text-center">
      <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6 fade-in-up">
        <Icon className="w-10 h-10 text-red-400" />
      </div>
      <h2 className="text-xl font-bold text-slate-800 mb-3 fade-in-up">{config.title}</h2>
      <p className="text-slate-500 text-sm mb-8 max-w-xs fade-in-up">{config.message}</p>
      <div className="flex gap-3 fade-in-up">
        <button
          onClick={onHome}
          className="px-5 py-3 rounded-xl bg-slate-200 text-slate-700 font-semibold active:scale-95 transition-transform"
        >
          Beranda
        </button>
        <button
          onClick={onRetry}
          className="px-5 py-3 rounded-xl bg-emerald-500 text-white font-semibold flex items-center gap-2 active:scale-95 transition-transform"
        >
          <RefreshCw className="w-4 h-4" />
          Coba Lagi
        </button>
      </div>
    </div>
  );
}
