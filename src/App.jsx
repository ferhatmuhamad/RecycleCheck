import { useState, useCallback } from 'react';
import { Camera, Recycle, Leaf, Sparkles } from 'lucide-react';
import CameraScanner from './components/CameraScanner';
import ImagePreview from './components/ImagePreview';
import LoadingOverlay from './components/LoadingOverlay';
import ResultCard from './components/ResultCard';
import ErrorView from './components/ErrorView';
import ImpactDashboard from './components/ImpactDashboard';
import { analyzeWaste } from './services/GeminiService';
import { saveAction } from './utils/storage';

// App states: home | camera | preview | loading | result | error
export default function App() {
  const [screen, setScreen] = useState('home');
  const [capturedImage, setCapturedImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [errorCode, setErrorCode] = useState(null);
  const [dashboardKey, setDashboardKey] = useState(0);

  const handleStartScan = () => setScreen('camera');

  const handleCapture = useCallback((imageData) => {
    setCapturedImage(imageData);
    setScreen('preview');
  }, []);

  const handleRetake = () => setScreen('camera');

  const handleConfirm = useCallback(async () => {
    if (!capturedImage) return;
    setScreen('loading');

    try {
      const result = await analyzeWaste(capturedImage.base64, 'image/jpeg');
      setAnalysisResult(result);
      saveAction(result.category);
      setDashboardKey(prev => prev + 1);
      setScreen('result');
    } catch (err) {
      console.error('Analysis error:', err);
      const code = err.message || 'UNKNOWN';
      if (code.startsWith('API_') || code === 'RATE_LIMIT' || code === 'PARSE_ERROR' || code === 'EMPTY_RESPONSE') {
        setErrorCode(code);
      } else if (!navigator.onLine) {
        setErrorCode('NETWORK_ERROR');
      } else {
        setErrorCode(code);
      }
      setScreen('error');
    }
  }, [capturedImage]);

  const handleScanAgain = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
    setErrorCode(null);
    setScreen('camera');
  };

  const handleGoHome = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
    setErrorCode(null);
    setScreen('home');
  };

  const handleRetryFromError = () => {
    if (capturedImage) {
      handleConfirm();
    } else {
      handleStartScan();
    }
  };

  // ========== SCREENS ==========

  if (screen === 'camera') {
    return <CameraScanner onCapture={handleCapture} onClose={handleGoHome} />;
  }

  if (screen === 'preview' && capturedImage) {
    return (
      <ImagePreview
        imageDataUrl={capturedImage.dataUrl}
        onConfirm={handleConfirm}
        onRetake={handleRetake}
      />
    );
  }

  if (screen === 'loading' && capturedImage) {
    return <LoadingOverlay imageDataUrl={capturedImage.dataUrl} />;
  }

  if (screen === 'result' && analysisResult) {
    return (
      <ResultCard
        result={analysisResult}
        imageDataUrl={capturedImage?.dataUrl}
        onScanAgain={handleScanAgain}
      />
    );
  }

  if (screen === 'error') {
    return (
      <ErrorView
        errorCode={errorCode}
        onRetry={handleRetryFromError}
        onHome={handleGoHome}
      />
    );
  }

  // ========== HOME SCREEN ==========
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Container for mobile-first */}
      <div className="w-full max-w-[480px] mx-auto flex flex-col flex-1">
        {/* Hero section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-700 px-6 pt-14 pb-20 text-white safe-top">
          {/* Decorative circles */}
          <div className="absolute top-[-40px] right-[-40px] w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute bottom-[-20px] left-[-30px] w-32 h-32 rounded-full bg-white/5" />
          <div className="absolute top-20 left-10 w-3 h-3 rounded-full bg-white/20" />
          <div className="absolute top-32 right-20 w-2 h-2 rounded-full bg-white/30" />

          {/* Logo area */}
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Recycle className="w-6 h-6 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight">RecycleCheck</span>
            </div>
            <h1 className="text-3xl font-extrabold mt-6 mb-3 leading-tight">
              Pilah Sampahmu<br />dengan AI 🌱
            </h1>
            <p className="text-white/80 text-sm leading-relaxed max-w-[280px]">
              Arahkan kamera ke sampah dan biarkan AI membantu kamu memilah dengan benar.
            </p>
          </div>

          {/* Wave bottom */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 480 40" fill="none" className="w-full">
              <path d="M0 40V20C80 0 160 0 240 20C320 40 400 40 480 20V40H0Z" fill="#f8fafc" />
            </svg>
          </div>
        </div>

        {/* Main action */}
        <div className="px-6 -mt-6 relative z-10">
          <button
            onClick={handleStartScan}
            id="btn-start-scan"
            className="w-full py-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold text-lg flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/30 active:scale-[0.97] transition-all duration-200 pulse-glow"
          >
            <Camera className="w-6 h-6" />
            Mulai Pindai
          </button>
        </div>

        {/* Features */}
        <div className="px-6 mt-8 mb-6">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Cara Kerja</h2>
          <div className="space-y-3 stagger">
            {[
              { icon: Camera, title: 'Foto Sampahmu', desc: 'Arahkan kamera ke benda yang ingin diidentifikasi', color: 'bg-blue-100 text-blue-600' },
              { icon: Sparkles, title: 'AI Menganalisis', desc: 'Gemini Vision mengidentifikasi jenis dan material', color: 'bg-purple-100 text-purple-600' },
              { icon: Leaf, title: 'Pilah dengan Benar', desc: 'Dapatkan instruksi cara membuang yang tepat', color: 'bg-emerald-100 text-emerald-600' },
            ].map((item, i) => (
              <div key={i} className="glass-card p-4 flex items-start gap-4 fade-in-up" style={{ opacity: 0 }}>
                <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">{item.title}</h3>
                  <p className="text-slate-500 text-xs mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Impact Dashboard */}
        <div className="mt-auto pb-6">
          <ImpactDashboard key={dashboardKey} />
        </div>

        {/* Footer */}
        <div className="text-center pb-6 px-6">
          <p className="text-slate-300 text-[10px]">
            RecycleCheck © 2025 • Powered by Gemini AI
          </p>
        </div>
      </div>
    </div>
  );
}
