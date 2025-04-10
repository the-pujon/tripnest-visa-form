import { useFormContext } from "react-hook-form";
import type { IVisaForm } from "@/interface/visaFormInterface";

interface VisaTypeSelectorProps {
	onVisaTypeChange: (value: string) => void;
}

export function VisaTypeSelector({ onVisaTypeChange }: VisaTypeSelectorProps) {
	const { watch } = useFormContext<IVisaForm>();
	const currentVisaType =  watch("visaType");
	// const currentVisaType = watch("visaType") || "jobHolder";

	return (
		<select
			className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm appearance-none 
             bg-gradient-to-r from-orange-200 via-white to-white
             text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
			onChange={(e) => onVisaTypeChange(e.target.value)}
			value={currentVisaType}
		>
			<option value="">Select your occupation from dropdown</option>
			<option value="jobHolder">Job Holder&apos;s Documents</option>
			<option value="business">Businessperson&apos;s Documents</option>
			<option value="student">Student&apos;s Documents</option>
		</select>
	);
}
