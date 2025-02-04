"use client";

import { useForm, UseFormReturn } from "react-hook-form";
import type { IVisaForm } from "@/interface/visaFormInterface";
import { useEffect, useState, useRef, useCallback } from "react";
import { TravelerFormSection } from "@/components/form/TavelerFormSection";
import { useFormValidation } from "@/hooks/useFormValidation";
import toast from "react-hot-toast";
import { useGetSubTravelerByIdQuery, useGetVisaByIdQuery, useUpdateSubTravelerMutation, useUpdateVisaMutation } from "@/redux/features/visaApi";
import { useParams, useRouter } from "next/navigation";

export default function UpdateSubTravelForm() {
  const { id, subT_id } = useParams();
  console.log(id, subT_id);
  const router = useRouter();
  const formMethodsRef = useRef<Map<number, UseFormReturn<IVisaForm>>>(new Map());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: visaData, isLoading } = useGetSubTravelerByIdQuery({ id: id as string, subTravelerId: subT_id as string });
  const [updateSubTraveler] = useUpdateSubTravelerMutation();

  console.log(visaData);

  const handleRegisterFormMethods = useCallback(
    (id: number, methods: UseFormReturn<IVisaForm> | null) => {
      console.log('Registering form methods for ID:', id, methods ? 'with methods' : 'null');
      if (methods) {
        formMethodsRef.current.set(id, methods);
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
      console.log('Form values:', values);

      // Send all form data as update
      formData.append('data', JSON.stringify({
        givenName: values.givenName,
        surname: values.surname,
        phone: values.phone,
        email: values.email,
        address: values.address,
        notes: values.notes,
        visaType: values.visaType
      }));

      // Handle document files if they exist
      const documentTypes = ['generalDocuments', 'businessDocuments', 'studentDocuments', 'jobHolderDocuments', 'otherDocuments'];
      documentTypes.forEach(docType => {
        const documents = values[docType];
        if (documents) {
          Object.entries(documents).forEach(([key, value]) => {
            if (value?.file) {
              formData.append(`subTraveler_${key}`, value.file);
            }
          });
        }
      });

      console.log('Sending update with:', Object.fromEntries(formData.entries()));

      const response = await updateSubTraveler({ 
        id: id as string, 
        subTravelerId: subT_id as string,
        data: formData 
      }).unwrap();
      
      if (response.success) {
        toast.success('Updated successfully');
        // router.back();
      }
    } catch (error: any) {
      console.error('Update error:', error);
      toast.error(error?.data?.message || 'Something went wrong');
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
    <div className="container mx-auto py-8">
      <div className="space-y-8">
        <TravelerFormSection
          key={1}
          id={1}
          isFirst={true}
          onRemove={() => {}}
          onRegisterFormMethods={(methods) => handleRegisterFormMethods(1, methods)}
          defaultValues={visaData.data}
        />
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={handleSubmitAll}
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isSubmitting ? 'Updating...' : 'Update'}
          </button>
        </div>
      </div>
    </div>
  );
}



// export const SubTravelerUpdate = () => {
  
//   return (
//     <div>
//       sub traveler update
//     </div>
//   )
// }