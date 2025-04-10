import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
	isStar?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
	({ className, type,label,isStar, error, ...props }, ref) => {
		return (
			<div className="w-full">
				<label className="block text-gray-700 font-normal text-[16px]">
					{label}
					{isStar ? <span className="text-red-500">*</span> : ""}
				</label>
				<input
					type={type}
					className={cn(
						"w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500",
						error && "border-red-500 focus:border-red-500 focus:ring-red-500",
						className
					)}
					ref={ref}
					{...props}
				/>
				{error && <p className="mt-1 text-sm text-red-500">{error}</p>}
			</div>
		);
	}
);

Input.displayName = "Input";

export { Input };
