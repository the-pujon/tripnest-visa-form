"use client";

import { useForm } from "react-hook-form";
import type { IVisaForm } from "@/interface/visaFormInterface";
import { useEffect, useState, useRef, useCallback } from "react";
import { TravelerFormSection } from "@/components/form/TavelerFormSection";
import { useFormValidation } from "@/hooks/useFormValidation";
import { SubmissionModal } from "@/components/modal/SubmissionModal";
import toast from "react-hot-toast";
import { useCreateVisaMutation } from "@/redux/features/visaApi";

// Add this type definition at the top of the file, after the imports
type VisaType = 'business' | 'student' | 'jobHolder' | 'other';

//type for the form methods ref
type FormMethodsRef = Map<number, ReturnType<typeof useForm<IVisaForm>>>;



export default function TravelForm() {
  const [travelerIds, setTravelerIds] = useState<number[]>([1]);
  const formMethodsRef = useRef<FormMethodsRef>(new Map());
  const [isAllValid, setIsAllValid] = useState(false);
  const { isFormValid } = useFormValidation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createVisa, {data, error}] = useCreateVisaMutation();
  console.log(error)

  const registerFormMethods = useCallback(
    (id: number, methods: ReturnType<typeof useForm<IVisaForm>> | null) => {
      if (methods === null) {
        formMethodsRef.current.delete(id);
      } else {
        formMethodsRef.current.set(id, methods);
      }
    },[]);

  //handle validation 
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleValidation = async () => {
      if (timeoutId) clearTimeout(timeoutId);

      timeoutId = setTimeout(async () => {
        const forms = Array.from(formMethodsRef.current.values());
        const valid = await isFormValid(forms);
        setIsAllValid(valid);
      }, 500);
    };

    const forms = Array.from(formMethodsRef.current.values());
    const subscriptions = forms.map((methods) => methods.watch(handleValidation));
    
    handleValidation();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      subscriptions.forEach((subscription) => subscription.unsubscribe());
    };
  }, [travelerIds, isFormValid]);


  //handle submit all
  const handleSubmitAll = async () => {
    setIsSubmitting(true);
    try {
      const forms = Array.from(formMethodsRef.current.values());
      
      const isValid = await isFormValid(forms);

      if (!isValid) {
        toast.error("Please fill all required fields and upload necessary documents for all travelers.");
        return;
      }

      // Get primary traveler's form (ID: 1) and sub-travelers
      const primaryTravelerForm = formMethodsRef.current.get(1);
      const subTravelerForms = Array.from(formMethodsRef.current.entries())
        .filter(([id]) => id !== 1)
        .map(([, methods]) => methods);

      if (!primaryTravelerForm) {
        throw new Error("Primary traveler's form not found");
      }

      const formData = new FormData();
      const primaryTravelerValues = primaryTravelerForm.getValues();
      const subTravelersValues = subTravelerForms.map(methods => methods.getValues());

      // Create clean data objects without file objects
      const primaryTravelerData = {
        givenName: primaryTravelerValues.givenName,
        surname: primaryTravelerValues.surname,
        phone: primaryTravelerValues.phone,
        email: primaryTravelerValues.email,
        address: primaryTravelerValues.address,
        notes: primaryTravelerValues.notes || '',
        visaType: primaryTravelerValues.visaType,
      };

      const subTravelersData = subTravelersValues.map(traveler => ({
        givenName: traveler.givenName,
        surname: traveler.surname,
        phone: traveler.phone,
        email: traveler.email,
        address: traveler.address,
        notes: traveler.notes || '',
        visaType: traveler.visaType,
      }));

      // Create the final data object
      const finalData = {
        ...primaryTravelerData,
        subTravelers: subTravelersData
      };

      // Append the JSON data (without files)
      formData.append('data', JSON.stringify(finalData));

      // Handle primary traveler's files
      if (primaryTravelerValues.generalDocuments) {
        Object.entries(primaryTravelerValues.generalDocuments).forEach(([key, file]) => {
          if (file?.file instanceof File) {
            formData.append(`primaryTraveler_${key}`, file.file);
          }
        });
      }

      // Update the documentTypes object definition
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const documentTypes: Record<VisaType, any> = {
        business: primaryTravelerValues.businessDocuments,
        student: primaryTravelerValues.studentDocuments,
        jobHolder: primaryTravelerValues.jobHolderDocuments,
        other: primaryTravelerValues.otherDocuments
      } as const;

      // Type guard to check if the visaType is valid
      const isValidVisaType = (visaType: string): visaType is VisaType => {
        return ['business', 'student', 'jobHolder', 'other'].includes(visaType);
      };

      // Update the primary traveler document handling
      if (isValidVisaType(primaryTravelerValues.visaType) && documentTypes[primaryTravelerValues.visaType]) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Object.entries(documentTypes[primaryTravelerValues.visaType]).forEach(([key, file]: [string, any]) => {
          if (file?.file instanceof File) {
            formData.append(`primaryTraveler_${key}`, file.file);
          }
        });
      }

      // Handle sub-travelers' files
      subTravelersValues.forEach((traveler, index) => {
        // Add general documents
        if (traveler.generalDocuments) {
          Object.entries(traveler.generalDocuments).forEach(([key, file]) => {
            if (file?.file instanceof File) {
              formData.append(`subTraveler${index}_${key}`, file.file);
            }
          });
        }

        // Add type-specific documents
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const subTravelerDocs: Record<VisaType, any> = {
          business: traveler.businessDocuments,
          student: traveler.studentDocuments,
          jobHolder: traveler.jobHolderDocuments,
          other: traveler.otherDocuments
        } as const;

        if (isValidVisaType(traveler.visaType) && subTravelerDocs[traveler.visaType]) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          Object.entries(subTravelerDocs[traveler.visaType]).forEach(([key, file]: [string, any]) => {
            if (file?.file instanceof File) {
              formData.append(`subTraveler${index}_${key}`, file.file);
            }
          });
        }
      });

      const formDataObject = Object.fromEntries(formData.entries());
console.log('FormData as object:', formDataObject);

      try {
        const responseData = await createVisa(formData);
        if ('error' in responseData) {
          toast.error('Failed to submit visa application');
        } else {
          toast.success("Visa applications submitted successfully. Please proceed to payment...");
          setShowSuccessModal(true);
          console.log(responseData)
          console.log(data)
          
          // Reset all forms
          // formMethodsRef.current.forEach((methods) => {
          //   methods.reset({
          //     givenName: '',
          //     surname: '',
          //     phone: '',
          //     email: '',
          //     address: '',
          //     notes: '',
          //     visaType: '',
          //     generalDocuments: {},
          //     businessDocuments: {},
          //     studentDocuments: {},
          //     jobHolderDocuments: {},
          //     otherDocuments: {}
          //   });
          // });
          
          // // Reset to single traveler
          // setTimeout(() => {
          //   setTravelerIds([1]);
          // }, 0);
        }
      } catch (error) {
        throw error;
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred while submitting the applications."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    // Optionally reset form or redirect
  };

  const addTraveler = () => {
    const newId = Math.max(...travelerIds) + 1;
    setTravelerIds([...travelerIds, newId]);
  };

  const removeTraveler = (idToRemove: number) => {
    if (idToRemove === 1) return;
    formMethodsRef.current.delete(idToRemove);
    setTravelerIds(travelerIds.filter((id) => id !== idToRemove));
  };

  return (
    <>
      <div className="w-full max-w-5xl mx-auto py-10">
        <div className="bg-white shadow-md rounded-lg overflow-hidden lg:px-28 px-0 pb-10">
          {travelerIds.map((id) => (
            <TravelerFormSection
              key={id}
              id={id}
              onRemove={removeTraveler}
              isFirst={id === 1}
              onRegisterFormMethods={(methods) => registerFormMethods(id, methods)}
            />
          ))}
          <button
            type="button"
            className="text-[#FF6B00] hover:text-[#FF6B00]/80 font-semibold pl-5"
            onClick={addTraveler}
          >
            + Add Traveler
          </button>
        </div>

        <div className="flex flex-col items-center gap-4 mt-5">
          <button
            type="button"
            onClick={handleSubmitAll}
            className="self-center py-2 px-11 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary hover:bg-primary/70 transition-all duration-500 focus:outline-none focus:ring-0 focus:ring-offset-0 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={!isAllValid || isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⏳</span>
                Submitting...
              </span>
            ) : (
              "Submit All Documents"
            )}
          </button>
        </div>
      </div>
      
      <SubmissionModal 
        isOpen={showSuccessModal} 
        onClose={handleCloseModal} 
      />
    </>
  );
}
