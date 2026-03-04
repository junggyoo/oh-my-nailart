"use client";

import React, { useRef } from "react";
import { cn } from "@/lib/utils";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useAnimationFrame,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";

export const HeroContent = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion() ?? false;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  const gridOffsetX = useMotionValue(0);
  const gridOffsetY = useMotionValue(0);

  const speedX = reducedMotion ? 0 : 0.5;
  const speedY = reducedMotion ? 0 : 0.5;

  useAnimationFrame(() => {
    const currentX = gridOffsetX.get();
    const currentY = gridOffsetY.get();
    gridOffsetX.set((currentX + speedX) % 40);
    gridOffsetY.set((currentY + speedY) % 40);
  });

  const maskImage = useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-background"
      )}
    >
      <div className="absolute inset-0 z-0 opacity-[0.05]">
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} />
      </div>
      <motion.div
        className="absolute inset-0 z-0 opacity-40"
        style={{ maskImage, WebkitMaskImage: maskImage }}
      >
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} />
      </motion.div>

      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute right-[-20%] top-[-20%] w-[40%] h-[40%] rounded-full bg-orange-500/40 dark:bg-orange-600/20 blur-[120px]" />
        <div className="absolute right-[10%] top-[-10%] w-[20%] h-[20%] rounded-full bg-primary/30 blur-[100px]" />
        <div className="absolute left-[-10%] bottom-[-20%] w-[40%] h-[40%] rounded-full bg-blue-500/40 dark:bg-blue-600/20 blur-[120px]" />
      </div>

      <FloatingDecorations reducedMotion={reducedMotion} />

      <div className="relative z-10 flex flex-col md:flex-row items-center md:items-center text-center md:text-left px-4 md:px-8 max-w-6xl mx-auto gap-8 md:gap-12 pointer-events-none">
        <div className="flex-1 space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground drop-shadow-sm">
              Design Your Thumbnails,
              <br />
              <span className="font-[family-name:var(--font-indie-flower)] bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
                Your Way
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-[family-name:var(--font-indie-flower)]">
              Create stunning thumbnails in seconds.
              <br />
              Let AI craft the perfect design for you.
            </p>
          </div>

          <div className="flex pointer-events-auto justify-center md:justify-start">
            <a href="/auth" className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 text-white font-semibold shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30 transition-all active:scale-95">
              Get Started
            </a>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center pointer-events-none">
          <ThumbnailMockup reducedMotion={reducedMotion} />
        </div>
      </div>
    </div>
  );
};

const GridPattern = ({
  offsetX,
  offsetY,
}: {
  offsetX: MotionValue<number>;
  offsetY: MotionValue<number>;
}) => {
  return (
    <svg className="w-full h-full">
      <defs>
        <motion.pattern
          id="grid-pattern"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
          x={offsetX}
          y={offsetY}
        >
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-muted-foreground"
          />
        </motion.pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-pattern)" />
    </svg>
  );
};

const FloatingDecorations = ({
  reducedMotion,
}: {
  reducedMotion: boolean;
}) => {
  const floatAnimation = reducedMotion
    ? {}
    : { y: [0, -8, 0] };
  const scaleAnimation = reducedMotion
    ? {}
    : { scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] };
  const rotateAnimation = reducedMotion
    ? {}
    : { rotate: [0, 5, 0] };

  return (
    <div className="absolute inset-0 z-[5] pointer-events-none hidden md:block text-muted-foreground/30">
      {/* Play Button */}
      <motion.svg
        className="absolute top-[15%] left-[8%] w-12 h-12"
        viewBox="0 0 48 48"
        animate={floatAnimation}
        transition={{ duration: 3, repeat: Infinity, repeatType: "loop" }}
      >
        <circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" strokeWidth="2" />
        <polygon points="18,14 18,34 36,24" fill="currentColor" />
      </motion.svg>

      {/* Spark / Star */}
      <motion.svg
        className="absolute top-[25%] right-[12%] w-8 h-8"
        viewBox="0 0 32 32"
        animate={scaleAnimation}
        transition={{ duration: 4, repeat: Infinity, repeatType: "loop" }}
      >
        <path
          d="M16 0l4 12h12l-10 8 4 12-10-8-10 8 4-12L0 12h12z"
          fill="currentColor"
        />
      </motion.svg>

      {/* Frame */}
      <motion.svg
        className="absolute bottom-[20%] left-[15%] w-10 h-10"
        viewBox="0 0 40 40"
        animate={rotateAnimation}
        transition={{ duration: 5, repeat: Infinity, repeatType: "loop" }}
      >
        <rect x="2" y="2" width="36" height="36" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M2 28l12-12 8 8 6-6 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </motion.svg>
    </div>
  );
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (targetOpacity: number) => ({
    opacity: targetOpacity,
    y: 0,
    transition: { duration: 0.6 },
  }),
};

const ThumbnailMockup = ({
  reducedMotion,
}: {
  reducedMotion: boolean;
}) => {
  return (
    <motion.svg
      viewBox="0 0 320 240"
      className="w-full max-w-sm"
      variants={containerVariants}
      initial={reducedMotion ? "visible" : "hidden"}
      animate="visible"
    >
      {/* Card 1 (back) */}
      <motion.g
        variants={cardVariants}
        custom={0.4}
        style={{ transformOrigin: "160px 120px" }}
      >
        <g transform="rotate(-6, 160, 120)">
          <rect
            x="40" y="30" width="240" height="135" rx="8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-muted-foreground"
            opacity="0.3"
          />
          <line x1="60" y1="140" x2="180" y2="140" stroke="currentColor" strokeWidth="2" className="text-muted-foreground" opacity="0.2" />
          <line x1="60" y1="150" x2="140" y2="150" stroke="currentColor" strokeWidth="2" className="text-muted-foreground" opacity="0.15" />
        </g>
      </motion.g>

      {/* Card 2 (middle) */}
      <motion.g
        variants={cardVariants}
        custom={0.7}
        style={{ transformOrigin: "160px 120px" }}
      >
        <g transform="rotate(3, 160, 120)">
          <rect
            x="40" y="40" width="240" height="135" rx="8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-muted-foreground"
            opacity="0.5"
          />
          <line x1="60" y1="150" x2="200" y2="150" stroke="currentColor" strokeWidth="2" className="text-muted-foreground" opacity="0.3" />
          <line x1="60" y1="160" x2="150" y2="160" stroke="currentColor" strokeWidth="2" className="text-muted-foreground" opacity="0.2" />
        </g>
      </motion.g>

      {/* Card 3 (front) */}
      <motion.g
        variants={cardVariants}
        custom={1.0}
        style={{ transformOrigin: "160px 120px" }}
      >
        <rect
          x="40" y="50" width="240" height="135" rx="8"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-muted-foreground"
        />
        {/* Play triangle inside */}
        <polygon
          points="140,100 140,140 170,120"
          fill="currentColor"
          className="text-muted-foreground"
          opacity="0.4"
        />
        {/* Text lines */}
        <line x1="60" y1="165" x2="220" y2="165" stroke="currentColor" strokeWidth="2.5" className="text-muted-foreground" opacity="0.5" />
        <line x1="60" y1="175" x2="160" y2="175" stroke="currentColor" strokeWidth="2" className="text-muted-foreground" opacity="0.3" />
      </motion.g>
    </motion.svg>
  );
};
