'use client';

import React, { useState, useEffect } from 'react';
import DitheredSphere from '@/components/custom/dithered-sphere';
import { getCompanyDomain, getFaviconUrl } from '@/lib/favicon';
import { cn } from '@/lib/utils';

export interface JobAvatarProps {
  company?: string | null;
  companyUrl?: string | null;
  jobUrl?: string | null;
  size?: number;
  index?: number;
  seed?: string;
  className?: string;
}

export default function JobAvatar({
  company,
  companyUrl,
  jobUrl,
  size = 32,
  index = 0,
  seed,
  className,
}: JobAvatarProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const domain = getCompanyDomain(company, companyUrl, jobUrl);
  const effectiveSeed = seed || company || 'job';

  // Reset error & loaded states when inputs change
  useEffect(() => {
    setHasError(false);
    setIsLoaded(false);
  }, [domain]);

  // If no domain could be resolved or the image failed to load, fallback to dithered blob
  if (!domain || hasError) {
    return (
      <DitheredSphere
        index={index}
        seed={effectiveSeed}
        size={size}
        className={className}
      />
    );
  }

  const faviconUrl = getFaviconUrl(domain, 128);

  return (
    <div
      className={cn(
        'relative shrink-0 rounded-xl overflow-hidden border border-border/70 bg-card/80 shadow-2xs flex items-center justify-center select-none',
        className
      )}
      style={{ width: size, height: size }}
      title={company || domain}
    >
      {/* Fallback dithered blob shown while favicon image is loading */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <DitheredSphere index={index} seed={effectiveSeed} size={size} />
        </div>
      )}

      {/* High-res Favicon */}
      <img
        src={faviconUrl}
        alt={company ? `${company} icon` : 'Company icon'}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={cn(
          'w-[65%] h-[65%] object-contain rounded-xs transition-opacity duration-200',
          isLoaded ? 'opacity-100' : 'opacity-0'
        )}
      />
    </div>
  );
}
