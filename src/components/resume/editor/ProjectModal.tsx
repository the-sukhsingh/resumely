'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Project } from '@/types/resume';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { TagInput } from './TagInput';
import { BulletsInput } from './BulletsInput';
import { motion, AnimatePresence } from 'motion/react';
import { WaveBackgroundPreview } from '@/components/custom/bg-shader-modal';
import { X } from 'lucide-react';

interface ProjectModalProps {
  project: Project;
  onSave: (proj: Project) => void;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onSave, onClose }) => {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const isBackdropClickRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [formData, setFormData] = useState<Project>(project);
  const [bullets, setBullets] = useState<string[]>(() => {
    const raw = (project.bullets || []).filter(Boolean) as string[];
    return raw.length > 0 ? raw : [''];
  });

  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedBullets = bullets
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    onSave({ ...formData, bullets: cleanedBullets });
  };

  const updateField = (field: keyof Project, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence onExitComplete={onClose}>
      {isOpen && (
        <motion.div
          key="version-history-backdrop"
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
            key="version-history-shader"
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

          {/* Minimalist, Sleek Modal Window */}
          <motion.div
            key="version-history-modal"
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
              <h2 className="font-sans text-xl font-semibold">
                {project.name ? 'Edit Project' : 'Add Project'}
              </h2>
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
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                <div className="flex gap-3 *:w-1/2">
                  <div>
                    <Label className="text-xs text-primary/90 mb-1">Project Name</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      placeholder="My Awesome Project"
                      className="h-9"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-primary/90 mb-1">Link (optional)</Label>
                    <Input
                      value={formData.link ?? ''}
                      onChange={(e) => updateField('link', e.target.value)}
                      placeholder="https://github.com/..."
                      className="h-9"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-primary/90 mb-1">Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    placeholder="Describe what this project does..."
                    rows={4}
                    className="resize-none"
                  />
                </div>

                <div>
                  <Label className="text-xs text-primary/90 mb-2">Technologies</Label>
                  <TagInput
                    tags={(formData.technologies || []).filter(Boolean) as string[]}
                    onChange={(techs) => updateField('technologies', techs)}
                    placeholder="Type a technology and press Enter..."
                  />
                </div>

                <BulletsInput
                  bullets={bullets}
                  onChange={setBullets}
                  label="Bullets"
                  placeholder="Describe an accomplishment or responsibility..."
                />
              </div>

              {/* Footer */}
              <div className="flex justify-end items-center gap-2 px-6 py-3 border-t border-border/60 bg-background/80 backdrop-blur-sm shrink-0">
                <Button type="button" variant="ghost" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit">
                  Save
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
