import { Leaf, Package, AlertTriangle, Inbox, Trash2 } from "lucide-react";
import { getHistory, clearHistory, formatRelativeTime } from "../utils/storage";

const categoryStyle = {
  Organik: { chip: "chip-organik", icon: Leaf },
  Anorganik: { chip: "chip-anorganik", icon: Package },
  B3: { chip: "chip-b3", icon: AlertTriangle },
};

export default function HistoryView({ onSelect, onChanged }) {
  const history = getHistory();

  const handleClear = () => {
    if (confirm("Hapus semua riwayat pemindaian?")) {
      clearHistory();
      onChanged?.();
    }
  };

  return (
    <div className="screen-enter px-5 pt-6 pb-nav">
      <div
        className="flex items-center justify-between"
        style={{ marginBottom: 20 }}>
        <div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: "#0f172a",
            }}>
            Riwayat
          </h1>
          <p style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>
            {history.length} pemindaian tersimpan
          </p>
        </div>
        {history.length > 0 && (
          <button
            onClick={handleClear}
            className="btn-press flex items-center justify-center"
            aria-label="Hapus riwayat"
            style={{
              width: 40,
              height: 40,
              borderRadius: 14,
              background: "white",
              border: "1px solid #e2e8f0",
              color: "#64748b",
            }}>
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div
          className="card text-center"
          style={{ padding: 32, marginTop: 32 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: "#ecfdf5",
              margin: "0 auto 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
            <Inbox className="w-7 h-7" style={{ color: "#10b981" }} />
          </div>
          <h3 style={{ fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>
            Belum Ada Riwayat
          </h3>
          <p
            style={{
              fontSize: 13,
              color: "#64748b",
              maxWidth: 260,
              margin: "0 auto",
              lineHeight: 1.5,
            }}>
            Mulai pindai sampah pertamamu — riwayat akan tampil di sini.
          </p>
        </div>
      ) : (
        <div className="space-y-3 stagger">
          {history.map((entry) => {
            const conf =
              categoryStyle[entry.category] || categoryStyle.Anorganik;
            const Icon = conf.icon;
            return (
              <button
                key={entry.id}
                onClick={() => onSelect?.(entry)}
                className="card btn-press fade-in-up w-full text-left flex items-center gap-3"
                style={{ padding: 12 }}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 16,
                    background: "#f1f5f9",
                    overflow: "hidden",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
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
                    <Icon className="w-6 h-6" style={{ color: "#94a3b8" }} />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    className="flex items-center justify-between gap-2"
                    style={{ marginBottom: 4 }}>
                    <h3
                      style={{
                        fontWeight: 700,
                        color: "#0f172a",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}>
                      {entry.object}
                    </h3>
                    <span
                      style={{ fontSize: 10, color: "#94a3b8", flexShrink: 0 }}>
                      {formatRelativeTime(entry.timestamp)}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 12,
                      color: "#64748b",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      marginBottom: 8,
                    }}>
                    {entry.material}
                  </p>
                  <span
                    className={`chip ${conf.chip}`}
                    style={{ fontSize: 10, padding: "3px 8px" }}>
                    <Icon className="w-3 h-3" />
                    {entry.category}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
