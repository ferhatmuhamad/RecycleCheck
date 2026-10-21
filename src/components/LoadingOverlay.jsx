import { Sparkles } from "lucide-react";

export default function LoadingOverlay({ imageDataUrl }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-6 safe-top safe-bottom">
      <div className="relative w-full max-w-[280px] aspect-square rounded-[28px] overflow-hidden mb-8 scale-in">
        <img
          src={imageDataUrl}
          alt="Sedang dianalisis"
          className="w-full h-full object-cover opacity-50"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(0deg, transparent 24%, rgba(16,185,129,0.06) 25%, rgba(16,185,129,0.06) 26%, transparent 27%, transparent 74%, rgba(16,185,129,0.06) 75%, rgba(16,185,129,0.06) 76%, transparent 77%),
              linear-gradient(90deg, transparent 24%, rgba(16,185,129,0.06) 25%, rgba(16,185,129,0.06) 26%, transparent 27%, transparent 74%, rgba(16,185,129,0.06) 75%, rgba(16,185,129,0.06) 76%, transparent 77%)
            `,
            backgroundSize: "32px 32px",
          }}
        />
        <div className="scan-line" />
        <div className="viewfinder-corner top-left" />
        <div className="viewfinder-corner top-right" />
        <div className="viewfinder-corner bottom-left" />
        <div className="viewfinder-corner bottom-right" />
      </div>

      <div className="relative w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mb-5">
        <Sparkles className="w-6 h-6 text-emerald-400 spin-slow" />
      </div>

      <h3 className="text-white text-lg font-bold mb-1">Menganalisis Sampah</h3>
      <p className="text-slate-400 text-sm loading-dots mb-8">
        AI sedang mengidentifikasi objek
      </p>

      <div className="w-full max-w-[300px] space-y-3">
        <div className="shimmer h-5 w-3/4 rounded-lg" />
        <div className="shimmer h-4 w-full rounded-lg" />
        <div className="shimmer h-4 w-5/6 rounded-lg" />
        <div className="shimmer h-8 w-1/3 rounded-full mt-4" />
      </div>
    </div>
  );
}
