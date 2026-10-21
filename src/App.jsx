import { useState, useCallback, useEffect } from "react";
import CameraScanner from "./components/CameraScanner";
import ImagePreview from "./components/ImagePreview";
import LoadingOverlay from "./components/LoadingOverlay";
import ResultCard from "./components/ResultCard";
import ErrorView from "./components/ErrorView";
import HomeView from "./components/HomeView";
import HistoryView from "./components/HistoryView";
import BottomNav from "./components/BottomNav";
import { analyzeWaste } from "./services/OpenAIService";
import {
  saveAction,
  saveHistoryEntry,
  compressDataUrl,
  getImpactStats,
  getHistory,
} from "./utils/storage";

export default function App() {
  const [tab, setTab] = useState("home");
  const [modal, setModal] = useState(null); // camera | preview | loading | result | error
  const [capturedImage, setCapturedImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [errorCode, setErrorCode] = useState(null);
  const [stats, setStats] = useState(getImpactStats());
  const [history, setHistory] = useState(getHistory());

  const refreshData = useCallback(() => {
    setStats(getImpactStats());
    setHistory(getHistory());
  }, []);

  useEffect(() => {
    const onVisible = () => refreshData();
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [refreshData]);

  const handleStartScan = () => setModal("camera");

  const handleCloseModal = () => {
    setModal(null);
    setCapturedImage(null);
    setAnalysisResult(null);
    setErrorCode(null);
  };

  const handleCapture = useCallback((imageData) => {
    setCapturedImage(imageData);
    setModal("preview");
  }, []);

  const handleRetake = () => setModal("camera");

  const handleConfirm = useCallback(async () => {
    if (!capturedImage) return;
    setModal("loading");
    try {
      const result = await analyzeWaste(capturedImage.base64, "image/jpeg");
      setAnalysisResult(result);
      saveAction(result.category);
      const thumb = await compressDataUrl(capturedImage.dataUrl, 240, 0.7);
      saveHistoryEntry(result, thumb);
      refreshData();
      setModal("result");
    } catch (err) {
      console.error("[RecycleCheck] Analysis failed:", err);
      const code = err?.message || "UNKNOWN";
      if (!navigator.onLine) setErrorCode("NETWORK_ERROR");
      else setErrorCode(code);
      setModal("error");
    }
  }, [capturedImage, refreshData]);

  const handleScanAgain = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
    setModal("camera");
  };

  const handleResultBack = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
    setModal(null);
  };

  const handleRetryFromError = () => {
    if (capturedImage) handleConfirm();
    else handleStartScan();
  };

  const handleSelectHistory = (entry) => {
    setAnalysisResult({
      object: entry.object,
      material: entry.material,
      category: entry.category,
      steps: entry.steps,
      eco_fact: entry.eco_fact,
    });
    setCapturedImage(
      entry.thumbnail ? { dataUrl: entry.thumbnail, base64: "" } : null,
    );
    setModal("result");
  };

  // ---------- FULL-SCREEN MODAL OVERLAYS ----------
  if (modal === "camera")
    return (
      <CameraScanner onCapture={handleCapture} onClose={handleCloseModal} />
    );
  if (modal === "preview" && capturedImage) {
    return (
      <ImagePreview
        imageDataUrl={capturedImage.dataUrl}
        onConfirm={handleConfirm}
        onRetake={handleRetake}
      />
    );
  }
  if (modal === "loading" && capturedImage) {
    return <LoadingOverlay imageDataUrl={capturedImage.dataUrl} />;
  }

  // ---------- FRAMED SHELL ----------
  return (
    <div className="app-shell">
      {modal === "result" && analysisResult ? (
        <ResultCard
          result={analysisResult}
          imageDataUrl={capturedImage?.dataUrl}
          onScanAgain={handleScanAgain}
          onBack={handleResultBack}
        />
      ) : modal === "error" ? (
        <ErrorView
          errorCode={errorCode}
          onRetry={handleRetryFromError}
          onHome={handleCloseModal}
        />
      ) : (
        <>
          {tab === "home" && (
            <HomeView
              stats={stats}
              history={history}
              onScan={handleStartScan}
              onSelectHistory={handleSelectHistory}
              onSeeAllHistory={() => setTab("history")}
            />
          )}
          {tab === "history" && (
            <HistoryView
              onSelect={handleSelectHistory}
              onChanged={refreshData}
            />
          )}
          <BottomNav active={tab} onChange={setTab} onScan={handleStartScan} />
        </>
      )}
    </div>
  );
}
