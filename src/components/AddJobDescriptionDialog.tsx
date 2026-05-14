'use client';

import { useState } from 'react';
import { useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Props {
  buttonLabel?: string;
  userId: Id<'users'>;
  masterResumeId: Id<'resumeVersions'>;
  onCreated?: (versionId: Id<'resumeVersions'>) => void;
}

export default function AddJobDescriptionDialog({
  buttonLabel = 'Add Job Description',
  userId,
  masterResumeId,
  onCreated,
}: Props) {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const createJDAndVersion = useAction(api.jobDescriptions.createJDAndVersion);

  const handleSave = async () => {
    const trimmed = description.trim();
    if (!trimmed) return;
    setLoading(true);
    try {
      const { versionId } = await createJDAndVersion({ userId, masterResumeId, jdText: trimmed });
      onCreated?.(versionId);
      setDescription('');
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          setDescription('');
        }
      }}
    >
      <DialogTrigger asChild >
        <Button variant="neo" className=''  >
          <svg viewBox="0 0 24 24" fill="none" className='size-5'><g id="SVGRepo_bgCarrier" strokeWidth="0" /><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" /><g id="SVGRepo_iconCarrier"> <path opacity="0.1" d="M3 12C3 4.5885 4.5885 3 12 3C19.4115 3 21 4.5885 21 12C21 19.4115 19.4115 21 12 21C4.5885 21 3 19.4115 3 12Z" className='fill-[#323232] dark:fill-[#b8b8b8]' /> <path d="M9 12H15" className='stroke-[#323232] dark:stroke-[#b8b8b8]' strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> <path d="M12 9L12 15" className='stroke-[#323232] dark:stroke-[#b8b8b8]' strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> <path d="M3 12C3 4.5885 4.5885 3 12 3C19.4115 3 21 4.5885 21 12C21 19.4115 19.4115 21 12 21C4.5885 21 3 19.4115 3 12Z" className='stroke-[#323232] dark:stroke-[#b8b8b8]' strokeWidth="2" /> </g></svg>
          {buttonLabel}
        </Button>
      </DialogTrigger>
      <DialogContent >
        <DialogHeader className='gap-0'>
          <DialogTitle className='text-xl'>Add job description</DialogTitle>
          <DialogDescription>
            Paste the job description below. You can edit it later.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          placeholder="Paste the job description text..."
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={40}
          className='min-h-50 max-h-100'
        />
        {description.trim() && (
          <div className="p-4">
            {description.length} characters, {description.split(/\s+/).length} words
          </div>
        )}
        <DialogFooter className='space-x-2 py-1.5'>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!description.trim() || loading}>
            {loading ? 'Creating...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
