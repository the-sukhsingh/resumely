'use client';

import React, { useState, useEffect, useRef, useLayoutEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useQuery, useMutation, useAction } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';
import QuietStudio from './variants/QuietStudio';
import TargetHub from './variants/TargetHub';
import EditorialBento from './variants/EditorialBento';
import { MOCK_RESUMES, PrototypeResumeItem } from './data';
import { formatDistanceToNow } from 'date-fns';
import './picker.css';

const VARIANTS = [
  { name: 'Quiet Studio', component: QuietStudio },
  { name: 'Target Hub', component: TargetHub },
  { name: 'Editorial Bento', component: EditorialBento },
];

export default function PrototypesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  // Convex live queries
  const liveVersions = useQuery(
    api.resumeVersions.getResumeVersionsByUser,
    user ? { userId: user._id } : 'skip'
  );
  const masterResume = useQuery(
    api.masterResumes.getMasterResumeByUser,
    user ? { userId: user._id } : 'skip'
  );

  // Convex mutations
  const deleteVersion = useMutation(api.resumeVersions.deleteResumeVersion);
  const duplicateVersionAction = useAction(api.resumeVersions.duplicateVersion);

  // Transform live Convex resumes into prototype shape if available, or fall back to MOCK_RESUMES
  const resumeItems: PrototypeResumeItem[] = useMemo(() => {
    if (liveVersions && liveVersions.length > 0) {
      const master = liveVersions.find((v) => v.isMasterResume);
      const tailored = liveVersions.filter((v) => !v.isMasterResume);

      const mappedMaster: PrototypeResumeItem[] = master
        ? [
            {
              id: master._id,
              name: master.name || 'Master Resume',
              isMasterResume: true,
              targetRole: 'Primary Profile & Baseline',
              lastUpdated: formatDistanceToNow(new Date(master.updatedAt || master._creationTime), { addSuffix: true }),
              metrics: {
                experiences: master.experience?.length || 0,
                skills: master.skills?.reduce((acc, s) => acc + (s.items?.length || 0), 0) || 0,
                projects: master.projects?.length || 0,
              },
            },
          ]
        : [];

      const mappedTailored: PrototypeResumeItem[] = tailored.map((v) => ({
        id: v._id,
        name: v.name || 'Untitled Version',
        isMasterResume: false,
        targetRole: v.name || 'Target Application',
        matchScore: v.matchScore ?? 92,
        keywords: v.skills?.slice(0, 4).map((s) => s.category) || ['Full-Stack', 'Frontend', 'TypeScript'],
        lastUpdated: formatDistanceToNow(new Date(v.updatedAt || v._creationTime), { addSuffix: true }),
        metrics: {
          experiences: v.experience?.length || 0,
          skills: v.skills?.reduce((acc, s) => acc + (s.items?.length || 0), 0) || 0,
          projects: v.projects?.length || 0,
        },
      }));

      return [...mappedMaster, ...mappedTailored];
    }
    return MOCK_RESUMES;
  }, [liveVersions]);

  // Read initial variant from query param (1-indexed ?v=1)
  const initialV = parseInt(searchParams.get('v') || '1', 10);
  const initialIdx = isNaN(initialV) || initialV < 1 || initialV > VARIANTS.length ? 0 : initialV - 1;

  const [current, setCurrent] = useState(initialIdx);
  const [replayKey, setReplayKey] = useState(0);
  const [ready, setReady] = useState(false);

  const itemsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const highlightRef = useRef<HTMLSpanElement | null>(null);

  const updateHighlight = (idx: number) => {
    const el = itemsRef.current[idx];
    const hl = highlightRef.current;
    if (el && hl) {
      hl.style.width = `${el.offsetWidth}px`;
      hl.style.transform = `translateX(${el.offsetLeft}px)`;
    }
  };

  const setActive = (idx: number) => {
    if (idx < 0 || idx >= VARIANTS.length) return;
    setCurrent(idx);
    updateHighlight(idx);
    const url = new URL(window.location.href);
    url.searchParams.set('v', (idx + 1).toString());
    window.history.replaceState(null, '', url.toString());
  };

  const handleReplay = () => {
    setReplayKey((k) => k + 1);
  };

  const handleDelete = async (id: string) => {
    if (user && liveVersions?.some((v) => v._id === id)) {
      await deleteVersion({ versionId: id as Id<'resumeVersions'> });
    }
  };

  const handleDuplicate = async (item: PrototypeResumeItem) => {
    if (user && liveVersions?.some((v) => v._id === item.id)) {
      await duplicateVersionAction({
        versionId: item.id as Id<'resumeVersions'>,
        newName: `${item.name} (Copy)`,
      });
    }
  };

  // Keyboard navigation contract
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/^(INPUT|TEXTAREA|SELECT)$/i.test((e.target as HTMLElement)?.tagName) || (e.target as HTMLElement)?.isContentEditable) {
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= VARIANTS.length) {
        setActive(num - 1);
      } else if (e.key === 'ArrowRight') {
        setActive((current + 1) % VARIANTS.length);
      } else if (e.key === 'ArrowLeft') {
        setActive((current - 1 + VARIANTS.length) % VARIANTS.length);
      } else if (e.key === 'r' || e.key === 'R') {
        handleReplay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [current]);

  useLayoutEffect(() => {
    updateHighlight(current);
    const timer = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setReady(true);
      });
    });
    return () => cancelAnimationFrame(timer);
  }, []);

  useEffect(() => {
    const handleResize = () => updateHighlight(current);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [current]);

  const CurrentVariant = VARIANTS[current].component;

  return (
    <div className="relative min-h-screen">
      {/* Active Prototype Render Stage */}
      <main key={`${current}-${replayKey}`} className="w-full">
        <CurrentVariant
          resumes={resumeItems}
          userName={user?.name?.split(' ')[0] ?? 'Sukhjit'}
          userId={user?._id}
          masterResumeId={masterResume?._id}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
        />
      </main>

      {/* Floating Picker Harness (Verbatim PICKER.md spec) */}
      <nav
        className="proto-picker"
        aria-label="Prototype variants"
        data-ready={ready ? '' : undefined}
      >
        <span ref={highlightRef} className="proto-picker-highlight" aria-hidden="true" />
        {VARIANTS.map((v, i) => (
          <button
            key={v.name}
            ref={(el) => {
              itemsRef.current[i] = el;
            }}
            type="button"
            className="proto-picker-item"
            data-active={current === i ? '' : undefined}
            aria-current={current === i ? 'true' : undefined}
            onClick={() => setActive(i)}
          >
            {v.name}
          </button>
        ))}
        <span className="proto-picker-divider" aria-hidden="true" />
        <button
          type="button"
          className="proto-picker-item proto-picker-replay"
          aria-label="Replay animation (R)"
          onClick={handleReplay}
          title="Replay animation (R)"
        >
          ↻
        </button>
      </nav>
    </div>
  );
}
