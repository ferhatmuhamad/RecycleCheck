import { Leaf, TrendingUp, Trash2 } from "lucide-react";

export default function ImpactDashboard({ stats }) {
  const empty = !stats || stats.totalScanned === 0;
  const activeCategories = empty
    ? 0
    : Object.values(stats.categories).filter((v) => v > 0).length;

  return (
    <div
      className="relative overflow-hidden text-white"
      style={{
        borderRadius: 28,
        padding: 20,
        background:
          "linear-gradient(135deg, #10b981 0%, #047857 60%, #064e3b 100%)",
        boxShadow: "0 18px 48px -16px rgba(6, 95, 70, 0.55)",
      }}>
      <div
        style={{
          position: "absolute",
          top: -60,
          right: -60,
          width: 180,
          height: 180,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.10)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -50,
          left: -30,
          width: 140,
          height: 140,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.06)",
        }}
      />

      <div className="relative">
        <div className="flex items-center gap-2">
          <div
            className="flex items-center justify-center"
            style={{
              width: 28,
              height: 28,
              borderRadius: 10,
              background: "rgba(255,255,255,0.18)",
            }}>
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.12em",
              opacity: 0.85,
            }}>
            AKSI HIJAU KAMU
          </span>
        </div>

        <div className="flex items-end gap-2" style={{ marginTop: 16 }}>
          <span
            style={{
              fontSize: 56,
              lineHeight: 1,
              fontWeight: 800,
              letterSpacing: "-0.02em",
            }}>
            {empty ? 0 : stats.totalScanned}
          </span>
          <span
            style={{
              fontSize: 13,
              fontWeight: 500,
              opacity: 0.85,
              marginBottom: 6,
            }}>
            item dipilah
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3" style={{ marginTop: 20 }}>
          <div
            style={{
              borderRadius: 18,
              padding: 12,
              background: "rgba(255,255,255,0.16)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}>
            <Leaf
              className="w-4 h-4"
              style={{ opacity: 0.85, marginBottom: 6 }}
            />
            <p
              style={{
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                opacity: 0.75,
                fontWeight: 600,
              }}>
              CO₂ berkurang
            </p>
            <p style={{ fontSize: 18, fontWeight: 700, marginTop: 2 }}>
              {empty ? "0" : stats.carbonReduced}
              <span style={{ fontSize: 12, fontWeight: 500, opacity: 0.85 }}>
                {" "}
                kg
              </span>
            </p>
          </div>
          <div
            style={{
              borderRadius: 18,
              padding: 12,
              background: "rgba(255,255,255,0.16)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}>
            <Trash2
              className="w-4 h-4"
              style={{ opacity: 0.85, marginBottom: 6 }}
            />
            <p
              style={{
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                opacity: 0.75,
                fontWeight: 600,
              }}>
              Kategori aktif
            </p>
            <p style={{ fontSize: 18, fontWeight: 700, marginTop: 2 }}>
              {activeCategories}
              <span style={{ fontSize: 12, fontWeight: 500, opacity: 0.85 }}>
                {" "}
                jenis
              </span>
            </p>
          </div>
        </div>

        {!empty && activeCategories > 0 && (
          <div className="grid grid-cols-3 gap-2" style={{ marginTop: 12 }}>
            <Pill emoji="🌿" value={stats.categories.Organik} />
            <Pill emoji="📦" value={stats.categories.Anorganik} />
            <Pill emoji="⚠️" value={stats.categories.B3} />
          </div>
        )}
      </div>
    </div>
  );
}

function Pill({ emoji, value }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "8px 0",
        borderRadius: 14,
        background: "rgba(255,255,255,0.10)",
        fontSize: 11,
        fontWeight: 700,
      }}>
      <span style={{ marginRight: 4 }}>{emoji}</span>
      {value || 0}
    </div>
  );
}
