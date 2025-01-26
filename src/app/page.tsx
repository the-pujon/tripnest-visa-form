"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { travelerFormSchema } from "@/schemas/visaFormSchema";
import type { IVisaForm } from "@/interface/visaFormInterface";
// import { FileUpload } from "@/components/form/file-upload";
import { useEffect, useState, useRef, useCallback } from "react";
// import { Input } from "@/components/ui/input";
// import { Title } from "@/components/ui/title";
// import { TravelerHeader } from "@/components/form/TravelerHeader";
import { TravelerBasicInfo } from "@/components/form/TravelerBasicInfo";
import { VisaTypeSelector } from "@/components/form/VisaTypeSelector";
import { DocumentSection } from "@/components/form/DocumentSection";
import { GENERAL_DOCUMENTS, BUSINESS_DOCUMENTS, STUDENT_DOCUMENTS, WORK_DOCUMENTS, OTHER_DOCUMENTS } from "@/constants/documents";
import { TravelerHeader } from "@/components/form/TravelerHeader";
// import { submitTravelForm } from "./app/actions"

const defaultFileUpload = { file: null, name: "", uploaded: false };

interface TravelerFormProps {
  id: number;
  onRemove: (id: number) => void;
  isFirst: boolean;
  onRegisterFormMethods: (methods: ReturnType<typeof useForm<IVisaForm>> | null) => void;
}

function TravelerFormSection({ id, onRemove, isFirst, onRegisterFormMethods }: TravelerFormProps) {
  const formKey = useRef(`traveler-form-${id}`).current;
  
  const formMethods = useForm<IVisaForm>({
    resolver: zodResolver(travelerFormSchema),
    mode: "onSubmit",
    reValidateMode: "onBlur",
    defaultValues: {
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

  useEffect(() => {
    onRegisterFormMethods(formMethods);
    return () => {
      onRegisterFormMethods(null);
    };
  }, [formMethods, id, onRegisterFormMethods]);

  const handleVisaTypeChange = useCallback((value: string) => {
    const currentValues = formMethods.getValues();
    formMethods.reset({
      ...currentValues,
      visaType: value,
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
    } else if (value === "work") {
      formMethods.setValue("jobHolderDocuments", {
        nocCertificate: defaultFileUpload,
        officialId: defaultFileUpload,
        bmdcCertificate: defaultFileUpload,
        barCouncilCertificate: defaultFileUpload,
        retirementCertificate: defaultFileUpload,
      });
    }
  }, [formMethods]);

  return (
    <div className="mb-8">
      <FormProvider {...formMethods}>
        <div className="bg-white shadow-md rounded-lg overflow-hidden px-28">
          <div className="p-6">
            <form className="space-y-6" id={formKey}>
              <TravelerHeader 
                id={id} 
                isFirst={isFirst} 
                onRemove={onRemove} 
              />
              
              <TravelerBasicInfo />
              
              <VisaTypeSelector onVisaTypeChange={handleVisaTypeChange} />

              <DocumentSection
                title="General Documents (Mandatory for all E-Visa)"
                documents={GENERAL_DOCUMENTS}
                travelerId={id}
              />

              {formMethods.watch("visaType") === "business" && (
                <DocumentSection
                  title="Businessperson Documents"
                  documents={BUSINESS_DOCUMENTS}
                  travelerId={id}
                />
              )}

              {formMethods.watch("visaType") === "student" && (
                <DocumentSection
                  title="Student Documents"
                  documents={STUDENT_DOCUMENTS}
                  travelerId={id}
                />
              )}

              {formMethods.watch("visaType") === "work" && (
                <DocumentSection
                  title="Job Holder Documents"
                  documents={WORK_DOCUMENTS}
                  travelerId={id}
                />
              )}

              {formMethods.watch("visaType") === "other" && (
                <DocumentSection
                  title="Other Documents"
                  documents={OTHER_DOCUMENTS}
                  travelerId={id}
                />
              )}
            </form>
          </div>
        </div>
      </FormProvider>
    </div>
  );
}

export default function TravelForm() {
  const [travelerIds, setTravelerIds] = useState<number[]>([1]);
  const formMethodsRef = useRef<Map<number, ReturnType<typeof useForm<IVisaForm>>>>(new Map());
  const [isAllValid, setIsAllValid] = useState(false);

  const registerFormMethods = useCallback((id: number, methods: ReturnType<typeof useForm<IVisaForm>> | null) => {
    if (methods === null) {
      formMethodsRef.current.delete(id);
    } else {
      // Ensure we're creating a new entry for each form
      formMethodsRef.current.set(id, methods);
    }
  }, []);

  const isFormValid = useCallback(async () => {
    try {
      const forms = Array.from(formMethodsRef.current.values());
      if (forms.length === 0) return false;

      for (const methods of forms) {
        const values = methods.getValues();
        
        // Basic field validation
        if (!values.givenName?.trim() || 
            !values.surname?.trim() || 
            !values.phone?.trim() || 
            !values.email?.trim() || 
            !values.address?.trim() || 
            !values.visaType) {
          return false;
        }

        // Check general documents - verify they are actually uploaded
        const generalDocsValid = Object.values(values.generalDocuments).every(
          (doc) => doc && doc.uploaded && doc.file
        );
        if (!generalDocsValid) return false;

        // Check specific documents based on visa type
        switch (values.visaType) {
          case "business":
            if (!values.businessDocuments || 
                !Object.values(values.businessDocuments).every(doc => doc && doc.uploaded && doc.file)) {
              return false;
            }
            break;
          case "student":
            if (!values.studentDocuments || 
                !Object.values(values.studentDocuments).every(doc => doc && doc.uploaded && doc.file)) {
              return false;
            }
            break;
          case "work":
            if (!values.jobHolderDocuments || 
                !Object.values(values.jobHolderDocuments).every(doc => doc && doc.uploaded && doc.file)) {
              return false;
            }
            break;
          case "other":
            if (!values.otherDocuments || 
                !Object.values(values.otherDocuments).every(doc => doc && doc.uploaded && doc.file)) {
              return false;
            }
            break;
        }

        // Clear other document types based on visa type
        if (values.visaType !== "business") {
          values.businessDocuments = undefined;
        }
        if (values.visaType !== "student") {
          values.studentDocuments = undefined;
        }
        if (values.visaType !== "work") {
          values.jobHolderDocuments = undefined;
        }
        if (values.visaType !== "other") {
          values.otherDocuments = undefined;
        }

        // Update the form values with cleared documents
        methods.reset(values);
      }
      
      return true;
    } catch (error) {
      console.error('Validation error:', error);
      return false;
    }
  }, []);

  // Modify the watch effect
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleValidation = () => {
      // Clear any existing timeout
      if (timeoutId) clearTimeout(timeoutId);
      
      // Set new timeout
      timeoutId = setTimeout(async () => {
        const valid = await isFormValid();
        setIsAllValid(valid);
      }, 100);
    };

    const forms = Array.from(formMethodsRef.current.values());
    const subscriptions = forms.map(methods => 
      methods.watch(handleValidation)
    );

    // Initial validation
    handleValidation();

    // Cleanup
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      subscriptions.forEach(subscription => subscription.unsubscribe());
    };
  }, [travelerIds, isFormValid]);

  const handleSubmitAll = async () => {
    try {
      const isValid = await isFormValid();
      
      if (!isValid) {
        throw new Error("Please fill all required fields and upload necessary documents for all travelers.");
      }

      // Trigger validation for all forms
      const forms = Array.from(formMethodsRef.current.values());
      const validationResults = await Promise.all(
        forms.map(async (methods) => {
          const result = await methods.trigger();
          if (!result) {
            const errors = methods.formState.errors;
            console.log('Form validation errors:', errors);
          }
          return result;
        })
      );

      if (validationResults.some(result => !result)) {
        throw new Error("Please check all required fields are filled correctly.");
      }

      // Clean up the form data before submission
      const formData = Array.from(formMethodsRef.current.entries()).map(([id, methods]) => {
        const values = methods.getValues();
        const visaType = values.visaType;

        // Clear other document types
        if (visaType !== "business") delete values.businessDocuments;
        if (visaType !== "student") delete values.studentDocuments;
        if (visaType !== "work") delete values.jobHolderDocuments;
        if (visaType !== "other") delete values.otherDocuments;

        return {
          id,
          data: values,
        };
      });

      console.log('All form data:', formData);
      
      // Uncomment to implement actual submission
      // await submitTravelForm(formData.map(f => f.data));
      alert("All travel forms have been submitted successfully.");
    } catch (error) {
      console.error('Submission error:', error);
      alert(error instanceof Error ? error.message : "Please ensure all forms are filled out correctly.");
    }
  };

  // Add a new traveler form
  const addTraveler = () => {
    const newId = Math.max(...travelerIds) + 1;
    setTravelerIds([...travelerIds, newId]);
  };

  // Remove traveler form
  const removeTraveler = (idToRemove: number) => {
    if (idToRemove === 1) return;
    
    // Clean up form methods when removing traveler
    formMethodsRef.current.delete(idToRemove);
    setTravelerIds(travelerIds.filter(id => id !== idToRemove));
  };
console.log(isAllValid)
  return (
    <div className="w-full max-w-5xl mx-auto py-10">
      {travelerIds.map((id) => (
        <TravelerFormSection
          key={id}
          id={id}
          onRemove={removeTraveler}
          isFirst={id === 1}
          onRegisterFormMethods={(methods) => registerFormMethods(id, methods)}
        />
      ))}
      
      <div className="flex flex-col items-center gap-4">
        <button
          type="button"
          className="text-[#FF6B00] hover:text-[#FF6B00]/80 font-medium"
          onClick={addTraveler}
        >
          + Add Traveler
        </button>

        <button
          type="button"
          onClick={handleSubmitAll}
          className="self-center py-2 px-11 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary hover:bg-primary/70 transition-all duration-500 focus:outline-none focus:ring-0 focus:ring-offset-0 disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={!isAllValid}
        >
          Submit All Documents
        </button>
      </div>
    </div>
  );
}
