"use client";

import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { toast } from "sonner";
import { X, FileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  files: Array<{ name: string; url: string; size: number }>;
  onFilesChange: (
    files: Array<{ name: string; url: string; size: number }>,
  ) => void;
  maxFiles?: number;
}

export function FileUpload({
  files,
  onFilesChange,
  maxFiles = 5,
}: FileUploadProps) {
  const handleRemove = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="space-y-4">
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-muted rounded-lg"
            >
              <div className="flex items-center gap-2">
                <FileIcon className="h-4 w-4" />
                <span className="text-sm">{file.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({formatFileSize(file.size)})
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemove(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {files.length < maxFiles && (
        //TODO : Add a button to upload files and check uploadthing
        <UploadButton<OurFileRouter, "ticketAttachment">
          endpoint="ticketAttachment"
          onClientUploadComplete={(res) => {
            if (res) {
              const newFiles = res.map((file) => ({
                name: file.name,
                url: file.url,
                size: file.size,
              }));
              onFilesChange([...files, ...newFiles]);
              toast.success("Files uploaded successfully");
            }
          }}
          onUploadError={(error: Error) => {
            toast.error(`Upload failed: ${error.message}`);
          }}
        />
      )}

      <p className="text-xs text-muted-foreground">
        Upload up to {maxFiles} files. Supported: Images (4MB), PDF (8MB), Text
        files (2MB)
      </p>
    </div>
  );
}
