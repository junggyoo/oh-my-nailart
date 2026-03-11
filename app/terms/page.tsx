"use client";

import { motion } from "framer-motion";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function TermsPage() {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-violet-500/10 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full bg-orange-500/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-3xl px-4 pt-32 pb-20">
        <motion.div
          initial="initial"
          animate="animate"
          transition={{ staggerChildren: 0.08 }}
          className="space-y-10"
        >
          {/* Header */}
          <motion.div variants={fadeIn} transition={{ duration: 0.5 }} className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
              Terms of{" "}
              <span className="bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
                Service
              </span>
            </h1>
            <p className="text-sm text-muted-foreground">Last updated: March 11, 2026</p>
          </motion.div>

          {/* Content */}
          <div className="space-y-8">
            <Section
              title="1. Acceptance of Terms"
              content="By accessing or using Oh My NailArt, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service."
            />

            <Section
              title="2. Description of Service"
              content="Oh My NailArt is an AI-powered nail art thumbnail generation service. Users can create nail art design images by providing text prompts and optional reference images, powered by Google Gemini AI technology."
            />

            <Section
              title="3. Account Registration"
              content={
                <ul className="list-disc pl-5 space-y-2">
                  <li>You must sign in using a valid Google account to access the service.</li>
                  <li>You are responsible for maintaining the security of your account.</li>
                  <li>You must provide accurate and complete information.</li>
                  <li>You must be at least 13 years old to use this service.</li>
                </ul>
              }
            />

            <Section
              title="4. Subscription Plans & Payments"
              content={
                <>
                  <p className="mb-3">We offer the following plans:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Free:</strong> Limited image generations per month.</li>
                    <li><strong>Pro:</strong> Increased generation limits and priority processing.</li>
                    <li><strong>Ultra:</strong> Maximum generation limits and premium features.</li>
                  </ul>
                  <p className="mt-3">Payments are processed securely through Polar. Subscriptions renew automatically unless cancelled. Refund requests are handled on a case-by-case basis.</p>
                </>
              }
            />

            <Section
              title="5. Acceptable Use"
              content={
                <>
                  <p className="mb-3">You agree NOT to:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Use the service to generate harmful, illegal, or offensive content</li>
                    <li>Attempt to reverse engineer, decompile, or exploit the AI system</li>
                    <li>Use automated tools or bots to access the service</li>
                    <li>Violate any applicable laws or regulations</li>
                    <li>Share or redistribute generated images for commercial purposes without proper licensing</li>
                    <li>Circumvent usage limits or abuse the credit system</li>
                  </ul>
                </>
              }
            />

            <Section
              title="6. Intellectual Property"
              content={
                <ul className="list-disc pl-5 space-y-2">
                  <li>The Oh My NailArt platform, brand, and technology are owned by us.</li>
                  <li>Images generated through the service may be used for personal and commercial purposes, subject to applicable AI-generated content regulations.</li>
                  <li>You retain rights to any original reference images you upload.</li>
                  <li>We reserve the right to use anonymized, aggregated usage data to improve our service.</li>
                </ul>
              }
            />

            <Section
              title="7. AI-Generated Content Disclaimer"
              content="Images generated by our AI service are created based on user prompts. We do not guarantee the accuracy, quality, or suitability of generated content. AI outputs may occasionally produce unexpected or imperfect results."
            />

            <Section
              title="8. Service Availability"
              content="We strive to maintain high availability but do not guarantee uninterrupted access. We reserve the right to modify, suspend, or discontinue the service at any time with reasonable notice."
            />

            <Section
              title="9. Limitation of Liability"
              content="To the maximum extent permitted by law, Oh My NailArt shall not be liable for any indirect, incidental, special, or consequential damages arising from the use or inability to use our service."
            />

            <Section
              title="10. Termination"
              content="We may suspend or terminate your account if you violate these terms. You may delete your account at any time. Upon termination, your right to use the service ceases immediately."
            />

            <Section
              title="11. Changes to Terms"
              content="We reserve the right to modify these Terms of Service at any time. Continued use of the service after changes constitutes acceptance of the new terms."
            />

            <Section
              title="12. Contact Us"
              content={
                <p>
                  For questions about these Terms of Service, please contact us at{" "}
                  <a
                    href="mailto:support@ohmynailart.com"
                    className="text-orange-500 hover:text-orange-400 underline underline-offset-2 transition-colors"
                  >
                    support@ohmynailart.com
                  </a>
                  .
                </p>
              }
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Section({
  title,
  content,
}: {
  title: string;
  content: React.ReactNode;
}) {
  return (
    <motion.div
      variants={fadeIn}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-border/50 bg-background/60 p-6 md:p-8 shadow-lg shadow-black/[0.03] backdrop-blur-xl"
    >
      <h2 className="mb-4 text-xl font-bold text-foreground">{title}</h2>
      <div className="text-sm leading-relaxed text-muted-foreground">{content}</div>
    </motion.div>
  );
}
