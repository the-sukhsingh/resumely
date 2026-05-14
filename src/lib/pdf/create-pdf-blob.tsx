import { variantRegistry } from "@/components/resume/preview/variants/registry";
import { ResumeData, ResumeTemplate } from "@/types/resume";
import { pdf } from "@react-pdf/renderer";

interface CreatePdfBlobProps {
  resumeData: ResumeData;
  type?: "pdf" | "image";
  theme?: ResumeTemplate;
}

export const createPdfBlob = async ({ resumeData, type, theme }: CreatePdfBlobProps) => {
  console.log("Creating PDF blob with theme:", theme);
  const Template = getPdfTemplate((theme ?? "classic") as "classic" | "twoColumn");
  console.log("Using PDF template:", Template.name);
  const pdfDocument = <Template data={resumeData} />;
  const blob = await pdf(pdfDocument).toBlob();

  return blob;
};

const getPdfTemplate = (template: "classic" | "twoColumn") => {
  const normalizedTemplate = String(template)
    .trim()
    .replace(/[-_\s]+/g, "")
    .toLowerCase();

  const variantKey = Object.keys(variantRegistry).find(
    (key) => key.replace(/[-_\s]+/g, "").toLowerCase() === normalizedTemplate,
  ) as keyof typeof variantRegistry | undefined;

  const variant = variantKey ? variantRegistry[variantKey] : undefined;

  return variant?.component ?? variantRegistry.classic.component;
};
