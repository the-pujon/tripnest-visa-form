import { useFormContext } from "react-hook-form";
import type { IVisaForm } from "@/interface/visaFormInterface";

interface VisaTypeSelectorProps {
	onVisaTypeChange: (value: string) => void;
}

// export function VisaTypeSelector({ onVisaTypeChange }: VisaTypeSelectorProps) {
// 	const { watch } = useFormContext<IVisaForm>();
// 	const currentVisaType =  watch("visaType");
// 	// const currentVisaType = watch("visaType") || "jobHolder";

// 	return (
// 		<select
// 			className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm appearance-none 
//              bg-gradient-to-r from-orange-200 via-white to-white
//              text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-black focus:border-orange-500"
// 			onChange={(e) => onVisaTypeChange(e.target.value)}
// 			value={currentVisaType}
// 		>
// 			<option value="">Select your occupation from dropdown</option>
// 			<option value="jobHolder">Job Holder&apos;s Documents</option>
// 			<option value="business">Businessperson&apos;s Documents</option>
// 			<option value="student">Student&apos;s Documents</option>
// 		</select>
// 	);
// }



export const VisaTypeSelector: React.FC<VisaTypeSelectorProps> = ({ onVisaTypeChange }) => {
	const { watch } = useFormContext<IVisaForm>();
	const currentVisaType = watch("visaType");
	return (
		<div className="relative rounded-md p-[1px] bg-gradient-to-r from-[#EC6809] via-[#4B2DCF] to-[#D840C9]">
			<select
				className="w-full px-3 py-2 rounded-md shadow-sm appearance-none 
				   bg-white
				   text-sm text-gray-700 focus:outline-none focus:ring-0 focus:border-transparent"
				onChange={(e) => onVisaTypeChange(e.target.value)}
				value={currentVisaType}
			>
				<option value="">Select your occupation from dropdown</option>
				<option value="jobHolder">Job Holder&apos;s Documents</option>
				<option value="business">Businessperson&apos;s Documents</option>
				<option value="student">Student&apos;s Documents</option>
			</select>
			<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#EC6809]">
				<svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
					<path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
				</svg>
			</div>
		</div>
	)
}