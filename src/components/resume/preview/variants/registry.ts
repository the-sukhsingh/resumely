
import ClassicPdf from './classic';
import { ResumeData } from '@/types/resume';
import TwoColumn from './two-column';

export const variantRegistry: { [key: string]: { name: string; component: React.ComponentType<{ data: ResumeData}> } } = {
  classic: {
    name: 'Classic',
    component: ClassicPdf
  },
  twoColumn: {
    name: 'TwoColumn',
    component: TwoColumn
  }
} as const;

export type ResumeTemplate = keyof typeof variantRegistry;
