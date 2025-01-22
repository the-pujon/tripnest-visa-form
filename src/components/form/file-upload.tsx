"use client";

// import { useState } from "react"
import { useFormContext } from "react-hook-form";
import type { IFileUpload } from "@/interface/visaFormInterface";
// import UploadIcon from "@/images/icons/upload.png"
// import Image from "next/image";
import { AiFillCheckCircle, AiOutlineCloudUpload } from "react-icons/ai";
import { LuTrash2 } from "react-icons/lu";


interface FileUpload {
  file: File | null;
  name: string;
  uploaded: boolean;
  uploadTime?: string;
  size?: {
    current: number;
    total: number;
  };
}

interface FileUploadProps {
  number: number;
  label: string;
  name: string;
}

export function FileUpload({ number, label, name }: FileUploadProps) {
  const { setValue, watch } = useFormContext();
  const fileData = watch(name) as IFileUpload;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue(
        name,
        {
          file,
          name: file.name,
          uploaded: true,
          uploadTime: new Date().toLocaleString(),
          size: {
            current: file.size,
            total: file.size,
          },
        },
        { shouldValidate: true }
      );
    }
  };

  return (
    <div className="space-y-2">
      
      <div className="flex justify-between items-start gap-10">
        <div className="flex gap-2" >
          <span className="text-sm font-semibold">{number}.</span>
          <span className="text-sm font-semibold">{label}</span>
        </div>
        {!fileData?.uploaded && (
          <div>
            <input
              type="file"
              id={name}
              className="hidden"
              onChange={handleFileChange}
            />
            <label htmlFor={name}>
              <button
                // size="lg"
                // variant="outline"
                className="w-32 gap-2 py-6 border-muted-foreground rounded-md"
                type="button"
                // asChild
              >
                <span>
                  <AiOutlineCloudUpload className="w-4 h-4 text-orange-500 font-semibold" />
                  <span className="text-orange-500 font-semibold">Upload</span>
                </span>
              </button>
            </label>
          </div>
        )}
      </div>
      {fileData?.uploaded && (
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-2 text-sm">
            <span>{fileData.name.length > 20 ? fileData.name.slice(0, 20) + "..." : fileData.name}</span>
            <button className="text-orange-500">
              <LuTrash2 className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="text-muted-foreground/70">
              {Math.round(fileData.size?.current / 1024)} KB of{" "}
              {Math.round(fileData.size?.total / 1024)} KB
            </span>
            <span className="flex items-center gap-1 text-black/70">
              {/* <CheckCircle className="h-3 w-3" /> */}
              <AiFillCheckCircle className="h-3 w-3 text-green-500" />
              Uploaded
            </span>
          </div>
        </div>
      ) }
    </div>
  );
}
