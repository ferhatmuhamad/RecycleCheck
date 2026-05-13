import { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, SwitchCamera, Zap, ZapOff, X } from 'lucide-react';

export default function CameraScanner({ onCapture, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const trackRef = useRef(null);

  const [facingMode, setFacingMode] = useState('environment');
  const [flashOn, setFlashOn] = useState(false);
  const [flashSupported, setFlashSupported] = useState(false);
  const [error, setError] = useState(null);
  const [isReady, setIsReady] = useState(false);

  const startCamera = useCallback(async (facing) => {
    // Stop existing stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }

    try {
      const constraints = {
        video: {
          facingMode: facing,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      const videoTrack = stream.getVideoTracks()[0];
      trackRef.current = videoTrack;

      // Check flash/torch support
      const capabilities = videoTrack.getCapabilities?.();
      if (capabilities?.torch) {
        setFlashSupported(true);
      } else {
        setFlashSupported(false);
        setFlashOn(false);
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsReady(true);
        setError(null);
      }
    } catch (err) {
      console.error('Camera error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('PERMISSION_DENIED');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError('NO_CAMERA');
      } else {
        setError('CAMERA_ERROR');
      }
    }
  }, []);

  useEffect(() => {
    startCamera(facingMode);

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, [facingMode, startCamera]);

  const toggleFlash = async () => {
    if (!trackRef.current || !flashSupported) return;

    const newFlashState = !flashOn;
    try {
      await trackRef.current.applyConstraints({
        advanced: [{ torch: newFlashState }]
      });
      setFlashOn(newFlashState);
    } catch (err) {
      console.warn('Flash toggle failed:', err);
    }
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');

    // Mirror if front camera
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0);

    // Get base64 image
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    const base64 = dataUrl.split(',')[1];

    // Stop the stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }

    onCapture({ dataUrl, base64 });
  };

  if (error) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mb-6">
          <Camera className="w-10 h-10 text-slate-500" />
        </div>
        <h2 className="text-white text-xl font-bold mb-3">
          {error === 'PERMISSION_DENIED' ? 'Akses Kamera Ditolak' : 'Kamera Tidak Tersedia'}
        </h2>
        <p className="text-slate-400 text-sm mb-8 max-w-xs">
          {error === 'PERMISSION_DENIED'
            ? 'Izinkan akses kamera di pengaturan browser Anda untuk menggunakan fitur pemindaian.'
            : 'Pastikan perangkat Anda memiliki kamera dan tidak sedang digunakan aplikasi lain.'}
        </p>
        <button
          onClick={onClose}
          className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-semibold active:scale-95 transition-transform"
        >
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Video feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
        style={facingMode === 'user' ? { transform: 'scaleX(-1)' } : {}}
      />

      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Overlay */}
      <div className="absolute inset-0 z-10">
        {/* Top bar */}
        <div className="safe-top flex items-center justify-between px-4 pt-4 pb-2">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center active:scale-90 transition-transform"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          <div className="flex gap-3">
            {flashSupported && (
              <button
                onClick={toggleFlash}
                className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center active:scale-90 transition-transform"
              >
                {flashOn ? (
                  <Zap className="w-5 h-5 text-yellow-400" />
                ) : (
                  <ZapOff className="w-5 h-5 text-white" />
                )}
              </button>
            )}
            <button
              onClick={switchCamera}
              className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center active:scale-90 transition-transform"
            >
              <SwitchCamera className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Viewfinder area */}
        <div className="flex-1 flex items-center justify-center px-10 mt-8">
          <div className="relative w-full aspect-square max-w-[300px]">
            <div className="viewfinder-corner top-left" />
            <div className="viewfinder-corner top-right" />
            <div className="viewfinder-corner bottom-left" />
            <div className="viewfinder-corner bottom-right" />
            {isReady && <div className="scan-line" />}
          </div>
        </div>

        {/* Instruction text */}
        <div className="text-center mt-4">
          <p className="text-white/80 text-sm font-medium">
            Arahkan kamera ke sampah yang ingin diidentifikasi
          </p>
        </div>

        {/* Capture button */}
        <div className="absolute bottom-0 left-0 right-0 safe-bottom flex justify-center pb-10 pt-6">
          <button
            onClick={capturePhoto}
            disabled={!isReady}
            className="relative w-[72px] h-[72px] rounded-full bg-white flex items-center justify-center active:scale-90 transition-transform disabled:opacity-40"
          >
            <div className="absolute inset-0 rounded-full border-[3px] border-white" />
            <div className="w-[58px] h-[58px] rounded-full bg-white border-[2px] border-slate-300" />
            {isReady && (
              <div className="absolute inset-[-6px] rounded-full border-[3px] border-emerald-400 pulse-glow" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
