'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Plus, Trash2, Check, Lightbulb, Bot, SlidersHorizontal, Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Props {
  userId: Id<'users'>;
  trigger?: React.ReactNode;
}

const RULE_SUGGESTIONS = [
  {
    category: 'Format & Impact',
    rules: [
      "Format bullet points with Google's XYZ formula: Accomplished [X], measured by [Y], by doing [Z]",
      'Keep each bullet point strictly between 1 to 2 lines for scanability',
      'Include quantitative metrics (%, $, numbers) in at least 70% of bullets',
    ],
  },
  {
    category: 'Tone & Style',
    rules: [
      'Never use first-person pronouns (I, me, my, our)',
      'Use strong, assertive action verbs (Orchestrated, Engineered, Spearheaded)',
      'Never use em dashes (—) or vague buzzwords like "hardworking" or "team player"',
      'Use British/UK English spelling (e.g., analyse, optimise, colour)',
    ],
  },
  {
    category: 'Role Targeting',
    rules: [
      'Highlight cross-functional leadership, mentoring, and technical vision',
      'Emphasize cloud architecture, distributed systems, and scalability (AWS, K8s)',
      'Focus on technical depth, latency reduction, and 99.99% system uptime',
      'Emphasize end-to-end product ownership from user research to production',
    ],
  },
];

export default function AgentRulesDialog({ userId, trigger }: Props) {
  const [open, setOpen] = useState(false);
  const [newRuleInput, setNewRuleInput] = useState('');
  const [localRules, setLocalRules] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const existingRules = useQuery(api.users.getUserAgentRules, { userId });
  const updateAgentRules = useMutation(api.users.updateAgentRules);

  useEffect(() => {
    if (existingRules) {
      setLocalRules(existingRules);
    }
  }, [existingRules]);

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

  const handleRemoveRule = (index: number) => {
    setLocalRules((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateAgentRules({
        userId,
        rules: localRules,
      });
      toast.success('Agent rules saved! The AI will apply them to all your resumes.');
      setOpen(false);
    } catch (err: unknown) {
      console.error(err);
      toast.error('Failed to save rules. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const activeCount = existingRules?.length ?? 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <button
            type="button"
            className={cn(
              'inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer border select-none',
              'bg-card/90 hover:bg-muted/70 text-foreground border-border/70 hover:border-foreground/20 shadow-2xs hover:shadow-xs active:scale-[0.98]'
            )}
          >
            <SlidersHorizontal className="size-3.5 text-primary" />
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
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden rounded-2xl border-border bg-card">
        {/* Header with gradient badge */}
        <div className="p-6 pb-4 border-b border-border/50 bg-linear-to-b from-muted/30 to-transparent">
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="size-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Bot className="size-4" />
            </div>
            <div>
              <DialogTitle className="text-base sm:text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
                <span>Resume Agent Rules</span>
                <Badge variant="outline" className="text-[10px] font-normal py-0 h-4 border-primary/30 text-primary">
                  Per-User Global
                </Badge>
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Rules defined here are injected into every chat session and obeyed across all your tailored resume versions.
              </DialogDescription>
            </div>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Current Active Rules List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold tracking-wide uppercase text-muted-foreground flex items-center gap-1.5">
                <span>Active Rules</span>
                <span className="text-[11px] font-mono text-foreground font-bold">({localRules.length}/20)</span>
              </h4>
              {localRules.length > 0 && (
                <button
                  type="button"
                  onClick={() => setLocalRules([])}
                  className="text-[11px] text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                >
                  Clear all
                </button>
              )}
            </div>

            {localRules.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border/70 p-5 text-center bg-muted/10 space-y-1.5">
                <p className="text-xs font-medium text-foreground">No active rules yet</p>
                <p className="text-[11px] text-muted-foreground max-w-sm mx-auto">
                  Add custom instructions below or click any of the curated suggestions to customize how the AI writes your resume.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {localRules.map((rule, index) => (
                  <div
                    key={index}
                    className="group flex items-start justify-between gap-3 p-3 rounded-xl bg-muted/20 border border-border/60 hover:border-foreground/20 transition-all text-xs text-foreground"
                  >
                    <div className="flex items-start gap-2.5 flex-1 min-w-0">
                      <span className="size-4.5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-mono font-semibold shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="leading-relaxed break-words">{rule}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveRule(index)}
                      className="text-muted-foreground hover:text-destructive p-1 rounded-md hover:bg-destructive/10 transition-colors shrink-0 cursor-pointer"
                      title="Remove rule"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Custom Rule Input */}
          <div className="space-y-2 pt-2 border-t border-border/50">
            <h4 className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
              Add Custom Rule
            </h4>
            <div className="flex gap-2">
              <Input
                value={newRuleInput}
                onChange={(e) => setNewRuleInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddRule(newRuleInput);
                  }
                }}
                placeholder="e.g., Prioritize AWS architecture and quantify all production achievements..."
                className="text-xs h-9 bg-background/50 border-border/80"
              />
              <Button
                type="button"
                size="sm"
                onClick={() => handleAddRule(newRuleInput)}
                disabled={!newRuleInput.trim()}
                className="shrink-0 gap-1.5 cursor-pointer h-9 px-3.5"
              >
                <Plus className="size-3.5" />
                <span>Add</span>
              </Button>
            </div>
          </div>

          {/* Curated Suggestions Section */}
          <div className="space-y-3.5 pt-2 border-t border-border/50">
            <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase text-muted-foreground">
              <Lightbulb className="size-3.5 text-amber-500" />
              <span>Recommended Rule Suggestions</span>
            </div>

            <div className="space-y-4">
              {RULE_SUGGESTIONS.map((categoryGroup, groupIdx) => (
                <div key={groupIdx} className="space-y-2">
                  <span className="text-[11px] font-medium text-muted-foreground/80 block">
                    {categoryGroup.category}
                  </span>
                  <div className="flex flex-col gap-1.5">
                    {categoryGroup.rules.map((sug, sugIdx) => {
                      const isAdded = localRules.includes(sug);
                      return (
                        <button
                          key={sugIdx}
                          type="button"
                          disabled={isAdded}
                          onClick={() => handleAddRule(sug)}
                          className={cn(
                            'text-left text-xs p-2.5 rounded-lg border transition-all duration-150 flex items-center justify-between gap-3 cursor-pointer select-none',
                            isAdded
                              ? 'bg-muted/30 text-muted-foreground border-border/40 opacity-70 cursor-default'
                              : 'bg-card hover:bg-muted/40 text-foreground border-border/70 hover:border-primary/40 hover:shadow-2xs active:scale-[0.99]'
                          )}
                        >
                          <span className="leading-snug">{sug}</span>
                          {isAdded ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 shrink-0">
                              <Check className="size-3" />
                              <span>Added</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-primary shrink-0 opacity-80 group-hover:opacity-100">
                              <Plus className="size-3" />
                              <span>Add Rule</span>
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <DialogFooter className="p-4 px-6 border-t border-border/50 bg-muted/10 flex flex-row items-center justify-between sm:justify-between gap-3">
          <p className="text-[11px] text-muted-foreground font-mono">
            {localRules.length} rules will be injected into chat
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
              className="text-xs h-9 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              disabled={saving}
              className="text-xs h-9 gap-1.5 px-4 cursor-pointer"
            >
              {saving ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="size-3.5" />
                  <span>Save Rules</span>
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
