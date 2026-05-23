"use client";

import { useState } from "react";
import { Upload, FileText, Loader2 } from "lucide-react";
import { useAction} from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";

interface ResumeUploaderProps {
  userId: Id<"users">;
  onSuccess?: () => void;
}

export default function ResumeUploader({ userId, onSuccess }: ResumeUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  const parseResume = useAction(api.masterResumes.parseResumeText);

  const handleFile = async (selectedFile: File) => {
    if (selectedFile.type !== "application/pdf" && !selectedFile.name.endsWith(".pdf")) {
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
      className={`group relative flex flex-col justify-center items-center px-4 py-4 h-full rounded-xl cursor-pointer bg-[#f0f0f0]/60 dark:bg-[#202020ce]/60 hover:bg-[#f7f7f7]/80 dark:hover:bg-[#202020]/80 border border-dashed border-border/80 dark:border-border/40 hover:border-primary/50 dark:hover:border-primary/40 transition-all shadow-sm ${
        dragActive ? "border-primary/60 bg-primary/5" : ""
      } ${loading ? "opacity-50 pointer-events-none" : ""}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      {loading ? (
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="size-6 animate-spin text-primary" />
          <p className="text-base font-medium text-foreground/90">Parsing resume...</p>
          <p className="text-xs text-muted-foreground mt-0.5">This may take a moment</p>
        </div>
      ) : (
        <>
          <input
            type="file"
            id="resume-upload"
            className="hidden"
            accept=".pdf,application/pdf"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <label htmlFor="resume-upload" className="cursor-pointer size-full flex flex-col justify-center items-center">
            <div className="flex flex-col items-center gap-2">
              <Upload className="size-6 text-muted-foreground group-hover:text-foreground transition-colors" />
              <div>
                <p className="text-base font-medium text-foreground/90 group-hover:text-foreground transition-colors">
                  {file ? file.name : "Upload Resume"}
                </p>
                <p className="text-xs text-muted-foreground mt-1 transition-colors">
                  Drag & drop or click to browse
                </p>
              </div>
            </div>
          </label>
        </>
      )}
    </div>
  );
}
