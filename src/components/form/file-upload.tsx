import type { ChangeEvent } from "react"
import { useFormContext } from "react-hook-form"
import type { IFileUpload } from "@/interface/visaFormInterface"

interface FileUploadProps {
  number: number
  label: string
  name: string
}

export function FileUpload({ number, label, name }: FileUploadProps) {
  const { setValue, watch } = useFormContext()
  const fileData = watch(name) as IFileUpload

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
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
        { shouldValidate: true },
      )
    }
  }

  const handleDelete = () => {
    setValue(
      name,
      {
        file: null,
        name: "",
        uploaded: false,
        size: undefined,
      },
      { shouldValidate: true },
    )
  }

  if (fileData?.uploaded) {
    return (
      <div className="space-y-1">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex gap-2 text-gray-900">
              <span>{number}.</span>
              <span>{label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">{fileData.name}</span>
              <button type="button" onClick={handleDelete} className="text-[#FF6B00] hover:text-[#FF6B00]/80">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">
                {Math.round(fileData.size?.current / 1024)} KB of {Math.round(fileData.size?.total / 1024)} KB
              </span>
              <div className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-xs">Uploaded</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-between items-start">
      <div className="flex gap-2">
        <span className="text-sm text-gray-900">{number}.</span>
        <span className="text-sm text-gray-900">{label}</span>
      </div>
      <div>
        <input type="file" id={name} className="hidden" onChange={handleFileChange} />
        <label htmlFor={name}>
          <span className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2 text-[#FF6B00]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            <span className="text-sm font-medium text-[#FF6B00]">Upload</span>
          </span>
        </label>
      </div>
    </div>
  )
}

