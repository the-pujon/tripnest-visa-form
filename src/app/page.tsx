"use client";

import { useForm } from "react-hook-form";
import type { IVisaForm } from "@/interface/visaFormInterface";
import { useEffect, useState, useRef, useCallback } from "react";
import { TravelerFormSection } from "@/components/form/TavelerFormSection";
import { useFormValidation } from "@/hooks/useFormValidation";

//type for the form methods ref
type FormMethodsRef = Map<number, ReturnType<typeof useForm<IVisaForm>>>;

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export default function TravelForm() {
  const [travelerIds, setTravelerIds] = useState<number[]>([1]);
  const formMethodsRef = useRef<FormMethodsRef>(new Map());
  const [isAllValid, setIsAllValid] = useState(false);
  const { isFormValid } = useFormValidation();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        console.log("Forms to validate:", forms.length);
        const valid = await isFormValid(forms);
        console.log("Validation result:", valid);
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
      console.log("Number of forms to validate:", forms.length);
      
      const isValid = await isFormValid(forms);
      console.log("Overall form validation result:", isValid);

      if (!isValid) {
        throw new Error(
          "Please fill all required fields and upload necessary documents for all travelers."
        );
      }

      // Submit each traveler's application
      const submissions = Array.from(formMethodsRef.current.entries()).map(
        async ([id, methods]) => {
          console.log(`Processing form for traveler ${id}`);
          const formData = new FormData();
          const values = methods.getValues();
          console.log("Form Values:", values);

          // Create base form data object without document fields first
          const formDataObj = {
            givenName: values.givenName,
            surname: values.surname,
            phone: values.phone,
            email: values.email,
            address: values.address,
            notes: values.notes || '',
            visaType: values.visaType
          };

          // Add files to FormData first
          if (values.generalDocuments) {
            Object.entries(values.generalDocuments).forEach(([key, file]) => {
              if (file?.file instanceof File) {
                formData.append(key, file.file);
              }
            });
          }

          // Add type-specific documents based on visa type
          if (values.visaType === 'business' && values.businessDocuments) {
            Object.entries(values.businessDocuments).forEach(([key, file]) => {
              if (file?.file instanceof File) {
                formData.append(key, file.file);
              }
            });
          }

          if (values.visaType === 'student' && values.studentDocuments) {
            Object.entries(values.studentDocuments).forEach(([key, file]) => {
              if (file?.file instanceof File) {
                formData.append(key, file.file);
              }
            });
          }

          if (values.visaType === 'jobHolder' && values.jobHolderDocuments) {
            Object.entries(values.jobHolderDocuments).forEach(([key, file]) => {
              if (file?.file instanceof File) {
                formData.append(key, file.file);
              }
            });
          }

          if (values.visaType === 'other' && values.otherDocuments) {
            Object.entries(values.otherDocuments).forEach(([key, file]) => {
              if (file?.file instanceof File) {
                formData.append(key, file.file);
              }
            });
          }

          // Important: Append the data first
          formData.append('data', JSON.stringify(formDataObj));

          // Log the form data for debugging
          console.log("Form Data being sent:", {
            formData: Object.fromEntries(formData.entries()),
            jsonData: formDataObj
          });

          try {
            const response = await fetch(`${API_URL}/visa/create`, {
              method: 'POST',
              body: formData,
            });

            const responseData = await response.json();

            if (!response.ok) {
              throw new Error(responseData.message || 'Failed to submit visa application');
            }

            return responseData;
          } catch (error) {
            console.error('Error submitting visa application:', error);
            throw error;
          }
        }
      );

      const results = await Promise.all(submissions);
      console.log("Submission results:", results);
      
      alert("All visa applications have been submitted successfully!");
    } catch (error) {
      console.error("Submission error:", error);
      alert(
        error instanceof Error
          ? error.message
          : "An error occurred while submitting the applications."
      );
    } finally {
      setIsSubmitting(false);
    }
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
    <div className="w-full max-w-5xl mx-auto py-10">
      <div className="bg-white shadow-md rounded-lg overflow-hidden px-28 pb-10">
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
          className="text-[#FF6B00] hover:text-[#FF6B00]/80 font-semibold"
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
  );
}
