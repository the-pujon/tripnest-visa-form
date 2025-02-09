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
  OTHER_DOCUMENTS,
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
      phone: "",
      email: "",
      address: "",
      notes: "",
      visaType: "",
      generalDocuments: {
        passportCopy: defaultFileUpload,
        passportPhoto: defaultFileUpload,
        bankStatement: defaultFileUpload,
        bankSolvency: defaultFileUpload,
        visitingCard: defaultFileUpload,
        hotelBooking: defaultFileUpload,
        airTicket: defaultFileUpload,
      },
      businessDocuments: undefined,
      studentDocuments: undefined,
      jobHolderDocuments: undefined,
      otherDocuments: {
        marriageCertificate: defaultFileUpload,
      },
    },
  });

  // Update form values when defaultValues change
  useEffect(() => {
    if (defaultValues) {
      const formValues = {
        ...defaultValues,
        generalDocuments: {
          passportCopy: { ...defaultFileUpload, ...defaultValues.generalDocuments?.passportCopy },
          passportPhoto: { ...defaultFileUpload, ...defaultValues.generalDocuments?.passportPhoto },
          bankStatement: { ...defaultFileUpload, ...defaultValues.generalDocuments?.bankStatement },
          bankSolvency: { ...defaultFileUpload, ...defaultValues.generalDocuments?.bankSolvency },
          visitingCard: { ...defaultFileUpload, ...defaultValues.generalDocuments?.visitingCard },
          hotelBooking: { ...defaultFileUpload, ...defaultValues.generalDocuments?.hotelBooking },
          airTicket: { ...defaultFileUpload, ...defaultValues.generalDocuments?.airTicket },
        },
        businessDocuments: defaultValues.businessDocuments,
        studentDocuments: defaultValues.studentDocuments,
        jobHolderDocuments: defaultValues.jobHolderDocuments,
        otherDocuments: {
          marriageCertificate: { ...defaultFileUpload, ...defaultValues.otherDocuments?.marriageCertificate },
        },
      };
      formMethods.reset(formValues);
    }
  }, [defaultValues]);

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
        otherDocuments: {
          marriageCertificate: defaultFileUpload,
        },
      });

      if (value === "business") {
        formMethods.setValue("businessDocuments", {
          tradeLicense: defaultFileUpload,
          notarizedId: defaultFileUpload,
          memorandum: defaultFileUpload,
          officePad: defaultFileUpload,
        });
      } else if (value === "student") {
        formMethods.setValue("studentDocuments", {
          studentId: defaultFileUpload,
          travelLetter: defaultFileUpload,
          birthCertificate: defaultFileUpload,
        });
      } else if (value === "jobHolder") {
        formMethods.setValue("jobHolderDocuments", {
          nocCertificate: defaultFileUpload,
          officialId: defaultFileUpload,
          bmdcCertificate: defaultFileUpload,
          barCouncilCertificate: defaultFileUpload,
          retirementCertificate: defaultFileUpload,
        });
      }
    },
    [formMethods]
  );

  return (
    <div className="">
      <FormProvider {...formMethods}>
        <div>
          <div className="p-6">
            <form className="space-y-6" id={formKey}>
              <TravelerHeader id={id} isFirst={isFirst} onRemove={onRemove} />

              <TravelerBasicInfo />

              <VisaTypeSelector onVisaTypeChange={handleVisaTypeChange} />

              <DocumentSection
                title="General Documents (Mandatory for all E-Visa)"
                documents={GENERAL_DOCUMENTS}
                travelerId={id}
                documentData={defaultValues?.generalDocuments}
              />

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

              {formMethods.watch("visaType") === "other" && (
                <DocumentSection
                  title="Other Documents"
                  documents={OTHER_DOCUMENTS}
                  travelerId={id}
                  documentData={defaultValues?.otherDocuments}
                />
              )}
            </form>
          </div>
        </div>
      </FormProvider>
    </div>
  );
}