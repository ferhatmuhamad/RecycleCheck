import { useState, useRef, useEffect, useCallback } from "react";
import {
  SwitchCamera,
  Zap,
  ZapOff,
  X,
  Image as ImageIcon,
  Camera as CameraIcon,
} from "lucide-react";

export default function CameraScanner({ onCapture, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const trackRef = useRef(null);
  const fileInputRef = useRef(null);

  const [facingMode, setFacingMode] = useState("environment");
  const [flashOn, setFlashOn] = useState(false);
  const [flashSupported, setFlashSupported] = useState(false);
  const [error, setError] = useState(null);
  const [isReady, setIsReady] = useState(false);

  const startCamera = useCallback(async (facing) => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setError("UNSUPPORTED");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });
      streamRef.current = stream;
      const videoTrack = stream.getVideoTracks()[0];
      trackRef.current = videoTrack;

      const capabilities = videoTrack.getCapabilities?.();
      setFlashSupported(!!capabilities?.torch);
      if (!capabilities?.torch) setFlashOn(false);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsReady(true);
        setError(null);
      }
    } catch (err) {
      console.error("Camera error:", err);
      if (
        err.name === "NotAllowedError" ||
        err.name === "PermissionDeniedError"
      ) {
        setError("PERMISSION_DENIED");
      } else if (
        err.name === "NotFoundError" ||
        err.name === "DevicesNotFoundError"
      ) {
        setError("NO_CAMERA");
      } else if (err.name === "NotReadableError") {
        setError("CAMERA_BUSY");
      } else {
        setError("CAMERA_ERROR");
      }
    }
  }, []);

  useEffect(() => {
    startCamera(facingMode);
    return () => {
      if (streamRef.current)
        streamRef.current.getTracks().forEach((t) => t.stop());
    };
  }, [facingMode, startCamera]);

  const toggleFlash = async () => {
    if (!trackRef.current || !flashSupported) return;
    const newState = !flashOn;
    try {
      await trackRef.current.applyConstraints({
        advanced: [{ torch: newState }],
      });
      setFlashOn(newState);
    } catch (err) {
      console.warn("Flash toggle failed:", err);
    }
  };

  const switchCamera = () =>
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (facingMode === "user") {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    const base64 = dataUrl.split(",")[1];
    if (streamRef.current)
      streamRef.current.getTracks().forEach((t) => t.stop());
    onCapture({ dataUrl, base64 });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      // Re-encode to jpeg for consistent base64
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDim = 1600;
        const ratio = Math.min(maxDim / img.width, maxDim / img.height, 1);
        canvas.width = Math.round(img.width * ratio);
        canvas.height = Math.round(img.height * ratio);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const out = canvas.toDataURL("image/jpeg", 0.85);
        const base64 = out.split(",")[1];
        if (streamRef.current)
          streamRef.current.getTracks().forEach((t) => t.stop());
        onCapture({ dataUrl: out, base64 });
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const openFilePicker = () => fileInputRef.current?.click();

  // ---------------- ERROR / FALLBACK SCREEN ----------------
  if (error) {
    const messages = {
      PERMISSION_DENIED: {
        title: "Akses Kamera Ditolak",
        desc: "Izinkan kamera di pengaturan browser, atau pilih foto dari galeri sebagai alternatif.",
      },
      NO_CAMERA: {
        title: "Tidak Ada Kamera",
        desc: "Perangkat ini tidak terdeteksi memiliki kamera. Kamu masih bisa upload foto dari galeri.",
      },
      CAMERA_BUSY: {
        title: "Kamera Sedang Dipakai",
        desc: "Aplikasi lain sedang menggunakan kamera. Tutup aplikasi tersebut, atau upload dari galeri.",
      },
      UNSUPPORTED: {
        title: "Browser Tidak Mendukung",
        desc: "Browser ini tidak mendukung akses kamera. Silakan upload foto dari galeri.",
      },
      CAMERA_ERROR: {
        title: "Gagal Membuka Kamera",
        desc: "Terjadi kesalahan saat membuka kamera. Coba lagi atau pilih dari galeri.",
      },
    };
    const m = messages[error] || messages.CAMERA_ERROR;
    return (
      <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center p-8 text-center safe-top safe-bottom">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center safe-top">
          <X className="w-5 h-5 text-white" />
        </button>
        <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 scale-in">
          <CameraIcon className="w-9 h-9 text-emerald-400" />
        </div>
        <h2
          className="text-white text-xl font-bold mb-3 fade-in-up"
          style={{ animationDelay: "60ms" }}>
          {m.title}
        </h2>
        <p
          className="text-slate-400 text-sm leading-relaxed max-w-xs mb-8 fade-in-up"
          style={{ animationDelay: "120ms" }}>
          {m.desc}
        </p>
        <div
          className="w-full max-w-xs space-y-3 fade-in-up"
          style={{ animationDelay: "180ms" }}>
          <button
            onClick={openFilePicker}
            className="w-full py-4 rounded-2xl bg-emerald-500 text-white font-semibold flex items-center justify-center gap-2 btn-press">
            <ImageIcon className="w-5 h-5" />
            Pilih dari Galeri
          </button>
          <button
            onClick={() => {
              setError(null);
              startCamera(facingMode);
            }}
            className="w-full py-4 rounded-2xl bg-white/10 text-white font-semibold btn-press">
            Coba Lagi
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    );
  }

  // ---------------- LIVE CAMERA ----------------
  return (
    <div className="fixed inset-0 z-50 bg-black">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
        style={facingMode === "user" ? { transform: "scaleX(-1)" } : {}}
      />
      <canvas ref={canvasRef} className="hidden" />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Top gradient */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent pointer-events-none z-10" />
      {/* Bottom gradient */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/70 to-transparent pointer-events-none z-10" />

      {/* Top bar */}
      <div className="absolute inset-x-0 top-0 z-20 safe-top px-4 pb-2 flex items-center justify-between">
        <button
          onClick={onClose}
          className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center btn-press">
          <X className="w-5 h-5 text-white" />
        </button>
        <div className="px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-white text-xs font-semibold tracking-wide">
          PINDAI SAMPAH
        </div>
        <div className="flex gap-2">
          {flashSupported && (
            <button
              onClick={toggleFlash}
              className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center btn-press">
              {flashOn ? (
                <Zap className="w-5 h-5 text-yellow-400" />
              ) : (
                <ZapOff className="w-5 h-5 text-white" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Viewfinder */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <div className="relative w-[68vw] max-w-[300px] aspect-square">
          <div className="viewfinder-corner top-left" />
          <div className="viewfinder-corner top-right" />
          <div className="viewfinder-corner bottom-left" />
          <div className="viewfinder-corner bottom-right" />
          {isReady && <div className="scan-line" />}
        </div>
      </div>

      {/* Hint */}
      <div className="absolute inset-x-0 z-10 bottom-44 text-center px-6">
        <p className="inline-block px-4 py-2 rounded-full bg-black/40 backdrop-blur-md text-white/90 text-xs font-medium">
          Arahkan ke benda yang ingin diidentifikasi
        </p>
      </div>

      {/* Bottom controls */}
      <div className="absolute inset-x-0 bottom-0 z-20 safe-bottom px-8 pb-8">
        <div className="flex items-center justify-between">
          <button
            onClick={openFilePicker}
            className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center btn-press">
            <ImageIcon className="w-5 h-5 text-white" />
          </button>

          <button
            onClick={capturePhoto}
            disabled={!isReady}
            className="relative w-[78px] h-[78px] rounded-full flex items-center justify-center btn-press disabled:opacity-40">
            <div className="absolute inset-0 rounded-full border-[3px] border-white/80" />
            <div className="w-[62px] h-[62px] rounded-full bg-white" />
            {isReady && (
              <div className="absolute inset-[-8px] rounded-full border-2 border-emerald-400/70" />
            )}
          </button>

          <button
            onClick={switchCamera}
            className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center btn-press">
            <SwitchCamera className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
