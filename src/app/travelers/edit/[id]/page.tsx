"use client";

import { UseFormReturn } from "react-hook-form";
import type { IVisaForm, VisaType } from "@/interface/visaFormInterface";
import {useState, useRef, useCallback, useEffect } from "react";
import { TravelerFormSection } from "@/components/form/TavelerFormSection";
import toast from "react-hot-toast";
import { useGetVisaByIdQuery, useUpdatePrimaryTravelerMutation } from "@/redux/features/visaApi";
import { useParams, useRouter } from "next/navigation";
import { removeEmptyFields } from "@/lib/utils";

export default function EditTravelForm() {
  const { id } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    } else {
      // Ensure at least one sub-traveler form is available
      setSubTravelers([2]);
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
      


      // Prepare primary traveler data maintaining the same structure
      const finalData = removeEmptyFields({
        _id: visaData?.data?._id || '',
        givenName: values.givenName,
        surname: values.surname,
        phone: values.phone,
        email: values.email,
        address: values.address,
        notes: values.notes,
        visaType: values.visaType,
        generalDocuments: { ...(visaData?.data?.generalDocuments || {}) },
        businessDocuments: { ...(visaData?.data?.businessDocuments || {}) },
        studentDocuments: { ...(visaData?.data?.studentDocuments || {}) },
        jobHolderDocuments: { ...(visaData?.data?.jobHolderDocuments || {}) },
        otherDocuments: { ...(visaData?.data?.otherDocuments || {}) },
        createdAt: visaData?.data?.createdAt,
        updatedAt: visaData?.data?.updatedAt,
        __v: visaData?.data?.__v,
        subTravelers: []
      });

      // Handle primary traveler files
      if (values.generalDocuments) {
        Object.entries(values.generalDocuments).forEach(([key, file]) => {
          if (file?.file instanceof File) {
            formData.append(`primaryTraveler_${key}`, file.file);
            // Remove the existing file data since we're uploading a new one
            if (finalData.generalDocuments?.[key]) {
              delete finalData.generalDocuments[key];
            }
          }
        });
      }

      // Type guard to check if the visaType is valid
      const isValidVisaType = (visaType: string): visaType is VisaType => {
        return ['business', 'student', 'jobHolder', 'other'].includes(visaType);
      };

      // Handle visa type specific documents for primary traveler
      if (isValidVisaType(values.visaType)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const documentTypes: Record<VisaType, any> = {
          business: values.businessDocuments,
          student: values.studentDocuments,
          jobHolder: values.jobHolderDocuments,
          other: values.otherDocuments,
          '': undefined
        } as const;

        const documentTypeKeys: Record<VisaType, string> = {
          business: 'businessDocuments',
          student: 'studentDocuments',
          jobHolder: 'jobHolderDocuments',
          other: 'otherDocuments',
          '': ''
        };

        if (documentTypes[values.visaType]) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          Object.entries(documentTypes[values.visaType]).forEach(([key, file]: [string, any]) => {
            if (file?.file instanceof File) {
              formData.append(`primaryTraveler_${key}`, file.file);
              // Remove the existing file data since we're uploading a new one
              if (finalData[documentTypeKeys[values.visaType]]?.[key]) {
                delete finalData[documentTypeKeys[values.visaType]][key];
              }
              // Remove the document collection if it's empty
              if (finalData[documentTypeKeys[values.visaType]] && Object.keys(finalData[documentTypeKeys[values.visaType]]).length === 0) {
                delete finalData[documentTypeKeys[values.visaType]];
              }
            }
          });
        }
      }
      
      // Get sub travelers data
      const submittedSubTravelers = [];
      const newTravelers = [];
      let newTravelerCounter = 1;

      for (let i = 0; i < subTravelers.length; i++) {
        const subTravelerId = subTravelers[i];
        const subTravelerForm = formMethodsRef.current.get(subTravelerId);
        if (subTravelerForm) {
          const subValues = subTravelerForm.getValues();
          
          // Check if this is a new sub-traveler or an existing one
          const originalSubTraveler = visaData?.data?.subTravelers?.[i];
          
          // Generate new traveler id if it's a new sub-traveler
          const newTravelerId = originalSubTraveler ? null : `new${newTravelerCounter}`;
          
          // Create sub traveler data maintaining the same structure
          const subTravelerData = removeEmptyFields({
            // If it's a new sub-traveler, include the new id
            ...(originalSubTraveler ? { _id: originalSubTraveler._id } : { id: newTravelerId }),
            givenName: subValues.givenName,
            surname: subValues.surname,
            phone: subValues.phone,
            email: subValues.email,
            address: subValues.address,
            notes: subValues.notes,
            visaType: subValues.visaType,
            generalDocuments: originalSubTraveler 
              ? { ...(originalSubTraveler.generalDocuments || {}) } 
              : {},
            businessDocuments: originalSubTraveler 
              ? { ...(originalSubTraveler.businessDocuments || {}) } 
              : {},
            studentDocuments: originalSubTraveler 
              ? { ...(originalSubTraveler.studentDocuments || {}) } 
              : {},
            jobHolderDocuments: originalSubTraveler 
              ? { ...(originalSubTraveler.jobHolderDocuments || {}) } 
              : {},
            otherDocuments: originalSubTraveler 
              ? { ...(originalSubTraveler.otherDocuments || {}) } 
              : {},
            ...(originalSubTraveler 
              ? { 
                  createdAt: originalSubTraveler.createdAt,
                  updatedAt: originalSubTraveler.updatedAt 
                } 
              : {})
          });

          // Handle sub traveler general documents
          if (subValues.generalDocuments) {
            Object.entries(subValues.generalDocuments).forEach(([key, file]) => {
              if (file?.file instanceof File) {
                // Use the appropriate identifier
                const subTravelerIdentifier = originalSubTraveler 
                  ? originalSubTraveler._id 
                  : newTravelerId;
                
                formData.append(`subTraveler_${subTravelerIdentifier}_${key}`, file.file);
                
                // Remove the existing file data since we're uploading a new one
                if (subTravelerData.generalDocuments?.[key]) {
                  delete subTravelerData.generalDocuments[key];
                }
                
                // Remove the document collection if it's empty
                if (subTravelerData.generalDocuments && Object.keys(subTravelerData.generalDocuments).length === 0) {
                  delete subTravelerData.generalDocuments;
                }
              }
            });
          }

          // Handle visa type specific documents for sub traveler
          if (isValidVisaType(subValues.visaType)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const subTravelerDocs: Record<VisaType, any> = {
              business: subValues.businessDocuments,
              student: subValues.studentDocuments,
              jobHolder: subValues.jobHolderDocuments,
              other: subValues.otherDocuments,
              '': undefined
            } as const;

            const documentTypeKeys: Record<VisaType, string> = {
              business: 'businessDocuments',
              student: 'studentDocuments',
              jobHolder: 'jobHolderDocuments',
              other: 'otherDocuments',
              '': ''
            };

            if (subTravelerDocs[subValues.visaType]) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              Object.entries(subTravelerDocs[subValues.visaType]).forEach(([key, file]: [string, any]) => {
                if (file?.file instanceof File) {
                  // Use the appropriate identifier
                  const subTravelerIdentifier = originalSubTraveler 
                    ? originalSubTraveler._id 
                    : newTravelerId;
                  
                  formData.append(`subTraveler_${subTravelerIdentifier}_${key}`, file.file);
                  
                  // Remove the existing file data since we're uploading a new one
                  if (subTravelerData[documentTypeKeys[subValues.visaType]]?.[key]) {
                    delete subTravelerData[documentTypeKeys[subValues.visaType]][key];
                  }
                  
                  // Remove the document collection if it's empty
                  if (subTravelerData[documentTypeKeys[subValues.visaType]] && Object.keys(subTravelerData[documentTypeKeys[subValues.visaType]]).length === 0) {
                    delete subTravelerData[documentTypeKeys[subValues.visaType]];
                  }
                }
              });
            }
          }

          // Separate existing and new sub-travelers
          if (originalSubTraveler) {
            submittedSubTravelers.push(subTravelerData);
          } else {
            newTravelers.push(subTravelerData);
            newTravelerCounter++; // Increment counter for next new traveler
          }
        }
      }

      // Update the final data to include sub-travelers
      finalData.subTravelers = submittedSubTravelers;

      // Append new travelers to formData
      if (newTravelers.length > 0) {
        formData.append('newTraveler', JSON.stringify(newTravelers));
      }

      console.log('=== Final Data ===');
      console.log(finalData);
      console.log('=== New Travelers ===');
      console.log(newTravelers);
      console.log('=== End Data ===\n');

      // Append the main data structure
      formData.append('data', JSON.stringify(finalData));

      // Log the FormData contents
      console.log('\n=== Data Structure ===');
      console.log(finalData);
      console.log('\n=== Files Being Sent ===');
      const formDataObject = Object.fromEntries(formData.entries());
      // console.log('FormData as object:', JSON.parse(formDataObject.data));
      console.log(formDataObject);
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

  const handleAddSubTraveler = () => {
    const newSubTravelerId = subTravelers.length > 0 
      ? Math.max(...subTravelers) + 1 
      : 2;
    setSubTravelers([...subTravelers, newSubTravelerId]);
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
            key={`sub-${visaData.data.subTravelers?.[index]?._id || id}`}
            id={id}
            isFirst={false}
            onRemove={() => {}}
            onRegisterFormMethods={(methods) => handleRegisterFormMethods(id, methods)}
            defaultValues={visaData.data.subTravelers?.[index] || {}}
          />
        ))}

        <div className="mt-4">
        <button
            type="button"
            className="text-[#FF6B00] hover:text-[#FF6B00]/80 font-semibold pl-5"
            onClick={handleAddSubTraveler}
          >
            + Add Traveler
          </button>
        </div>

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
