'use client';

import React, { useState } from 'react';
import { Experience } from '@/types/resume';
import { Dialog, DialogContent,  DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface ExperienceModalProps {
  experience: Experience;
  onSave: (exp: Experience) => void;
  onClose: () => void;
}

export const ExperienceModal: React.FC<ExperienceModalProps> = ({ experience, onSave, onClose }) => {
  const [formData, setFormData] = useState<Experience>(experience);
  const [bulletsText, setBulletsText] = useState(
    (experience.bullets || []).filter(Boolean).join('\n')
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bullets = bulletsText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    onSave({ ...formData, bullets });
  };

  const updateField = (field: keyof Experience, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-sans text-xl">
            {experience.position ? 'Edit Experience' : 'Add Experience'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-primary/90 mb-1">Position</Label>
              <Input
                value={formData.position}
                onChange={(e) => updateField('position', e.target.value)}
                placeholder="Software Engineer"
                className="h-9"
                required
              />
            </div>
            <div>
              <Label className="text-xs text-primary/90 mb-1">Company</Label>
              <Input
                value={formData.company}
                onChange={(e) => updateField('company', e.target.value)}
                placeholder="Tech Corp"
                className="h-9"
                required
              />
            </div>
          </div>
          <div>
            <Label className="text-xs text-primary/90 mb-1">Location</Label>
            <Input
              value={formData.location ?? ''}
              onChange={(e) => updateField('location', e.target.value)}
              placeholder="New York, NY"
              className="h-9"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-primary/90 mb-1">Start Date</Label>
              <Input
                value={formData.startDate}
                onChange={(e) => updateField('startDate', e.target.value)}
                placeholder="Jan 2020"
                className="h-9"
              />
            </div>
            <div>
              <Label className="text-xs text-primary/90 mb-1">End Date</Label>
              <Input
                value={formData.endDate ?? ''}
                onChange={(e) => updateField('endDate', e.target.value)}
                placeholder="Dec 2022"
                disabled={formData.current}
                className="h-9"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="current"
              checked={formData.current}
              onChange={(e) => updateField('current', e.target.checked)}
              className="w-4 h-4 rounded border-stone-300"
            />
            <Label htmlFor="current" className="text-sm text-neutral-700">
              Currently working here
            </Label>
          </div>
          <div>
            <Label className="text-xs text-primary/90 mb-1">Bullets</Label>
            <Textarea
              value={bulletsText}
              onChange={(e) => setBulletsText(e.target.value)}
              placeholder="One bullet per line..."
              rows={6}
              className="resize-none"
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
