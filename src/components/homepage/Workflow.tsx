import { Play } from 'lucide-react'
import React from 'react'
import Heading from './Heading';

const WorkflowSection = () => {
  return (
    <section id="how-it-works" className="relative px-6 z-10 bg-background">
      <div className="text-left mb-16 mx-auto max-w-5xl">
        <Heading as={'h2'}>
          The workflow
        </Heading>
        <p className="text-lg text-muted-foreground">From a single master record to endless targeted applications.</p>
      </div>

      <div className="flex items-center gap-16 mx-auto max-w-7xl">
        <div className="w-full max-w-4xl aspect-video bg-card/40 backdrop-blur-sm border border-border/50 rounded-2xl flex items-center justify-center group cursor-pointer hover:bg-card/60 transition-all duration-500 shadow-[0_0_50px_rgba(255,255,255,0.02)] relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-tr from-transparent via-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="w-16 h-16 rounded-full bg-foreground/10 flex items-center justify-center backdrop-blur-md border border-foreground/20 group-hover:scale-110 transition-transform duration-300">
            <Play className="w-6 h-6 text-foreground" />
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full max-w-4xl">
          <Step number="01" title="Upload" description="Bring in your existing resume format. We strip the styling and keep the core data." />
          <Step number="02" title="Paste" description="Input the job description. Our engine finds the precise keywords and missing links." />
          <Step number="03" title="Review" description="Review the tailored output. Export to a clean PDF instantly." />
        </div>
      </div>
    </section>
  )
};



function Step({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="flex gap-3 text-center md:text-left items-center md:items-start p-6 rounded-3xl border border-transparent hover:border-border/50 hover:bg-card/20 transition-all duration-300">
      <div className="size-8 rounded-full border border-border bg-muted/30 flex items-center justify-center text-sm font-mono text-foreground tracking-wider mb-2">
        {number}
      </div>
      <div>
        <h3 className="font-semibold text-xl mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}


export default WorkflowSection