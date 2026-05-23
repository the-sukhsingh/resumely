import { Play } from 'lucide-react'
import React from 'react'
import Heading from './Heading';

const WorkflowSection = () => {
  return (
    <section id="how-it-works" className="relative px-6 z-10">
      <div className="text-left mb-16 mx-auto max-w-5xl">
        <Heading as={'h2'}>
          The workflow
        </Heading>
        <p className="text-lg text-muted-foreground">From a single master record to endless targeted applications.</p>
      </div>

      <div className="flex flex-col-reverse lg:flex-row  items-center gap-16 mx-auto max-w-7xl">
        <div className="w-full max-w-4xl aspect-video bg-card/40 backdrop-blur-sm border border-border/50 rounded-2xl flex items-center justify-center relative overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.02)] ">
          <iframe 
            width="100%" 
            height="100%" 
            src="https://www.youtube.com/embed/jZMa3juiB9U" 
            title="Workflow demo" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
            className="absolute inset-0 border-0"
          ></iframe>
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
    <div className="flex gap-3 text-center md:text-left items-center md:items-start p-4">
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