'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight, FileText, Sparkles, Target, Zap } from 'lucide-react';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="mx-auto max-w-5xl px-6 pt-32 pb-20">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Resume Optimization
          </div>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Tailor Your Resume
            <br />
            <span className="text-muted-foreground">For Every Job</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create a master resume and generate job-specific versions with AI.
            Match keywords, optimize content, and land more interviews.
          </p>

          <div className="flex items-center justify-center gap-3 pt-4">
            <Button asChild size="lg" className="gap-2">
              <Link href={user ? "/resume" : "/auth"}>
                {user ? 'Go to Dashboard' : 'Get Started'}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="mx-auto max-w-5xl px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<FileText className="w-5 h-5" />}
            title="Master Resume"
            description="Maintain one comprehensive resume with all your skills, experience, and achievements."
          />
          <FeatureCard
            icon={<Target className="w-5 h-5" />}
            title="Job-Specific Versions"
            description="Generate tailored resume versions optimized for each job description automatically."
          />
          <FeatureCard
            icon={<Zap className="w-5 h-5" />}
            title="AI Agent Assistant"
            description="Chat with AI to refine content, inject keywords, and improve your match score."
          />
        </div>
      </div>

      {/* How It Works */}
      <div className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="space-y-8">
          <Step number="1" title="Create Master Resume" description="Upload or build your comprehensive resume with all experience and skills." />
          <Step number="2" title="Add Job Description" description="Paste the job description you're applying for." />
          <Step number="3" title="AI Tailoring" description="Our AI analyzes and optimizes your resume for the specific role." />
          <Step number="4" title="Export & Apply" description="Download your tailored resume and apply with confidence." />
        </div>
      </div>

      {/* CTA Section */}
      <div className="mx-auto max-w-5xl px-6 py-20">
        <div className="rounded-2xl border border-border bg-muted/30 p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to optimize your resume?</h2>
          <p className="text-muted-foreground mb-6">Join and start creating tailored resumes in minutes.</p>
          <Button asChild size="lg" className="gap-2">
            <Link href={user ? "/resume" : "/auth"}>
              {user ? 'Go to Dashboard' : 'Start Free'}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-3">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
        {icon}
      </div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

function Step({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="flex gap-4">
      <div className="shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
        {number}
      </div>
      <div className="pt-0.5">
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}