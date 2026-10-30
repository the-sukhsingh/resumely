import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, ShieldCheck, Lock, EyeOff, FileText, Mail } from "lucide-react";
import Footer from "@/components/homepage/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | Resumely",
  description: "Learn how Resumely handles, protects, and retains your career data. Zero model training on your work history.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#faf9f6] dark:bg-[#121110] text-[#1c1b18] dark:text-[#edebe6] flex flex-col justify-between transition-colors duration-200">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-20 w-full">
        {/* Navigation Breadcrumb */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[#71717a] dark:text-[#a1a1aa] hover:text-[#1c1b18] dark:hover:text-[#f3f2ee] transition-colors mb-8 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to home</span>
        </Link>

        {/* Header Block */}
        <div className="border-b border-[#e2e0da] dark:border-[#24231f] pb-10 mb-12">
          <h1 className="text-4xl sm:text-5xl font-normal tracking-[-0.025em] text-[#1c1b18] dark:text-[#f3f2ee] leading-[1.1] font-[family-name:Georgia,Cambria,'Times_New_Roman',Times,serif]">
            Privacy & Security Terms
          </h1>
          <p className="mt-3 text-[13px] text-[#71717a] dark:text-[#a1a1aa] font-mono">
            Updated 20 October 2026 · Effective immediately
          </p>
          <p className="mt-6 text-base text-[#52525b] dark:text-[#a1a1aa] font-normal leading-relaxed">
            Your career history, accomplishments, and applications are your intellectual property. At Resumely, we believe career software must maintain absolute confidentiality, zero hidden tracking, and zero AI training on your documents.
          </p>
        </div>

        {/* Core Guarantees Callout */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#1a1918] border border-neutral-200/90 dark:border-neutral-800 flex flex-col gap-2">
            <EyeOff className="w-4 h-4 text-[#2563eb]" />
            <h2 className="text-xs font-semibold text-[#1c1b18] dark:text-[#f3f2ee]">Zero LLM Training</h2>
            <p className="text-[11px] text-[#71717a] dark:text-[#a1a1aa] leading-relaxed">
              Your resume text and accomplishments are never used to train public or foundation AI models.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-[#1a1918] border border-neutral-200/90 dark:border-neutral-800 flex flex-col gap-2">
            <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-xs font-semibold text-[#1c1b18] dark:text-[#f3f2ee]">Encrypted at Rest</h2>
            <p className="text-[11px] text-[#71717a] dark:text-[#a1a1aa] leading-relaxed">
              All stored records in your Master Ledger are encrypted using modern TLS 1.3 in transit and AES-256 at rest.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-[#1a1918] border border-neutral-200/90 dark:border-neutral-800 flex flex-col gap-2">
            <FileText className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <h2 className="text-xs font-semibold text-[#1c1b18] dark:text-[#f3f2ee]">100% Data Ownership</h2>
            <p className="text-[11px] text-[#71717a] dark:text-[#a1a1aa] leading-relaxed">
              Export your complete ledger anytime in open JSON, LaTeX, and vector PDF formats with zero paywalls.
            </p>
          </div>
        </div>

        {/* Detailed Policy Prose */}
        <div className="space-y-12 text-sm text-[#3f3f46] dark:text-[#d4d4d8] leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-xl font-medium tracking-tight text-[#1c1b18] dark:text-[#f3f2ee]">
              1. Information We Collect
            </h2>
            <p>
              When you use Resumely, we collect only the information necessary to provide our career ledger, ATS calibration, and application tracking services:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-[#52525b] dark:text-[#a1a1aa]">
              <li>
                <strong className="text-[#1c1b18] dark:text-[#f3f2ee]">Account Data:</strong> When signing in via Google OAuth, we receive your email address, name, and profile picture strictly for authentication.
              </li>
              <li>
                <strong className="text-[#1c1b18] dark:text-[#f3f2ee]">Career Ledger Data:</strong> Work experience, project outcomes, education, technical proficiencies, and metrics you upload or manually enter.
              </li>
              <li>
                <strong className="text-[#1c1b18] dark:text-[#f3f2ee]">Target Job Descriptions:</strong> Rubrics or job posting text you provide when requesting role calibration.
              </li>
              <li>
                <strong className="text-[#1c1b18] dark:text-[#f3f2ee]">Application Kanban Tracker:</strong> Employer names, status stages, and notes you record to track your interview pipeline.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium tracking-tight text-[#1c1b18] dark:text-[#f3f2ee]">
              2. How We Use and Process Your Data
            </h2>
            <p>
              We process your career data strictly to execute your instructions:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-[#52525b] dark:text-[#a1a1aa]">
              <li>Compiling vector PDFs and LaTeX source documents according to ATS single-column formatting standards.</li>
              <li>Calibrating your verified bullet points against role rubrics using private, enterprise-tier LLM endpoints.</li>
              <li>Maintaining your Master Ledger so you can branch variations across different career tracks without re-entering data.</li>
            </ul>
            <p className="pt-1">
              <strong className="text-[#1c1b18] dark:text-[#f3f2ee]">Zero Third-Party Advertising:</strong> We do not sell your personal data, resume contents, or contact details to third-party recruiters, advertisers, or data brokers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium tracking-tight text-[#1c1b18] dark:text-[#f3f2ee]">
              3. AI Inference and Zero Model Training Guarantee
            </h2>
            <p>
              When performing calibrations or cover letter generation:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-[#52525b] dark:text-[#a1a1aa]">
              <li>Your prompts and resume text are sent through enterprise APIs covered by strict commercial zero-retention clauses.</li>
              <li>Your data is never retained by inference providers to train foundation models or fine-tune public weights.</li>
              <li>Inference is strictly ephemeral: once the tailored response is generated and sent back to your session, the prompt context is purged from provider memory.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium tracking-tight text-[#1c1b18] dark:text-[#f3f2ee]">
              4. Data Retention & Your Deletion Rights
            </h2>
            <p>
              You maintain total dominion over your data:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-[#52525b] dark:text-[#a1a1aa]">
              <li>You may export your complete career ledger, tailored variants, and tracking history in standard JSON or LaTeX at any time.</li>
              <li>You may request complete account deletion at any time by contacting us directly. Upon request, all ledger entries, versions, and account records are permanently purged from active databases and backups.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium tracking-tight text-[#1c1b18] dark:text-[#f3f2ee]">
              5. Sub-processors and Cloud Infrastructure
            </h2>
            <p>
              Resumely relies on secure, vetted infrastructure providers:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-[#52525b] dark:text-[#a1a1aa]">
              <li><strong className="text-[#1c1b18] dark:text-[#f3f2ee]">Convex:</strong> Cloud database and real-time reactive sync infrastructure.</li>
              <li><strong className="text-[#1c1b18] dark:text-[#f3f2ee]">Google Cloud / NextAuth:</strong> Industry-standard OAuth 2.0 authentication.</li>
              <li><strong className="text-[#1c1b18] dark:text-[#f3f2ee]">Enterprise AI Providers:</strong> Cloud inference with zero data retention.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium tracking-tight text-[#1c1b18] dark:text-[#f3f2ee]">
              6. Contact Support & Data Officer
            </h2>
            <p>
              If you have any questions regarding these Privacy Terms, wish to request a data export, or want to permanently delete your account, write directly to:
            </p>
            <div className="pt-2">
              <a
                href="mailto:sukhaji65@gmail.com"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-[#1a1918] border border-neutral-200/90 dark:border-neutral-800 text-xs font-mono text-[#1c1b18] dark:text-[#f3f2ee] hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
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
