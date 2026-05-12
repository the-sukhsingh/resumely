'use client';

import React, { useState } from 'react';
import { Achievement } from '@/types/resume';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface AchievementModalProps {
  achievement: Achievement;
  onSave: (ach: Achievement) => void;
  onClose: () => void;
}

export const AchievementModal: React.FC<AchievementModalProps> = ({ achievement, onSave, onClose }) => {
  const [formData, setFormData] = useState<Achievement>(achievement);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const updateField = (field: keyof Achievement, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-sans text-xl">
            {achievement.title ? 'Edit Achievement' : 'Add Achievement'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label className="text-xs text-primary/90 mb-1">Title</Label>
            <Input
              value={formData.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Award or recognition"
              className="h-9"
              required
            />
          </div>
          <div>
            <Label className="text-xs text-primary/90 mb-1">Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Details about this achievement..."
              rows={4}
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
