'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { Button } from '@/components/ui/button';
import ColoredButton from '@/components/custom/colored-button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'motion/react';
import { WaveBackgroundPreview } from '@/components/custom/bg-shader-modal';
import { X, Plus, Link2, FileText, Sparkles, Loader2, Clock, Send } from 'lucide-react';
import { toast } from 'sonner';

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
  const [mode, setMode] = useState<'text' | 'link'>('link');
  const [linkUrl, setLinkUrl] = useState('');
  const [description, setDescription] = useState('');
  const [stage, setStage] = useState<'applied' | 'saved'>('applied');
  const [loading, setLoading] = useState(false);
  const isBackdropClickRef = useRef(false);

  const createJDAndVersion = useAction(api.jobDescriptions.createJDAndVersion);
  const extractJobFromUrl = useAction(api.jobTracker.extractJobFromUrl);

  const handleClose = () => {
    if (loading) return;
    setOpen(false);
    setDescription('');
    setLinkUrl('');
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
  }, [open, loading]);

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
    if (loading) return;

    if (mode === 'link') {
      const trimmedUrl = linkUrl.trim();
      if (!trimmedUrl) return;

      if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
        toast.error('Please enter a valid URL starting with https://');
        return;
      }

      setLoading(true);
      try {
        const result = await extractJobFromUrl({
          userId,
          url: trimmedUrl,
          stage,
          autoTailor: true,
          masterResumeId,
        });

        if (result.resumeVersionId) {
          toast.success(`Tailored resume created for ${result.company}!`);
          onCreated?.(result.resumeVersionId);
        } else {
          toast.success(`Tracked ${result.company} job`);
        }
        handleClose();
      } catch (err: unknown) {
        console.error(err);
        const msg = err instanceof Error ? err.message : 'Failed to extract job from URL';
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    } else {
      const trimmed = description.trim();
      if (!trimmed) return;

      setLoading(true);
      try {
        const { versionId } = await createJDAndVersion({
          userId,
          masterResumeId,
          jdText: trimmed,
        });
        toast.success('Tailored resume created!');
        onCreated?.(versionId);
        handleClose();
      } catch (err: unknown) {
        console.error(err);
        const msg = err instanceof Error ? err.message : 'Failed to tailor resume';
        toast.error(msg);
      } finally {
        setLoading(false);
      }
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
        <ColoredButton
          onClick={() => setOpen(true)}
          color="amber"
          type="button"
          className="px-3 rounded-full"
        >
          <Plus className="size-3.5" />
          <span>{buttonLabel}</span>
        </ColoredButton>
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
                {/* Wave Background Preview */}
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

                {/* Modal Window */}
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
                  className="relative w-full max-w-xl max-h-[86dvh] bg-background border border-border/60 shadow-2xl rounded-2xl flex flex-col overflow-hidden text-foreground z-10 select-auto"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 shrink-0">
                    <div>
                      <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                        <span>Resume</span>
                        <span className="text-border">/</span>
                        <span>Tailor for Job</span>
                      </div>
                      <h2 className="font-sans text-xl font-semibold tracking-tight mt-0.5">
                        Tailor Resume for a Job
                      </h2>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={handleClose}
                      disabled={loading}
                      className="h-8 w-8 rounded-full p-0 text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-4 h-4" />
                      <span className="sr-only">Close</span>
                    </Button>
                  </div>

                  {/* Mode Selector: Link vs Raw Text */}
                  <div className="px-6 pt-3 shrink-0">
                    <div className="flex p-1 bg-muted/40 rounded-xl border border-border/50 max-w-xs">
                      <button
                        type="button"
                        onClick={() => setMode('link')}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium transition-all ${
                          mode === 'link'
                            ? 'bg-background text-foreground shadow-xs'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <Link2 className="size-3.5" />
                        <span>From Job Link</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setMode('text')}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium transition-all ${
                          mode === 'text'
                            ? 'bg-background text-foreground shadow-xs'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <FileText className="size-3.5" />
                        <span>Paste JD Text</span>
                      </button>
                    </div>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                    <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
                      {mode === 'link' ? (
                        <div className="space-y-4">
                          <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-foreground">
                              Job Link URL
                            </Label>
                            <div className="relative">
                              <Link2 className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                              <Input
                                type="url"
                                placeholder="https://jobs.lever.co/... or greenhouse, ashby, linkedin..."
                                value={linkUrl}
                                onChange={(e) => setLinkUrl(e.target.value)}
                                disabled={loading}
                                required
                                autoFocus
                                className="pl-9 text-xs h-10 rounded-xl"
                              />
                            </div>
                            <p className="text-[11px] text-muted-foreground">
                              Resumely will read the posting, extract requirements, generate a tailored resume version, and track the role in your pipeline.
                            </p>
                          </div>

                          {/* Initial Tracker Stage Selector */}
                          <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-foreground">
                              Application Stage
                            </Label>
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() => setStage('applied')}
                                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs text-left transition-all ${
                                  stage === 'applied'
                                    ? 'border-blue-500/40 bg-blue-500/10 font-medium'
                                    : 'border-border/60 bg-card/40 text-muted-foreground'
                                }`}
                              >
                                <Send className="size-3.5 text-blue-500" />
                                <span>Mark Applied</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setStage('saved')}
                                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs text-left transition-all ${
                                  stage === 'saved'
                                    ? 'border-foreground/30 bg-muted/60 font-medium'
                                    : 'border-border/60 bg-card/40 text-muted-foreground'
                                }`}
                              >
                                <Clock className="size-3.5 text-slate-500" />
                                <span>Add for later (Saved)</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col flex-1 gap-1.5 min-h-0">
                          <Label className="text-xs text-foreground font-medium">
                            Job Description Text
                          </Label>
                          <Textarea
                            placeholder="Paste the job description text, requirements, and responsibilities here..."
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                            className="flex-1 min-h-[200px] resize-none leading-relaxed font-sans text-xs border-border/60 p-3.5 rounded-xl focus-visible:ring-1"
                            autoFocus
                          />
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between items-center px-6 py-3 border-t border-border/60 bg-background/80 backdrop-blur-sm shrink-0">
                      <div className="text-xs text-muted-foreground">
                        {loading && (
                          <span className="inline-flex items-center gap-1.5 text-primary">
                            <Loader2 className="size-3.5 animate-spin" />
                            <span>AI Tailoring in progress...</span>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={handleClose}
                          disabled={loading}
                          className="text-xs text-muted-foreground"
                        >
                          Cancel
                        </Button>
                        <ColoredButton
                          type="submit"
                          disabled={
                            loading ||
                            (mode === 'link' ? !linkUrl.trim() : !description.trim())
                          }
                          className="text-xs font-medium px-4"
                          color='emerald'
                        >
                          {loading ? (
                            <>
                              <Loader2 className="size-3.5 animate-spin mr-1.5" />
                              Tailoring...
                            </>
                          ) : (
                            <>
                              Tailor & Track
                            </>
                          )}
                        </ColoredButton>
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
