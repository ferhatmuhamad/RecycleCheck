import { useEffect, useState } from 'react';
import { Leaf, Recycle, TrendingUp, Trash2 } from 'lucide-react';
import { getImpactStats } from '../utils/storage';

export default function ImpactDashboard() {
  const [stats, setStats] = useState(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const data = getImpactStats();
    setStats(data);
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!stats || stats.totalScanned === 0) {
    return (
      <div className="glass-card p-5 mx-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
            <Recycle className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Aksi Hijau Kamu</h3>
            <p className="text-slate-400 text-xs">Mulai pindai sampah untuk melacak kontribusimu!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-5 mx-4 mb-4 fade-in-up">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
        </div>
        <h3 className="font-bold text-slate-800 text-sm">Aksi Hijau Kamu</h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-emerald-50 rounded-xl p-3 text-center">
          <Trash2 className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
          <div className={`text-2xl font-extrabold text-emerald-700 ${animate ? 'count-up' : 'opacity-0'}`}>
            {stats.totalScanned}
          </div>
          <p className="text-emerald-600/70 text-[11px] font-medium mt-0.5">Sampah Dipilah</p>
        </div>
        <div className="bg-green-50 rounded-xl p-3 text-center">
          <Leaf className="w-5 h-5 text-green-500 mx-auto mb-1" />
          <div className={`text-2xl font-extrabold text-green-700 ${animate ? 'count-up' : 'opacity-0'}`}>
            {stats.carbonReduced}<span className="text-sm font-bold"> kg</span>
          </div>
          <p className="text-green-600/70 text-[11px] font-medium mt-0.5">CO₂ Berkurang</p>
        </div>
      </div>
      {(stats.categories.Organik > 0 || stats.categories.Anorganik > 0 || stats.categories.B3 > 0) && (
        <div className="flex gap-2 mt-3">
          {stats.categories.Organik > 0 && (
            <span className="flex-1 text-center py-1.5 rounded-lg bg-green-100 text-green-700 text-[11px] font-semibold">
              🌿 Organik: {stats.categories.Organik}
            </span>
          )}
          {stats.categories.Anorganik > 0 && (
            <span className="flex-1 text-center py-1.5 rounded-lg bg-yellow-100 text-yellow-700 text-[11px] font-semibold">
              📦 Anorganik: {stats.categories.Anorganik}
            </span>
          )}
          {stats.categories.B3 > 0 && (
            <span className="flex-1 text-center py-1.5 rounded-lg bg-red-100 text-red-700 text-[11px] font-semibold">
              ⚠️ B3: {stats.categories.B3}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
