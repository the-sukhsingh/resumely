import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Shield, Server, Lock, Cpu, Mail } from "lucide-react";
import Footer from "@/components/homepage/Footer";

export const metadata: Metadata = {
  title: "Security & Infrastructure | Resumely",
  description: "Learn about the security standards, encryption protocols, and inference safeguards protecting your career ledger.",
};

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-background text-neutral-900 dark:text-neutral-100 flex flex-col justify-between transition-colors duration-200">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-20 w-full">
        {/* Navigation Breadcrumb */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to home</span>
        </Link>

        {/* Header Block */}
        <div className="border-b border-border pb-10 mb-12">
          <h1 className="text-4xl sm:text-5xl font-normal tracking-[-0.025em] text-neutral-900 dark:text-neutral-100 leading-[1.1] font-[family-name:Georgia,Cambria,'Times_New_Roman',Times,serif]">
            Security & Infrastructure
          </h1>
          <p className="mt-3 text-[13px] text-neutral-500 dark:text-neutral-400 font-mono">
            Updated 20 October 2026 · Built for career integrity
          </p>
          <p className="mt-6 text-base text-neutral-600 dark:text-neutral-400 font-normal leading-relaxed">
            Your career documents contain sensitive professional and educational history. Resumely implements defense-in-depth security, strict zero-retention AI protocols, and modern encryption standards across every layer.
          </p>
        </div>

        {/* Security Pillars Callout */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
          <div className="p-4 rounded-2xl bg-card border border-border flex flex-col gap-2 shadow-xs">
            <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">TLS 1.3 & AES-256</h2>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
              All communications are encrypted using TLS 1.3 in transit and AES-256 for persistent database storage.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-card border border-border flex flex-col gap-2 shadow-xs">
            <Cpu className="w-4 h-4 text-[#2563eb]" />
            <h2 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">Ephemeral AI Inference</h2>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Tailoring prompts are processed in RAM and discarded immediately without persistent model storage.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-card border border-border flex flex-col gap-2 shadow-xs">
            <Server className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <h2 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">Pure Vector Sandboxing</h2>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
              PDF generation executes in isolated worker environments without executable scripts, macros, or external references.
            </p>
          </div>
        </div>

        {/* Detailed Security Prose */}
        <div className="space-y-12 text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-xl font-medium tracking-tight text-neutral-900 dark:text-neutral-100">
              1. Cloud Architecture & Data Storage
            </h2>
            <p>
              Resumely leverages Convex for its transactional database and real-time backend synchronization. Data centers are hosted in enterprise SOC-2 certified facilities featuring 24/7 physical security, biometric access controls, and redundant power and networking.
            </p>
            <p>
              Row-level access control guarantees that career documents, Master Ledgers, and application records are accessible strictly by the authenticated owner.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium tracking-tight text-neutral-900 dark:text-neutral-100">
              2. Authentication & Identity Safeguards
            </h2>
            <p>
              We implement industry-standard OAuth 2.0 authentication via Google Cloud identity protocols and NextAuth. Resumely never stores raw user passwords on our servers, mitigating credential-stuffing and database leakage risks.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium tracking-tight text-neutral-900 dark:text-neutral-100">
              3. ATS Vector PDF Safety
            </h2>
            <p>
              Every generated PDF is compiled directly into a single-column, sanitized vector document. We strip all dynamic scripting, active content, embedded macros, and untrusted font subsets that could trigger security firewalls in modern enterprise applicant tracking systems (such as Workday, Greenhouse, and Lever).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium tracking-tight text-neutral-900 dark:text-neutral-100">
              4. Responsible Vulnerability Disclosure
            </h2>
            <p>
              We take software security seriously and welcome reports from security researchers and users. If you discover a potential vulnerability or security concern, please contact our engineering team directly:
            </p>
            <div className="pt-2">
              <a
                href="mailto:sukhaji65@gmail.com"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-xs font-mono text-neutral-900 dark:text-neutral-100 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#2563eb]" />
                <span>sukhaji65@gmail.com</span>
              </a>
            </div>
          </section>

        </div>
      </main>

      {/* Reusable Clean Footer */}
      <Footer />
    </div>
  );
}

