import { variantRegistry } from "@/components/resume/preview/variants/registry";
import { ResumeData, ResumeTemplate } from "@/types/resume";
import { pdf } from "@react-pdf/renderer";

interface CreatePdfBlobProps {
  resumeData: ResumeData;
  type?: "pdf" | "image";
}

export const createPdfBlob = async ({ resumeData, type }: CreatePdfBlobProps) => {
  const Template = getPdfTemplate("classic");
  const pdfDocument = <Template data={resumeData} />;
  const blob = await pdf(pdfDocument).toBlob();

  return blob;
};

const getPdfTemplate = (template: "classic" | "vercel" | "designer") => {
  // if there is no template or the template isn't registered, fallback to default (designer)
  const variant = variantRegistry[template as string as keyof typeof variantRegistry];
  return variant ? variant.component : variantRegistry.designer.component;
};
