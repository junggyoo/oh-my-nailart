"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import DashboardNavbar from "@/components/dashboard/navbar";
import { PromptArea } from "@/components/ui/prompt-area";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth");
    }
  }, [user, loading, router]);

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

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Grid background - matching landing page */}
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


      {/* Dashboard Navbar */}
      <DashboardNavbar />

      {/* Main Content - Centered Prompt */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-2xl flex flex-col gap-8"
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

          <PromptArea />
        </motion.div>
      </div>
    </div>
  );
}
