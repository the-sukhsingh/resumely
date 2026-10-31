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
            Privacy & Security Terms
          </h1>
          <p className="mt-3 text-[13px] text-neutral-500 dark:text-neutral-400 font-mono">
            Updated 20 October 2026 · Effective immediately
          </p>
          <p className="mt-6 text-base text-neutral-600 dark:text-neutral-400 font-normal leading-relaxed">
            Your career history, accomplishments, and applications are your intellectual property. At Resumely, we believe career software must maintain absolute confidentiality, zero hidden tracking, and zero AI training on your documents.
          </p>
        </div>

        {/* Core Guarantees Callout */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
          <div className="p-4 rounded-2xl bg-card border border-border flex flex-col gap-2 shadow-xs">
            <EyeOff className="w-4 h-4 text-[#2563eb]" />
            <h2 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">Zero LLM Training</h2>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Your resume text and accomplishments are never used to train public or foundation AI models.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-card border border-border flex flex-col gap-2 shadow-xs">
            <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">Encrypted at Rest</h2>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
              All stored records in your Master Ledger are encrypted using modern TLS 1.3 in transit and AES-256 at rest.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-card border border-border flex flex-col gap-2 shadow-xs">
            <FileText className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <h2 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">100% Data Ownership</h2>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Export your complete ledger anytime in open JSON, LaTeX, and vector PDF formats with zero paywalls.
            </p>
          </div>
        </div>

        {/* Detailed Policy Prose */}
        <div className="space-y-12 text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-xl font-medium tracking-tight text-neutral-900 dark:text-neutral-100">
              1. Information We Collect
            </h2>
            <p>
              When you use Resumely, we collect only the information necessary to provide our career ledger, ATS calibration, and application tracking services:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
              <li>
                <strong className="text-neutral-900 dark:text-neutral-100">Account Data:</strong> When signing in via Google OAuth, we receive your email address, name, and profile picture strictly for authentication.
              </li>
              <li>
                <strong className="text-neutral-900 dark:text-neutral-100">Career Ledger Data:</strong> Work experience, project outcomes, education, technical proficiencies, and metrics you upload or manually enter.
              </li>
              <li>
                <strong className="text-neutral-900 dark:text-neutral-100">Target Job Descriptions:</strong> Rubrics or job posting text you provide when requesting role calibration.
              </li>
              <li>
                <strong className="text-neutral-900 dark:text-neutral-100">Application Kanban Tracker:</strong> Employer names, status stages, and notes you record to track your interview pipeline.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium tracking-tight text-neutral-900 dark:text-neutral-100">
              2. How We Use and Process Your Data
            </h2>
            <p>
              We process your career data strictly to execute your instructions:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
              <li>Compiling vector PDFs and LaTeX source documents according to ATS single-column formatting standards.</li>
              <li>Calibrating your verified bullet points against role rubrics using private, enterprise-tier LLM endpoints.</li>
              <li>Maintaining your Master Ledger so you can branch variations across different career tracks without re-entering data.</li>
            </ul>
            <p className="pt-1">
              <strong className="text-neutral-900 dark:text-neutral-100">Zero Third-Party Advertising:</strong> We do not sell your personal data, resume contents, or contact details to third-party recruiters, advertisers, or data brokers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium tracking-tight text-neutral-900 dark:text-neutral-100">
              3. AI Inference and Zero Model Training Guarantee
            </h2>
            <p>
              When performing calibrations or cover letter generation:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
              <li>Your prompts and resume text are sent through enterprise APIs covered by strict commercial zero-retention clauses.</li>
              <li>Your data is never retained by inference providers to train foundation models or fine-tune public weights.</li>
              <li>Inference is strictly ephemeral: once the tailored response is generated and sent back to your session, the prompt context is purged from provider memory.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium tracking-tight text-neutral-900 dark:text-neutral-100">
              4. Data Retention & Your Deletion Rights
            </h2>
            <p>
              You maintain total dominion over your data:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
              <li>You may export your complete career ledger, tailored variants, and tracking history in standard JSON or LaTeX at any time.</li>
              <li>You may request complete account deletion at any time by contacting us directly. Upon request, all ledger entries, versions, and account records are permanently purged from active databases and backups.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium tracking-tight text-neutral-900 dark:text-neutral-100">
              5. Sub-processors and Cloud Infrastructure
            </h2>
            <p>
              Resumely relies on secure, vetted infrastructure providers:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
              <li><strong className="text-neutral-900 dark:text-neutral-100">Convex:</strong> Cloud database and real-time reactive sync infrastructure.</li>
              <li><strong className="text-neutral-900 dark:text-neutral-100">Google Cloud / NextAuth:</strong> Industry-standard OAuth 2.0 authentication.</li>
              <li><strong className="text-neutral-900 dark:text-neutral-100">Enterprise AI Providers:</strong> Cloud inference with zero data retention.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium tracking-tight text-neutral-900 dark:text-neutral-100">
              6. Contact Support & Data Officer
            </h2>
            <p>
              If you have any questions regarding these Privacy Terms, wish to request a data export, or want to permanently delete your account, write directly to:
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

