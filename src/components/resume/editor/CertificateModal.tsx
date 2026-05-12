'use client';

import React, { useState } from 'react';
import { Certificate } from '@/types/resume';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface CertificateModalProps {
  certificate: Certificate;
  onSave: (cert: Certificate) => void;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ certificate, onSave, onClose }) => {
  const [formData, setFormData] = useState<Certificate>(certificate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const updateField = (field: keyof Certificate, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-sans text-xl">
            {certificate.name ? 'Edit Certification' : 'Add Certification'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
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
          <div className="grid grid-cols-2 gap-4">
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
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="h-9">
              Cancel
            </Button>
            <Button type="submit" className="h-9">
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
