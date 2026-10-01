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
import { X, Plus } from 'lucide-react';

interface Props {
  buttonLabel?: string;
  userId: Id<'users'>;
  masterResumeId: Id<'resumeVersions'>;
  onCreated?: (versionId: Id<'resumeVersions'>) => void;
  trigger?: React.ReactNode;
  variant?: 'button' | 'card' | 'minimal';
}

export default function AddJobDescriptionDialog({
  buttonLabel = 'Add Job Description',
  userId,
  masterResumeId,
  onCreated,
  trigger,
  variant = 'minimal',
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
      {trigger ? (
        <div onClick={() => setOpen(true)} className="cursor-pointer h-full w-full">
          {trigger}
        </div>
      ) : variant === 'card' ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group flex flex-col items-center justify-center min-h-[150px] h-full w-full rounded-xl border border-dashed border-border/80 hover:border-foreground/30 bg-muted/10 hover:bg-muted/25 p-5 text-center transition-all duration-200 cursor-pointer active:scale-[0.98]"
        >
          <div className="size-9 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors mb-2.5">
            <Plus className="size-4" />
          </div>
          <p className="text-xs font-semibold text-foreground tracking-tight">Target New Job</p>
          <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">Tailor resume for a job posting</p>
        </button>
      ) : variant === 'minimal' ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs md:text-sm font-medium rounded-lg bg-foreground text-background hover:bg-foreground/90 active:scale-[0.98] transition-all cursor-pointer shadow-xs"
        >
          <Plus className="size-3.5" />
          <span>{buttonLabel}</span>
        </button>
      ) : (
        <ColoredButton onClick={() => setOpen(true)} color="cyan">
          <Plus className="size-4 mr-1" />
          {buttonLabel}
        </ColoredButton>
      )}

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
