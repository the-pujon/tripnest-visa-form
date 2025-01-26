"use client";

import { useForm } from "react-hook-form";
import type { IVisaForm } from "@/interface/visaFormInterface";
import { useEffect, useState, useRef, useCallback } from "react";
import { TravelerFormSection } from "@/components/form/TavelerFormSection";
import { useFormValidation } from "@/hooks/useFormValidation";

export default function TravelForm() {
  const [travelerIds, setTravelerIds] = useState<number[]>([1]);
  const formMethodsRef = useRef<Map<number, ReturnType<typeof useForm<IVisaForm>>>>(
    new Map()
  );
  const [isAllValid, setIsAllValid] = useState(false);
  const { isFormValid } = useFormValidation();

  const registerFormMethods = useCallback(
    (id: number, methods: ReturnType<typeof useForm<IVisaForm>> | null) => {
      if (methods === null) {
        formMethodsRef.current.delete(id);
      } else {
        formMethodsRef.current.set(id, methods);
      }
    },
    []
  );

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleValidation = () => {
      if (timeoutId) clearTimeout(timeoutId);

      timeoutId = setTimeout(async () => {
        const forms = Array.from(formMethodsRef.current.values());
        const valid = await isFormValid(forms);
        setIsAllValid(valid);
      }, 100);
    };

    const forms = Array.from(formMethodsRef.current.values());
    const subscriptions = forms.map((methods) => methods.watch(handleValidation));

    handleValidation();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      subscriptions.forEach((subscription) => subscription.unsubscribe());
    };
  }, [travelerIds, isFormValid]);

  const handleSubmitAll = async () => {
    try {
      const forms = Array.from(formMethodsRef.current.values());
      const isValid = await isFormValid(forms);

      if (!isValid) {
        throw new Error(
          "Please fill all required fields and upload necessary documents for all travelers."
        );
      }

      // Validate all forms
      const validationResults = await Promise.all(
        forms.map(async (methods) => {
          const result = await methods.trigger();
          if (!result) {
            console.log("Form validation errors:", methods.formState.errors);
          }
          return result;
        })
      );

      if (validationResults.some((result) => !result)) {
        throw new Error("Please check all required fields are filled correctly.");
      }

      // Prepare form data for submission
      const formData = Array.from(formMethodsRef.current.entries()).map(
        ([id, methods]) => ({
          id,
          data: methods.getValues()
        })
      );

      console.log("All form data:", formData);
      alert("All travel forms have been submitted successfully.");
    } catch (error) {
      console.error("Submission error:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Please ensure all forms are filled out correctly."
      );
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

      <div className="flex flex-col items-center gap-4">
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
