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

const getPdfTemplate = (template: ResumeTemplate | string) => {
  const normalized = String(template)
    .trim()
    .replace(/[-_\s]+/g, "")
    .toLowerCase();

  if (normalized === "twocolumn" || normalized === "twocolumns") {
    return variantRegistry.twoColumn.component;
  }

  if (normalized === "onecolumn" || normalized === "single" || normalized === "classic") {
    return variantRegistry.classic.component;
  }

  const variantKey = Object.keys(variantRegistry).find(
    (key) => key.replace(/[-_\s]+/g, "").toLowerCase() === normalized,
  ) as keyof typeof variantRegistry | undefined;

  const variant = variantKey ? variantRegistry[variantKey] : undefined;

  return variant?.component ?? variantRegistry.classic.component;
};
