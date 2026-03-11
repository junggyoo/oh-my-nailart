"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CTA() {
  return (
    <section className="relative w-full py-24 px-4 overflow-hidden">
      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-border/50 bg-background/80 dark:bg-[#1a1a1a]/80"
        >
          {/* Animated gradient blobs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
            <div className="absolute -top-[40%] -right-[20%] w-[60%] h-[80%] rounded-full bg-orange-500/20 dark:bg-orange-500/10 blur-[100px] animate-pulse" />
            <div className="absolute -bottom-[40%] -left-[20%] w-[60%] h-[80%] rounded-full bg-rose-500/20 dark:bg-rose-500/10 blur-[100px] animate-pulse [animation-delay:1s]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] rounded-full bg-orange-400/10 dark:bg-orange-400/5 blur-[80px] animate-pulse [animation-delay:2s]" />
          </div>

          {/* Subtle border glow */}
          <div className="absolute inset-0 rounded-3xl ring-1 ring-orange-500/10 dark:ring-orange-500/5" />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center px-6 py-16 md:py-20 md:px-12">

            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground"
            >
              Ready to Create
              <br />
              <span className="font-[family-name:var(--font-indie-flower)] bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
                Stunning Thumbnails?
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-5 text-lg text-muted-foreground max-w-lg"
            >
              Join thousands of creators who are already designing
              eye-catching thumbnails with AI. Start for free today.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="mt-8 flex flex-col sm:flex-row items-center gap-4"
            >
              <a
                href="/auth"
                className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 text-white font-semibold shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30 transition-all active:scale-95"
              >
                Get Started Free
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </a>
              <a
                href="#pricing"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-border/50 text-foreground font-semibold hover:bg-muted/50 transition-all active:scale-95"
              >
                View Pricing
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
