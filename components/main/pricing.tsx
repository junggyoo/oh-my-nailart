"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Pro",
    price: "$20",
    credits: "100 credits",
    description: "Perfect for getting started",
    features: [
      "100 AI generations per month",
      "High-quality thumbnails",
      "Custom style presets",
      "Priority rendering",
    ],
    cta: "Get Pro",
    popular: false,
  },
  {
    name: "Ultra",
    price: "$45",
    credits: "300 credits",
    description: "For power creators",
    features: [
      "300 AI generations per month",
      "Ultra HD quality output",
      "Custom style presets",
      "Priority rendering",
      "Early access to new features",
      "Dedicated support",
    ],
    cta: "Get Ultra",
    popular: true,
  },
];

export default function Pricing() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="pricing" className="relative w-full py-24 px-4 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[60%] h-[40%] rounded-full bg-orange-500/10 dark:bg-orange-600/5 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            Simple,{" "}
            <span className="font-[family-name:var(--font-indie-flower)] bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
              transparent
            </span>{" "}
            pricing
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-md mx-auto">
            Choose the plan that fits your creative needs. No hidden fees.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className={`relative rounded-2xl border p-6 md:p-8 flex flex-col transition-all duration-300 ${
                plan.popular
                  ? "border-orange-500/30 bg-background/80 dark:bg-[#1a1a1a]/80 ring-1 ring-orange-500/20 shadow-lg shadow-orange-500/5"
                  : "border-border/50 bg-background/60 dark:bg-[#1a1a1a]/60"
              } ${hovered === i ? "scale-[1.02] shadow-xl" : ""}`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-4 py-1 text-xs font-semibold text-white shadow-md shadow-orange-500/20">
                    <Sparkles size={12} />
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan name */}
              <div className="text-foreground font-semibold text-lg">
                {plan.name}
              </div>

              {/* Price */}
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-foreground">
                  {plan.price}
                </span>
                <span className="text-sm text-muted-foreground">/mo</span>
              </div>

              {/* Credits */}
              <div className="mt-1 text-sm text-muted-foreground">
                {plan.credits}
              </div>

              {/* Description */}
              <p className="mt-3 text-sm text-muted-foreground">
                {plan.description}
              </p>

              {/* Divider */}
              <div className="my-6 h-px bg-border/50" />

              {/* Features */}
              <ul className="flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <Check size={16} className="mt-0.5 shrink-0 text-orange-500" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href="/auth"
                className={`mt-8 w-full rounded-xl py-3 text-sm font-semibold text-center transition-all block ${
                  plan.popular
                    ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                {plan.cta}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
