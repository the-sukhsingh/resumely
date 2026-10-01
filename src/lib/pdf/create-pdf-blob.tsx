import { variantRegistry } from "@/components/resume/preview/variants/registry";
import { ResumeData, ResumeTemplate } from "@/types/resume";
import { pdf } from "@react-pdf/renderer";

interface CreatePdfBlobProps {
  resumeData: ResumeData;
  type?: "pdf" | "image";
  theme?: ResumeTemplate | string;
}

export const createPdfBlob = async ({ resumeData, type, theme }: CreatePdfBlobProps) => {
  const chosenTheme = theme || resumeData.settings?.layout || "classic";
  const Template = getPdfTemplate(chosenTheme);
  const pdfDocument = <Template data={resumeData} />;
  const blob = await pdf(pdfDocument).toBlob();

  return blob;
};

const getPdfTemplate = (_template?: ResumeTemplate | string) => {
  return variantRegistry.classic.component;
};
