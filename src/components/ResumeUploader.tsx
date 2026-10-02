"use client";

import { useState, useRef } from "react";
import { Upload, Loader2 } from "lucide-react";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";
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
        "group relative flex flex-col justify-between p-4 sm:p-5 rounded-xl border cursor-pointer outline-none text-left select-none transition-[border-color,background-color,transform] duration-150 ease-out",
        "bg-muted/20 hover:bg-muted/40",
        dragActive
          ? "border-foreground/40 bg-muted/50 ring-1 ring-foreground/20 scale-[0.99]"
          : "border-border/60 hover:border-foreground/20 active:scale-[0.98]",
        loading && "pointer-events-none opacity-80",
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
        <div className="flex flex-col items-center justify-center text-center py-5">
          <Loader2 className="size-5 animate-spin text-muted-foreground mb-2" />
          <p className="text-xs font-medium text-foreground">Parsing resume...</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Extracting your background</p>
        </div>
      ) : (
        <>
          <div className="size-8 rounded-lg border border-border/70 bg-background flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors duration-150">
            <Upload className="size-4" strokeWidth={1.75} />
          </div>

          <div className="mt-4">
            <p className="text-xs font-medium text-foreground group-hover:text-foreground tracking-tight">
              {file ? file.name : "Upload Resume"}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5 leading-normal">
              Drag & drop or browse PDF
            </p>
          </div>
        </>
      )}
    </div>
  );
}
