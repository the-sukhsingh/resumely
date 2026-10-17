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

const getPdfTemplate = (template?: ResumeTemplate | string) => {
  if (template && template in variantRegistry) {
    return variantRegistry[template as keyof typeof variantRegistry].component;
  }
  return variantRegistry.classic.component;
};

