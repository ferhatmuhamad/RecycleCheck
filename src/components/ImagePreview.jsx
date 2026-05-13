import { Camera, RotateCcw } from 'lucide-react';

export default function ImagePreview({ imageDataUrl, onConfirm, onRetake }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col">
      {/* Preview image */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        <div className="relative w-full max-w-[400px] rounded-2xl overflow-hidden shadow-2xl fade-in-up">
          <img
            src={imageDataUrl}
            alt="Foto yang diambil"
            className="w-full h-auto object-contain max-h-[60vh]"
          />
          {/* Gradient overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
      </div>

      {/* Info text */}
      <div className="text-center px-6 mb-4">
        <p className="text-white/70 text-sm">
          Pastikan objek terlihat jelas dan tidak buram
        </p>
      </div>

      {/* Action buttons */}
      <div className="safe-bottom px-6 pb-8 flex gap-4">
        <button
          onClick={onRetake}
          className="flex-1 py-4 rounded-2xl bg-slate-800 text-white font-semibold flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <RotateCcw className="w-5 h-5" />
          Ambil Ulang
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-4 rounded-2xl bg-emerald-500 text-white font-semibold flex items-center justify-center gap-2 active:scale-95 transition-transform pulse-glow"
        >
          <Camera className="w-5 h-5" />
          Analisis
        </button>
      </div>
    </div>
  );
}
