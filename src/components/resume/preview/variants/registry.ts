
import ClassicPdf from './classic';
import { ResumeData } from '@/types/resume';

export const variantRegistry: { [key: string]: { name: string; component: React.ComponentType<{ data: ResumeData}> } } = {
  classic: {
    name: 'Classic',
    component: ClassicPdf
  }
} as const;

export type ResumeTemplate = keyof typeof variantRegistry;
