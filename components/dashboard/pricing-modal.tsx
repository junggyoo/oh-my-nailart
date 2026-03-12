"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BorderBeam } from "@/components/ui/border-beam";
import { X, Loader2 } from "lucide-react";

interface PricingModalProps {
  open: boolean;
  onClose: () => void;
}

export default function PricingModal({ open, onClose }: PricingModalProps) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState<"pro" | "ultra" | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<"pro" | "ultra">("ultra");
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  async function handleCheckout(plan: "pro" | "ultra") {
    setLoading(plan);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      window.location.href = data.url;
    } catch (error) {
      console.error("Checkout failed:", error);
      setLoading(null);
    }
  }

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === overlayRef.current) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-lg mx-4 rounded-3xl bg-background/95 dark:bg-[#1a1a1a] p-6 shadow-2xl overflow-hidden"
          >
            <BorderBeam duration={8} size={120} colorFrom="#f97316" colorTo="#3b82f6" borderWidth={2} />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-10 rounded-full p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Title */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-foreground font-display">Choose your plan</h2>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-2 gap-4">
              {/* Pro */}
              <div
                onClick={() => setSelectedPlan("pro")}
                className={`relative rounded-2xl border p-5 flex flex-col items-center gap-3 cursor-pointer transition-all ${
                  selectedPlan === "pro"
                    ? "border-orange-500/30 bg-background/60 dark:bg-[#252525] ring-1 ring-orange-500/20"
                    : "border-border/50 bg-background/60 dark:bg-[#252525]"
                }`}
              >
                <div className="text-foreground font-semibold text-lg">
                  Pro
                </div>
                <div className="text-3xl font-bold text-foreground">
                  $20
                  <span className="text-sm font-normal text-muted-foreground">/mo</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  100 credits
                </div>
                <button
                  onClick={() => handleCheckout("pro")}
                  disabled={loading !== null}
                  className={`mt-2 w-full rounded-xl py-2.5 text-sm font-medium hover:opacity-90 transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 ${
                    selectedPlan === "pro"
                      ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {loading === "pro" && <Loader2 size={14} className="animate-spin" />}
                  Get Pro
                </button>
              </div>

              {/* Ultra */}
              <div
                onClick={() => setSelectedPlan("ultra")}
                className={`relative rounded-2xl border p-5 flex flex-col items-center gap-3 cursor-pointer transition-all ${
                  selectedPlan === "ultra"
                    ? "border-orange-500/30 bg-background/60 dark:bg-[#252525] ring-1 ring-orange-500/20"
                    : "border-border/50 bg-background/60 dark:bg-[#252525]"
                }`}
              >
                <div className="text-foreground font-semibold text-lg">
                  Ultra
                </div>
                <div className="text-3xl font-bold text-foreground">
                  $45
                  <span className="text-sm font-normal text-muted-foreground">/mo</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  300 credits
                </div>
                <button
                  onClick={() => handleCheckout("ultra")}
                  disabled={loading !== null}
                  className={`mt-2 w-full rounded-xl py-2.5 text-sm font-medium hover:opacity-90 transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 ${
                    selectedPlan === "ultra"
                      ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {loading === "ultra" && <Loader2 size={14} className="animate-spin" />}
                  Get Ultra
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
