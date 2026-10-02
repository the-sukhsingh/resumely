"use client";

import { useState, useRef } from "react";
import { Upload, Loader2 } from "lucide-react";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";
import ColoredButton from "./custom/colored-button";
import { cn } from "@/lib/utils";

interface ResumeUploaderProps {
  userId: Id<"users">;
  onSuccess?: () => void;
  className?: string;
}

export default function ResumeUploader({ userId, onSuccess, className }: ResumeUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const parseResume = useAction(api.masterResumes.parseResumeText);

  const handleFile = async (selectedFile: File) => {
    if (selectedFile.type !== "application/pdf" && !selectedFile.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Please upload a PDF file (.pdf)");
      return;
    }

    setFile(selectedFile);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/parse-resume", {
        method: "POST",
        body: formData,
      });

      const { text } = await response.json();
      if (!text) {
        throw new Error("Failed to extract text from PDF");
      }
      await parseResume({ text, userId });

      toast.success("Resume uploaded and parsed successfully!");
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to parse resume. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
      setFile(null);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      onClick={() => inputRef.current?.click()}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={cn(
        "group relative flex flex-col justify-between p-5 sm:p-6 rounded-2xl transition-all duration-200 cursor-pointer outline-none text-left select-none",
        "bg-card/70 dark:bg-neutral-900/50 hover:bg-card/95 dark:hover:bg-neutral-900/80",
        "border shadow-2xs hover:shadow-md",
        dragActive
          ? "border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/25 scale-[1.01]"
          : "border-border/80 dark:border-border/50 hover:border-amber-500/50 dark:hover:border-amber-500/40",
        loading && "pointer-events-none opacity-90",
        className
      )}
    >
      <input
        ref={inputRef}
        type="file"
        id="resume-upload-input"
        className="hidden"
        accept=".pdf,application/pdf"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            handleFile(e.target.files[0]);
            e.target.value = "";
          }
        }}
      />

      {loading ? (
        <div className="size-full min-h-[200px] flex flex-col items-center justify-center text-center p-2">
          <div className="size-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-3">
            <Loader2 className="size-6 animate-spin text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="text-sm font-semibold tracking-tight text-foreground">
            Parsing Resume...
          </h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-[220px] leading-relaxed">
            Extracting experience, skills, and projects with AI
          </p>
          <div className="w-32 h-1 rounded-full bg-muted/60 overflow-hidden mt-4">
            <div className="h-full bg-amber-500 rounded-full animate-pulse" />
          </div>
        </div>
      ) : (
        <>
          {/* Top Row: Icon + Badge */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="size-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20 group-hover:scale-105 transition-transform duration-200">
                <Upload className="size-5" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                Fastest · ~30s
              </span>
            </div>

            <h3 className="text-base font-semibold tracking-tight text-foreground group-hover:text-foreground">
              Import Existing PDF
            </h3>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
              Upload your current resume. Our AI parser extracts your work history, skills, and projects automatically.
            </p>
          </div>

          {/* Bottom Row: CTA Button + Hint */}
          <div className="mt-6 pt-2">
            <ColoredButton
              type="button"
              color="amber"
              size="default"
              className="w-full rounded-xl font-medium active:scale-[0.98] shadow-xs justify-center"
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.click();
              }}
            >
              <Upload className="size-3.5 mr-1.5" />
              <span>{file ? file.name : "Select PDF File"}</span>
            </ColoredButton>
            <p className="text-[10px] text-muted-foreground text-center mt-2">
              Drag & drop or click · PDF up to 10MB
            </p>
          </div>
        </>
      )}
    </div>
  );
}
