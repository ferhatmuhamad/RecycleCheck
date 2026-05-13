import { useState } from 'react';
import {
  Leaf, Package, AlertTriangle, CheckCircle2, Circle,
  Share2, RotateCcw, Sparkles, Info
} from 'lucide-react';
import { generateWhatsAppLink, getImpactStats } from '../utils/storage';

const categoryConfig = {
  Organik: {
    color: 'bg-green-100 text-green-800 border-green-200',
    dotColor: 'bg-green-500',
    icon: Leaf,
    gradient: 'from-green-500 to-emerald-600',
  },
  Anorganik: {
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    dotColor: 'bg-yellow-500',
    icon: Package,
    gradient: 'from-yellow-500 to-amber-600',
  },
  B3: {
    color: 'bg-red-100 text-red-800 border-red-200',
    dotColor: 'bg-red-500',
    icon: AlertTriangle,
    gradient: 'from-red-500 to-rose-600',
  }
};

export default function ResultCard({ result, imageDataUrl, onScanAgain }) {
  const [checkedSteps, setCheckedSteps] = useState([false, false, false]);

  const config = categoryConfig[result.category] || categoryConfig.Anorganik;
  const CategoryIcon = config.icon;

  const toggleStep = (index) => {
    setCheckedSteps(prev => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const handleShare = () => {
    const stats = getImpactStats();
    const url = generateWhatsAppLink(result, stats);
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 safe-top safe-bottom">
      {/* Header gradient */}
      <div className={`relative bg-gradient-to-br ${config.gradient} pt-6 pb-16 px-5`}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-white/70 text-xs font-medium uppercase tracking-wider mb-1">Hasil Analisis</p>
            <h1 className="text-white text-2xl font-extrabold leading-tight">{result.object}</h1>
          </div>
          {/* Thumbnail */}
          <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-white/30 shadow-lg flex-shrink-0 ml-3">
            <img src={imageDataUrl} alt="Foto" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Category badge */}
        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border ${config.color}`}>
          <CategoryIcon className="w-4 h-4" />
          {result.category}
        </div>
      </div>

      {/* Content cards */}
      <div className="px-4 -mt-10 pb-6 space-y-4 stagger">
        {/* Material card */}
        <div className="glass-card p-5 fade-in-up" style={{ opacity: 0 }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-emerald-600" />
            </div>
            <h3 className="font-bold text-slate-800">Material</h3>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed">{result.material}</p>
        </div>

        {/* Cleaning steps card */}
        <div className="glass-card p-5 fade-in-up" style={{ opacity: 0 }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="font-bold text-slate-800">Cara Membersihkan</h3>
          </div>
          <div className="space-y-3">
            {result.steps.map((step, i) => (
              <button
                key={i}
                onClick={() => toggleStep(i)}
                className="flex items-start gap-3 w-full text-left group"
              >
                <div className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                  checkedSteps[i]
                    ? 'bg-emerald-500 scale-110'
                    : 'bg-slate-100 group-hover:bg-slate-200'
                }`}>
                  {checkedSteps[i] ? (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  ) : (
                    <span className="text-xs font-bold text-slate-400">{i + 1}</span>
                  )}
                </div>
                <p className={`text-sm leading-relaxed transition-all duration-300 ${
                  checkedSteps[i]
                    ? 'text-slate-400 line-through'
                    : 'text-slate-700'
                }`}>
                  {step}
                </p>
              </button>
            ))}
          </div>
          {/* Progress bar */}
          <div className="mt-4 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(checkedSteps.filter(Boolean).length / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Eco fact card */}
        <div className="glass-card p-5 fade-in-up" style={{ opacity: 0 }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
              <Info className="w-4 h-4 text-amber-600" />
            </div>
            <h3 className="font-bold text-slate-800">Tahukah Kamu?</h3>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed italic">
            🌍 {result.eco_fact}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 pt-2 fade-in-up" style={{ opacity: 0 }}>
          <button
            onClick={handleShare}
            className="flex-1 py-3.5 rounded-2xl bg-green-600 text-white font-semibold flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-green-600/20"
          >
            <Share2 className="w-5 h-5" />
            Bagikan
          </button>
          <button
            onClick={onScanAgain}
            className="flex-1 py-3.5 rounded-2xl bg-white text-slate-700 font-semibold flex items-center justify-center gap-2 active:scale-95 transition-transform border border-slate-200 shadow-sm"
          >
            <RotateCcw className="w-5 h-5" />
            Pindai Lagi
          </button>
        </div>
      </div>
    </div>
  );
}
