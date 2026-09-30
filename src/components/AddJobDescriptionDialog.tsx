'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { Button } from '@/components/ui/button';
import ColoredButton from '@/components/custom/colored-button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'motion/react';
import { WaveBackgroundPreview } from '@/components/custom/bg-shader-modal';
import { X } from 'lucide-react';

interface Props {
  buttonLabel?: string;
  userId: Id<'users'>;
  masterResumeId: Id<'resumeVersions'>;
  onCreated?: (versionId: Id<'resumeVersions'>) => void;
}

export default function AddJobDescriptionDialog({
  buttonLabel = 'Add Job Description',
  userId,
  masterResumeId,
  onCreated,
}: Props) {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const isBackdropClickRef = useRef(false);
  const createJDAndVersion = useAction(api.jobDescriptions.createJDAndVersion);

  const handleClose = () => {
    setOpen(false);
    setDescription('');
  };

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = description.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    try {
      const { versionId } = await createJDAndVersion({
        userId,
        masterResumeId,
        jdText: trimmed,
      });
      onCreated?.(versionId);
      setDescription('');
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ColoredButton onClick={() => setOpen(true)} color='cyan' >
        <svg viewBox="0 0 24 24" fill="none" className="size-5">
          <g id="SVGRepo_bgCarrier" strokeWidth="0" />
          <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
          <g id="SVGRepo_iconCarrier">
            <path
              d="M9 12H15"
              className="stroke-[#323232] dark:stroke-[#b8b8b8]"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 9L12 15"
              className="stroke-[#323232] dark:stroke-[#b8b8b8]"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 12C3 4.5885 4.5885 3 12 3C19.4115 3 21 4.5885 21 12C21 19.4115 19.4115 21 12 21C4.5885 21 3 19.4115 3 12Z"
              className="stroke-[#323232] dark:stroke-[#b8b8b8]"
              strokeWidth="2"
            />
          </g>
        </svg>
        {buttonLabel}
      </ColoredButton>

      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                key="jd-modal-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                transition={{ duration: 0.2 }}
                onMouseDown={(e) => {
                  isBackdropClickRef.current = e.target === e.currentTarget;
                }}
                onClick={(e) => {
                  if (isBackdropClickRef.current && e.target === e.currentTarget) {
                    handleClose();
                  }
                }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none backdrop-blur-xs"
              >
                {/* Wave Shader Backdrop with synchronized exit */}
                <motion.div
                  key="jd-shader-backdrop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{
                    opacity: 0,
                    transition: { duration: 0.2, ease: 'easeOut' },
                  }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="absolute inset-0 pointer-events-none overflow-hidden"
                >
                  <WaveBackgroundPreview className="w-full h-full mask-t-from-80%" />
                </motion.div>

                {/* Minimalist, Sleek Modal Window matching ProjectModal */}
                <motion.div
                  key="jd-modal-window"
                  initial={{ opacity: 0, scale: 0.95, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    scale: 0.95,
                    y: 12,
                    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
                  }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative w-full max-w-2xl h-[86dvh] max-h-[700px] bg-background border border-border/60 shadow-2xl rounded-2xl flex flex-col overflow-hidden text-foreground z-10 select-auto"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 shrink-0">
                    <div>
                      <h2 className="font-sans text-xl font-semibold">
                        Add Job Description
                      </h2>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Paste the target job description to create a tailored resume version.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={handleClose}
                      className="h-8 w-8 rounded-full p-0 text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-4 h-4" />
                      <span className="sr-only">Close</span>
                    </Button>
                  </div>

                  {/* Form */}
                  <form
                    onSubmit={handleSubmit}
                    className="flex flex-col flex-1 overflow-hidden"
                  >
                    <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3">
                      <div className="flex flex-col flex-1 gap-1.5 min-h-0">
                        <Label className="text-xs text-primary/90 font-medium">
                          Job Description
                        </Label>
                        <Textarea
                          placeholder="Paste the job description text here..."
                          value={description}
                          onChange={(event) => setDescription(event.target.value)}
                          className="flex-1 min-h-[240px] resize-none leading-relaxed font-sans text-sm border-border/60 p-3.5 focus-visible:ring-1"
                          autoFocus
                        />
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between items-center px-6 py-3 border-t border-border/60 bg-background/80 backdrop-blur-sm shrink-0">
                      <div className="text-xs text-muted-foreground">
                        {description.trim() ? (
                          <span>
                            <strong className="text-foreground font-medium">
                              {description.length}
                            </strong>{' '}
                            characters ·{' '}
                            <strong className="text-foreground font-medium">
                              {description.trim().split(/\s+/).length}
                            </strong>{' '}
                            words
                          </span>
                        ) : (
                          <span>Ready to paste</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={handleClose}
                          disabled={loading}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={!description.trim() || loading}
                        >
                          {loading ? 'Creating...' : 'Save'}
                        </Button>
                      </div>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
