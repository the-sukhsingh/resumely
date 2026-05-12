'use client';

import React, { useState } from 'react';
import { Education } from '@/types/resume';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface EducationModalProps {
    education: Education;
    onSave: (education: Education) => void;
    onClose: () => void;
}

export const EducationModal: React.FC<EducationModalProps> = ({ education, onSave, onClose }) => {
    const [formData, setFormData] = useState<Education>(education);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{education.institution ? 'Edit Education' : 'Add Education'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 *:space-y-1.5">
                        <div className="col-span-2">
                            <Label htmlFor="institution" className="text-xs text-primary/90 mb-1">Institution</Label>
                            <Input
                                id="institution"
                                value={formData.institution}
                                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                                placeholder="University Name"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="degree" className="text-xs text-primary/90 mb-1">Degree</Label>
                            <Input
                                id="degree"
                                value={formData.degree}
                                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                                placeholder="Bachelor's, Master's, etc."
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="field" className="text-xs text-primary/90 mb-1">Field of Study</Label>
                            <Input
                                id="field"
                                value={formData.field ?? ''}
                                onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                                placeholder="Computer Science"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="startDate" className="text-xs text-primary/90 mb-1">Start Year</Label>
                            <Input
                                id="startDate"
                                value={formData.startDate ?? ''}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                placeholder="2020"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="endDate" className="text-xs text-primary/90 mb-1">End Year</Label>
                            <Input
                                id="endDate"
                                value={formData.endDate ?? ''}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                placeholder="2024"
                            />
                        </div>
                        <div>
                            <Label htmlFor="location" className="text-xs text-primary/90 mb-1">Location (Optional)</Label>
                            <Input
                                id="location"
                                value={formData.location ?? ''}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                placeholder="City, Country"
                            />
                        </div>
                        <div>
                            <Label htmlFor="gpa" className="text-xs text-primary/90 mb-1">GPA (Optional)</Label>
                            <Input
                                id="gpa"
                                value={formData.gpa ?? ''}
                                onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                                placeholder="9.5"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit">Save</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
