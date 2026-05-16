'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EditorForm } from '@/components/resume/editor/EditorForm';
import type { ResumeData } from '@/types/resume';

export default function EditorPanel({ data }: { data: ResumeData }) {
  const [collapsed, setCollapsed] = useState(false);
  const [draft, setDraft] = useState<ResumeData>(data);


  if (collapsed) {
    return (
      <div className="flex flex-col items-center pt-3 w-8 shrink-0">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setCollapsed(false)}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden shrink-0">
      <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
        <span className="text-sm font-semibold">Editor</span>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setCollapsed(true)}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 min-h-0">
        <EditorForm data={draft} onChange={setDraft} />
      </div>
    </div>
  );
}
