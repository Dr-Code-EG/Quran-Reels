"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { SURAHS, RECITERS, fetchAyahs } from "@/lib/quran/api";
import { PLATFORMS, BACKGROUNDS } from "@/lib/video/platforms";
import type { Ayah, PlatformConfig } from "@/lib/quran/types";

type Step = "select" | "customize" | "preview";

export default function CreatePage() {
  const [step, setStep] = useState<Step>("select");
  const [surahNumber, setSurahNumber] = useState(1);
  const [ayahStart, setAyahStart] = useState(1);
  const [ayahEnd, setAyahEnd] = useState(7);
  const [reciterId, setReciterId] = useState(RECITERS[0].id);
  const [selectedPlatform, setSelectedPlatform] = useState("reels");
  const [selectedBackground, setSelectedBackground] = useState(BACKGROUNDS[0].id);
  const [showTranslation, setShowTranslation] = useState(true);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentAyahIndex, setCurrentAyahIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const selectedSurah = SURAHS.find((s) => s.number === surahNumber);
  const platform = PLATFORMS[selectedPlatform];
  const background = BACKGROUNDS.find((b) => b.id === selectedBackground) || BACKGROUNDS[0];

  const filteredSurahs = SURAHS.filter(
    (s) =>
      s.name.includes(searchQuery) ||
      s.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(s.number).includes(searchQuery)
  );

  const handleFetchAyahs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAyahs(surahNumber, ayahStart, ayahEnd, reciterId);
      setAyahs(data);
      setCurrentAyahIndex(0);
      setStep("customize");
    } catch {
      alert("حدث خطأ في تحميل الآيات. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  }, [surahNumber, ayahStart, ayahEnd, reciterId]);

  const handlePlayAudio = useCallback(
    (index: number) => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (ayahs[index]) {
        const audio = new Audio(ayahs[index].audioUrl);
        audioRef.current = audio;
        setCurrentAyahIndex(index);
        audio.play().catch(() => {});
        audio.onended = () => {
          if (index + 1 < ayahs.length) {
            handlePlayAudio(index + 1);
          }
        };
      }
    },
    [ayahs]
  );

  const drawVideoFrame = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      ayahIndex: number,
      progress: number
    ) => {
      const bg = background;
      if (bg.type === "gradient") {
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, bg.edgeColor);
        gradient.addColorStop(0.5, bg.middleColor);
        gradient.addColorStop(1, bg.edgeColor);
        ctx.fillStyle = gradient;
      } else {
        ctx.fillStyle = bg.edgeColor;
      }
      ctx.fillRect(0, 0, width, height);

      // Decorative elements
      ctx.strokeStyle = "rgba(212, 175, 55, 0.1)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(width / 2, height * 0.15, Math.min(width, height) * 0.15, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(width / 2, height * 0.15, Math.min(width, height) * 0.12, 0, Math.PI * 2);
      ctx.stroke();

      // Surah name
      const surah = SURAHS.find((s) => s.number === surahNumber);
      if (surah) {
        ctx.fillStyle = "rgba(212, 175, 55, 0.5)";
        ctx.font = `${Math.floor(width * 0.035)}px "Noto Naskh Arabic", serif`;
        ctx.textAlign = "center";
        ctx.fillText(
          `سورة ${surah.name}`,
          width / 2,
          height * 0.12
        );
      }

      // Decorative line
      ctx.strokeStyle = "rgba(212, 175, 55, 0.2)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(width * 0.2, height * 0.22);
      ctx.lineTo(width * 0.8, height * 0.22);
      ctx.stroke();

      // Bismillah
      ctx.fillStyle = "rgba(212, 175, 55, 0.4)";
      ctx.font = `${Math.floor(width * 0.028)}px "Noto Naskh Arabic", serif`;
      ctx.textAlign = "center";
      ctx.fillText("بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ", width / 2, height * 0.18);

      // Main Ayah text
      if (ayahs[ayahIndex]) {
        const ayah = ayahs[ayahIndex];
        const fontSize = Math.floor(width * 0.055);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, progress * 2)})`;
        ctx.font = `bold ${fontSize}px "Noto Naskh Arabic", serif`;
        ctx.textAlign = "center";
        ctx.direction = "rtl";

        const text = ayah.text;
        const maxWidth = width * 0.8;
        const lines = wrapText(ctx, text, maxWidth);
        const lineHeight = fontSize * 1.8;
        const startY = height * 0.35;

        lines.forEach((line, i) => {
          ctx.fillText(line, width / 2, startY + i * lineHeight);
        });

        // Ayah number
        ctx.fillStyle = "rgba(212, 175, 55, 0.6)";
        ctx.font = `${Math.floor(width * 0.03)}px "Noto Naskh Arabic", serif`;
        ctx.fillText(
          `﴿ ${ayah.number} ﴾`,
          width / 2,
          startY + lines.length * lineHeight + fontSize * 0.5
        );

        // Translation
        if (showTranslation && ayah.translation) {
          const transY = startY + lines.length * lineHeight + fontSize * 1.5;
          ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
          const transFontSize = Math.floor(width * 0.028);
          ctx.font = `${transFontSize}px sans-serif`;
          ctx.direction = "ltr";
          const transLines = wrapText(ctx, ayah.translation, maxWidth);
          transLines.forEach((line, i) => {
            ctx.fillText(line, width / 2, transY + i * (transFontSize * 1.5));
          });
        }
      }

      // Bottom info
      const reciter = RECITERS.find((r) => r.id === reciterId);
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      ctx.font = `${Math.floor(width * 0.025)}px sans-serif`;
      ctx.textAlign = "center";
      ctx.direction = "rtl";
      if (reciter) {
        ctx.fillText(reciter.nameAr + " ♫", width / 2, height * 0.9);
      }

      // Decorative bottom line
      ctx.strokeStyle = "rgba(212, 175, 55, 0.15)";
      ctx.beginPath();
      ctx.moveTo(width * 0.3, height * 0.85);
      ctx.lineTo(width * 0.7, height * 0.85);
      ctx.stroke();
    },
    [ayahs, background, reciterId, showTranslation, surahNumber]
  );

  const generateVideo = useCallback(async () => {
    if (ayahs.length === 0) return;
    setIsGenerating(true);

    try {
      const canvas = document.createElement("canvas");
      canvas.width = platform.width;
      canvas.height = platform.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setIsGenerating(false);
        return;
      }

      const stream = canvas.captureStream(30);

      // Load and play all audio
      const audioElements: HTMLAudioElement[] = [];
      for (const ayah of ayahs) {
        const audio = new Audio();
        audio.crossOrigin = "anonymous";
        audio.src = ayah.audioUrl;
        audioElements.push(audio);
      }

      // Create audio context to mix into stream
      const audioContext = new AudioContext();
      const dest = audioContext.createMediaStreamDestination();

      for (const audio of audioElements) {
        try {
          const source = audioContext.createMediaElementSource(audio);
          source.connect(dest);
          source.connect(audioContext.destination);
        } catch {
          // CORS may block audio capture
        }
      }

      // Add audio track to stream
      for (const track of dest.stream.getAudioTracks()) {
        stream.addTrack(track);
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm;codecs=vp9",
        videoBitsPerSecond: 5000000,
      });

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `quran-${selectedSurah?.englishName || "video"}-${selectedPlatform}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        audioContext.close().catch(() => {});
        for (const audio of audioElements) {
          audio.pause();
          audio.src = "";
        }
        setIsGenerating(false);
      };

      mediaRecorder.start();

      // Animate through ayahs
      let currentIdx = 0;
      const ayahDuration = 5000; // 5 seconds per ayah fallback

      const playNextAyah = () => {
        if (currentIdx >= ayahs.length) {
          // Final frame hold
          setTimeout(() => mediaRecorder.stop(), 1000);
          return;
        }

        setCurrentAyahIndex(currentIdx);
        const audio = audioElements[currentIdx];

        let animationFrame: number;
        const startTime = Date.now();

        const animate = () => {
          const elapsed = Date.now() - startTime;
          const duration = (audio.duration || ayahDuration / 1000) * 1000;
          const progress = Math.min(1, elapsed / 500); // fade in over 500ms
          drawVideoFrame(ctx, canvas.width, canvas.height, currentIdx, progress);
          if (elapsed < duration) {
            animationFrame = requestAnimationFrame(animate);
          }
        };

        animate();

        const onEnded = () => {
          cancelAnimationFrame(animationFrame);
          currentIdx++;
          playNextAyah();
        };

        audio.onended = onEnded;
        let fallbackScheduled = false;
        const scheduleFallback = () => {
          if (!fallbackScheduled) {
            fallbackScheduled = true;
            setTimeout(onEnded, ayahDuration);
          }
        };
        audio.onerror = () => {
          scheduleFallback();
        };

        audio.play().catch(() => {
          scheduleFallback();
        });
      };

      playNextAyah();
    } catch {
      alert("حدث خطأ في إنتاج الفيديو. يرجى المحاولة مرة أخرى.");
      setIsGenerating(false);
    }
  }, [ayahs, platform, drawVideoFrame, selectedPlatform, selectedSurah]);

  // Live preview rendering
  useEffect(() => {
    if (step !== "customize" && step !== "preview") return;
    if (ayahs.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const previewWidth = 360;
    const aspectRatio = platform.height / platform.width;
    const previewHeight = previewWidth * aspectRatio;
    canvas.width = previewWidth;
    canvas.height = previewHeight;

    drawVideoFrame(ctx, previewWidth, previewHeight, currentAyahIndex, 1);
  }, [step, ayahs, currentAyahIndex, platform, drawVideoFrame]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 glass-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl">☪</span>
              <span className="text-lg font-bold text-gradient-gold">QuranReels</span>
            </Link>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-1 text-sm text-muted">
                <button
                  onClick={() => setStep("select")}
                  className={`px-3 py-1 rounded-lg transition-colors ${step === "select" ? "bg-primary/20 text-primary" : ""}`}
                >
                  1. الاختيار
                </button>
                <span className="text-border">&#8594;</span>
                <button
                  onClick={() => ayahs.length > 0 && setStep("customize")}
                  className={`px-3 py-1 rounded-lg transition-colors ${step === "customize" ? "bg-primary/20 text-primary" : ""} ${ayahs.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  2. التخصيص
                </button>
                <span className="text-border">&#8594;</span>
                <button
                  onClick={() => ayahs.length > 0 && setStep("preview")}
                  className={`px-3 py-1 rounded-lg transition-colors ${step === "preview" ? "bg-primary/20 text-primary" : ""} ${ayahs.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  3. التصدير
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-20 pb-10 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Step 1: Select Surah and Ayahs */}
          {step === "select" && (
            <div className="animate-fade-in">
              <h1
                className="text-2xl sm:text-3xl font-bold text-center mb-2"
                style={{ fontFamily: "var(--font-noto-arabic)" }}
              >
                اختر الآيات <span className="text-gradient-gold">القرآنية</span>
              </h1>
              <p className="text-muted text-center mb-8">اختر السورة والآيات والقارئ</p>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Surah Selector */}
                <div className="lg:col-span-2">
                  <div className="glass-card rounded-xl p-5">
                    <h3 className="font-semibold mb-3 text-primary">اختر السورة</h3>
                    <input
                      type="text"
                      placeholder="ابحث عن سورة..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-background border border-border rounded-lg px-4 py-2.5 mb-3 text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                    <div className="h-72 overflow-y-auto space-y-1 pr-1">
                      {filteredSurahs.map((surah) => (
                        <button
                          key={surah.number}
                          onClick={() => {
                            setSurahNumber(surah.number);
                            setAyahStart(1);
                            setAyahEnd(Math.min(7, surah.numberOfAyahs));
                          }}
                          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm transition-all ${
                            surahNumber === surah.number
                              ? "bg-primary/20 border border-primary/40 text-primary"
                              : "hover:bg-card-hover"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                              {surah.number}
                            </span>
                            <span style={{ fontFamily: "var(--font-noto-arabic)" }}>
                              {surah.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-muted">
                            <span className="text-xs">{surah.englishName}</span>
                            <span className="text-xs">{surah.numberOfAyahs} آية</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Settings */}
                <div className="space-y-4">
                  {/* Ayah Range */}
                  <div className="glass-card rounded-xl p-5">
                    <h3 className="font-semibold mb-3 text-primary">نطاق الآيات</h3>
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="text-xs text-muted block mb-1">من آية</label>
                        <input
                          type="number"
                          min={1}
                          max={selectedSurah?.numberOfAyahs || 1}
                          value={ayahStart}
                          onChange={(e) => setAyahStart(Number(e.target.value))}
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs text-muted block mb-1">إلى آية</label>
                        <input
                          type="number"
                          min={ayahStart}
                          max={selectedSurah?.numberOfAyahs || 1}
                          value={ayahEnd}
                          onChange={(e) => setAyahEnd(Number(e.target.value))}
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                    {selectedSurah && (
                      <p className="text-xs text-muted mt-2">
                        سورة {selectedSurah.name} — {selectedSurah.numberOfAyahs} آية
                      </p>
                    )}
                  </div>

                  {/* Reciter */}
                  <div className="glass-card rounded-xl p-5">
                    <h3 className="font-semibold mb-3 text-primary">القارئ</h3>
                    <div className="space-y-1.5">
                      {RECITERS.map((reciter) => (
                        <button
                          key={reciter.id}
                          onClick={() => setReciterId(reciter.id)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                            reciterId === reciter.id
                              ? "bg-primary/20 border border-primary/40 text-primary"
                              : "hover:bg-card-hover"
                          }`}
                        >
                          <span className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs">
                            ♫
                          </span>
                          <span style={{ fontFamily: "var(--font-noto-arabic)" }}>
                            {reciter.nameAr}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={handleFetchAyahs}
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary-dark disabled:opacity-50 text-black font-bold px-6 py-3.5 rounded-xl transition-all text-lg"
                  >
                    {loading ? "جاري التحميل..." : "التالي ←"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Customize */}
          {(step === "customize" || step === "preview") && (
            <div className="animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Controls */}
                <div className="lg:col-span-2 space-y-4 order-2 lg:order-1">
                  <h2 className="text-xl font-bold">
                    {step === "customize" ? "تخصيص الفيديو" : "تصدير الفيديو"}
                  </h2>

                  {/* Platform */}
                  <div className="glass-card rounded-xl p-4">
                    <h3 className="font-semibold mb-3 text-primary text-sm">المنصة</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(PLATFORMS).map(([key, p]) => (
                        <button
                          key={key}
                          onClick={() => setSelectedPlatform(key)}
                          className={`flex flex-col items-center gap-1 px-3 py-2.5 rounded-lg text-xs transition-all ${
                            selectedPlatform === key
                              ? "bg-primary/20 border border-primary/40 text-primary"
                              : "hover:bg-card-hover border border-transparent"
                          }`}
                        >
                          <span className="font-medium">{p.nameAr}</span>
                          <span className="text-muted text-[10px]">{p.aspectRatio}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Background */}
                  <div className="glass-card rounded-xl p-4">
                    <h3 className="font-semibold mb-3 text-primary text-sm">الخلفية</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {BACKGROUNDS.map((bg) => (
                        <button
                          key={bg.id}
                          onClick={() => setSelectedBackground(bg.id)}
                          className={`aspect-square rounded-lg transition-all ${
                            selectedBackground === bg.id
                              ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                              : "hover:scale-105"
                          }`}
                          style={{ background: bg.value }}
                          title={bg.name}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Translation toggle */}
                  <div className="glass-card rounded-xl p-4">
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-sm font-medium">إظهار الترجمة الإنجليزية</span>
                      <div
                        className={`w-11 h-6 rounded-full transition-colors relative ${
                          showTranslation ? "bg-primary" : "bg-border"
                        }`}
                        onClick={() => setShowTranslation(!showTranslation)}
                      >
                        <div
                          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${
                            showTranslation ? "right-0.5" : "right-5"
                          }`}
                        />
                      </div>
                    </label>
                  </div>

                  {/* Ayahs list */}
                  <div className="glass-card rounded-xl p-4">
                    <h3 className="font-semibold mb-3 text-primary text-sm">الآيات المختارة</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {ayahs.map((ayah, i) => (
                        <button
                          key={ayah.number}
                          onClick={() => {
                            setCurrentAyahIndex(i);
                            handlePlayAudio(i);
                          }}
                          className={`w-full text-right px-3 py-2 rounded-lg text-sm transition-all ${
                            currentAyahIndex === i
                              ? "bg-primary/20 border border-primary/30"
                              : "hover:bg-card-hover"
                          }`}
                        >
                          <span
                            className="block leading-relaxed"
                            style={{ fontFamily: "var(--font-noto-arabic)" }}
                          >
                            {ayah.text.substring(0, 60)}{ayah.text.length > 60 ? "..." : ""}
                          </span>
                          <span className="text-muted text-xs">آية {ayah.number}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep("select")}
                      className="flex-1 bg-card hover:bg-card-hover border border-border text-foreground font-semibold px-4 py-3 rounded-xl transition-all text-sm"
                    >
                      &#8592; رجوع
                    </button>
                    <button
                      onClick={generateVideo}
                      disabled={isGenerating}
                      className="flex-1 bg-primary hover:bg-primary-dark disabled:opacity-50 text-black font-bold px-4 py-3 rounded-xl transition-all text-sm"
                    >
                      {isGenerating ? "جاري الإنتاج..." : "تحميل الفيديو"}
                    </button>
                  </div>
                </div>

                {/* Preview */}
                <div className="lg:col-span-3 flex justify-center order-1 lg:order-2">
                  <div className="sticky top-20">
                    <div className="text-center mb-3">
                      <span className="text-sm text-muted">
                        معاينة — {platform.nameAr} ({platform.aspectRatio})
                      </span>
                    </div>
                    <div
                      className="rounded-2xl overflow-hidden border border-primary/20 shadow-2xl shadow-primary/5 mx-auto"
                      style={{
                        width: 360,
                        height: 360 * (platform.height / platform.width),
                        maxHeight: "70vh",
                      }}
                    >
                      <canvas
                        ref={canvasRef}
                        className="w-full h-full"
                        style={{ imageRendering: "auto" }}
                      />
                    </div>
                    <div className="flex justify-center gap-2 mt-4">
                      {ayahs.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setCurrentAyahIndex(i);
                            handlePlayAudio(i);
                          }}
                          className={`w-2.5 h-2.5 rounded-full transition-all ${
                            currentAyahIndex === i
                              ? "bg-primary scale-125"
                              : "bg-border hover:bg-muted"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? currentLine + " " + word : word;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}
