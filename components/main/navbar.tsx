"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Menu, X } from "lucide-react";

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
  const [mobileOpen, setMobileOpen] = useState(false);

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
            <motion.a
              href="#get-started"
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
              <a
                href="#get-started"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-orange-500/20"
              >
                Get Started
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
}
