import { useFormContext } from "react-hook-form";
import type { IVisaForm } from "@/interface/visaFormInterface";

interface VisaTypeSelectorProps {
  onVisaTypeChange: (value: string) => void;
}

export function VisaTypeSelector({ onVisaTypeChange }: VisaTypeSelectorProps) {
  const { watch } = useFormContext<IVisaForm>();
  const currentVisaType =  watch("visaType");

  return (
    <select
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 [&>option:hover]:bg-[#0066FF] [&>option:checked]:bg-[#0066FF]"
      onChange={(e) => onVisaTypeChange(e.target.value)}
      value={currentVisaType}
    >
      <option value="">Select document type</option>
      <option value="jobHolder">Job Holder&apos;s Documents</option>
      <option value="business">Businessperson&apos;s Documents</option>
      <option value="student">Student&apos;s Documents</option>
      {/* <option value="other">Other Documents</option> */}
    </select>
  );
} 