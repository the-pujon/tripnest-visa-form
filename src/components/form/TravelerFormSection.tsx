"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { travelerFormSchema } from "@/schemas/visaFormSchema";
import type { IVisaForm, VisaType } from "@/interface/visaFormInterface";
import { useEffect, useRef, useCallback } from "react";
import { TravelerBasicInfo } from "@/components/form/TravelerBasicInfo";
import { VisaTypeSelector } from "@/components/form/VisaTypeSelector";
import { DocumentSection } from "@/components/form/DocumentSection";
import {
	GENERAL_DOCUMENTS,
	BUSINESS_DOCUMENTS,
	STUDENT_DOCUMENTS,
	JOB_HOLDER_DOCUMENTS,
} from "@/constants/documents";
import { TravelerHeader } from "@/components/form/TravelerHeader";

interface TravelerFormProps {
	id: number;
	onRemove: (id: number) => void;
	isFirst: boolean;
	onRegisterFormMethods: (
		methods: ReturnType<typeof useForm<IVisaForm>> | null
	) => void;
	defaultValues?: IVisaForm;
}

const defaultFileUpload = { file: null, name: "", uploaded: false };

export function TravelerFormSection({
	id,
	onRemove,
	isFirst,
	onRegisterFormMethods,
	defaultValues,
}: TravelerFormProps) {
	const formKey = useRef(`traveler-form-${id}`).current;

	const formMethods = useForm<IVisaForm>({
		resolver: zodResolver(travelerFormSchema),
		mode: "onChange",
		defaultValues: defaultValues || {
			givenName: "",
			surname: "",
			phone1: "",
			phone2: "",
			email: "",
			address: "",
			notes: "",
			visaType: "",
			generalDocuments: {
				passportCopy: defaultFileUpload,
				passportPhoto: defaultFileUpload,
				bankStatement: defaultFileUpload,
				bankSolvency: defaultFileUpload,
				hotelBooking: defaultFileUpload,
				airTicket: defaultFileUpload,
				previousVisa: defaultFileUpload,
				marriageCertificate: defaultFileUpload,
			},
			businessDocuments: undefined,
			studentDocuments: undefined,
			jobHolderDocuments: undefined,
		},
	});

	// Update form values when defaultValues change
	useEffect(() => {
		if (defaultValues) {
			const formValues = {
				...defaultValues,
				generalDocuments: {
					passportCopy: {
						...defaultFileUpload,
						...defaultValues.generalDocuments?.passportCopy,
					},
					passportPhoto: {
						...defaultFileUpload,
						...defaultValues.generalDocuments?.passportPhoto,
					},
					bankStatement: {
						...defaultFileUpload,
						...defaultValues.generalDocuments?.bankStatement,
					},
					bankSolvency: {
						...defaultFileUpload,
						...defaultValues.generalDocuments?.bankSolvency,
					},
					hotelBooking: {
						...defaultFileUpload,
						...defaultValues.generalDocuments?.hotelBooking,
					},
					airTicket: {
						...defaultFileUpload,
						...defaultValues.generalDocuments?.airTicket,
					},
					previousVisa: {
						...defaultFileUpload,
						...defaultValues.generalDocuments?.previousVisa,
					},
					marriageCertificate: {
						...defaultFileUpload,
						...defaultValues.generalDocuments?.marriageCertificate,
					},
				},
				businessDocuments: defaultValues.businessDocuments,
				studentDocuments: defaultValues.studentDocuments,
				jobHolderDocuments: defaultValues.jobHolderDocuments,
			};
			formMethods.reset(formValues);
		}
	}, [defaultValues, formMethods]);

	// Register form methods with parent component
	useEffect(() => {
		onRegisterFormMethods(formMethods);
		return () => {
			onRegisterFormMethods(null);
		};
	}, [formMethods, onRegisterFormMethods]);

	const handleVisaTypeChange = useCallback(
		(value: string) => {
			const currentValues = formMethods.getValues();
			formMethods.reset({
				...currentValues,
				visaType: value as VisaType,
				businessDocuments: undefined,
				studentDocuments: undefined,
				jobHolderDocuments: undefined,
				
			});

			if (value === "business") {
				formMethods.setValue("businessDocuments", {
					tradeLicense: defaultFileUpload,
					memorandum: defaultFileUpload,
					visitingCard: defaultFileUpload,
					companyPad: defaultFileUpload,
				});
			} else if (value === "student") {
				formMethods.setValue("studentDocuments", {
					studentId: defaultFileUpload,
					leaveLetter: defaultFileUpload,
					birthCertificate: defaultFileUpload,
				});
			} else if (value === "jobHolder") {
				formMethods.setValue("jobHolderDocuments", {
					nocCertificate: defaultFileUpload,
					officialId: defaultFileUpload,
					bmdcCertificate: defaultFileUpload,
					barCouncilCertificate: defaultFileUpload,
					retirementCertificate: defaultFileUpload,
					notarizedId: defaultFileUpload,
					salaryCertificate: defaultFileUpload
				});
			}
		},
		[formMethods]
	);

	return (
		<div className="">
			<FormProvider {...formMethods}>
				<div>
					<form className="mb-10 space-y-6" id={formKey}>
						<TravelerHeader id={id} isFirst={isFirst} onRemove={onRemove} />

						<TravelerBasicInfo />
						<DocumentSection
							// title="General Documents (Mandatory for all E-Visa)"
							title="General Documents"
							documents={GENERAL_DOCUMENTS}
							travelerId={id}
							documentData={defaultValues?.generalDocuments}
						/>
						<h3>Visa Type <span className="text-red-500">*</span></h3>
						<VisaTypeSelector onVisaTypeChange={handleVisaTypeChange} />

						{formMethods.watch("visaType") === "business" && (
							<DocumentSection
								title="Businessperson Documents"
								documents={BUSINESS_DOCUMENTS}
								travelerId={id}
								documentData={defaultValues?.businessDocuments}
							/>
						)}

						{formMethods.watch("visaType") === "student" && (
							<DocumentSection
								title="Student Documents"
								documents={STUDENT_DOCUMENTS}
								travelerId={id}
								documentData={defaultValues?.studentDocuments}
							/>
						)}

						{formMethods.watch("visaType") === "jobHolder" && (
							<DocumentSection
								title="Job Holder Documents"
								documents={JOB_HOLDER_DOCUMENTS}
								travelerId={id}
								documentData={defaultValues?.jobHolderDocuments}
							/>
						)}

						
					</form>
				</div>
			</FormProvider>
		</div>
	);
}
