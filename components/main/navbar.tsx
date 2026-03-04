"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

function NailArtLogo() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      {/* Nail polish bottle body */}
      <rect
        x="9"
        y="12"
        width="14"
        height="16"
        rx="3"
        className="fill-primary"
      />
      {/* Bottle shine */}
      <rect
        x="11.5"
        y="14"
        width="3"
        height="10"
        rx="1.5"
        className="fill-primary-foreground/30"
      />
      {/* Bottle cap */}
      <rect
        x="12"
        y="6"
        width="8"
        height="7"
        rx="1.5"
        className="fill-foreground"
      />
      {/* Brush handle */}
      <rect
        x="15"
        y="2"
        width="2"
        height="5"
        rx="1"
        className="fill-foreground/60"
      />
      {/* Sparkle top-right */}
      <path
        d="M26 4l0.8 2.2L29 7l-2.2 0.8L26 10l-0.8-2.2L23 7l2.2-0.8Z"
        className="fill-orange-400"
      />
      {/* Sparkle small */}
      <path
        d="M5 8l0.5 1.5L7 10l-1.5 0.5L5 12l-0.5-1.5L3 10l1.5-0.5Z"
        className="fill-blue-400/70"
      />
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, loading, signOut } = useAuth();

  if (pathname.startsWith("/auth")) return null;

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-auto max-w-6xl px-4 pt-4">
        <nav className="relative flex items-center justify-between rounded-2xl border border-border/50 bg-background/60 px-5 py-3 shadow-lg shadow-black/[0.03] backdrop-blur-xl">
          {/* Left: Logo + Text */}
          <a href="/" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ rotate: [0, -8, 8, 0] }}
              transition={{ duration: 0.5 }}
            >
              <NailArtLogo />
            </motion.div>
            <span className="font-[family-name:var(--font-indie-flower)] text-xl font-bold tracking-tight text-foreground">
              Oh My
              <span className="bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
                {" "}NailArt
              </span>
            </span>
          </a>

          {/* Center: Nav Links (desktop) */}
          <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground group"
              >
                {link.label}
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-[2px] w-0 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 transition-all duration-300 group-hover:w-5" />
              </a>
            ))}
          </div>

          {/* Right: CTA + Mobile Toggle */}
          <div className="flex items-center gap-3">
            {!loading && !user && (
              <motion.a
                href="/auth"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-orange-500/20 transition-shadow hover:shadow-lg hover:shadow-orange-500/30"
              >
                Get Started
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  className="transition-transform group-hover:translate-x-0.5"
                >
                  <path
                    d="M1 7h12m0 0L8.5 2.5M13 7l-4.5 4.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.a>
            )}

            {!loading && user && (
              <div className="relative hidden sm:block">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 rounded-xl border border-border/50 bg-background/80 px-3 py-1.5 transition-colors hover:bg-muted/50 cursor-pointer"
                >
                  <img
                    src={user.user_metadata?.avatar_url || ""}
                    alt="avatar"
                    className="w-7 h-7 rounded-full"
                    referrerPolicy="no-referrer"
                  />
                  <span className="text-sm font-medium text-foreground max-w-[120px] truncate">
                    {user.user_metadata?.full_name || user.email}
                  </span>
                </motion.button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 4, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-48 rounded-xl border border-border/50 bg-background/90 p-1.5 shadow-lg backdrop-blur-xl"
                    >
                      <div className="px-3 py-2 border-b border-border/50 mb-1">
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={async () => {
                          await signOut();
                          setProfileOpen(false);
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                      >
                        <LogOut size={14} />
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={
            mobileOpen
              ? { height: "auto", opacity: 1 }
              : { height: 0, opacity: 0 }
          }
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="md:hidden overflow-hidden"
        >
          <div className="mt-2 flex flex-col gap-1 rounded-2xl border border-border/50 bg-background/80 p-3 shadow-lg shadow-black/[0.03] backdrop-blur-xl">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-1 border-t border-border/50 pt-2">
              {!loading && !user && (
                <a
                  href="/auth"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-orange-500/20"
                >
                  Get Started
                </a>
              )}
              {!loading && user && (
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 px-4 py-2">
                    <img
                      src={user.user_metadata?.avatar_url || ""}
                      alt="avatar"
                      className="w-7 h-7 rounded-full"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {user.user_metadata?.full_name || user.email}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      await signOut();
                      setMobileOpen(false);
                    }}
                    className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                  >
                    <LogOut size={14} />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
}
