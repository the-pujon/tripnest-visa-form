"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { travelerFormSchema } from "@/schemas/visaFormSchema";
import type { IVisaForm } from "@/interface/visaFormInterface";
import { FileUpload } from "@/components/form/file-upload";
import { useEffect, useState, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Title } from "@/components/ui/title";
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

  // Register form methods when component mounts
  useEffect(() => {
    onRegisterFormMethods(formMethods);
    // Cleanup when component unmounts
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onRegisterFormMethods(null as any); // Clear the registration
    };
  }, [formMethods, id, onRegisterFormMethods]); // Add id as dependency

  const handleVisaTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    
    // Reset only this form's documents
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

    // Set appropriate document section based on visa type
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
  };

  return (
    <div className="mb-8">
      <FormProvider {...formMethods}>
        <div className="bg-white shadow-md rounded-lg overflow-hidden px-28" data-traveler-id={id}>
          <div className="p-6">
            <form
              className="space-y-6"
              id={formKey}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Title>
                    Traveler {String(id).padStart(2, "0")}
                    {isFirst ? " (Primary Contact)" : ""}
                  </Title>
                  {isFirst && (
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="myself"
                        className="rounded text-orange-500 focus:ring-orange-500"
                      />
                      <label htmlFor="myself" className="text-sm text-gray-600">
                        Myself
                      </label>
                    </div>
                  )}
                </div>
                {id !== 1 && (
                  <button
                    type="button"
                    onClick={() => onRemove(id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove Traveler
                  </button>
                )}
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  placeholder="Given Name (First Name & Middle Name)*"
                  {...formMethods.register("givenName")}
                  error={formMethods.formState.errors.givenName?.message?.toString()}
                />
                <Input
                  placeholder="Surname (Last Name)*"
                  {...formMethods.register("surname")}
                  error={formMethods.formState.errors.surname?.message?.toString()}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  placeholder="Phone Number*"
                  type="tel"
                  {...formMethods.register("phone")}
                  error={formMethods.formState.errors.phone?.message?.toString()}
                />
                <Input
                  placeholder="Email*"
                  type="email"
                  {...formMethods.register("email")}
                  error={formMethods.formState.errors.email?.message?.toString()}
                />
              </div>

              <Input
                placeholder="Local Address*"
                {...formMethods.register("address")}
                error={formMethods.formState.errors.address?.message?.toString()}
              />

              <Input
                placeholder="Special Notes"
                {...formMethods.register("notes")}
                error={formMethods.formState.errors.notes?.message?.toString()}
              />
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 [&>option:hover]:bg-[#0066FF] [&>option:checked]:bg-[#0066FF]"
                onChange={handleVisaTypeChange}
                value={formMethods.watch("visaType")}
              >
                <option value="">Select document type</option>
                <option value="work">Job Holder&apos;s Documents</option>
                <option value="business">
                  Businessperson&apos;s Documents
                </option>
                <option value="student">Student&apos;s Documents</option>
                <option value="other">Other Documents</option>
              </select>

              <div className="space-y-4">
                <Title>General Documents (Mandatory for all E-Visa)</Title>
                <div className="grid md:grid-cols-2 gap-6">
                  <FileUpload
                    number={1}
                    label="Passport Scanned Copy"
                    name="generalDocuments.passportCopy"
                    travelerId={id}
                  />
                  <FileUpload
                    number={2}
                    label="Recent Passport Size Photo"
                    name="generalDocuments.passportPhoto"
                    travelerId={id}
                  />
                  <FileUpload
                    number={3}
                    label="Bank Statement of the last 06 months"
                    name="generalDocuments.bankStatement"
                    travelerId={id}
                  />
                  <FileUpload
                    number={4}
                    label="Bank Solvency Certificate"
                    name="generalDocuments.bankSolvency"
                    travelerId={id}
                  />
                  <FileUpload
                    number={5}
                    label="Visiting Card Copy"
                    name="generalDocuments.visitingCard"
                    travelerId={id}
                  />
                  <FileUpload
                    number={6}
                    label="Hotel Booking Copy"
                    name="generalDocuments.hotelBooking"
                    travelerId={id}
                  />
                  <FileUpload
                    number={7}
                    label="Air Ticket Booking Copy"
                    name="generalDocuments.airTicket"
                    travelerId={id}
                  />
                </div>
              </div>

              {formMethods.watch("visaType") === "business" && (
                <div className="space-y-4">
                  <Title>Businessperson Documents</Title>
                  <div className="grid md:grid-cols-2 gap-6">
                    <FileUpload
                      number={1}
                      label="Valid Trade license copy with notary public (English Translation)"
                      name="businessDocuments.tradeLicense"
                      travelerId={id}
                    />
                    <FileUpload
                      number={2}
                      label="Notarized ID with an English translation (Govt. Employee)"
                      name="businessDocuments.notarizedId"
                      travelerId={id}
                    />
                    <FileUpload
                      number={3}
                      label="Memorandum for Limited Company (For Businessperson)"
                      name="businessDocuments.memorandum"
                      travelerId={id}
                    />
                    <FileUpload
                      number={4}
                      label="Office Pad / Company Letter Head Pad (For Businessperson)"
                      name="businessDocuments.officePad"
                      travelerId={id}
                    />
                  </div>
                </div>
              )}

              {formMethods.watch("visaType") === "student" && (
                <div className="space-y-4">
                  <Title>Student&apos;s Document</Title>
                  <div className="grid md:grid-cols-2 gap-6">
                    <FileUpload
                      number={1}
                      label="Student ID card copy (For Student)"
                      name="studentDocuments.studentId"
                      travelerId={id}
                    />
                    <FileUpload
                      number={2}
                      label="Travel Letter or Leave Letter from the Educational Institute"
                      name="studentDocuments.travelLetter"
                      travelerId={id}
                    />
                    <FileUpload
                      number={3}
                      label="Birth Certificate (Only for Child & infant)"
                      name="studentDocuments.birthCertificate"
                      travelerId={id}
                    />
                  </div>
                </div>
              )}

              {formMethods.watch("visaType") === "work" && (
                <div className="space-y-4">
                  <Title>Job Holder&apos;s Document</Title>
                  <div className="grid md:grid-cols-2 gap-6">
                    <FileUpload
                      number={1}
                      label="NOC Certificate"
                      name="jobHolderDocuments.nocCertificate"
                      travelerId={id}
                    />
                    <FileUpload
                      number={2}
                      label="Official ID card copy"
                      name="jobHolderDocuments.officialId"
                      travelerId={id}
                    />
                    <FileUpload
                      number={3}
                      label="BMDC certificate for Doctors"
                      name="jobHolderDocuments.bmdcCertificate"
                      travelerId={id}
                    />
                    <FileUpload
                      number={4}
                      label="BAR Council Certificate"
                      name="jobHolderDocuments.barCouncilCertificate"
                      travelerId={id}
                    />
                    <FileUpload
                      number={5}
                      label="Retirement certificate"
                      name="jobHolderDocuments.retirementCertificate"
                      travelerId={id}
                    />
                  </div>
                </div>
              )}

              {formMethods.watch("visaType") === "other" && (
                <div className="space-y-4">
                  <Title>Other Documents</Title>
                  <div className="grid md:grid-cols-2 gap-6">
                    <FileUpload
                      number={1}
                      label="Marriage Certificate or Nikahnama (if spouse's name is not on the applicant's passport)"
                      name="otherDocuments.marriageCertificate"
                      travelerId={id}
                    />
                  </div>
                </div>
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

        // Check general documents
        const generalDocsValid = Object.values(values.generalDocuments).every(
          (doc) => doc.uploaded
        );
        if (!generalDocsValid) return false;

        // Check specific documents based on visa type
        switch (values.visaType) {
          case "business":
            if (!values.businessDocuments || 
                !Object.values(values.businessDocuments).every(doc => doc.uploaded)) {
              return false;
            }
            break;
          case "student":
            if (!values.studentDocuments || 
                !Object.values(values.studentDocuments).every(doc => doc.uploaded)) {
              return false;
            }
            break;
          case "work":
            if (!values.jobHolderDocuments || 
                !Object.values(values.jobHolderDocuments).every(doc => doc.uploaded)) {
              return false;
            }
            break;
        }
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

      const formData = Array.from(formMethodsRef.current.entries()).map(([id, methods]) => ({
        id,
        data: methods.getValues(),
      }));

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
