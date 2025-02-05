import { useEffect, useState, type ChangeEvent } from "react";
import { useFormContext } from "react-hook-form";
import type { IFileUpload } from "@/interface/visaFormInterface";
import { TbTrash } from "react-icons/tb";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { RiUploadCloud2Line } from "react-icons/ri";
import { toast } from "react-hot-toast";

interface FileUploadProps {
  number: number;
  label: string;
  name: string;
  travelerId: number; 
  existingFile?: string;
}

export function FileUpload({ number, label, name, travelerId, existingFile }: FileUploadProps) {
  const { setValue, watch } = useFormContext();
  const fileData = watch(name) as IFileUpload;
  const inputId = `${name}-${travelerId}`;
  const [fileExists, setFileExists] = useState<boolean>(false);

  useEffect(() => {
    if (existingFile) {
      setFileExists(true);
    }
  }, [existingFile]);

  console.log(fileExists)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error('File size must be less than 5MB');
        e.target.value = '';
        return;
      }

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

  const handleDelete = () => {
    setValue(
      name,
      {
        file: null,
        name: "",
        uploaded: false,
        size: undefined,
      },
      { shouldValidate: true }
    );

    setFileExists(false);
  };

  // if(fileExists){
  //   <div className="space-y-1 w-full">
  //   <div className="flex items-start justify-between">
  //     <div className="space-y-1 w-full">
  //       <div className="flex gap-2 text-gray-900">
  //         <span>{number}.</span>
  //         <span>{label}</span>
  //       </div>

  //       <div className="grid grid-cols-2 gap-2">
  //         <span className="text-sm">
  //           {existingFile!.length > 30
  //             ? existingFile!.slice(0, 20) + "..."
  //             : existingFile}
  //         </span>
  //         <button
  //           type="button"
  //           onClick={handleDelete}
  //           className="text-[#FF6B00] hover:text-[#FF6B00]/80 w-full flex justify-end"
  //         >
  //           <TbTrash />
  //         </button>
  //         {/* <span className="text-xs text-gray-400">
  //           {Math.round(fileData!.size!.current / 1024)} KB of{" "}
  //           {Math.round(fileData!.size!.total / 1024)} KB
  //         </span> */}
  //         <div className="flex items-center gap-1 justify-end">
  //           <IoIosCheckmarkCircle className="text-green-500" />
  //           <span className="text-xs">Uploaded</span>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // </div>
  // }
  

  if (fileData?.uploaded) {
    return (
      <div className="space-y-1 w-full">
        <div className="flex items-start justify-between">
          <div className="space-y-1 w-full">
            <div className="flex gap-2 text-gray-900">
              <span>{number}.</span>
              <span>{label}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <span className="text-sm">
                {fileData.name.length > 30
                  ? fileData.name.slice(0, 20) + "..."
                  : fileData.name}
              </span>
              <button
                type="button"
                onClick={handleDelete}
                className="text-[#FF6B00] hover:text-[#FF6B00]/80 w-full flex justify-end"
              >
                <TbTrash />
              </button>
              <span className="text-xs text-gray-400">
                {Math.round(fileData!.size!.current / 1024)} KB of{" "}
                {Math.round(fileData!.size!.total / 1024)} KB
              </span>
              <div className="flex items-center gap-1 justify-end">
                <IoIosCheckmarkCircle className="text-green-500" />
                <span className="text-xs">Uploaded</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
   <>
    {
      fileExists ?  <div className="space-y-1 w-full">
      <div className="flex items-start justify-between">
        <div className="space-y-1 w-full">
          <div className="flex gap-2 text-gray-900">
            <span>{number}.</span>
            <span>{label}</span>
          </div>
  
          <div className="grid grid-cols-2 gap-2">
            <span className="text-sm">
              {existingFile!.length > 40
                ? existingFile!.slice(0, 40) + "..."
                : existingFile}
            </span>
            <button
              type="button"
              onClick={handleDelete}
              className="text-[#FF6B00] hover:text-[#FF6B00]/80 w-full flex justify-end"
            >
              <TbTrash />
            </button>
            <span className="text-xs text-gray-400">
              {/* {Math.round(fileData!.size!.current / 1024)} KB of{" "}
              {Math.round(fileData!.size!.total / 1024)} KB */}
            </span>
            <div className="flex items-center gap-1 justify-end">
              <IoIosCheckmarkCircle className="text-green-500" />
              <span className="text-xs">Uploaded</span>
            </div>
          </div>
        </div>
      </div>
    </div> : <div className="flex justify-between items-start">
      <div className="flex gap-2">
        <span className="text-sm text-gray-900">{number}.</span>
        <span className="text-sm text-gray-900">{label}</span>
      </div>
      <div>
        <input
          type="file"
          id={inputId}
          name={`${name}-${travelerId}`}
          className="hidden"
          onChange={handleFileChange}
          accept=".pdf,.jpg,.jpeg,.png"
        />
        <label htmlFor={inputId}>
          <span className="inline-flex gap-2 items-center px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 cursor-pointer">
            <RiUploadCloud2Line className="text-[#FF6B00]" />
            <span className="text-sm font-medium text-[#FF6B00]">Upload</span>
          </span>
        </label>
        <p className="text-xs text-gray-500 mt-1">Max size: 5MB</p>
      </div>
    </div>
    }
   </>
    
  );
}
