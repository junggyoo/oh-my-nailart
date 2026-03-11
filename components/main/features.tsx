"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Wand2, Palette, Zap } from "lucide-react";

const features = [
  {
    tag: "AI-Powered Design",
    title: "Generate Thumbnails",
    highlight: "in Seconds",
    description:
      "Simply describe your vision and let our AI create stunning, click-worthy thumbnails. No design skills needed — just your creativity.",
    image: "/main/1.jpg",
    icon: Wand2,
  },
  {
    tag: "Style Presets",
    title: "Endless Styles,",
    highlight: "One Click",
    description:
      "Choose from dozens of curated style presets or create your own. From bold and dramatic to clean and minimal — every aesthetic is at your fingertips.",
    image: "/main/2.jpg",
    icon: Palette,
  },
  {
    tag: "Ultra Fast",
    title: "Built for",
    highlight: "Speed & Quality",
    description:
      "High-resolution output in seconds, not hours. Optimized for YouTube, Instagram, and every platform you create for.",
    image: "/main/3.jpg",
    icon: Zap,
  },
];

export default function Features() {
  return (
    <section id="features" className="relative w-full py-24 px-4 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute right-[-10%] top-[20%] w-[30%] h-[30%] rounded-full bg-orange-500/8 dark:bg-orange-600/5 blur-[120px]" />
        <div className="absolute left-[-10%] bottom-[10%] w-[30%] h-[30%] rounded-full bg-rose-500/8 dark:bg-rose-600/5 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            Everything you need to{" "}
            <span className="font-[family-name:var(--font-indie-flower)] bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
              stand out
            </span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-md mx-auto">
            Powerful features designed for creators who want thumbnails that convert.
          </p>
        </motion.div>

        {/* Feature Rows */}
        <div className="space-y-28">
          {features.map((feature, i) => {
            const isReversed = i % 2 === 1;
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.tag}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className={`flex flex-col gap-10 md:gap-16 items-center ${
                  isReversed ? "md:flex-row-reverse" : "md:flex-row"
                }`}
              >
                {/* Image */}
                <div className="flex-1 w-full">
                  <div className="relative group">
                    {/* Glow behind image */}
                    <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-orange-500/10 to-rose-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative overflow-hidden rounded-2xl border border-border/50 shadow-lg shadow-black/[0.03]">
                      <Image
                        src={feature.image}
                        alt={feature.tag}
                        width={640}
                        height={360}
                        className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                      {/* Subtle overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Text Content */}
                <div className="flex-1 w-full space-y-5">
                  {/* Tag */}
                  <motion.div
                    initial={{ opacity: 0, x: isReversed ? 20 : -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/5 px-4 py-1.5"
                  >
                    <Icon size={14} className="text-orange-500" />
                    <span className="text-xs font-semibold text-orange-500 tracking-wide uppercase">
                      {feature.tag}
                    </span>
                  </motion.div>

                  {/* Title */}
                  <motion.h3
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.25 }}
                    className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground"
                  >
                    {feature.title}
                    <br />
                    <span className="font-[family-name:var(--font-indie-flower)] bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
                      {feature.highlight}
                    </span>
                  </motion.h3>

                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-md"
                  >
                    {feature.description}
                  </motion.p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
