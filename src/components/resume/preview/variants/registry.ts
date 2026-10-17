
import ClassicPdf from './classic';
import LatexPdf from './latex';
import TwoColumnPdf from './two-column';
import { ResumeData } from '@/types/resume';

export const variantRegistry = {
  classic: {
    name: 'Classic',
    component: ClassicPdf
  },
  latex: {
    name: 'LaTeX',
    component: LatexPdf
  },
  'two-column': {
    name: 'Two Column',
    component: TwoColumnPdf
  }
} as const;

export type ResumeTemplate = keyof typeof variantRegistry;

