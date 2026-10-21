import { Camera, RotateCcw, Sparkles } from "lucide-react";

export default function ImagePreview({ imageDataUrl, onConfirm, onRetake }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col safe-top safe-bottom">
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        <button
          onClick={onRetake}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center btn-press">
          <RotateCcw className="w-4 h-4 text-white" />
        </button>
        <h2 className="text-white text-sm font-semibold">Pratinjau Foto</h2>
        <div className="w-10" />
      </div>

      <div className="flex-1 flex items-center justify-center px-5 overflow-hidden">
        <div className="relative w-full max-w-[420px] rounded-[28px] overflow-hidden shadow-2xl scale-in">
          <img
            src={imageDataUrl}
            alt="Foto yang diambil"
            className="w-full h-auto object-contain max-h-[60vh] bg-black"
          />
          <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-emerald-500/90 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" />
            SIAP DIANALISIS
          </div>
        </div>
      </div>

      <div className="text-center px-8 mt-4 mb-2">
        <p className="text-slate-400 text-xs">
          Pastikan objek terlihat jelas dan tidak buram
        </p>
      </div>

      <div className="px-5 pb-6 pt-4 flex gap-3">
        <button
          onClick={onRetake}
          className="flex-1 py-4 rounded-2xl bg-white/10 text-white font-semibold flex items-center justify-center gap-2 btn-press">
          <RotateCcw className="w-5 h-5" />
          Ulang
        </button>
        <button
          onClick={onConfirm}
          className="flex-[2] py-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-emerald-600 text-white font-bold flex items-center justify-center gap-2 btn-press shadow-lg shadow-emerald-500/30">
          <Sparkles className="w-5 h-5" />
          Analisis dengan AI
        </button>
      </div>
    </div>
  );
}
