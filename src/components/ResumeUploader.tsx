"use client";

import { useState, useRef } from "react";
import { UploadFile, FolderUpload } from "@duo-icons/react";
import { Loader2 } from "lucide-react";
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
        "group relative flex flex-col items-center justify-center py-10 sm:py-14 px-6 sm:px-12 rounded-2xl border-2 border-dashed transition-all duration-150 cursor-pointer outline-none text-center select-none",
        "bg-background/40 hover:bg-muted/20 border-border/80 hover:border-foreground/30",
        dragActive && "border-foreground/60 bg-muted/40 ring-4 ring-foreground/5 scale-[1.005]",
        loading && "pointer-events-none opacity-85",
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
        <div className="flex flex-col items-center justify-center py-4">
          <div className="size-12 rounded-full border border-border/80 bg-background flex items-center justify-center mb-3 shadow-xs">
            <Loader2 className="size-5 animate-spin text-foreground" />
          </div>
          <p className="text-sm font-semibold tracking-tight text-foreground">
            Parsing Resume Document...
          </p>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs leading-relaxed">
            Extracting experience, credentials, and achievements into your master profile.
          </p>
          <div className="w-36 h-1 rounded-full bg-muted overflow-hidden mt-4">
            <div className="h-full bg-foreground/60 rounded-full animate-pulse" />
          </div>
        </div>
      ) : (
        <>
          <div className="size-14 rounded-2xl border border-border/80 bg-background/90 flex items-center justify-center text-foreground group-hover:scale-105 group-hover:border-foreground/30 transition-all duration-150 shadow-xs mb-4">
            <UploadFile size={32} />
          </div>

          <div className="space-y-1">
            <p className="text-sm sm:text-base font-medium text-foreground tracking-tight">
              {file ? file.name : "Drop your PDF resume here, or browse"}
            </p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
              We&apos;ll automatically parse your work history, skills, and projects into an editable Master Profile.
            </p>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <ColoredButton
              type="button"
              color="neutral"
              size="default"
              className="rounded-xl px-5 text-xs font-medium justify-center active:scale-[0.97] shadow-xs"
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.click();
              }}
            >
              <span className="inline-flex items-center mr-2">
                <FolderUpload size={16} />
              </span>
              <span>Select PDF File</span>
            </ColoredButton>
          </div>
        </>
      )}
    </div>
  );
}
