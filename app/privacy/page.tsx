"use client";

import { motion } from "framer-motion";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function PrivacyPage() {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-orange-500/10 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-rose-500/10 blur-[120px]" />
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
              Privacy{" "}
              <span className="bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
                Policy
              </span>
            </h1>
            <p className="text-sm text-muted-foreground">Last updated: March 11, 2026</p>
          </motion.div>

          {/* Content */}
          <div className="space-y-8">
            <Section
              title="1. Introduction"
              content={'Oh My NailArt ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered nail art thumbnail generation service.'}
            />

            <Section
              title="2. Information We Collect"
              content={
                <>
                  <p className="mb-3">We may collect the following types of information:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Account Information:</strong> When you sign in with Google, we receive your name, email address, and profile picture.</li>
                    <li><strong>Usage Data:</strong> We collect information about how you interact with our service, including prompts submitted, images generated, and feature usage.</li>
                    <li><strong>Payment Information:</strong> Payment processing is handled by our third-party provider (Polar). We do not directly store your payment card details.</li>
                    <li><strong>Device Information:</strong> Browser type, operating system, and device identifiers for service optimization.</li>
                  </ul>
                </>
              }
            />

            <Section
              title="3. How We Use Your Information"
              content={
                <ul className="list-disc pl-5 space-y-2">
                  <li>To provide, maintain, and improve our nail art generation service</li>
                  <li>To process your transactions and manage your subscription</li>
                  <li>To communicate with you about updates, features, and support</li>
                  <li>To monitor usage patterns and optimize service performance</li>
                  <li>To detect, prevent, and address security issues or abuse</li>
                </ul>
              }
            />

            <Section
              title="4. Data Sharing"
              content={
                <>
                  <p className="mb-3">We do not sell your personal information. We may share your data with:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Service Providers:</strong> Google (authentication), Supabase (data storage), Polar (payments), and Google Gemini (AI image generation).</li>
                    <li><strong>Legal Requirements:</strong> When required by law, regulation, or legal process.</li>
                  </ul>
                </>
              }
            />

            <Section
              title="5. Data Storage & Security"
              content="Your data is stored securely using Supabase infrastructure. We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction."
            />

            <Section
              title="6. Your Rights"
              content={
                <ul className="list-disc pl-5 space-y-2">
                  <li>Access, update, or delete your personal information</li>
                  <li>Request a copy of your data</li>
                  <li>Withdraw consent for data processing</li>
                  <li>Delete your account and associated data</li>
                </ul>
              }
            />

            <Section
              title="7. Cookies"
              content="We use essential cookies and local storage to maintain your authentication session and preferences. We do not use third-party tracking cookies for advertising purposes."
            />

            <Section
              title="8. Children's Privacy"
              content="Our service is not intended for users under the age of 13. We do not knowingly collect personal information from children under 13."
            />

            <Section
              title="9. Changes to This Policy"
              content={'We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.'}
            />

            <Section
              title="10. Contact Us"
              content={
                <p>
                  If you have questions about this Privacy Policy, please contact us at{" "}
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
