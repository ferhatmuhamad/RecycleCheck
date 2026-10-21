import { Home, Clock, Camera } from "lucide-react";

const items = [
  { id: "home", label: "Beranda", icon: Home },
  { id: "scan", label: "Pindai", icon: Camera, fab: true },
  { id: "history", label: "Riwayat", icon: Clock },
];

export default function BottomNav({ active, onChange, onScan }) {
  return (
    <nav className="bottom-nav">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.id;
        if (item.fab) {
          return (
            <div key={item.id} className="fab-wrap">
              <button
                onClick={onScan}
                aria-label="Mulai Pindai"
                className="fab">
                <Icon className="w-6 h-6" strokeWidth={2.4} />
              </button>
            </div>
          );
        }
        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={`nav-item${isActive ? " active" : ""}`}>
            <Icon className="w-5 h-5" strokeWidth={isActive ? 2.4 : 2} />
            <span>{item.label}</span>
            <span className="nav-dot" />
          </button>
        );
      })}
    </nav>
  );
}
