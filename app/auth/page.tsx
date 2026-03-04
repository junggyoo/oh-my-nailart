"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function NailArtLogo() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <rect x="9" y="12" width="14" height="16" rx="3" className="fill-primary" />
      <rect x="11.5" y="14" width="3" height="10" rx="1.5" className="fill-primary-foreground/30" />
      <rect x="12" y="6" width="8" height="7" rx="1.5" className="fill-foreground" />
      <rect x="15" y="2" width="2" height="5" rx="1" className="fill-foreground/60" />
      <path
        d="M26 4l0.8 2.2L29 7l-2.2 0.8L26 10l-0.8-2.2L23 7l2.2-0.8Z"
        className="fill-orange-400"
      />
      <path
        d="M5 8l0.5 1.5L7 10l-1.5 0.5L5 12l-0.5-1.5L3 10l1.5-0.5Z"
        className="fill-blue-400/70"
      />
    </svg>
  );
}

export default function AuthPage() {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col lg:flex-row overflow-hidden bg-background">
      {/* Left Panel - 3/5 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative hidden lg:flex w-full lg:w-3/5 min-h-screen flex-col bg-gradient-to-br from-orange-500/10 via-rose-500/10 to-violet-500/10"
      >
        {/* Color overlay */}
        <div className="absolute inset-0 bg-foreground/[0.03]" />

        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.04]">
          <svg className="w-full h-full">
            <defs>
              <pattern
                id="auth-grid"
                width="60"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 60 0 L 0 0 0 60"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-foreground"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#auth-grid)" />
          </svg>
        </div>

        {/* Gradient blurs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute right-[-10%] top-[10%] w-[40%] h-[40%] rounded-full bg-orange-500/20 blur-[150px]" />
          <div className="absolute left-[-5%] bottom-[5%] w-[35%] h-[35%] rounded-full bg-rose-500/15 blur-[120px]" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col flex-1 items-center justify-center p-8 sm:p-12 lg:p-16">
          <div className="w-full max-w-xl space-y-8 lg:space-y-10">
            {/* YouTube Video */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl shadow-black/20 border border-white/10 aspect-video">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/mhVgh640FUw"
                  title="Oh My NailArt"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </motion.div>

            {/* Oversized Title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
            >
              <h1 className="font-[family-name:var(--font-indie-flower)] text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[0.95] tracking-tight">
                <span className="text-foreground/80">Oh My</span>
                <br />
                <span className="bg-gradient-to-r from-orange-500 via-rose-500 to-violet-500 bg-clip-text text-transparent">
                  NailArt
                </span>
              </h1>
              <p className="mt-4 text-base sm:text-lg text-muted-foreground/70 max-w-md font-[family-name:var(--font-indie-flower)]">
                Create stunning nail art thumbnails with AI-powered design tools
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Right Panel - 2/5 */}
      <div className="relative w-full lg:w-2/5 min-h-screen flex items-center justify-center overflow-hidden bg-background">
        {/* Grid background (matching hero) */}
        <div className="absolute inset-0 z-0 opacity-[0.05]">
          <svg className="w-full h-full">
            <defs>
              <pattern
                id="auth-right-grid"
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
            <rect width="100%" height="100%" fill="url(#auth-right-grid)" />
          </svg>
        </div>

        {/* Gradient blurs (matching hero) */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute right-[-20%] top-[-20%] w-[40%] h-[40%] rounded-full bg-orange-500/40 dark:bg-orange-600/20 blur-[120px]" />
          <div className="absolute right-[10%] top-[-10%] w-[20%] h-[20%] rounded-full bg-primary/30 blur-[100px]" />
          <div className="absolute left-[-10%] bottom-[-20%] w-[40%] h-[40%] rounded-full bg-blue-500/40 dark:bg-blue-600/20 blur-[120px]" />
        </div>

        {/* Login card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="relative z-10 w-full max-w-md mx-6 sm:mx-8 lg:mx-12"
        >
          <div className="rounded-3xl border border-border/50 bg-background/60 p-8 sm:p-10 shadow-xl shadow-black/[0.03] backdrop-blur-xl">
            {/* Logo & Title */}
            <div className="flex flex-col items-center text-center mb-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="mb-4"
              >
                <NailArtLogo />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.5 }}
                className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground"
              >
                Welcome to{" "}
                <span className="font-[family-name:var(--font-indie-flower)] bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
                  NailArt
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.5 }}
                className="mt-2 text-sm sm:text-base text-muted-foreground font-[family-name:var(--font-indie-flower)]"
              >
                Sign in to start creating stunning thumbnails
              </motion.p>
            </div>

            {/* Divider */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mb-8"
            >
              <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            </motion.div>

            {/* Google Sign-in Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 rounded-xl border border-border/80 bg-background/80 px-6 py-3.5 text-sm font-semibold text-foreground shadow-sm transition-all hover:bg-muted/50 hover:shadow-md hover:border-border cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <GoogleIcon />
                )}
                {loading ? "Signing in..." : "Continue with Google"}
              </motion.button>
            </motion.div>

            {/* Terms */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.85, duration: 0.5 }}
              className="mt-6 text-center text-xs text-muted-foreground/70"
            >
              By continuing, you agree to our{" "}
              <a href="#" className="underline underline-offset-2 hover:text-muted-foreground transition-colors">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="underline underline-offset-2 hover:text-muted-foreground transition-colors">
                Privacy Policy
              </a>
            </motion.p>
          </div>

          {/* Back to home */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.95, duration: 0.5 }}
            className="mt-6 text-center"
          >
            <a
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                className="transition-transform group-hover:-translate-x-0.5"
              >
                <path
                  d="M13 7H1m0 0l4.5-4.5M1 7l4.5 4.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Back to home
            </a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
