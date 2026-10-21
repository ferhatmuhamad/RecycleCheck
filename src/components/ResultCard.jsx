import { useState } from "react";
import {
  Leaf,
  Package,
  AlertTriangle,
  CheckCircle2,
  Share2,
  Sparkles,
  Info,
  ArrowLeft,
  FlaskConical,
} from "lucide-react";
import { generateWhatsAppLink, getImpactStats } from "../utils/storage";

const categoryConfig = {
  Organik: {
    chipClass: "chip-organik",
    icon: Leaf,
    gradient: "linear-gradient(135deg, #10b981 0%, #047857 60%, #064e3b 100%)",
    label: "Sampah Organik",
  },
  Anorganik: {
    chipClass: "chip-anorganik",
    icon: Package,
    gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 60%, #92400e 100%)",
    label: "Sampah Anorganik",
  },
  B3: {
    chipClass: "chip-b3",
    icon: AlertTriangle,
    gradient: "linear-gradient(135deg, #f43f5e 0%, #e11d48 60%, #9f1239 100%)",
    label: "Limbah B3",
  },
};

export default function ResultCard({
  result,
  imageDataUrl,
  onScanAgain,
  onBack,
}) {
  const [checked, setChecked] = useState([false, false, false]);
  const config = categoryConfig[result.category] || categoryConfig.Anorganik;
  const CategoryIcon = config.icon;
  const completed = checked.filter(Boolean).length;
  const toggle = (i) =>
    setChecked((p) => p.map((v, idx) => (idx === i ? !v : v)));

  const handleShare = () => {
    const stats = getImpactStats();
    window.open(generateWhatsAppLink(result, stats), "_blank");
  };

  return (
    <div className="screen-enter pb-nav" style={{ minHeight: "100dvh" }}>
      {/* Hero */}
      <div
        className="relative overflow-hidden text-white"
        style={{
          background: config.gradient,
          padding: "0 20px 80px",
          color: "white",
        }}>
        <div
          style={{
            position: "absolute",
            top: -64,
            right: -64,
            width: 220,
            height: 220,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.10)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -40,
            left: -40,
            width: 160,
            height: 160,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
          }}
        />

        <div
          className="safe-top relative flex items-center justify-between"
          style={{ paddingTop: 16 }}>
          <button
            onClick={onBack}
            className="btn-press flex items-center justify-center glass"
            style={{ width: 40, height: 40, borderRadius: "50%" }}>
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span
            style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              opacity: 0.85,
            }}>
            Hasil Analisis
          </span>
          <button
            onClick={handleShare}
            className="btn-press flex items-center justify-center glass"
            style={{ width: 40, height: 40, borderRadius: "50%" }}>
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        <div
          className="relative flex items-end gap-4"
          style={{ marginTop: 24 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              className="chip"
              style={{
                background: "rgba(255,255,255,0.95)",
                color: "#0f172a",
                marginBottom: 12,
                fontSize: 11,
              }}>
              <CategoryIcon className="w-3.5 h-3.5" />
              {config.label}
            </div>
            <h1
              style={{
                fontSize: 28,
                fontWeight: 800,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                wordBreak: "break-word",
              }}>
              {result.object}
            </h1>
            <p
              style={{
                marginTop: 6,
                fontSize: 13,
                fontWeight: 500,
                color: "rgba(255,255,255,0.85)",
              }}>
              {result.material}
            </p>
          </div>
          {imageDataUrl && (
            <div
              className="scale-in"
              style={{
                width: 80,
                height: 80,
                borderRadius: 18,
                overflow: "hidden",
                border: "2px solid rgba(255,255,255,0.4)",
                boxShadow: "0 12px 24px -8px rgba(0,0,0,0.35)",
                flexShrink: 0,
              }}>
              <img
                src={imageDataUrl}
                alt="Foto"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Cards */}
      <div
        className="px-4 stagger"
        style={{ marginTop: -56, position: "relative", zIndex: 10 }}>
        <div className="space-y-3">
          {/* Material */}
          <div
            className="card fade-in-up flex items-center gap-3"
            style={{ padding: 16 }}>
            <div
              className="flex items-center justify-center"
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background: "#ecfdf5",
                flexShrink: 0,
              }}>
              <FlaskConical className="w-5 h-5" style={{ color: "#059669" }} />
            </div>
            <div style={{ minWidth: 0 }}>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: "#94a3b8",
                  textTransform: "uppercase",
                }}>
                Material
              </p>
              <h3
                style={{
                  fontWeight: 700,
                  color: "#0f172a",
                  fontSize: 15,
                  marginTop: 2,
                }}>
                {result.material}
              </h3>
            </div>
          </div>

          {/* Steps */}
          <div className="card fade-in-up" style={{ padding: 16 }}>
            <div
              className="flex items-center justify-between"
              style={{ marginBottom: 14 }}>
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    background: "#dbeafe",
                    flexShrink: 0,
                  }}>
                  <CheckCircle2
                    className="w-5 h-5"
                    style={{ color: "#2563eb" }}
                  />
                </div>
                <div>
                  <p
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      color: "#94a3b8",
                      textTransform: "uppercase",
                    }}>
                    Langkah
                  </p>
                  <h3
                    style={{ fontWeight: 700, color: "#0f172a", fontSize: 15 }}>
                    Cara Membersihkan
                  </h3>
                </div>
              </div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#047857",
                  background: "#ecfdf5",
                  padding: "4px 10px",
                  borderRadius: 999,
                }}>
                {completed}/3
              </span>
            </div>

            <div className="space-y-2">
              {result.steps.map((step, i) => (
                <button
                  key={i}
                  onClick={() => toggle(i)}
                  className="w-full text-left flex items-start gap-3"
                  style={{
                    padding: 12,
                    borderRadius: 16,
                    background: checked[i]
                      ? "rgba(209, 250, 229, 0.5)"
                      : "#f8fafc",
                    border: `1px solid ${checked[i] ? "#a7f3d0" : "transparent"}`,
                    transition: "all 0.2s ease",
                  }}>
                  <div
                    className="flex items-center justify-center flex-shrink-0"
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 10,
                      marginTop: 2,
                      background: checked[i] ? "#10b981" : "#ffffff",
                      border: `1px solid ${checked[i] ? "#10b981" : "#e2e8f0"}`,
                      transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
                      transform: checked[i] ? "scale(1.05)" : "scale(1)",
                    }}>
                    {checked[i] ? (
                      <CheckCircle2
                        className="w-4 h-4"
                        style={{ color: "white" }}
                      />
                    ) : (
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 800,
                          color: "#64748b",
                        }}>
                        {i + 1}
                      </span>
                    )}
                  </div>
                  <p
                    style={{
                      flex: 1,
                      fontSize: 13,
                      lineHeight: 1.55,
                      color: checked[i] ? "#94a3b8" : "#334155",
                      fontWeight: 500,
                      textDecoration: checked[i] ? "line-through" : "none",
                      transition: "all 0.2s ease",
                    }}>
                    {step}
                  </p>
                </button>
              ))}
            </div>

            <div
              style={{
                marginTop: 14,
                height: 6,
                borderRadius: 999,
                background: "#f1f5f9",
                overflow: "hidden",
              }}>
              <div
                style={{
                  height: "100%",
                  borderRadius: 999,
                  width: `${(completed / 3) * 100}%`,
                  background: "linear-gradient(90deg, #34d399, #059669)",
                  transition: "width 0.5s ease-out",
                }}
              />
            </div>
          </div>

          {/* Eco fact */}
          <div
            className="fade-in-up"
            style={{
              borderRadius: 24,
              padding: 16,
              background: "linear-gradient(135deg, #fffbeb, #fef3c7)",
              border: "1px solid #fde68a",
            }}>
            <div
              className="flex items-center gap-3"
              style={{ marginBottom: 10 }}>
              <div
                className="flex items-center justify-center"
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: "white",
                  flexShrink: 0,
                }}>
                <Info className="w-5 h-5" style={{ color: "#d97706" }} />
              </div>
              <div>
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    color: "#a16207",
                    textTransform: "uppercase",
                  }}>
                  Tahukah Kamu?
                </p>
                <h3 style={{ fontWeight: 700, color: "#78350f", fontSize: 15 }}>
                  Dampak Lingkungan
                </h3>
              </div>
            </div>
            <p
              style={{
                fontSize: 13,
                lineHeight: 1.6,
                color: "#78350f",
                fontStyle: "italic",
              }}>
              🌍 {result.eco_fact}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 fade-in-up" style={{ paddingTop: 4 }}>
            <button
              onClick={handleShare}
              className="btn-press flex items-center justify-center gap-2"
              style={{
                flex: 1,
                padding: "14px 0",
                borderRadius: 18,
                background: "white",
                color: "#334155",
                fontWeight: 700,
                border: "1px solid #e2e8f0",
              }}>
              <Share2 className="w-5 h-5" />
              Bagikan
            </button>
            <button
              onClick={onScanAgain}
              className="btn-press flex items-center justify-center gap-2"
              style={{
                flex: 1.6,
                padding: "14px 0",
                borderRadius: 18,
                background: "linear-gradient(135deg, #10b981, #047857)",
                color: "white",
                fontWeight: 800,
                boxShadow: "0 12px 28px -8px rgba(16,185,129,0.5)",
              }}>
              <Sparkles className="w-5 h-5" />
              Pindai Lagi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
