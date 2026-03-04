"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user, signOut } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
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
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-auto max-w-6xl px-4 pt-4 flex items-center justify-between">
        {/* Logo - floating pill */}
        <motion.a
          href="/dashboard"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="flex items-center gap-2 rounded-2xl border border-border/50 bg-background/60 px-4 py-2.5 backdrop-blur-xl shadow-lg shadow-black/[0.03] transition-colors hover:border-border hover:bg-background/80"
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
            className="flex items-center gap-2.5 rounded-2xl border border-border/50 bg-background/60 px-3 py-2 backdrop-blur-xl shadow-lg shadow-black/[0.03] transition-colors hover:border-border hover:bg-background/80 cursor-pointer"
          >
            <img
              src={user.user_metadata?.avatar_url || ""}
              alt="avatar"
              className="w-7 h-7 rounded-full ring-1 ring-border"
              referrerPolicy="no-referrer"
            />
            <span className="text-sm font-medium text-foreground max-w-[120px] truncate hidden sm:block">
              {user.user_metadata?.full_name || user.email}
            </span>
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
  );
}
