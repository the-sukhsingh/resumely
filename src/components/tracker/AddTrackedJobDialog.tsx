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
import {
  X,
  DollarSign,
  Loader2,
  AlertCircle,
  Check,
  ChevronDown,
  Building2,
  MapPin,
  Globe,
  FileText,
} from 'lucide-react';
import {
  AddCircle,
  LinkDuo,
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
  const isBackdropClickRef = useRef(false);

  // Link Extraction State
  const [url, setUrl] = useState('');
  const [extracting, setExtracting] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);
  const [extractSuccess, setExtractSuccess] = useState(false);

  // Form Fields State
  const [company, setCompany] = useState('');
  const [title, setTitle] = useState('');
  const [stage, setStage] = useState<JobStage>(initialStage);
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [companyUrl, setCompanyUrl] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');

  // Expandable sections
  const [showOptionalFields, setShowOptionalFields] = useState(false);

  // AI Tailor State
  const [autoTailor, setAutoTailor] = useState(Boolean(masterResumeId));

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [submitPhase, setSubmitPhase] = useState<'saving' | 'tailoring' | 'idle'>('idle');

  // Convex actions & mutations
  const parseJobDetailsFromUrl = useAction(api.jobTracker.parseJobDetailsFromUrl);
  const createJobApplication = useMutation(api.jobTracker.createJobApplication);
  const createJobDescription = useMutation(api.jobDescriptions.createJobDescription);
  const createResumeVersion = useAction(api.resumeVersions.createResumeVersion);
  const linkResumeToJob = useMutation(api.jobTracker.linkResumeToJob);

  // Sync initial values on open
  useEffect(() => {
    if (open) {
      setStage(initialStage);
      setAutoTailor(Boolean(masterResumeId));
    }
  }, [open, initialStage, masterResumeId]);

  const handleClose = () => {
    if (extracting || submitting) return;
    setOpen(false);
    // Reset state
    setUrl('');
    setExtracting(false);
    setExtractError(null);
    setExtractSuccess(false);
    setCompany('');
    setTitle('');
    setStage(initialStage);
    setLocation('');
    setSalary('');
    setCompanyUrl('');
    setDescription('');
    setNotes('');
    setShowOptionalFields(false);
    setSubmitting(false);
    setSubmitPhase('idle');
  };

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, extracting, submitting]);

  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  // Extract from URL handler
  const handleExtractFromUrl = async () => {
    const trimmedUrl = url.trim();
    if (!trimmedUrl || extracting) return;

    if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
      toast.error('Please enter a valid URL starting with https://');
      setExtractError('Please enter a valid URL starting with https://');
      return;
    }

    setExtracting(true);
    setExtractError(null);
    setExtractSuccess(false);

    try {
      const details = await parseJobDetailsFromUrl({ url: trimmedUrl });

      if (details.company) setCompany(details.company);
      if (details.title) setTitle(details.title);
      if (details.location) setLocation(details.location);
      if (details.salary) setSalary(details.salary);
      if (details.companyUrl) setCompanyUrl(details.companyUrl);
      if (details.description) setDescription(details.description);

      // Auto-open additional details if filled
      if (details.location || details.salary || details.companyUrl || details.description) {
        setShowOptionalFields(true);
      }

      setExtractSuccess(true);
      toast.success(
        details.company && details.title
          ? `Extracted details for ${details.title} at ${details.company}!`
          : 'Extracted job details successfully!'
      );
    } catch (err: unknown) {
      console.error('Extraction error:', err);
      const msg = 'Failed to extract job details';
      setExtractError(msg);
      toast.error(msg);
    } finally {
      setExtracting(false);
    }
  };

  // Clipboard Paste Helper for Job Description Textarea
  const handlePasteDescriptionFromClipboard = async () => {
    try {
      if (navigator?.clipboard?.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim()) {
          setDescription(text.trim());
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

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !title.trim() || submitting || extracting) return;

    setSubmitting(true);
    setSubmitPhase('saving');

    try {
      let jobDescriptionId: Id<'jobDescriptions'> | undefined = undefined;

      // 1. If description provided, create job description entry
      if (description.trim()) {
        jobDescriptionId = await createJobDescription({
          userId,
          description: description.trim(),
          requirements: [],
          responsibilities: [],
          extractedSkills: [],
          extractedKeywords: [],
        });
      }

      // 2. Create job application entry
      const applicationId = await createJobApplication({
        userId,
        company: company.trim(),
        title: title.trim(),
        stage,
        jobUrl: url.trim() || undefined,
        companyUrl: companyUrl.trim() || undefined,
        location: location.trim() || undefined,
        salary: salary.trim() || undefined,
        description: description.trim() || undefined,
        notes: notes.trim() || undefined,
        jobDescriptionId,
      });

      // 3. Tailor resume if requested and masterResumeId is present
      if (autoTailor && masterResumeId) {
        setSubmitPhase('tailoring');
        try {
          // If no JD was pasted, create a fallback JD from company and title for tailoring
          let effectiveJdId = jobDescriptionId;
          if (!effectiveJdId) {
            effectiveJdId = await createJobDescription({
              userId,
              description: `Role: ${title.trim()}\nCompany: ${company.trim()}\nLocation: ${location.trim() || 'Not specified'}`,
              requirements: [],
              responsibilities: [],
              extractedSkills: [],
              extractedKeywords: [],
            });
          }

          const tailored = await createResumeVersion({
            masterResumeId,
            jobDescriptionId: effectiveJdId,
            versionName: `${company.trim()} - ${title.trim()}`,
          });

          if (tailored?.versionId) {
            await linkResumeToJob({
              applicationId,
              resumeVersionId: tailored.versionId,
              jobDescriptionId: effectiveJdId,
            });
          }
        } catch (tailorErr) {
          console.error('Tailoring error:', tailorErr);
          toast.info('Job tracked! Resume tailoring can be generated anytime.');
        }
      }

      toast.success(
        autoTailor && masterResumeId
          ? `Tracked "${title.trim()}" at ${company.trim()} & tailored resume!`
          : `Tracked "${title.trim()}" at ${company.trim()}`
      );

      onCreated?.(applicationId);
      handleClose();
    } catch (err: unknown) {
      console.error(err);
      toast.error('Failed to create job application');
    } finally {
      setSubmitting(false);
      setSubmitPhase('idle');
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
                exit={{ opacity: 0, transition: { duration: 0.18 } }}
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

                {/* Modal Container */}
                <motion.div
                  key="track-modal-window"
                  initial={{ opacity: 0, y: 24, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{
                    opacity: 0,
                    y: 20,
                    scale: 0.98,
                    transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1] },
                  }}
                  transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative w-full max-w-lg h-[86dvh] sm:h-[620px] max-h-[90dvh] sm:max-h-[85dvh] bg-background border-t sm:border border-border/60 shadow-2xl rounded-t-3xl sm:rounded-2xl rounded-b-none sm:rounded-b-2xl flex flex-col overflow-hidden text-foreground z-10 select-auto"
                >
                  {/* Mobile Pull Handle */}
                  <div className="w-full flex sm:hidden items-center justify-center pt-2.5 pb-1 shrink-0">
                    <div className="w-10 h-1 rounded-full bg-muted-foreground/25" />
                  </div>

                  {/* Clean Header */}
                  <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-border/50 shrink-0">
                    <div>
                      <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground/75">
                        <span>Tracker</span>
                        <span className="text-border">/</span>
                        <span>New Application</span>
                      </div>
                      <h2 className="font-sans text-base sm:text-lg font-semibold tracking-tight text-foreground mt-0.5">
                        Track Application
                      </h2>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={handleClose}
                      disabled={extracting || submitting}
                      className="h-7 w-7 rounded-full p-0 text-muted-foreground/70 hover:text-foreground hover:bg-muted/60"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span className="sr-only">Close</span>
                    </Button>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
                    <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1 min-h-0">
                      
                      {/* Top Minimal Link Bar */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs font-medium text-foreground/90">
                            Job Posting URL
                          </Label>
                          <span className="text-[11px] text-muted-foreground/70 font-normal">
                            Auto-fills fields below
                          </span>
                        </div>

                        <div className="relative flex items-center gap-2">
                          <div className="relative flex-1 min-w-0">
                            <LinkDuo className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 pointer-events-none" />
                            <Input
                              type="url"
                              placeholder="https://lever.co/... or linkedin, greenhouse, ashby..."
                              value={url}
                              onChange={(e) => {
                                setUrl(e.target.value);
                                if (extractError) setExtractError(null);
                                if (extractSuccess) setExtractSuccess(false);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleExtractFromUrl();
                                }
                              }}
                              disabled={extracting || submitting}
                              className="pl-8.5 pr-3 text-xs h-9 rounded-xl border-border/60 bg-muted/20 hover:bg-muted/30 focus-visible:bg-background focus-visible:border-primary/50 transition-colors"
                            />
                          </div>

                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={handleExtractFromUrl}
                            disabled={!url.trim() || extracting || submitting}
                            className={cn(
                              'h-9 px-3.5 text-xs font-medium rounded-xl shrink-0 transition-all cursor-pointer',
                              url.trim() && !extracting
                                ? 'bg-primary/10 text-primary hover:bg-primary/15 border border-primary/20'
                                : 'text-muted-foreground'
                            )}
                          >
                            {extracting ? (
                              <>
                                <Loader2 className="size-3 animate-spin mr-1.5 text-primary" />
                                <span>Extracting...</span>
                              </>
                            ) : (
                              <>
                                <SparklesDuo className="size-3.5 mr-1.5 text-primary" />
                                <span>Extract</span>
                              </>
                            )}
                          </Button>
                        </div>

                        {/* Subtle Status Feedback */}
                        {extractError && (
                          <div className="flex items-center gap-1.5 text-[11px] text-destructive bg-destructive/10 border border-destructive/15 rounded-lg px-2.5 py-1.5 animate-in fade-in duration-150">
                            <AlertCircle className="size-3.5 shrink-0" />
                            <span className="flex-1 leading-tight">Failed to extract job details</span>
                            <span className="text-muted-foreground text-[10px]">
                              Fill below manually
                            </span>
                          </div>
                        )}

                        {extractSuccess && !extractError && (
                          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/15 rounded-lg px-2.5 py-1.5 animate-in fade-in duration-150">
                            <Check className="size-3.5 shrink-0" />
                            <span className="leading-tight">Details extracted and filled below</span>
                          </div>
                        )}
                      </div>

                      {/* Divider */}
                      <div className="relative my-1">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-border/40" />
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase font-mono tracking-wider">
                          <span className="bg-background px-2 text-muted-foreground/60">
                            Job Details
                          </span>
                        </div>
                      </div>

                      {/* Primary Role & Company Fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium text-foreground/90">
                            Company <span className="text-destructive">*</span>
                          </Label>
                          <div className="relative">
                            <Building className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 pointer-events-none" />
                            <Input
                              placeholder="e.g. Stripe, Linear"
                              value={company}
                              onChange={(e) => setCompany(e.target.value)}
                              required
                              disabled={submitting}
                              className="pl-8.5 text-xs h-9 rounded-xl border-border/60"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium text-foreground/90">
                            Job Title <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            placeholder="e.g. Senior Frontend Engineer"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            disabled={submitting}
                            className="text-xs h-9 rounded-xl border-border/60"
                          />
                        </div>
                      </div>

                      {/* Stage Selector */}
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-foreground/90">Application Stage</Label>
                        <Select
                          value={stage}
                          onValueChange={(val) => setStage(val as JobStage)}
                          disabled={submitting}
                        >
                          <SelectTrigger className="w-full text-xs h-9 px-3 rounded-xl bg-background border border-border/60 text-foreground focus-visible:ring-1 focus-visible:ring-foreground/20">
                            <div className="flex items-center gap-2">
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

                      {/* Location & Salary in a compact grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium text-foreground/80">Location (Optional)</Label>
                          <div className="relative">
                            <Location className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 pointer-events-none" />
                            <Input
                              placeholder="Remote, SF, New York"
                              value={location}
                              onChange={(e) => setLocation(e.target.value)}
                              disabled={submitting}
                              className="pl-8.5 text-xs h-9 rounded-xl border-border/60"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium text-foreground/80">Salary (Optional)</Label>
                          <div className="relative">
                            <DollarSign className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 pointer-events-none" />
                            <Input
                              placeholder="$150k - $180k"
                              value={salary}
                              onChange={(e) => setSalary(e.target.value)}
                              disabled={submitting}
                              className="pl-8.5 text-xs h-9 rounded-xl border-border/60"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Toggle for Additional Details (JD, Company Website, Notes) */}
                      <div>
                        <button
                          type="button"
                          onClick={() => setShowOptionalFields(!showOptionalFields)}
                          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer py-1 font-medium select-none"
                        >
                          <ChevronDown
                            className={cn('size-3.5 transition-transform duration-200', showOptionalFields && 'rotate-180')}
                          />
                          <span>
                            {showOptionalFields
                              ? 'Hide job description & notes'
                              : 'Add job description text & notes'}
                          </span>
                          {(description.trim() || companyUrl.trim() || notes.trim()) && !showOptionalFields && (
                            <span className="size-1.5 rounded-full bg-primary shrink-0" />
                          )}
                        </button>
                      </div>

                      {/* Collapsible Additional Details */}
                      <AnimatePresence initial={false}>
                        {showOptionalFields && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.18, ease: 'easeOut' }}
                            className="space-y-3.5 overflow-hidden pt-1"
                          >
                            {/* Job Description Textarea */}
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                <Label className="text-xs font-medium text-foreground/80">
                                  Job Description Text
                                </Label>
                                <button
                                  type="button"
                                  onClick={handlePasteDescriptionFromClipboard}
                                  disabled={submitting}
                                  className="text-[11px] text-primary hover:text-primary/80 flex items-center gap-1 font-medium cursor-pointer"
                                >
                                  <Clipboard className="size-3" />
                                  <span>Paste</span>
                                </button>
                              </div>
                              <Textarea
                                placeholder="Paste or review the requirements and role responsibilities..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                disabled={submitting}
                                className="min-h-[100px] text-xs resize-y rounded-xl leading-relaxed font-sans placeholder:text-muted-foreground/50 border-border/60"
                              />
                            </div>

                            {/* Company Website */}
                            <div className="space-y-1.5">
                              <Label className="text-xs font-medium text-foreground/80">Company Website</Label>
                              <Input
                                type="url"
                                placeholder="https://company.com"
                                value={companyUrl}
                                onChange={(e) => setCompanyUrl(e.target.value)}
                                disabled={submitting}
                                className="text-xs h-9 rounded-xl border-border/60"
                              />
                            </div>

                            {/* Notes / Recruiter Contact */}
                            <div className="space-y-1.5">
                              <Label className="text-xs font-medium text-foreground/80">Notes & Contacts</Label>
                              <Textarea
                                placeholder="Referral name, recruiter email, interview reminders..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                disabled={submitting}
                                className="min-h-[50px] text-xs resize-none rounded-xl border-border/60"
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Tailor Resume with AI Switch */}
                      <div
                        onClick={() => {
                          if (masterResumeId && !submitting) {
                            setAutoTailor(!autoTailor);
                          }
                        }}
                        className={cn(
                          'group flex items-center justify-between p-2.5 rounded-xl border transition-all duration-150 select-none',
                          !masterResumeId
                            ? 'border-border/40 bg-muted/10 opacity-60 cursor-not-allowed'
                            : autoTailor
                              ? 'border-border/70 bg-muted/20 hover:bg-muted/25 cursor-pointer'
                              : 'border-border/40 bg-transparent hover:bg-muted/10 cursor-pointer'
                        )}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          <div
                            className={cn(
                              'size-7 rounded-lg flex items-center justify-center shrink-0 border transition-colors',
                              autoTailor && masterResumeId
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                : 'bg-muted/40 text-muted-foreground border-border/40 group-hover:text-foreground'
                            )}
                          >
                            <SparklesDuo className="size-3.5" />
                          </div>

                          <div className="min-w-0">
                            <p className="text-xs font-medium text-foreground leading-tight">
                              Tailor Resume with AI
                            </p>
                            <p className="text-[11px] text-muted-foreground/75 leading-tight mt-0.5 truncate">
                              {masterResumeId
                                ? 'Creates a tailored resume version for this role'
                                : 'Requires master resume'}
                            </p>
                          </div>
                        </div>

                        <Switch
                          checked={autoTailor && !!masterResumeId}
                          onCheckedChange={(checked) => masterResumeId && setAutoTailor(checked)}
                          disabled={submitting || !masterResumeId}
                          className="shrink-0 data-[state=checked]:bg-emerald-500 scale-90"
                        />
                      </div>

                      {/* Submitting Progress Indicator */}
                      {submitting && (
                        <div className="p-3 rounded-xl border border-border/60 bg-muted/20 space-y-2 animate-in fade-in duration-150">
                          <div className="flex items-center gap-2">
                            <Loader2 className="size-3.5 animate-spin text-primary" />
                            <span className="text-xs font-medium text-foreground">
                              {submitPhase === 'saving' && 'Saving application...'}
                              {submitPhase === 'tailoring' && 'Tailoring resume version with AI...'}
                              {submitPhase === 'idle' && 'Processing...'}
                            </span>
                          </div>
                          <div className="w-full bg-muted/50 h-1 rounded-full overflow-hidden">
                            <div
                              className="bg-primary h-full transition-all duration-500"
                              style={{
                                width: submitPhase === 'saving' ? '50%' : '95%',
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Clean Footer */}
                    <div className="flex justify-end gap-2 items-center px-5 sm:px-6 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] sm:pb-3 border-t border-border/50 bg-background/90 backdrop-blur-sm shrink-0">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleClose}
                        disabled={submitting || extracting}
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        Cancel
                      </Button>
                      <ColoredButton
                        type="submit"
                        disabled={!company.trim() || !title.trim() || submitting || extracting}
                        className="text-xs font-medium px-4 h-8.5 rounded-lg"
                        color="emerald"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="size-3 animate-spin mr-1.5" />
                            <span>Processing...</span>
                          </>
                        ) : autoTailor && masterResumeId ? (
                          <>Create & Tailor</>
                        ) : (
                          <>Track Application</>
                        )}
                      </ColoredButton>
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
