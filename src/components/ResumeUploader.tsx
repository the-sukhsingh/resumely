"use client";

import { useState } from "react";
import { Upload, FileText, Loader2 } from "lucide-react";
import { useAction, useMutation } from "convex/react";
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
        className={`relative border-2 h-full border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive ? "border-primary bg-primary/5" : "border-gray-300"
        } ${loading ? "opacity-50 pointer-events-none" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {loading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="size-6 animate-spin text-primary" />
            <p className="text-lg font-medium">Parsing your resume...</p>
            <p className="text-sm text-muted-foreground">This may take a moment</p>
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
            <label htmlFor="resume-upload" className="cursor-pointer">
              <div className="flex flex-col items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  {file ? (
                    <FileText className="size-6 text-primary" />
                  ) : (
                    <Upload className="size-6 text-primary" />
                  )}
                </div>
                <div>
                  <p className="text-lg font-medium">
                    {file ? file.name : "Upload your resume"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Drag and drop or click to browse
                  </p>
                </div>
              </div>
            </label>
          </>
        )}
      </div>
    
  );
}
