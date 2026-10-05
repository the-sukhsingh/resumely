'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import { Button } from '@/components/ui/button';
import ColoredButton from '@/components/custom/colored-button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'motion/react';
import { WaveBackgroundPreview } from '@/components/custom/bg-shader-modal';
import AnimatedSwitcher from '@/components/custom/animated-switcher';
import {
  Check,
  X,
  Loader2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import {
  SlidersDuo,
  SparklesDuo,
  TrashDuo,
  Plus,
} from '@/components/icons';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Props {
  userId: Id<'users'>;
  trigger?: React.ReactNode;
}

interface RuleCategory {
  category: string;
  tag: string;
  rules: string[];
}

const RULE_PRESETS: RuleCategory[] = [
  {
    category: 'Format & Impact',
    tag: 'Impact',
    rules: [
      "Format bullet points with Google's XYZ formula: Accomplished [X], measured by [Y], by doing [Z]",
      'Keep each bullet point strictly between 1 to 2 lines for scanability',
      'Include quantitative metrics (%, $, numbers) in at least 70% of bullets',
      'Start each bullet with a distinct, punchy past-tense action verb',
    ],
  },
  {
    category: 'Tone & Style',
    tag: 'Tone',
    rules: [
      'Never use first-person pronouns (I, me, my, our)',
      'Use strong, assertive action verbs (Orchestrated, Engineered, Spearheaded)',
      'Never use em dashes (—) or vague buzzwords like "hardworking" or "team player"',
      'Use British/UK English spelling (e.g., analyse, optimise, colour)',
    ],
  },
  {
    category: 'Role Targeting',
    tag: 'Targeting',
    rules: [
      'Highlight cross-functional leadership, mentoring, and technical vision',
      'Emphasize cloud architecture, distributed systems, and scalability (AWS, K8s)',
      'Focus on technical depth, latency reduction, and 99.99% system uptime',
      'Emphasize end-to-end product ownership from user research to production',
    ],
  },
];

const STARTER_PACK = [
  "Format bullet points with Google's XYZ formula: Accomplished [X], measured by [Y], by doing [Z]",
  'Include quantitative metrics (%, $, numbers) in at least 70% of bullets',
  'Never use first-person pronouns (I, me, my, our)',
];

export default function AgentRulesDialog({ userId, trigger }: Props) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'presets'>('active');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [newRuleInput, setNewRuleInput] = useState('');
  const [localRules, setLocalRules] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isBackdropClickRef = useRef(false);

  const existingRules = useQuery(api.users.getUserAgentRules, { userId });
  const updateAgentRules = useMutation(api.users.updateAgentRules);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (existingRules) {
      setLocalRules(existingRules);
    }
  }, [existingRules]);

  // Lock body scroll when open
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  // Handle Escape key
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, existingRules]);

  const handleClose = () => {
    if (saving) return;
    // Reset to last saved rules state on close
    if (existingRules) {
      setLocalRules(existingRules);
    }
    setNewRuleInput('');
    setOpen(false);
  };

  const handleAddRule = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    if (localRules.includes(trimmed)) {
      toast.info('This rule is already in your active list.');
      return;
    }
    if (localRules.length >= 20) {
      toast.error('Maximum limit of 20 custom agent rules reached.');
      return;
    }
    setLocalRules((prev) => [...prev, trimmed]);
    setNewRuleInput('');
  };

  const handleToggleRule = (text: string) => {
    if (localRules.includes(text)) {
      setLocalRules((prev) => prev.filter((r) => r !== text));
    } else {
      if (localRules.length >= 20) {
        toast.error('Maximum limit of 20 custom agent rules reached.');
        return;
      }
      setLocalRules((prev) => [...prev, text]);
    }
  };

  const handleRemoveRule = (index: number) => {
    setLocalRules((prev) => prev.filter((_, i) => i !== index));
  };

  const handleLoadStarterPack = () => {
    const newItems = STARTER_PACK.filter((r) => !localRules.includes(r));
    if (newItems.length === 0) {
      toast.info('Starter rules are already active in your list.');
      return;
    }
    setLocalRules((prev) => [...prev, ...newItems]);
    toast.success(`Added ${newItems.length} recommended starter rules.`);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateAgentRules({
        userId,
        rules: localRules,
      });
      toast.success('Agent rules saved! The AI will follow them across all tailored versions.');
      setOpen(false);
    } catch (err: unknown) {
      console.error(err);
      toast.error('Failed to save rules. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const activeCount = existingRules?.length ?? 0;

  // Filter presets by category
  const categories = ['All', ...RULE_PRESETS.map((p) => p.category)];
  const filteredPresets = selectedCategory === 'All'
    ? RULE_PRESETS
    : RULE_PRESETS.filter((p) => p.category === selectedCategory);

  return (
    <>
      {/* Trigger Button */}
      {trigger ? (
        React.isValidElement(trigger) ? (
          React.cloneElement(trigger as React.ReactElement<any>, {
            onClick: () => setOpen(true),
          })
        ) : (
          <div onClick={() => setOpen(true)}>{trigger}</div>
        )
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            'inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer border select-none',
            'bg-card/90 hover:bg-muted/70 text-foreground border-border/70 hover:border-foreground/20 shadow-2xs hover:shadow-xs active:scale-[0.98]'
          )}
        >
          <SlidersDuo className="size-3.5 text-primary" />
          <span>AI Agent Rules</span>
          {activeCount > 0 ? (
            <span className="inline-flex items-center justify-center px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
              {activeCount} active
            </span>
          ) : (
            <span className="text-[10px] text-muted-foreground font-mono">Configure</span>
          )}
        </button>
      )}

      {/* Modal Dialog rendered via Portal */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                key="agent-rules-backdrop"
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
                className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 select-none backdrop-blur-xs"
              >
                {/* Wave Shader Backdrop */}
                <motion.div
                  key="agent-rules-shader"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.2, ease: 'easeOut' } }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="absolute inset-0 pointer-events-none overflow-hidden"
                >
                  <WaveBackgroundPreview className="w-full h-full mask-t-from-80%" />
                </motion.div>

                {/* Modal Container / Mobile Bottom Drawer */}
                <motion.div
                  key="agent-rules-window"
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
                  className="relative w-full max-w-xl max-h-[90dvh] sm:max-h-[86dvh] bg-background border-t sm:border border-border/70 shadow-2xl rounded-t-3xl sm:rounded-2xl rounded-b-none sm:rounded-b-2xl flex flex-col overflow-hidden text-foreground z-10 select-auto"
                >
                  {/* Mobile Pull Handle */}
                  <div className="w-full flex sm:hidden items-center justify-center pt-2.5 pb-1 shrink-0">
                    <div className="w-12 h-1.5 rounded-full bg-muted-foreground/30" />
                  </div>

                  {/* Header */}
                  <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-border/60 shrink-0">
                    <div>
                      <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                        <span>Resume</span>
                        <span className="text-border">/</span>
                        <span>AI Directives</span>
                      </div>
                      <h2 className="font-sans text-lg sm:text-xl font-semibold tracking-tight mt-0.5">
                        Resume Agent Rules
                      </h2>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={handleClose}
                      disabled={saving}
                      className="h-8 w-8 rounded-full p-0 text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-4 h-4" />
                      <span className="sr-only">Close</span>
                    </Button>
                  </div>

                  {/* Subheader Switcher */}
                  <div className="px-4 sm:px-6 pt-3 pb-2 border-b border-border/40 shrink-0 bg-muted/10">
                    <AnimatedSwitcher
                      value={activeTab}
                      onChange={setActiveTab}
                      fullWidth
                      className="max-w-xs"
                      items={[
                        {
                          value: 'active',
                          label: (
                            <span className="flex items-center gap-1.5">
                              <span>Active Rules</span>
                              <span
                                className={cn(
                                  'px-1.5 py-0.2 rounded-full text-[10px] font-mono leading-tight',
                                  localRules.length > 0
                                    ? 'bg-primary/15 text-primary font-semibold'
                                    : 'bg-muted text-muted-foreground'
                                )}
                              >
                                {localRules.length}
                              </span>
                            </span>
                          ),
                          icon: SlidersDuo,
                        },
                        {
                          value: 'presets',
                          label: 'Presets Library',
                          icon: SparklesDuo,
                        },
                      ]}
                    />
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
                    {activeTab === 'active' ? (
                      /* Tab 1: Active Rules Management */
                      <div className="space-y-4">
                        {/* Custom Rule Input Bar */}
                        <div className="relative flex items-center">
                          <Plus className="size-4 absolute left-3 text-muted-foreground pointer-events-none" />
                          <Input
                            value={newRuleInput}
                            onChange={(e) => setNewRuleInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddRule(newRuleInput);
                              }
                            }}
                            placeholder="Add rule (e.g. Always quantify metrics with %)..."
                            disabled={localRules.length >= 20 || saving}
                            className="pl-9 pr-16 h-10 text-xs rounded-xl bg-muted/30 border-border/70 focus-visible:ring-1 focus-visible:bg-background transition-all"
                          />
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => handleAddRule(newRuleInput)}
                            disabled={!newRuleInput.trim() || localRules.length >= 20 || saving}
                            className="absolute right-1.5 h-7 px-3 text-[11px] rounded-lg cursor-pointer"
                          >
                            Add
                          </Button>
                        </div>

                        {/* Rules List or Empty State */}
                        {localRules.length === 0 ? (
                          <div className="flex flex-col items-center justify-center p-8 rounded-2xl border border-dashed border-border/70 bg-muted/10 text-center space-y-3.5 my-2">
                            <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                              <ShieldCheck className="size-5" />
                            </div>
                            <div className="space-y-1 max-w-sm">
                              <h3 className="text-sm font-semibold text-foreground">
                                No custom rules active
                              </h3>
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                Custom directives ensure the AI tailors bullet points, tone, and keywords according to your exact preferences.
                              </p>
                            </div>
                            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setActiveTab('presets')}
                                className="text-xs h-8 rounded-xl gap-1.5 cursor-pointer"
                              >
                                <SparklesDuo className="size-3.5 text-primary" />
                                <span>Browse Presets</span>
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={handleLoadStarterPack}
                                className="text-xs h-8 rounded-xl text-muted-foreground hover:text-foreground cursor-pointer"
                              >
                                <span>Load Recommended Pack</span>
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between px-0.5 text-[11px] text-muted-foreground font-mono">
                              <span>
                                {localRules.length} {localRules.length === 1 ? 'rule' : 'rules'} active
                              </span>
                              <button
                                type="button"
                                onClick={() => setLocalRules([])}
                                className="text-[11px] text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                              >
                                Clear all
                              </button>
                            </div>

                            {localRules.map((rule, idx) => (
                              <div
                                key={idx}
                                className="group relative flex items-start gap-3 p-3 rounded-xl bg-card/60 hover:bg-muted/40 border border-border/60 hover:border-border transition-all duration-150"
                              >
                                <span className="font-mono text-[10px] font-semibold text-muted-foreground/80 mt-0.5 size-5 rounded-md bg-muted/60 flex items-center justify-center shrink-0">
                                  {String(idx + 1).padStart(2, '0')}
                                </span>
                                <p className="flex-1 text-xs text-foreground leading-relaxed pr-2">
                                  {rule}
                                </p>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveRule(idx)}
                                  className="text-muted-foreground hover:text-destructive p-1 rounded-md hover:bg-destructive/10 transition-colors shrink-0 cursor-pointer"
                                  title="Remove rule"
                                >
                                  <TrashDuo className="size-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Tab 2: Curated Presets Library */
                      <div className="space-y-4">
                        {/* Category Filter Pills */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                          {categories.map((cat) => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setSelectedCategory(cat)}
                              className={cn(
                                'px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer border select-none',
                                selectedCategory === cat
                                  ? 'bg-foreground text-background border-foreground font-semibold'
                                  : 'bg-muted/30 hover:bg-muted/60 text-muted-foreground border-border/50 hover:text-foreground'
                              )}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>

                        {/* Presets List */}
                        <div className="space-y-4">
                          {filteredPresets.map((categoryGroup, groupIdx) => (
                            <div key={groupIdx} className="space-y-2">
                              {selectedCategory === 'All' && (
                                <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-muted-foreground px-0.5">
                                  <span>{categoryGroup.category}</span>
                                </div>
                              )}
                              <div className="space-y-1.5">
                                {categoryGroup.rules.map((preset, pIdx) => {
                                  const isAdded = localRules.includes(preset);
                                  return (
                                    <div
                                      key={pIdx}
                                      onClick={() => handleToggleRule(preset)}
                                      className={cn(
                                        'group p-3 rounded-xl border text-xs transition-all duration-150 flex items-center justify-between gap-3 cursor-pointer select-none',
                                        isAdded
                                          ? 'border-emerald-500/30 bg-emerald-500/5 text-foreground hover:border-emerald-500/40'
                                          : 'border-border/60 bg-card/40 hover:bg-muted/30 text-foreground hover:border-border'
                                      )}
                                    >
                                      <div className="flex items-start gap-2.5 min-w-0 pr-2">
                                        <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded-md bg-muted/60 text-muted-foreground shrink-0 mt-0.5">
                                          {categoryGroup.tag}
                                        </span>
                                        <p className="leading-snug">{preset}</p>
                                      </div>

                                      <div className="shrink-0">
                                        {isAdded ? (
                                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                                            <Check className="size-3" />
                                            <span>Active</span>
                                          </span>
                                        ) : (
                                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium text-muted-foreground group-hover:text-foreground group-hover:bg-muted/60 transition-all">
                                            <Plus className="size-3" />
                                            <span>Add</span>
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between items-center px-4 sm:px-6 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] sm:pb-3 border-t border-border/60 bg-background/80 backdrop-blur-sm shrink-0">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span
                        className={cn(
                          'size-2 rounded-full transition-colors',
                          localRules.length > 0 ? 'bg-emerald-500' : 'bg-muted-foreground/40'
                        )}
                      />
                      <span className="font-mono text-[11px]">
                        {localRules.length} of 20 rules active
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handleClose}
                        disabled={saving}
                        className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        Cancel
                      </Button>
                      <ColoredButton
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        color="emerald"
                        className="text-xs font-medium px-4 cursor-pointer"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="size-3.5 animate-spin mr-1.5" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Check className="size-3.5 mr-1.5" />
                            Save Rules
                          </>
                        )}
                      </ColoredButton>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
