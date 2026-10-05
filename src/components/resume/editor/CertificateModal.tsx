'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Certificate } from '@/types/resume';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'motion/react';
import { WaveBackgroundPreview } from '@/components/custom/bg-shader-modal';
import { X } from 'lucide-react';

interface CertificateModalProps {
  certificate: Certificate;
  onSave: (cert: Certificate) => void;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ certificate, onSave, onClose }) => {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const isBackdropClickRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [formData, setFormData] = useState<Certificate>(certificate);

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
    onSave(formData);
  };

  const updateField = (field: keyof Certificate, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence onExitComplete={onClose}>
      {isOpen && (
        <motion.div
          key="certificate-modal-backdrop"
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
          {/* Wave Shader Backdrop with synchronized exit */}
          <motion.div
            key="certificate-modal-shader"
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

          {/* Minimalist, Sleek Modal Window / Mobile Bottom Drawer */}
          <motion.div
            key="certificate-modal-window"
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
            className="relative w-full max-w-2xl h-[90dvh] sm:h-auto sm:max-h-[86dvh] bg-background border-t sm:border border-border/70 shadow-2xl rounded-t-3xl sm:rounded-2xl rounded-b-none sm:rounded-b-2xl flex flex-col overflow-hidden text-foreground z-10 select-auto"
          >
            {/* Mobile Pull Handle */}
            <div className="w-full flex sm:hidden items-center justify-center pt-2.5 pb-1 shrink-0">
              <div className="w-12 h-1.5 rounded-full bg-muted-foreground/30" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-border/60 shrink-0">
              <h2 className="font-sans text-lg sm:text-xl font-semibold">
                {certificate.name ? 'Edit Certification' : 'Add Certification'}
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
              <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
                <div>
                  <Label className="text-xs text-primary/90 mb-1">Certificate Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="AWS Certified Developer"
                    className="h-9"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-primary/90 mb-1">Issuer</Label>
                    <Input
                      value={formData.issuer}
                      onChange={(e) => updateField('issuer', e.target.value)}
                      placeholder="Amazon Web Services"
                      className="h-9"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-primary/90 mb-1">Date</Label>
                    <Input
                      value={formData.date ?? ''}
                      onChange={(e) => updateField('date', e.target.value)}
                      placeholder="Jan 2023"
                      className="h-9"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-primary/90 mb-1">Link (optional)</Label>
                  <Input
                    value={formData.link ?? ''}
                    onChange={(e) => updateField('link', e.target.value)}
                    placeholder="https://..."
                    className="h-9"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end items-center gap-2 px-4 sm:px-6 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] sm:pb-3 border-t border-border/60 bg-background/80 backdrop-blur-sm shrink-0">
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
