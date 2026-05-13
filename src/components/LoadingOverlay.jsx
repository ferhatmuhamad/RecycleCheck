import { Recycle } from 'lucide-react';

export default function LoadingOverlay({ imageDataUrl }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/95 flex flex-col items-center justify-center p-6">
      {/* Scanning image */}
      <div className="relative w-full max-w-[280px] rounded-2xl overflow-hidden mb-8 fade-in-up">
        <img
          src={imageDataUrl}
          alt="Sedang dianalisis"
          className="w-full h-auto object-cover aspect-square opacity-60"
        />
        {/* Scan line */}
        <div className="scan-line" />
        {/* Overlay grid effect */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(0deg, transparent 24%, rgba(16,185,129,0.04) 25%, rgba(16,185,129,0.04) 26%, transparent 27%, transparent 74%, rgba(16,185,129,0.04) 75%, rgba(16,185,129,0.04) 76%, transparent 77%),
              linear-gradient(90deg, transparent 24%, rgba(16,185,129,0.04) 25%, rgba(16,185,129,0.04) 26%, transparent 27%, transparent 74%, rgba(16,185,129,0.04) 75%, rgba(16,185,129,0.04) 76%, transparent 77%)
            `,
            backgroundSize: '30px 30px',
          }}
        />
        {/* Corner brackets */}
        <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-emerald-400 rounded-tl" />
        <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-emerald-400 rounded-tr" />
        <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-emerald-400 rounded-bl" />
        <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-emerald-400 rounded-br" />
      </div>

      {/* Loading icon */}
      <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
        <Recycle className="w-7 h-7 text-emerald-400 animate-spin-slow" />
      </div>

      {/* Loading text */}
      <h3 className="text-white text-lg font-bold mb-2">Menganalisis Sampah</h3>
      <p className="text-slate-400 text-sm text-center loading-dots">
        AI sedang mengidentifikasi objek
      </p>

      {/* Shimmer skeleton preview */}
      <div className="w-full max-w-[300px] mt-8 space-y-3">
        <div className="shimmer h-5 w-3/4 rounded" />
        <div className="shimmer h-4 w-full rounded" />
        <div className="shimmer h-4 w-5/6 rounded" />
        <div className="shimmer h-8 w-1/3 rounded-full" />
      </div>
    </div>
  );
}
