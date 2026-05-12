
import DesignerPdf from './designer';
import VercelPdf from './vercel';
import ClassicPdf from './classic';
import { ResumeData } from '@/types/resume';

export const variantRegistry: { [key: string]: { name: string; component: React.ComponentType<{ data: ResumeData}> } } = {
  designer: {
    name: 'Designer',
    component: DesignerPdf,
  },
  vercel: {
    name: 'Vercel',
    component: VercelPdf,
  },
  classic: {
    name: 'Classic',
    component: ClassicPdf
  }
} as const;

export type ResumeTemplate = keyof typeof variantRegistry;
