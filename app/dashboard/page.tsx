"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import DashboardNavbar from "@/components/dashboard/navbar";
import GallerySidebar from "@/components/dashboard/gallery-sidebar";
import PricingModal from "@/components/dashboard/pricing-modal";
import { PromptArea } from "@/components/ui/prompt-area";

interface GeneratedResult {
  id: string;
  prompt: string;
  image?: string;
  text?: string;
  error?: string;
  loading: boolean;
}

interface SavedImage {
  id: string;
  prompt: string;
  image_url: string;
  created_at: string;
}

export default function DashboardPage() {
  const { user, loading, refreshCredits } = useAuth();
  const router = useRouter();
  const [results, setResults] = useState<GeneratedResult[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedImages, setSavedImages] = useState<SavedImage[]>([]);
  const [pricingOpen, setPricingOpen] = useState(false);
  const resultsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (results.length > 0) {
      resultsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [results]);

  // Load saved images from Supabase on mount
  useEffect(() => {
    if (!user) return;
    fetch("/api/gallery")
      .then((res) => res.json())
      .then((data) => {
        if (data.images) setSavedImages(data.images);
      })
      .catch(console.error);
  }, [user]);

  const handleSubmit = async (data: {
    prompt: string;
    imageData: string | null;
    tool: string | null;
  }) => {
    const id = Date.now().toString();

    setResults((prev) => [
      ...prev,
      { id, prompt: data.prompt, loading: true },
    ]);
    setIsGenerating(true);

    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: data.prompt,
          imageData: data.imageData,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        if (res.status === 403) {
          // Credit insufficient — remove loading card and show pricing modal
          setResults((prev) => prev.filter((r) => r.id !== id));
          setPricingOpen(true);
          return;
        }
        setResults((prev) =>
          prev.map((r) =>
            r.id === id ? { ...r, loading: false, error: result.error } : r
          )
        );
      } else {
        setResults((prev) =>
          prev.map((r) =>
            r.id === id
              ? { ...r, loading: false, image: result.image, text: result.text }
              : r
          )
        );
      }
    } catch {
      setResults((prev) =>
        prev.map((r) =>
          r.id === id
            ? { ...r, loading: false, error: "네트워크 오류가 발생했습니다." }
            : r
        )
      );
    } finally {
      setIsGenerating(false);
      // Refresh credits in UI after generation
      refreshCredits();
      // Refresh saved images from Supabase after generation
      fetch("/api/gallery")
        .then((res) => res.json())
        .then((data) => {
          if (data.images) setSavedImages(data.images);
        })
        .catch(console.error);
    }
  };

  const handleDownload = (imageDataUrl: string, prompt: string) => {
    const link = document.createElement("a");
    link.href = imageDataUrl;
    link.download = `nailart-${prompt.slice(0, 20).replace(/\s+/g, "-")}.png`;
    link.click();
  };

  // Combine saved images from Supabase + newly generated session images
  const sessionImages = results
    .filter((r) => r.image && !r.loading)
    .map((r) => ({ id: r.id, src: r.image!, prompt: r.prompt }));

  const persistedImages = savedImages.map((img) => ({
    id: img.id,
    src: img.image_url,
    prompt: img.prompt,
  }));

  // Session images first (newest), then persisted (deduplicated)
  const sessionPrompts = new Set(sessionImages.map((img) => img.prompt));
  const galleryImages = [
    ...sessionImages,
    ...persistedImages.filter((img) => !sessionPrompts.has(img.prompt)),
  ];

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-8 w-8 rounded-full border-2 border-muted border-t-orange-500"
        />
      </div>
    );
  }

  if (!user) return null;

  const firstName = user.user_metadata?.full_name?.split(" ")[0] || "there";
  const hasResults = results.length > 0;

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Grid background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.05]">
        <svg className="w-full h-full">
          <defs>
            <pattern
              id="dash-grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-muted-foreground"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dash-grid)" />
        </svg>
      </div>

      <PricingModal open={pricingOpen} onClose={() => setPricingOpen(false)} />
      <DashboardNavbar />

      <GallerySidebar
        images={galleryImages}
        onDownload={handleDownload}
      />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Results area - scrollable */}
        <div className={`flex-1 ${hasResults ? "pt-20 pb-40" : "flex items-center justify-center"}`}>
          <div className="w-full max-w-2xl mx-auto px-4">
            {!hasResults && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="w-full flex flex-col gap-8"
              >
                <div className="text-center">
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                    Hey, {firstName}{" "}
                    <span className="inline-block animate-[wave_1.8s_ease-in-out_infinite] origin-[70%_70%]">
                      👋
                    </span>
                  </h1>
                  <p className="mt-3 text-muted-foreground text-lg">
                    What would you like to create today?
                  </p>
                </div>
                <PromptArea onPromptSubmit={handleSubmit} isLoading={isGenerating} />
              </motion.div>
            )}

            {hasResults && (
              <div className="flex flex-col gap-6">
                <AnimatePresence>
                  {results.map((result) => (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="flex flex-col gap-3"
                    >
                      {/* User prompt */}
                      <div className="flex justify-end">
                        <div className="max-w-[80%] rounded-2xl bg-black dark:bg-white text-white dark:text-black px-4 py-3 text-sm">
                          {result.prompt}
                        </div>
                      </div>

                      {/* AI response */}
                      <div className="flex justify-start">
                        <div className="max-w-[90%] flex flex-col gap-3">
                          {result.loading && (
                            <div className="flex items-center gap-3 rounded-2xl bg-muted/50 dark:bg-[#303030] px-4 py-4">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                                className="h-5 w-5 rounded-full border-2 border-muted-foreground/30 border-t-orange-500"
                              />
                              <span className="text-sm text-muted-foreground">
                                이미지를 생성하고 있어요...
                              </span>
                            </div>
                          )}

                          {result.error && (
                            <div className="rounded-2xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-500">
                              {result.error}
                            </div>
                          )}

                          {result.text && (
                            <div className="rounded-2xl bg-muted/50 dark:bg-[#303030] px-4 py-3 text-sm text-foreground dark:text-white whitespace-pre-wrap">
                              {result.text}
                            </div>
                          )}

                          {result.image && (
                            <div className="group relative">
                              <img
                                src={result.image}
                                alt={result.prompt}
                                className="rounded-2xl max-w-full shadow-lg"
                              />
                              <button
                                onClick={() =>
                                  handleDownload(result.image!, result.prompt)
                                }
                                className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 hover:bg-black/80 text-white rounded-full px-3 py-1.5 text-xs font-medium backdrop-blur-sm"
                              >
                                Download
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={resultsEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Sticky prompt area at bottom when results exist */}
        {hasResults && (
          <div className="fixed bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-background via-background to-transparent pt-6 pb-4 px-4">
            <div className="w-full max-w-2xl mx-auto">
              <PromptArea onPromptSubmit={handleSubmit} isLoading={isGenerating} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
