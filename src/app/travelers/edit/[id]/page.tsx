"use client";

import { UseFormReturn } from "react-hook-form";
import type { IVisaForm, VisaType } from "@/interface/visaFormInterface";
import {useState, useRef, useCallback, useEffect } from "react";
import { TravelerFormSection } from "@/components/form/TavelerFormSection";
import toast from "react-hot-toast";
import { useGetVisaByIdQuery, useUpdatePrimaryTravelerMutation, useUpdateVisaMutation } from "@/redux/features/visaApi";
import { useParams, useRouter } from "next/navigation";

export default function EditTravelForm() {
  const { id } = useParams();
  const router = useRouter();
  const formMethodsRef = useRef<Map<number, UseFormReturn<IVisaForm>>>(new Map());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: visaData, isLoading } = useGetVisaByIdQuery(id as string);
  const [updateVisa, {error}] = useUpdatePrimaryTravelerMutation();

  console.log(visaData)
  console.log(error)

  const [subTravelers, setSubTravelers] = useState<number[]>([]);

  useEffect(() => {
    if (visaData?.data?.subTravelers?.length) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setSubTravelers(visaData.data.subTravelers.map((_: any, index: number) => index + 2));
    }
  }, [visaData]);

  const handleRegisterFormMethods = useCallback(
    (id: number, methods: UseFormReturn<IVisaForm> | null) => {
      if (methods) {
        formMethodsRef.current.set(id, methods);
        
        // Subscribe to form changes
        const subscription = methods.watch((value) => {
          console.log(`Form ${id} changed:`, value);
        });

        // Cleanup subscription when form is unregistered
        return () => subscription.unsubscribe();
      } else {
        formMethodsRef.current.delete(id);
      }
    },
    []
  );

  const handleSubmitAll = async () => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      // Get primary traveler form
      const primaryTravelerForm = formMethodsRef.current.get(1);
      if (!primaryTravelerForm) {
        console.error('Primary traveler form not found');
        toast.error('Primary traveler form not found');
        return;
      }

      // Get all form values
      const values = primaryTravelerForm.getValues();
      
      // Prepare primary traveler data
      const primaryTravelerData = {
        _id: visaData.data._id, 
        givenName: values.givenName,
        surname: values.surname,
        phone: values.phone,
        email: values.email,
        address: values.address,
        notes: values.notes,
        visaType: values.visaType
      };

      // Create the final data structure
      const finalData = {
        _id: visaData.data._id,  
        ...primaryTravelerData,
        subTravelers: []
      };

      console.log(finalData);

      // Helper function to handle document files
      // const handleDocumentFiles = (
      //   documents: Record<string, { file: File | null }> | undefined, 
      //   prefix: string
      // ) => {
      //   if (!documents) return;
      //   Object.entries(documents).forEach(([key, value]) => {
      //     if (value?.file instanceof File) {
      //       formData.append(`${prefix}_${key}`, value.file);
      //     }
      //   });
      // };

      // Handle primary traveler files
      // General Documents
      if (values.generalDocuments) {
        Object.entries(values.generalDocuments).forEach(([key, file]) => {
          if (file?.file instanceof File) {
            formData.append(`primaryTraveler_${key}`, file.file);
          }
        });
      }

      // Type guard to check if the visaType is valid
      const isValidVisaType = (visaType: string): visaType is VisaType => {
        return ['business', 'student', 'jobHolder', 'other'].includes(visaType);
      };

      // Handle visa type specific documents for primary traveler
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const documentTypes: Record<VisaType, any> = {
        business: values.businessDocuments,
        student: values.studentDocuments,
        jobHolder: values.jobHolderDocuments,
        other: values.otherDocuments
      } as const;

      if (isValidVisaType(values.visaType) && documentTypes[values.visaType]) {
        Object.entries(documentTypes[values.visaType]).forEach(([key, file]: [string, any]) => {
          if (file?.file instanceof File) {
            formData.append(`primaryTraveler_${visaData.data._id}_${key}`, file.file);
          }
        });
      }
      
      // Get sub travelers data
      for (let i = 0; i < subTravelers.length; i++) {
        const subTravelerId = subTravelers[i];
        const subTravelerForm = formMethodsRef.current.get(subTravelerId);
        if (subTravelerForm) {
          const subValues = subTravelerForm.getValues();
          const subTravelerMongoId = visaData.data.subTravelers[i]._id;
          
          // Add sub traveler data with _id
          const subTravelerData = {
            _id: subTravelerMongoId,  
            givenName: subValues.givenName,
            surname: subValues.surname,
            phone: subValues.phone,
            email: subValues.email,
            address: subValues.address,
            notes: subValues.notes,
            visaType: subValues.visaType
          };
          finalData.subTravelers.push(subTravelerData);

          // Handle general documents for sub traveler
          if (subValues.generalDocuments) {
            Object.entries(subValues.generalDocuments).forEach(([key, file]) => {
              if (file?.file instanceof File) {
                formData.append(`subTraveler_${subTravelerMongoId}_${key}`, file.file);
              }
            });
          }

          // Handle visa type specific documents for sub traveler
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const subTravelerDocs: Record<VisaType, any> = {
            business: subValues.businessDocuments,
            student: subValues.studentDocuments,
            jobHolder: subValues.jobHolderDocuments,
            other: subValues.otherDocuments
          } as const;

          if (isValidVisaType(subValues.visaType) && subTravelerDocs[subValues.visaType]) {
            Object.entries(subTravelerDocs[subValues.visaType]).forEach(([key, file]: [string, any]) => {
              if (file?.file instanceof File) {
                formData.append(`subTraveler_${subTravelerMongoId}_${key}`, file.file);
              }
            });
          }
        }
      }

      // Append the main data structure
      formData.append('data', JSON.stringify(finalData));

      // Log the FormData contents
      console.log('\n=== Data Structure ===');
      console.log(finalData);
      console.log('\n=== Files Being Sent ===');
      const formDataObject = Object.fromEntries(formData.entries());
      console.log('FormData as object:', formDataObject);
      console.log('=== End Files ===\n');


      // Call the mutation
      const result = await updateVisa({ id, data: formData });

      if (result) {
        toast.success('Visa information updated successfully');
        // router.push(`/travelers/${id}`);
      }

    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('An error occurred while updating visa information');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!visaData?.data) {
    return <div>No data found</div>;
  }

  return (
    <div className="w-full max-w-5xl mx-auto py-10">
      <div className="bg-white shadow-md rounded-lg overflow-hidden lg:px-28 px-0 pb-10 space-y-8">
        <TravelerFormSection
          key={`primary-${visaData.data._id}`}
          id={1}
          isFirst={true}
          onRemove={() => {}}
          onRegisterFormMethods={(methods) => handleRegisterFormMethods(1, methods)}
          defaultValues={visaData.data}
        />

        {subTravelers.map((id, index) => (
          <TravelerFormSection
            key={`sub-${visaData.data.subTravelers[index]._id}`}
            id={id}
            isFirst={false}
            onRemove={() => {}}
            onRegisterFormMethods={(methods) => handleRegisterFormMethods(id, methods)}
            defaultValues={visaData.data.subTravelers[index]}
          />
        ))}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={handleSubmitAll}
            disabled={isSubmitting}
            className="px-4 py-2 bg-secondary text-white rounded hover:bg-secondary/90 disabled:opacity-50"
          >
            {isSubmitting ? 'Updating...' : 'Update'}
          </button>
        </div>
      </div>
    </div>
  );
}
