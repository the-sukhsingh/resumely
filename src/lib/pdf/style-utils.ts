import { ResumeSettings } from "@/types/resume";
import { normalizeFontFamily } from "@/constants/pdf-fonts";

export interface ComputedResumeStyles {
  activeFont: string;
  baseFontSize: number;
  lineHeight: number;
  sectionSpacing: number;
  paragraphSpacing: number;
  activeMargin: number;
  paperSize: "A4" | "LETTER";
  accentColor: string;
  showUnderline: boolean;
  headingTextTransform: "uppercase" | "capitalize" | "none";
  // Scaled font sizes in pt
  fontSizeName: number;
  fontSizeTitle: number;
  fontSizeSubheading: number;
  fontSizeBody: number;
  fontSizeSmall: number;
  fontSizeMeta: number;
}

export function computeResumeStyles(settings?: ResumeSettings): ComputedResumeStyles {
  const activeFont = normalizeFontFamily(settings?.font);
  
  const baseFontSize = settings?.fontSize && settings.fontSize >= 6 && settings.fontSize <= 16
    ? settings.fontSize
    : 9.5;
  
  const lineHeight = settings?.lineHeight && settings.lineHeight >= 0.8 && settings.lineHeight <= 2.5
    ? settings.lineHeight
    : 1.35;
  
  // Section spacing multiplier (e.g. 1.0, 1.25, 1.5, 2.0) -> points
  const sectionSpacing = settings?.sectionSpacing
    ? Math.round(settings.sectionSpacing * 8)
    : 12;
  
  const paragraphSpacing = settings?.paragraphSpacing !== undefined
    ? settings.paragraphSpacing
    : 2;
  
  const marginMap = { compact: 16, normal: 26, relaxed: 38 };
  const activeMargin = typeof settings?.pageMargin === "number"
    ? settings.pageMargin
    : settings?.pageMargin && settings.pageMargin in marginMap
      ? marginMap[settings.pageMargin as keyof typeof marginMap]
      : 26;
  
  const rawPaperSize = (settings?.paperSize || "LETTER").toUpperCase();
  const paperSize: "A4" | "LETTER" = rawPaperSize === "A4" ? "A4" : "LETTER";
  
  const accentColor = settings?.accentColor || settings?.primaryColor || "#0f172a";
  const showUnderline = settings?.showUnderline !== false;
  
  const headingTextTransform: "uppercase" | "capitalize" | "none" =
    settings?.headingStyle === "standard"
      ? "none"
      : settings?.headingStyle === "capitalize"
        ? "capitalize"
        : "uppercase";

  return {
    activeFont,
    baseFontSize,
    lineHeight,
    sectionSpacing,
    paragraphSpacing,
    activeMargin,
    paperSize,
    accentColor,
    showUnderline,
    headingTextTransform,
    fontSizeName: Math.round(baseFontSize * 2.1 * 10) / 10,
    fontSizeTitle: Math.round(baseFontSize * 1.2 * 10) / 10,
    fontSizeSubheading: Math.round(baseFontSize * 1.05 * 10) / 10,
    fontSizeBody: baseFontSize,
    fontSizeSmall: Math.round(baseFontSize * 0.9 * 10) / 10,
    fontSizeMeta: Math.round(baseFontSize * 0.82 * 10) / 10,
  };
}
