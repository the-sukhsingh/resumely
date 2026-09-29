'use client';

import React, { useRef, useEffect } from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface BulletsInputProps {
  bullets: string[];
  onChange: (bullets: string[]) => void;
  label?: string;
  placeholder?: string;
}

export const BulletsInput: React.FC<BulletsInputProps> = ({
  bullets,
  onChange,
  label = 'Bullets',
  placeholder = 'Accomplishment or responsibility...',
}) => {
  const textareaRefs = useRef<(HTMLTextAreaElement | null)[]>([]);

  // Automatically adjust heights of all active textareas to fit content
  useEffect(() => {
    textareaRefs.current.forEach((el) => {
      if (el) {
        el.style.height = 'auto';
        el.style.height = `${Math.max(28, el.scrollHeight)}px`;
      }
    });
  }, [bullets]);

  const updateBullet = (index: number, val: string) => {
    const next = [...bullets];
    next[index] = val;
    onChange(next);
  };

  const addBullet = () => {
    const next = [...bullets, ''];
    onChange(next);
    setTimeout(() => {
      const idx = next.length - 1;
      textareaRefs.current[idx]?.focus();
    }, 0);
  };

  const removeBullet = (index: number) => {
    if (bullets.length <= 1) {
      onChange(['']);
      setTimeout(() => {
        textareaRefs.current[0]?.focus();
      }, 0);
      return;
    }
    const next = bullets.filter((_, i) => i !== index);
    onChange(next);
    setTimeout(() => {
      const targetIdx = Math.max(0, index - 1);
      const targetEl = textareaRefs.current[targetIdx];
      if (targetEl) {
        targetEl.focus();
        const len = targetEl.value.length;
        targetEl.setSelectionRange(len, len);
      }
    }, 0);
  };

  const moveBullet = (index: number, direction: -1 | 1) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= bullets.length) return;
    const next = [...bullets];
    const [moved] = next.splice(index, 1);
    next.splice(targetIdx, 0, moved);
    onChange(next);
    setTimeout(() => {
      textareaRefs.current[targetIdx]?.focus();
    }, 0);
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    const current = bullets[index] || '';

    // Enter without Shift creates a new bullet directly below
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const selectionStart = target.selectionStart ?? current.length;
      const left = current.slice(0, selectionStart);
      const right = current.slice(selectionStart);

      const next = [...bullets];
      next[index] = left;
      next.splice(index + 1, 0, right);
      onChange(next);

      setTimeout(() => {
        const nextEl = textareaRefs.current[index + 1];
        if (nextEl) {
          nextEl.focus();
          nextEl.setSelectionRange(0, 0);
        }
      }, 0);
    }
    // Backspace at the start of a line
    else if (e.key === 'Backspace') {
      const isAtStart = target.selectionStart === 0 && target.selectionEnd === 0;

      // If at position 0 and there's a previous bullet, merge with previous
      if (isAtStart && index > 0) {
        e.preventDefault();
        const prev = bullets[index - 1] || '';
        const prevLen = prev.length;

        const next = [...bullets];
        next[index - 1] = prev + current;
        next.splice(index, 1);
        onChange(next);

        setTimeout(() => {
          const prevEl = textareaRefs.current[index - 1];
          if (prevEl) {
            prevEl.focus();
            prevEl.setSelectionRange(prevLen, prevLen);
          }
        }, 0);
      }
      // If bullet is empty and we have multiple bullets, delete this one
      else if (!current && bullets.length > 1) {
        e.preventDefault();
        removeBullet(index);
      }
    }
    // ArrowUp from start of text
    else if (e.key === 'ArrowUp') {
      if (target.selectionStart === 0 && index > 0) {
        e.preventDefault();
        const prevEl = textareaRefs.current[index - 1];
        if (prevEl) {
          prevEl.focus();
          const len = prevEl.value.length;
          prevEl.setSelectionRange(len, len);
        }
      }
    }
    // ArrowDown from end of text
    else if (e.key === 'ArrowDown') {
      if (target.selectionStart === current.length && index < bullets.length - 1) {
        e.preventDefault();
        const nextEl = textareaRefs.current[index + 1];
        if (nextEl) {
          nextEl.focus();
          nextEl.setSelectionRange(0, 0);
        }
      }
    }
  };

  // Smart paste: split multi-line pasted text into separate bullets and clean bullet prefixes
  const handlePaste = (index: number, e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pasteText = e.clipboardData.getData('text');
    if (pasteText.includes('\n')) {
      e.preventDefault();
      const target = e.currentTarget;
      const selectionStart = target.selectionStart ?? (bullets[index] || '').length;
      const current = bullets[index] || '';
      const before = current.slice(0, selectionStart);
      const after = current.slice(selectionStart);

      const rawLines = pasteText.split('\n');
      const cleanedLines = rawLines
        .map((line) => line.replace(/^[\s•\-\*\u2022\u2023\u25E6\u2043\u2219\d+\.]\s*/, '').trim())
        .filter((line) => line.length > 0);

      if (cleanedLines.length === 0) return;

      if (cleanedLines.length === 1) {
        updateBullet(index, before + cleanedLines[0] + after);
        return;
      }

      const firstLine = before + cleanedLines[0];
      const middleLines = cleanedLines.slice(1, -1);
      const lastLine = cleanedLines[cleanedLines.length - 1] + after;

      const newBullets = [firstLine, ...middleLines, lastLine];
      const next = [...bullets];
      next.splice(index, 1, ...newBullets);
      onChange(next);

      setTimeout(() => {
        const lastIdx = index + newBullets.length - 1;
        textareaRefs.current[lastIdx]?.focus();
      }, 0);
    }
  };

  const activeCount = bullets.filter((b) => b.trim().length > 0).length;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label className="text-xs text-primary/90 mb-0">{label}</Label>
          {activeCount > 0 && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
              {activeCount} {activeCount === 1 ? 'bullet' : 'bullets'}
            </span>
          )}
        </div>
        <span className="text-[11px] text-muted-foreground/75">
          Press <kbd className="px-1 py-0.5 text-[10px] font-mono bg-muted border border-border/70 rounded">Enter</kbd> for new bullet
        </span>
      </div>

      <div className="border border-input rounded-lg bg-card/40 divide-y divide-border/40 overflow-hidden focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20 transition-all">
        {bullets.map((bullet, index) => (
          <div
            key={index}
            className="flex items-start gap-2.5 px-3 py-2 group hover:bg-muted/20 focus-within:bg-muted/30 transition-colors"
          >
            {/* Real bullet point icon */}
            <div className="pt-2 select-none shrink-0 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 group-focus-within:bg-primary transition-colors" />
            </div>

            {/* Seamless bullet content textarea */}
            <textarea
              ref={(el) => {
                textareaRefs.current[index] = el;
              }}
              value={bullet}
              onChange={(e) => updateBullet(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={(e) => handlePaste(index, e)}
              placeholder={placeholder}
              rows={1}
              className="flex-1 bg-transparent border-0 p-0 text-sm leading-relaxed outline-none resize-none focus:ring-0 placeholder:text-muted-foreground/50 min-h-[24px] field-sizing-content"
            />

            {/* Hover/Focus action buttons */}
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity shrink-0 pt-0.5">
              {bullets.length > 1 && index > 0 && (
                <button
                  type="button"
                  onClick={() => moveBullet(index, -1)}
                  className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
                  title="Move up"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
              )}
              {bullets.length > 1 && index < bullets.length - 1 && (
                <button
                  type="button"
                  onClick={() => moveBullet(index, 1)}
                  className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
                  title="Move down"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => removeBullet(index)}
                className="p-1 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive transition-colors"
                title="Delete bullet"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addBullet}
        className="w-full h-8 text-xs gap-1.5 border-dashed text-muted-foreground hover:text-primary mt-1"
      >
        <Plus className="w-3.5 h-3.5" /> Add Bullet Point
      </Button>
    </div>
  );
};
