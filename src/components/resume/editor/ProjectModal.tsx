'use client';

import React, { useState } from 'react';
import { Project } from '@/types/resume';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { TagInput } from './TagInput';

interface ProjectModalProps {
  project: Project;
  onSave: (proj: Project) => void;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onSave, onClose }) => {
  const [formData, setFormData] = useState<Project>(project);
  const [bulletsText, setBulletsText] = useState(
    (project.bullets || []).filter(Boolean).join('\n')
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bullets = bulletsText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    onSave({ ...formData, bullets });
  };

  const updateField = (field: keyof Project, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] min-w-xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-sans text-xl">
            {project.name ? 'Edit Project' : 'Add Project'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
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
          <div>
            <Label className="text-xs text-primary/90 mb-1">Link (optional)</Label>
            <Input
              value={formData.link ?? ''}
              onChange={(e) => updateField('link', e.target.value)}
              placeholder="https://github.com/..."
              className="h-9"
            />
          </div>
          <div>
            <Label className="text-xs text-primary/90 mb-1">Bullets</Label>
            <Textarea
              value={bulletsText}
              onChange={(e) => setBulletsText(e.target.value)}
              placeholder="One bullet per line..."
              rows={5}
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
