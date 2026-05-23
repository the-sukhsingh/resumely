"use client"
import React from 'react';
import Heading from './Heading';

const features = [
    {
        title: "Centralized Hub",
        description: "Maintain a single master record of your achievements. Update once, and it ripples across all your tailored resumes."
    },
    {
        title: "AI Editing",
        description: "Chat to your resume. Add metrics or change tones with a prompt."
    },
    {
        title: "Targeted Optimization",
        description: "We align your terminology to their exact job description seamlessly."
    },
    {
        title: "Cover Letters",
        description: "Generate precise cover letters tailored to match your specific resume export perfectly."
    }
];

const FeatureSection = () => {
  return (
      <section id="features" className="mx-auto px-6 py-24 md:py-32 relative z-10">
          <div className="w-full max-w-5xl mx-auto mb-16 md:mb-24">
              <Heading as="h2">
                  Everything you need
              </Heading>
              <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-2xl">
                  Powerful tools disguised as a simple interface.
              </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 w-full max-w-4xl mx-auto">
              {features.map((feature, i) => (
                  <div key={i} className="flex flex-col border-t border-border pt-6 group">
                      <span className="text-muted-foreground/50 font-mono text-sm mb-6 transition-colors group-hover:text-foreground">
                          {(i + 1).toString().padStart(2, '0')}
                      </span>
                      <h3 className="text-2xl font-medium tracking-tight mb-3 text-foreground">
                          {feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                          {feature.description}
                      </p>
                  </div>
              ))}
          </div>
      </section>
  )
};

export default FeatureSection;