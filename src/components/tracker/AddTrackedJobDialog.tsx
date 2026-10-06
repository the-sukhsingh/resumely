'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAction, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import { JobStage, STAGE_CONFIGS } from './types';
import { Button } from '@/components/ui/button';
import ColoredButton from '@/components/custom/colored-button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { WaveBackgroundPreview } from '@/components/custom/bg-shader-modal';
import AnimatedSwitcher from '@/components/custom/animated-switcher';
import {
  X,
  DollarSign,
  Loader2,
} from 'lucide-react';
import {
  AddCircle,
  LinkDuo,
  Clock,
  SendDuo,
  Building,
  Location,
  Clipboard,
  SparklesDuo,
} from '@/components/icons';
import { toast } from 'sonner';

interface Props {
  userId: Id<'users'>;
  masterResumeId?: Id<'resumeVersions'>;
  onCreated?: (applicationId: Id<'jobApplications'>) => void;
  trigger?: React.ReactNode;
  initialStage?: JobStage;
}

export default function AddTrackedJobDialog({
  userId,
  masterResumeId,
  onCreated,
  trigger,
  initialStage = 'saved',
}: Props) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'paste' | 'link' | 'manual'>('paste');
  const isBackdropClickRef = useRef(false);

  // Paste JD Form State
  const [pastedDescription, setPastedDescription] = useState('');
  const [pasteJobUrl, setPasteJobUrl] = useState('');
  const [pasteStage, setPasteStage] = useState<JobStage>(initialStage);
  const [pasteAutoTailor, setPasteAutoTailor] = useState(Boolean(masterResumeId));
  const [pasteExtracting, setPasteExtracting] = useState(false);
  const [pastePhase, setPastePhase] = useState<'analyzing' | 'tailoring' | 'idle'>('idle');

  // Link Form State
  const [url, setUrl] = useState('');
  const [linkDescription, setLinkDescription] = useState('');
  const [linkStage, setLinkStage] = useState<JobStage>(initialStage);
  const [autoTailor, setAutoTailor] = useState(Boolean(masterResumeId));
  const [extracting, setExtracting] = useState(false);
  const [extractPhase, setExtractPhase] = useState<'scraping' | 'analyzing' | 'tailoring' | 'idle'>('idle');

  // Manual Form State
  const [manualCompany, setManualCompany] = useState('');
  const [manualTitle, setManualTitle] = useState('');
  const [manualStage, setManualStage] = useState<JobStage>(initialStage);
  const [manualUrl, setManualUrl] = useState('');
  const [manualLocation, setManualLocation] = useState('');
  const [manualSalary, setManualSalary] = useState('');
  const [manualDescription, setManualDescription] = useState('');
  const [manualNotes, setManualNotes] = useState('');
  const [manualSubmitting, setManualSubmitting] = useState(false);

  // Convex actions & mutations
  const extractJobFromText = useAction(api.jobTracker.extractJobFromText);
  const extractJobFromUrl = useAction(api.jobTracker.extractJobFromUrl);
  const createJobApplication = useMutation(api.jobTracker.createJobApplication);
  const createJobDescription = useMutation(api.jobDescriptions.createJobDescription);

  // Sync initialStage & masterResumeId on open
  useEffect(() => {
    if (open) {
      setPasteStage(initialStage);
      setLinkStage(initialStage);
      setManualStage(initialStage);
      setPasteAutoTailor(Boolean(masterResumeId));
      setAutoTailor(Boolean(masterResumeId));
    }
  }, [open, initialStage, masterResumeId]);

  const handleClose = () => {
    if (extracting || pasteExtracting || manualSubmitting) return;
    setOpen(false);
    // Reset paste state
    setPastedDescription('');
    setPasteJobUrl('');
    setPastePhase('idle');
    // Reset link state
    setUrl('');
    setLinkDescription('');
    setExtractPhase('idle');
    // Reset manual state
    setManualCompany('');
    setManualTitle('');
    setManualUrl('');
    setManualLocation('');
    setManualSalary('');
    setManualDescription('');
    setManualNotes('');
  };

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, extracting, pasteExtracting, manualSubmitting]);

  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  // Clipboard Paste Helper
  const handlePasteFromClipboard = async () => {
    try {
      if (navigator?.clipboard?.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim()) {
          setPastedDescription(text.trim());
          toast.success('Pasted job description from clipboard!');
        } else {
          toast.info('Clipboard is empty.');
        }
      } else {
        toast.info('Please use Ctrl+V to paste your job description.');
      }
    } catch {
      toast.info('Please use Ctrl+V to paste your job description.');
    }
  };

  // Handle Pasted JD Extraction Submit
  const handlePasteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = pastedDescription.trim();
    if (!trimmed || pasteExtracting) return;

    if (trimmed.length < 40) {
      toast.error('Please paste a more complete job description detailing role responsibilities or requirements.');
      return;
    }

    setPasteExtracting(true);
    setPastePhase('analyzing');

    try {
      const tailorPhaseTimer = setTimeout(() => {
        if (pasteAutoTailor && masterResumeId) {
          setPastePhase('tailoring');
        }
      }, 2600);

      const result = await extractJobFromText({
        userId,
        text: trimmed,
        stage: pasteStage,
        jobUrl: pasteJobUrl.trim() || undefined,
        autoTailor: Boolean(pasteAutoTailor && masterResumeId),
        masterResumeId: masterResumeId || undefined,
      });

      clearTimeout(tailorPhaseTimer);

      toast.success(
        result.resumeVersionId
          ? `Tracked "${result.title}" at ${result.company} & tailored resume!`
          : `Tracked "${result.title}" at ${result.company}`
      );

      onCreated?.(result.jobApplicationId);
      handleClose();
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Failed to parse job description';
      toast.error(msg);
    } finally {
      setPasteExtracting(false);
      setPastePhase('idle');
    }
  };

  // Handle URL Extraction Submit
  const handleExtractSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedUrl = url.trim();
    if (!trimmedUrl || extracting) return;

    // Basic URL check
    if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
      toast.error('Please enter a valid URL starting with https://');
      return;
    }

    // Check for common non-job domains
    const lowerUrl = trimmedUrl.toLowerCase();
    const nonJobDomains = [
      'youtube.com', 'youtu.be', 'tiktok.com', 'instagram.com', 'facebook.com',
      'twitter.com', 'x.com', 'spotify.com', 'netflix.com', 'reddit.com'
    ];
    if (nonJobDomains.some((d) => lowerUrl.includes(d))) {
      toast.error('The provided link is from a media or social network, not an active job vacancy. Please paste a direct job posting link.');
      return;
    }

    setExtracting(true);
    setExtractPhase('scraping');

    try {
      // Phase 1 -> 2 transition timer for visual responsiveness
      const phaseTimer = setTimeout(() => {
        setExtractPhase('analyzing');
      }, 1200);

      const tailorPhaseTimer = setTimeout(() => {
        if (autoTailor && masterResumeId) {
          setExtractPhase('tailoring');
        }
      }, 3500);

      const result = await extractJobFromUrl({
        userId,
        url: trimmedUrl,
        stage: linkStage,
        autoTailor: Boolean(autoTailor && masterResumeId),
        masterResumeId: masterResumeId || undefined,
        customDescription: linkDescription.trim() || undefined,
      });

      clearTimeout(phaseTimer);
      clearTimeout(tailorPhaseTimer);

      toast.success(
        result.resumeVersionId
          ? `Tracked "${result.title}" at ${result.company} & tailored resume!`
          : `Tracked "${result.title}" at ${result.company}`
      );

      onCreated?.(result.jobApplicationId);
      handleClose();
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Failed to extract job details';
      toast.error(msg);
      // Switch to paste mode pre-filling the URL so user can still proceed!
      setPasteJobUrl(trimmedUrl);
      setTab('paste');
    } finally {
      setExtracting(false);
      setExtractPhase('idle');
    }
  };

  // Handle Manual Submit
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCompany.trim() || !manualTitle.trim() || manualSubmitting) return;

    setManualSubmitting(true);
    try {
      let jobDescriptionId: Id<'jobDescriptions'> | undefined = undefined;

      // If user pasted a job description, save it as a jobDescription record
      if (manualDescription.trim()) {
        jobDescriptionId = await createJobDescription({
          userId,
          description: manualDescription.trim(),
          requirements: [],
          responsibilities: [],
          extractedSkills: [],
          extractedKeywords: [],
        });
      }

      const appId = await createJobApplication({
        userId,
        company: manualCompany.trim(),
        title: manualTitle.trim(),
        stage: manualStage,
        jobUrl: manualUrl.trim() || undefined,
        location: manualLocation.trim() || undefined,
        salary: manualSalary.trim() || undefined,
        notes: manualNotes.trim() || undefined,
        jobDescriptionId,
      });

      toast.success(`Tracked "${manualTitle.trim()}" at ${manualCompany.trim()}`);
      onCreated?.(appId);
      handleClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to create job tracking entry');
    } finally {
      setManualSubmitting(false);
    }
  };

  return (
    <>
      {trigger ? (
        <div onClick={() => setOpen(true)} className="cursor-pointer">
          {trigger}
        </div>
      ) : (
        <ColoredButton
          color="amber"
          size="default"
          onClick={() => setOpen(true)}
          className="rounded-full px-4 shadow-xs"
        >
          <AddCircle className="size-3.5 mr-1" />
          <span>Track Job</span>
        </ColoredButton>
      )}

      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                key="track-modal-backdrop"
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
                className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 select-none backdrop-blur-xs"
              >
                {/* Wave Backdrop */}
                <motion.div
                  key="track-shader-backdrop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.2, ease: 'easeOut' } }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="absolute inset-0 pointer-events-none overflow-hidden"
                >
                  <WaveBackgroundPreview className="w-full h-full mask-t-from-80%" />
                </motion.div>

                {/* Modal Container / Mobile Drawer */}
                <motion.div
                  key="track-modal-window"
                  initial={{ opacity: 0, y: 32, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{
                    opacity: 0,
                    y: 32,
                    scale: 0.98,
                    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
                  }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative w-full max-w-xl h-[88dvh] sm:h-[640px] max-h-[90dvh] sm:max-h-[88dvh] bg-background border-t sm:border border-border/70 shadow-2xl rounded-t-3xl sm:rounded-2xl rounded-b-none sm:rounded-b-2xl flex flex-col overflow-hidden text-foreground z-10 select-auto"
                >
                  {/* Mobile Pull Handle */}
                  <div className="w-full flex sm:hidden items-center justify-center pt-2.5 pb-1 shrink-0">
                    <div className="w-12 h-1.5 rounded-full bg-muted-foreground/30" />
                  </div>

                  {/* Header */}
                  <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-border/60 shrink-0">
                    <div>
                      <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                        <span>Tracker</span>
                        <span className="text-border">/</span>
                        <span>New Application</span>
                      </div>
                      <h2 className="font-sans text-lg sm:text-xl font-semibold tracking-tight mt-0.5">
                        Track a Job Application
                      </h2>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={handleClose}
                      disabled={extracting || pasteExtracting || manualSubmitting}
                      className="h-8 w-8 rounded-full p-0 text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-4 h-4" />
                      <span className="sr-only">Close</span>
                    </Button>
                  </div>

                  {/* Tabs: Paste JD vs Link vs Manual */}
                  <div className="px-4 sm:px-6 pt-3 pb-1 shrink-0">
                    <AnimatedSwitcher
                      value={tab}
                      onChange={setTab}
                      fullWidth
                      className="max-w-sm"
                      items={[
                        { value: 'paste', label: 'Paste JD' },
                        { value: 'link', label: 'From Link'},
                        { value: 'manual', label: 'Manual' },
                      ]}
                    />
                  </div>

                  {/* Tab Content with fixed container height and smooth transitions */}
                  <AnimatePresence mode="wait" initial={false}>
                    {tab === 'paste' ? (
                      /* Tab 1: Paste Job Description */
                      <motion.form
                        key="tab-paste"
                        onSubmit={handlePasteSubmit}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="flex flex-col flex-1 min-h-0 overflow-hidden"
                      >
                        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 min-h-0">
                        {/* Job Description Textarea */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs font-medium text-foreground">
                              Job Description <span className="text-destructive">*</span>
                            </Label>
                            <div className="flex items-center gap-2">
                              {pastedDescription.trim().length > 0 && (
                                <span className="text-[10px] text-muted-foreground font-mono">
                                  {pastedDescription.trim().length.toLocaleString()} chars
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={handlePasteFromClipboard}
                                disabled={pasteExtracting}
                                className="text-[11px] text-primary hover:text-primary/80 hover:underline flex items-center gap-1 font-medium cursor-pointer"
                              >
                                <Clipboard className="size-3" />
                                <span>Paste from clipboard</span>
                              </button>
                            </div>
                          </div>
                          <Textarea
                            placeholder="Paste the full job description here (requirements, responsibilities, role details)..."
                            value={pastedDescription}
                            onChange={(e) => setPastedDescription(e.target.value)}
                            disabled={pasteExtracting}
                            required
                            autoFocus
                            className="min-h-[140px] text-xs resize-y rounded-xl leading-relaxed font-sans placeholder:text-muted-foreground/60"
                          />
                          <p className="text-[11px] text-muted-foreground leading-relaxed">
                            Resumely AI automatically extracts the company name, job title, location, salary, ATS keywords, and required skills.
                          </p>
                        </div>

                        {/* Optional Job URL */}
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium text-foreground flex items-center justify-between">
                            <span>Job Posting Link (Optional)</span>
                          </Label>
                          <div className="relative">
                            <LinkDuo className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                            <Input
                              type="url"
                              placeholder="https://..."
                              value={pasteJobUrl}
                              onChange={(e) => setPasteJobUrl(e.target.value)}
                              disabled={pasteExtracting}
                              className="pl-8 text-xs h-9 rounded-xl border-border/70"
                            />
                          </div>
                        </div>

                        {/* Initial Stage Selector */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs font-semibold text-foreground tracking-tight">
                              Initial Stage
                            </Label>
                            <span className="text-[11px] font-mono text-muted-foreground">
                              {pasteStage === 'saved' ? 'Queued in Saved' : 'Marked as Applied'}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            {/* Option 1: Saved for later */}
                            <button
                              type="button"
                              onClick={() => setPasteStage('saved')}
                              className={cn(
                                'group relative flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer select-none active:scale-[0.98]',
                                pasteStage === 'saved'
                                  ? 'border-amber-500/40 bg-amber-500/8 text-foreground ring-1 ring-amber-500/20 shadow-2xs'
                                  : 'border-border/60 bg-card/40 hover:bg-muted/40 hover:border-border text-muted-foreground hover:text-foreground'
                              )}
                            >
                              <div
                                className={cn(
                                  'size-8 rounded-lg flex items-center justify-center shrink-0 transition-colors border',
                                  pasteStage === 'saved'
                                    ? 'bg-amber-500/15 text-amber-500 border-amber-500/25 shadow-2xs'
                                    : 'bg-muted/60 text-muted-foreground border-border/40 group-hover:text-foreground'
                                )}
                              >
                                <Clock className="size-4" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold leading-tight text-foreground">Save for later</p>
                                <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">Apply when ready</p>
                              </div>
                              {pasteStage === 'saved' && (
                                <span className="size-1.5 rounded-full bg-amber-500 shrink-0 mr-0.5" />
                              )}
                            </button>

                            {/* Option 2: Already Applied */}
                            <button
                              type="button"
                              onClick={() => setPasteStage('applied')}
                              className={cn(
                                'group relative flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer select-none active:scale-[0.98]',
                                pasteStage === 'applied'
                                  ? 'border-blue-500/40 bg-blue-500/8 text-foreground ring-1 ring-blue-500/20 shadow-2xs'
                                  : 'border-border/60 bg-card/40 hover:bg-muted/40 hover:border-border text-muted-foreground hover:text-foreground'
                              )}
                            >
                              <div
                                className={cn(
                                  'size-8 rounded-lg flex items-center justify-center shrink-0 transition-colors border',
                                  pasteStage === 'applied'
                                    ? 'bg-blue-500/15 text-blue-500 border-blue-500/25 shadow-2xs'
                                    : 'bg-muted/60 text-muted-foreground border-border/40 group-hover:text-foreground'
                                )}
                              >
                                <SendDuo className="size-4" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold leading-tight text-foreground">Already Applied</p>
                                <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">Track active pipeline</p>
                              </div>
                              {pasteStage === 'applied' && (
                                <span className="size-1.5 rounded-full bg-blue-500 shrink-0 mr-0.5" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Tailor Resume with AI Option */}
                        <div
                          onClick={() => {
                            if (masterResumeId && !pasteExtracting) {
                              setPasteAutoTailor(!pasteAutoTailor);
                            }
                          }}
                          className={cn(
                            'group relative flex items-center justify-between p-3 rounded-xl border transition-all duration-200 select-none',
                            !masterResumeId
                              ? 'border-border/40 bg-muted/10 opacity-60 cursor-not-allowed'
                              : pasteAutoTailor
                                ? 'border-emerald-500/40 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent hover:border-emerald-500/50 shadow-2xs cursor-pointer ring-1 ring-emerald-500/20'
                                : 'border-border/60 bg-card/40 hover:bg-muted/30 hover:border-border cursor-pointer active:scale-[0.99]'
                          )}
                        >
                          <div className="flex items-center gap-3 min-w-0 pr-3">
                            <div
                              className={cn(
                                'size-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 border',
                                pasteAutoTailor && masterResumeId
                                  ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30 shadow-2xs'
                                  : 'bg-muted/60 text-muted-foreground border-border/50 group-hover:text-foreground'
                              )}
                            >
                              <SparklesDuo className="size-4.5" />
                            </div>

                            <div className="min-w-0 space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-foreground tracking-tight">
                                  Tailor Resume with AI
                                </span>
                                <span
                                  className={cn(
                                    'inline-flex items-center px-1.5 py-0.2 rounded-full text-[10px] font-mono font-medium transition-colors',
                                    pasteAutoTailor && masterResumeId
                                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25'
                                      : 'bg-muted/60 text-muted-foreground border border-border/50'
                                  )}
                                >
                                  {pasteAutoTailor && masterResumeId ? 'Enabled' : 'Recommended'}
                                </span>
                              </div>
                              <p className="text-[11px] text-muted-foreground leading-snug">
                                Automatically adapts bullet points & ATS keywords for this role
                              </p>
                              {!masterResumeId && (
                                <p className="text-[10px] text-amber-500/90 font-medium pt-0.5">
                                  Requires a master resume. You can track now and tailor later.
                                </p>
                              )}
                            </div>
                          </div>

                          <Switch
                            checked={pasteAutoTailor && !!masterResumeId}
                            onCheckedChange={(checked) => masterResumeId && setPasteAutoTailor(checked)}
                            disabled={pasteExtracting || !masterResumeId}
                            className="shrink-0 data-[state=checked]:bg-emerald-500"
                          />
                        </div>

                        {/* Progress animation */}
                        {pasteExtracting && (
                          <div className="p-4 rounded-xl border border-border/70 bg-muted/30 space-y-2.5 animate-in fade-in duration-200">
                            <div className="flex items-center gap-2.5">
                              <Loader2 className="size-4 animate-spin text-primary" />
                              <span className="text-xs font-medium text-foreground">
                                {pastePhase === 'analyzing' && 'Analyzing requirements & ATS keywords with AI...'}
                                {pastePhase === 'tailoring' && 'Crafting tailored resume version with AI...'}
                                {pastePhase === 'idle' && 'Processing job details...'}
                              </span>
                            </div>
                            <div className="w-full bg-muted/60 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-primary h-full transition-all duration-500"
                                style={{
                                  width: pastePhase === 'analyzing' ? '60%' : '95%',
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex justify-end gap-2 items-center px-4 sm:px-6 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] sm:pb-3 border-t border-border/60 bg-background/80 backdrop-blur-sm shrink-0">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={handleClose}
                          disabled={pasteExtracting}
                          className="text-xs text-muted-foreground"
                        >
                          Cancel
                        </Button>
                        <ColoredButton
                          type="submit"
                          disabled={!pastedDescription.trim() || pasteExtracting}
                          className="text-xs font-medium px-4"
                          color="emerald"
                        >
                          {pasteExtracting ? (
                            <>
                              <Loader2 className="size-3.5 animate-spin mr-1.5" />
                              Processing...
                            </>
                          ) : pasteAutoTailor && masterResumeId ? (
                            <>
                              Create & Tailor
                            </>
                          ) : (
                            <>
                              Create Job
                            </>
                          )}
                        </ColoredButton>
                      </div>
                    </motion.form>
                  ) : tab === 'link' ? (
                    /* Tab 2: From Job Link */
                    <motion.form
                      key="tab-link"
                      onSubmit={handleExtractSubmit}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="flex flex-col flex-1 min-h-0 overflow-hidden"
                    >
                      <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 min-h-0">
                        <div className="space-y-2">
                          <Label className="text-xs font-medium text-foreground">
                            Job Posting URL
                          </Label>
                          <div className="relative">
                            <LinkDuo className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                            <Input
                              type="url"
                              placeholder="https://jobs.lever.co/... or greenhouse, ashby, linkedin..."
                              value={url}
                              onChange={(e) => setUrl(e.target.value)}
                              disabled={extracting}
                              required
                              autoFocus
                              className="pl-9 pr-3 text-sm h-10 rounded-xl border-border/70 focus-visible:ring-1"
                            />
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">
                            Resumely will read the posting, extract company, role title, skills & ATS keywords automatically.
                          </p>
                        </div>

                        {/* Full Job Description (Optional) */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs font-medium text-foreground">
                              Full Job Description <span className="text-muted-foreground font-normal">(Optional)</span>
                            </Label>
                            <span className="text-[10px] text-muted-foreground font-mono">
                              Auto-extracted from URL if empty
                            </span>
                          </div>
                          <Textarea
                            placeholder="Optional: Paste the full job description text here if the URL requires authentication, has bot protection, or to guarantee exact requirements..."
                            value={linkDescription}
                            onChange={(e) => setLinkDescription(e.target.value)}
                            disabled={extracting}
                            className="min-h-[85px] text-xs resize-none rounded-xl border-border/70 placeholder:text-muted-foreground/70"
                          />
                        </div>

                        {/* Initial Stage Selector */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs font-semibold text-foreground tracking-tight">
                              Initial Stage
                            </Label>
                            <span className="text-[11px] font-mono text-muted-foreground">
                              {linkStage === 'saved' ? 'Queued in Saved' : 'Marked as Applied'}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            {/* Option 1: Saved for later */}
                            <button
                              type="button"
                              onClick={() => setLinkStage('saved')}
                              className={cn(
                                'group relative flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer select-none active:scale-[0.98]',
                                linkStage === 'saved'
                                  ? 'border-amber-500/40 bg-amber-500/8 text-foreground ring-1 ring-amber-500/20 shadow-2xs'
                                  : 'border-border/60 bg-card/40 hover:bg-muted/40 hover:border-border text-muted-foreground hover:text-foreground'
                              )}
                            >
                              <div
                                className={cn(
                                  'size-8 rounded-lg flex items-center justify-center shrink-0 transition-colors border',
                                  linkStage === 'saved'
                                    ? 'bg-amber-500/15 text-amber-500 border-amber-500/25 shadow-2xs'
                                    : 'bg-muted/60 text-muted-foreground border-border/40 group-hover:text-foreground'
                                )}
                              >
                                <Clock className="size-4" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold leading-tight text-foreground">Save for later</p>
                                <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">Apply when ready</p>
                              </div>
                              {linkStage === 'saved' && (
                                <span className="size-1.5 rounded-full bg-amber-500 shrink-0 mr-0.5" />
                              )}
                            </button>

                            {/* Option 2: Already Applied */}
                            <button
                              type="button"
                              onClick={() => setLinkStage('applied')}
                              className={cn(
                                'group relative flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer select-none active:scale-[0.98]',
                                linkStage === 'applied'
                                  ? 'border-blue-500/40 bg-blue-500/8 text-foreground ring-1 ring-blue-500/20 shadow-2xs'
                                  : 'border-border/60 bg-card/40 hover:bg-muted/40 hover:border-border text-muted-foreground hover:text-foreground'
                              )}
                            >
                              <div
                                className={cn(
                                  'size-8 rounded-lg flex items-center justify-center shrink-0 transition-colors border',
                                  linkStage === 'applied'
                                    ? 'bg-blue-500/15 text-blue-500 border-blue-500/25 shadow-2xs'
                                    : 'bg-muted/60 text-muted-foreground border-border/40 group-hover:text-foreground'
                                )}
                              >
                                <SendDuo className="size-4" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold leading-tight text-foreground">Already Applied</p>
                                <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">Track active pipeline</p>
                              </div>
                              {linkStage === 'applied' && (
                                <span className="size-1.5 rounded-full bg-blue-500 shrink-0 mr-0.5" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Tailor Resume with AI Option */}
                        <div
                          onClick={() => {
                            if (masterResumeId && !extracting) {
                              setAutoTailor(!autoTailor);
                            }
                          }}
                          className={cn(
                            'group relative flex items-center justify-between p-3 rounded-xl border transition-all duration-200 select-none',
                            !masterResumeId
                              ? 'border-border/40 bg-muted/10 opacity-60 cursor-not-allowed'
                              : autoTailor
                                ? 'border-emerald-500/40 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent hover:border-emerald-500/50 shadow-2xs cursor-pointer ring-1 ring-emerald-500/20'
                                : 'border-border/60 bg-card/40 hover:bg-muted/30 hover:border-border cursor-pointer active:scale-[0.99]'
                          )}
                        >
                          <div className="flex items-center gap-3 min-w-0 pr-3">
                            <div
                              className={cn(
                                'size-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 border',
                                autoTailor && masterResumeId
                                  ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30 shadow-2xs'
                                  : 'bg-muted/60 text-muted-foreground border-border/50 group-hover:text-foreground'
                              )}
                            >
                              <SparklesDuo className="size-4.5" />
                            </div>

                            <div className="min-w-0 space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-foreground tracking-tight">
                                  Tailor Resume with AI
                                </span>
                                <span
                                  className={cn(
                                    'inline-flex items-center px-1.5 py-0.2 rounded-full text-[10px] font-mono font-medium transition-colors',
                                    autoTailor && masterResumeId
                                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25'
                                      : 'bg-muted/60 text-muted-foreground border border-border/50'
                                  )}
                                >
                                  {autoTailor && masterResumeId ? 'Enabled' : 'Recommended'}
                                </span>
                              </div>
                              <p className="text-[11px] text-muted-foreground leading-snug">
                                Automatically adapts bullet points & ATS keywords for this role
                              </p>
                              {!masterResumeId && (
                                <p className="text-[10px] text-amber-500/90 font-medium pt-0.5">
                                  Requires a master resume. You can track now and tailor later.
                                </p>
                              )}
                            </div>
                          </div>

                          <Switch
                            checked={autoTailor && !!masterResumeId}
                            onCheckedChange={(checked) => masterResumeId && setAutoTailor(checked)}
                            disabled={extracting || !masterResumeId}
                            className="shrink-0 data-[state=checked]:bg-emerald-500"
                          />
                        </div>

                        {/* Extracting Progress Animation */}
                        {extracting && (
                          <div className="p-4 rounded-xl border border-border/70 bg-muted/30 space-y-2.5 animate-in fade-in duration-200">
                            <div className="flex items-center gap-2.5">
                              <Loader2 className="size-4 animate-spin text-primary" />
                              <span className="text-xs font-medium text-foreground">
                                {extractPhase === 'scraping' && 'Fetching job posting page...'}
                                {extractPhase === 'analyzing' && 'Analyzing requirements & ATS keywords with AI...'}
                                {extractPhase === 'tailoring' && 'Crafting tailored resume version with AI...'}
                                {extractPhase === 'idle' && 'Extracting job details...'}
                              </span>
                            </div>
                            <div className="w-full bg-muted/60 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-primary h-full transition-all duration-500"
                                style={{
                                  width:
                                    extractPhase === 'scraping'
                                      ? '33%'
                                      : extractPhase === 'analyzing'
                                      ? '68%'
                                      : '94%',
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex justify-end gap-2 items-center px-4 sm:px-6 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] sm:pb-3 border-t border-border/60 bg-background/80 backdrop-blur-sm shrink-0">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={handleClose}
                          disabled={extracting}
                          className="text-xs text-muted-foreground"
                        >
                          Cancel
                        </Button>
                        <ColoredButton
                          type="submit"
                          disabled={!url.trim() || extracting}
                          className="text-xs font-medium px-4"
                          color="emerald"
                        >
                          {extracting ? (
                            <>
                              <Loader2 className="size-3.5 animate-spin mr-1.5" />
                              Processing...
                            </>
                          ) : autoTailor && masterResumeId ? (
                            <>
                              Extract & Tailor
                            </>
                          ) : (
                            <>
                              Extract & Track
                            </>
                          )}
                        </ColoredButton>
                      </div>
                    </motion.form>
                  ) : (
                    /* Tab 3: Manual Entry */
                    <motion.form
                      key="tab-manual"
                      onSubmit={handleManualSubmit}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="flex flex-col flex-1 min-h-0 overflow-hidden"
                    >
                      <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 min-h-0">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <Label className="text-xs font-medium">Company *</Label>
                            <div className="relative">
                              <Building className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                              <Input
                                placeholder="e.g. Stripe, Linear"
                                value={manualCompany}
                                onChange={(e) => setManualCompany(e.target.value)}
                                required
                                className="pl-8 text-xs h-9 rounded-xl"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <Label className="text-xs font-medium">Job Title *</Label>
                            <Input
                              placeholder="e.g. Senior Frontend Engineer"
                              value={manualTitle}
                              onChange={(e) => setManualTitle(e.target.value)}
                              required
                              className="text-xs h-9 rounded-xl"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="space-y-1.5">
                            <Label className="text-xs font-medium">Stage</Label>
                            <Select
                              value={manualStage}
                              onValueChange={(val) => setManualStage(val as JobStage)}
                            >
                              <SelectTrigger className="w-full text-xs h-9 px-3 rounded-xl bg-background border border-border/70 text-foreground focus-visible:ring-1 focus-visible:ring-foreground/20">
                                <div className="flex items-center gap-2">
                                  <span className={cn('size-2 rounded-full shrink-0', STAGE_CONFIGS[manualStage].dotClass)} />
                                  <SelectValue />
                                </div>
                              </SelectTrigger>
                              <SelectContent position="popper" className="z-[110]">
                                {(Object.keys(STAGE_CONFIGS) as JobStage[]).map((st) => (
                                  <SelectItem key={st} value={st} className="text-xs cursor-pointer">
                                    <div className="flex items-center gap-2">
                                      <span className={cn('size-2 rounded-full shrink-0', STAGE_CONFIGS[st].dotClass)} />
                                      <span>{STAGE_CONFIGS[st].label}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-1.5">
                            <Label className="text-xs font-medium">Location (Optional)</Label>
                            <div className="relative">
                              <Location className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                              <Input
                                placeholder="Remote, SF, NY"
                                value={manualLocation}
                                onChange={(e) => setManualLocation(e.target.value)}
                                className="pl-8 text-xs h-9 rounded-xl"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <Label className="text-xs font-medium">Salary (Optional)</Label>
                            <div className="relative">
                              <DollarSign className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                              <Input
                                placeholder="$150k - $180k"
                                value={manualSalary}
                                onChange={(e) => setManualSalary(e.target.value)}
                                className="pl-8 text-xs h-9 rounded-xl"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium">Job URL (Optional)</Label>
                          <Input
                            type="url"
                            placeholder="https://..."
                            value={manualUrl}
                            onChange={(e) => setManualUrl(e.target.value)}
                            className="text-xs h-9 rounded-xl"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium">
                            Job Description Text (Optional)
                          </Label>
                          <Textarea
                            placeholder="Paste requirements, responsibilities, or raw description to enable 1-click tailoring later..."
                            value={manualDescription}
                            onChange={(e) => setManualDescription(e.target.value)}
                            className="min-h-[100px] text-xs resize-none rounded-xl"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium">Notes & Contacts (Optional)</Label>
                          <Textarea
                            placeholder="Referral name, recruiter contact, interview reminders..."
                            value={manualNotes}
                            onChange={(e) => setManualNotes(e.target.value)}
                            className="min-h-[60px] text-xs resize-none rounded-xl"
                          />
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex justify-end gap-2 items-center px-4 sm:px-6 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] sm:pb-3 border-t border-border/60 bg-background/80 backdrop-blur-sm shrink-0">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={handleClose}
                          disabled={manualSubmitting}
                          className="text-xs text-muted-foreground"
                        >
                          Cancel
                        </Button>
                        <ColoredButton
                          type="submit"
                          disabled={!manualCompany.trim() || !manualTitle.trim() || manualSubmitting}
                          className="text-xs font-medium px-4"
                          color="emerald"
                        >
                          {manualSubmitting ? 'Saving...' : 'Track Application'}
                        </ColoredButton>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
