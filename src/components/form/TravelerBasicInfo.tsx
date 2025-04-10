import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import type { IVisaForm } from "@/interface/visaFormInterface";

export function TravelerBasicInfo() {
	const {
		register,
		formState: { errors },
	} = useFormContext<IVisaForm>();

	return (
		<>
			<div className="grid md:grid-cols-2 gap-4">
				<Input
					placeholder="First Name & Middle Name"
					label="Given Name"
					isStar={true}
					{...register("givenName")}
					error={errors.givenName?.message?.toString()}
				/>
				<Input
					placeholder="Last Name"
					label="Surname"
					isStar={true}
					{...register("surname")}
					error={errors.surname?.message?.toString()}
				/>
			</div>

			<div className="grid md:grid-cols-2 gap-4">
				<Input
					placeholder="Primary number"
					type="tel"
					label="Phone Number 01"
					isStar={true}
					{...register("phone1")}
					error={errors.phone1?.message?.toString()}
				/>

				<Input
					placeholder="Secondary number"
					type="tel"
					label="Phone Number 02"
					{...register("phone2")}
					error={errors.phone2?.message?.toString()}
				/>
				<Input
					placeholder="Email"
					type="email"
					label="Email"
					isStar={true}
					{...register("email")}
					error={errors.email?.message?.toString()}
				/>
				<Input
					placeholder="Present Address"
					label="Current Address"
					isStar={true}
					{...register("address")}
					error={errors.address?.message?.toString()}
				/>
			</div>
			{/* 
			<Input
				placeholder="Special Notes"
				{...register("notes")}
				error={errors.notes?.message?.toString()}
			/> */}
		</>
	);
}
