import {
  Sparkles,
  ChevronRight,
  Camera,
  Leaf,
  Package,
  AlertTriangle,
  Recycle,
} from "lucide-react";
import ImpactDashboard from "./ImpactDashboard";
import { formatRelativeTime } from "../utils/storage";

const categoryStyle = {
  Organik: { chip: "chip-organik", icon: Leaf },
  Anorganik: { chip: "chip-anorganik", icon: Package },
  B3: { chip: "chip-b3", icon: AlertTriangle },
};

const tips = [
  {
    emoji: "🥤",
    title: "Botol Plastik",
    desc: "Bilas, lepas label, dan pipihkan sebelum dibuang.",
  },
  {
    emoji: "🍌",
    title: "Sisa Makanan",
    desc: "Pisahkan untuk komposter — kurangi sampah TPA.",
  },
  {
    emoji: "🔋",
    title: "Baterai Bekas",
    desc: "Termasuk B3, jangan dibuang ke tempat sampah biasa.",
  },
];

export default function HomeView({
  stats,
  history,
  onScan,
  onSelectHistory,
  onSeeAllHistory,
}) {
  const recent = history.slice(0, 4);

  return (
    <div className="screen-enter pb-nav">
      {/* Header */}
      <header className="safe-top px-5 pt-4 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center"
            style={{
              width: 44,
              height: 44,
              borderRadius: 16,
              background: "linear-gradient(135deg, #34d399, #047857)",
              boxShadow: "0 8px 22px -6px rgba(16,185,129,0.5)",
              color: "white",
            }}>
            <Recycle className="w-5 h-5" strokeWidth={2.4} />
          </div>
          <div>
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.12em",
                color: "#94a3b8",
                textTransform: "uppercase",
              }}>
              RecycleCheck
            </p>
            <h1
              style={{
                fontSize: 16,
                fontWeight: 800,
                letterSpacing: "-0.01em",
                color: "#0f172a",
                lineHeight: 1.1,
              }}>
              Halo, Eco Hero 👋
            </h1>
          </div>
        </div>
        <div
          style={{
            padding: "6px 12px",
            borderRadius: 999,
            background: "#ecfdf5",
            border: "1px solid #a7f3d0",
          }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#047857" }}>
            v1.0
          </span>
        </div>
      </header>

      {/* Hero impact */}
      <section className="px-5 mt-3">
        <ImpactDashboard stats={stats} />
      </section>

      {/* Primary CTA */}
      <section className="px-5 mt-5">
        <button
          onClick={onScan}
          className="card btn-press w-full text-left"
          style={{
            padding: 18,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}>
          <div style={{ position: "relative" }}>
            <div
              style={{
                position: "absolute",
                inset: -6,
                borderRadius: 22,
                background: "rgba(16,185,129,0.18)",
                filter: "blur(10px)",
              }}
            />
            <div
              style={{
                position: "relative",
                width: 52,
                height: 52,
                borderRadius: 16,
                background: "linear-gradient(135deg, #34d399, #047857)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                boxShadow: "0 8px 22px -6px rgba(16,185,129,0.5)",
              }}>
              <Camera className="w-6 h-6" strokeWidth={2.4} />
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              className="flex items-center gap-1.5"
              style={{ marginBottom: 2 }}>
              <Sparkles className="w-3 h-3" style={{ color: "#059669" }} />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  color: "#047857",
                  textTransform: "uppercase",
                }}>
                AI Powered
              </span>
            </div>
            <h2 style={{ fontWeight: 800, color: "#0f172a", fontSize: 16 }}>
              Mulai Pindai Sampah
            </h2>
            <p style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
              Identifikasi otomatis dengan kamera
            </p>
          </div>
          <ChevronRight className="w-5 h-5" style={{ color: "#94a3b8" }} />
        </button>
      </section>

      {/* Recent history */}
      {recent.length > 0 && (
        <section className="px-5" style={{ marginTop: 28 }}>
          <div
            className="flex items-center justify-between"
            style={{ marginBottom: 12 }}>
            <h2 style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>
              Pemindaian Terakhir
            </h2>
            <button
              onClick={onSeeAllHistory}
              className="flex items-center gap-0.5"
              style={{ fontSize: 12, fontWeight: 700, color: "#047857" }}>
              Lihat semua <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div
            className="flex gap-3 overflow-x-auto no-scrollbar -mx-5 px-5"
            style={{ paddingBottom: 4 }}>
            {recent.map((entry) => {
              const conf =
                categoryStyle[entry.category] || categoryStyle.Anorganik;
              const Icon = conf.icon;
              return (
                <button
                  key={entry.id}
                  onClick={() => onSelectHistory(entry)}
                  className="card btn-press text-left"
                  style={{
                    width: 152,
                    flexShrink: 0,
                    overflow: "hidden",
                    padding: 0,
                  }}>
                  <div
                    style={{
                      width: "100%",
                      height: 96,
                      background: "#f1f5f9",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                    }}>
                    {entry.thumbnail ? (
                      <img
                        src={entry.thumbnail}
                        alt={entry.object}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <Icon className="w-7 h-7" style={{ color: "#94a3b8" }} />
                    )}
                  </div>
                  <div style={{ padding: 10 }}>
                    <p
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#0f172a",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}>
                      {entry.object}
                    </p>
                    <div
                      className="flex items-center justify-between"
                      style={{ marginTop: 6 }}>
                      <span
                        className={`chip ${conf.chip}`}
                        style={{ fontSize: 9, padding: "2px 6px" }}>
                        {entry.category}
                      </span>
                      <span style={{ fontSize: 9, color: "#94a3b8" }}>
                        {formatRelativeTime(entry.timestamp)}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Tips */}
      <section className="px-5" style={{ marginTop: 28 }}>
        <h2
          style={{
            fontSize: 14,
            fontWeight: 800,
            color: "#0f172a",
            marginBottom: 12,
          }}>
          Tips Pemilahan
        </h2>
        <div className="space-y-3 stagger">
          {tips.map((tip, i) => (
            <div
              key={i}
              className="card fade-in-up flex items-center gap-3"
              style={{ padding: 14 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: "#ecfdf5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                }}>
                {tip.emoji}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontWeight: 700, color: "#0f172a", fontSize: 14 }}>
                  {tip.title}
                </h3>
                <p
                  style={{
                    fontSize: 12,
                    color: "#64748b",
                    marginTop: 2,
                    lineHeight: 1.5,
                  }}>
                  {tip.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
