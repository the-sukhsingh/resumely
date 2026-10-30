import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Scale, Clock, Award, Mail } from "lucide-react";
import Footer from "@/components/homepage/Footer";

export const metadata: Metadata = {
  title: "Terms of Service | Resumely",
  description: "Read the terms governing the use of Resumely's career engineering platform, credit packs, and vector compilers.",
};

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="mt-3 text-[13px] text-[#71717a] dark:text-[#a1a1aa] font-mono">
            Updated 20 October 2026 · Effective immediately
          </p>
          <p className="mt-6 text-base text-[#52525b] dark:text-[#a1a1aa] font-normal leading-relaxed">
            These terms set out your rights and responsibilities when using Resumely. We believe in transparent contracts, non-expiring credit packs, and honest career representation.
          </p>
        </div>

        {/* Key Tenets Callout */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#1a1918] border border-neutral-200/90 dark:border-neutral-800 flex flex-col gap-2">
            <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-xs font-semibold text-[#1c1b18] dark:text-[#f3f2ee]">No Auto-Renewals</h2>
            <p className="text-[11px] text-[#71717a] dark:text-[#a1a1aa] leading-relaxed">
              Credits are purchased in one-time packs and never expire. You will never be billed for an ongoing monthly subscription.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-[#1a1918] border border-neutral-200/90 dark:border-neutral-800 flex flex-col gap-2">
            <Scale className="w-4 h-4 text-[#2563eb]" />
            <h2 className="text-xs font-semibold text-[#1c1b18] dark:text-[#f3f2ee]">Your Intellectual Property</h2>
            <p className="text-[11px] text-[#71717a] dark:text-[#a1a1aa] leading-relaxed">
              You own all rights to your career ledger, accomplishment bullet points, and compiled resumes.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-[#1a1918] border border-neutral-200/90 dark:border-neutral-800 flex flex-col gap-2">
            <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <h2 className="text-xs font-semibold text-[#1c1b18] dark:text-[#f3f2ee]">Career Truth Pledge</h2>
            <p className="text-[11px] text-[#71717a] dark:text-[#a1a1aa] leading-relaxed">
              We design our models to optimize your genuine contributions without fabricating fictitious metrics or fake credentials.
            </p>
          </div>
        </div>

        {/* Detailed Terms Prose */}
        <div className="space-y-12 text-sm text-[#3f3f46] dark:text-[#d4d4d8] leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-xl font-medium tracking-tight text-[#1c1b18] dark:text-[#f3f2ee]">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using Resumely (&ldquo;the Service&rdquo;), you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not access or use the Service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium tracking-tight text-[#1c1b18] dark:text-[#f3f2ee]">
              2. User Accounts & Identity
            </h2>
            <p>
              You must register for an account using Google OAuth or designated login providers. You are responsible for maintaining the confidentiality of your credentials and for all activities that occur under your account.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium tracking-tight text-[#1c1b18] dark:text-[#f3f2ee]">
              3. Master Ledger Ownership & User Content
            </h2>
            <p>
              You retain all ownership rights to the career history, job descriptions, and personal data you input into Resumely. Resumely does not claim any ownership over your resumes, cover letters, or career artifacts. We are granted a limited license solely to format, compile, and calibrate documents per your explicit requests.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium tracking-tight text-[#1c1b18] dark:text-[#f3f2ee]">
              4. Credit Packs, Payments & Non-Expiration Policy
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-[#52525b] dark:text-[#a1a1aa]">
              <li>
                <strong className="text-[#1c1b18] dark:text-[#f3f2ee]">One-Time Purchases:</strong> Resumely does not charge recurring auto-renewing subscriptions. Credits are sold in discrete packs.
              </li>
              <li>
                <strong className="text-[#1c1b18] dark:text-[#f3f2ee]">Permanent Balance:</strong> Purchased credits do not expire as long as your account remains in good standing.
              </li>
              <li>
                <strong className="text-[#1c1b18] dark:text-[#f3f2ee]">Free Features:</strong> Editing your Master Ledger, standard vector PDF compilation, and your Kanban job tracker remain permanently accessible at no charge.
              </li>
              <li>
                <strong className="text-[#1c1b18] dark:text-[#f3f2ee]">Refunds:</strong> If you experience technical defects preventing credit usage, please reach out to support within 14 days of purchase.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium tracking-tight text-[#1c1b18] dark:text-[#f3f2ee]">
              5. Ethical Use & Career Truthfulness
            </h2>
            <p>
              Resumely is engineered to empower job candidates with ATS-optimized typography and truthful accomplishment reframing. You agree not to use the Service to:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-[#52525b] dark:text-[#a1a1aa]">
              <li>Generate intentionally fraudulent degrees, licensed certifications, or counterfeit employment records.</li>
              <li>Reverse engineer, scrape, or systematically extract proprietary ATS rubric data or software logic.</li>
              <li>Upload malicious code, exploits, or automated bot traffic to our servers.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium tracking-tight text-[#1c1b18] dark:text-[#f3f2ee]">
              6. Limitation of Liability
            </h2>
            <p>
              Resumely provides document formatting and AI-assisted tailoring tools. While our templates adhere strictly to contemporary ATS parsing benchmarks, we cannot guarantee specific interview invites, job offers, or hiring decisions. The Service is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium tracking-tight text-[#1c1b18] dark:text-[#f3f2ee]">
              7. Contact & Notices
            </h2>
            <p>
              For any questions regarding these Terms or commercial inquiries, contact our team directly:
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
