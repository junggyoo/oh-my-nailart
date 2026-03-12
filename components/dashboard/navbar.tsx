"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Sparkles, CreditCard, Coins } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import PricingModal from "@/components/dashboard/pricing-modal";

function NailArtLogo() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <rect x="9" y="12" width="14" height="16" rx="3" className="fill-orange-500" />
      <rect x="11.5" y="14" width="3" height="10" rx="1.5" className="fill-white/20" />
      <rect x="12" y="6" width="8" height="7" rx="1.5" className="fill-white" />
      <rect x="15" y="2" width="2" height="5" rx="1" className="fill-white/60" />
      <path d="M26 4l0.8 2.2L29 7l-2.2 0.8L26 10l-0.8-2.2L23 7l2.2-0.8Z" className="fill-orange-400" />
      <path d="M5 8l0.5 1.5L7 10l-1.5 0.5L5 12l-0.5-1.5L3 10l1.5-0.5Z" className="fill-blue-400/70" />
    </svg>
  );
}

export default function DashboardNavbar() {
  const { user, plan, credits, signOut } = useAuth();
  const [portalLoading, setPortalLoading] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [pricingOpen, setPricingOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    if (profileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [profileOpen]);

  if (!user) return null;

  return (
    <>
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-auto max-w-6xl px-4 pl-14 lg:pl-4 pt-4 flex items-center justify-between">
        {/* Logo - floating pill */}
        <motion.a
          href="/dashboard"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="flex items-center gap-2 px-2 py-2 transition-opacity hover:opacity-80"
        >
          <NailArtLogo />
          <span className="font-[family-name:var(--font-indie-flower)] text-base font-bold tracking-tight text-foreground">
            Oh My
            <span className="bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
              {" "}NailArt
            </span>
          </span>
        </motion.a>

        {/* Profile - floating pill */}
        <div ref={profileRef} className="relative">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 px-2 py-2 transition-opacity hover:opacity-80 cursor-pointer"
          >
            <img
              src={user.user_metadata?.avatar_url || ""}
              alt="avatar"
              className="w-7 h-7 rounded-full ring-1 ring-border"
              referrerPolicy="no-referrer"
            />
          </motion.button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute right-0 mt-2 w-52 rounded-2xl border border-border/50 bg-background/95 p-1.5 shadow-xl shadow-black/[0.05] backdrop-blur-xl"
              >
                {/* User info */}
                <div className="flex items-center gap-2.5 px-3 py-2.5 border-b border-border/50 mb-1">
                  <img
                    src={user.user_metadata?.avatar_url || ""}
                    alt="avatar"
                    className="w-8 h-8 rounded-full ring-1 ring-border"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {user.user_metadata?.full_name || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>

                {/* Plan & Credits */}
                <div className="flex items-center justify-between px-3 py-2 mb-1 border-b border-border/50">
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                    plan === "ultra"
                      ? "bg-purple-500/15 text-purple-600 dark:text-purple-400"
                      : plan === "pro"
                      ? "bg-orange-500/15 text-orange-600 dark:text-orange-400"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {plan === "free" ? "Free" : plan === "pro" ? "Pro" : "Ultra"}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Coins size={12} />
                    <span className="font-medium">{credits}</span> credits
                  </span>
                </div>

                {plan === "free" ? (
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      setPricingOpen(true);
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium bg-gradient-to-r from-orange-500/10 to-rose-500/10 text-orange-600 dark:text-orange-400 hover:from-orange-500/20 hover:to-rose-500/20 transition-all cursor-pointer"
                  >
                    <Sparkles size={14} />
                    Upgrade
                  </button>
                ) : (
                  <button
                    onClick={async () => {
                      setPortalLoading(true);
                      try {
                        const res = await fetch("/api/customer-portal", { method: "POST" });
                        const data = await res.json();
                        if (!res.ok) throw new Error(data.error);
                        window.location.href = data.url;
                      } catch (error) {
                        console.error("Failed to open customer portal:", error);
                      } finally {
                        setPortalLoading(false);
                        setProfileOpen(false);
                      }
                    }}
                    disabled={portalLoading}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer disabled:opacity-60"
                  >
                    <CreditCard size={14} />
                    {portalLoading ? "Loading..." : "Manage Subscription"}
                  </button>
                )}

                {/* Sign out */}
                <button
                  onClick={async () => {
                    setProfileOpen(false);
                    await signOut();
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                >
                  <LogOut size={14} />
                  Sign out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>

    <PricingModal open={pricingOpen} onClose={() => setPricingOpen(false)} />
    </>
  );
}
