// import { useCallback } from 'react';
// import type { IVisaForm } from '@/interface/visaFormInterface';
// import type { UseFormReturn } from 'react-hook-form';

import { IVisaForm } from "@/interface/visaFormInterface";
import { useCallback } from "react";
import { UseFormReturn } from "react-hook-form";

type VisaType = 'business' | 'student' | 'jobHolder' ;
type DocumentField = `${VisaType}Documents`;

export const useFormValidation = () => {
  const isFormValid = useCallback(async (forms: UseFormReturn<IVisaForm>[]) => {
    try {
      if (forms.length === 0) return false;

      for (const methods of forms) {
        const values = methods.getValues();

        console.log("values", values);
        const gnv = values.generalDocuments

        console.log("gnv", gnv);
        // Check if the form is empty

        // Basic field validation
        if (
          !values.givenName?.trim() ||
          !values.surname?.trim() ||
          !values.phone1?.trim() ||
          !values.phone2?.trim() ||
          !values.email?.trim() ||
          !values.address?.trim() ||
          !values.visaType
        ) {
          return false;
        }

        // Check general documents
        const generalDocsValid = Object.values(values.generalDocuments!).every(
          (doc) => {
            // if(gnv !== "marriageCertificate"){
              
            // }
            return doc && doc.uploaded && doc.file;
          }
        );
        if (!generalDocsValid) return false;

        // Check specific documents based on visa type
        const specificDocsValid = (() => {
          const docs = values[`${values.visaType}Documents` as DocumentField];
          return docs && Object.values(docs).every((doc) => doc && doc.uploaded && doc.file);
        })();
        if (!specificDocsValid) return false;

        // Create a new form values object to avoid mutating the original
        const updatedValues = { ...values };

        // Clear other document types
        const visaTypes: VisaType[] = ['business', 'student', 'jobHolder'];
        visaTypes.forEach((type) => {
          if (type !== values.visaType) {
            const fieldName = `${type}Documents` as DocumentField;
            delete updatedValues[fieldName];
          }
        });

        methods.reset(updatedValues);
      }

      return true;
    } catch (error) {
      console.error('Validation error:', error);
      return false;
    }
  }, []);

  return { isFormValid };
};



// export const useFormValidation = () => {
//   const isFormValid = useCallback(async (forms: UseFormReturn<IVisaForm>[]) => {
//     try {
//       if (forms.length === 0) return false;

//       for (const methods of forms) {
//         const values = methods.getValues();

//         // Basic field validation
//         const requiredFields = [
//           { field: 'givenName', label: 'Given Name' },
//           { field: 'surname', label: 'Surname' },
//           { field: 'phone1', label: 'Phone 1' },
//           { field: 'phone2', label: 'Phone 2' },
//           { field: 'email', label: 'Email' },
//           { field: 'address', label: 'Address' },
//           { field: 'visaType', label: 'Visa Type' },
//         ];

//         for (const { field, label } of requiredFields) {
//           if (!values[field]?.trim()) {
//             console.log(`Field "${label}" is not filled.`);
//             return false;
//           }
//         }

//         // Check general documents
//         const generalDocsValid = Object.values(values.generalDocuments!).every(
//           (doc) => doc && doc.uploaded && doc.file
//         );
//         if (!generalDocsValid) {
//           console.log("General documents are not fully uploaded or valid.");
//           return false;
//         }

//         // Check specific documents based on visa type
//         const docs = values[`${values.visaType}Documents` as DocumentField];
//         const specificDocsValid = docs && Object.values(docs).every((doc) => doc && doc.uploaded && doc.file);
//         if (!specificDocsValid) {
//           console.log(`Specific documents for visa type ${values.visaType} are not fully uploaded or valid.`);
//           return false;
//         }

//         // Create a new form values object to avoid mutating the original
//         const updatedValues = { ...values };

//         // Clear other document types
//         const visaTypes: VisaType[] = ['business', 'student', 'jobHolder'];
//         visaTypes.forEach((type) => {
//           if (type !== values.visaType) {
//             const fieldName = `${type}Documents` as DocumentField;
//             delete updatedValues[fieldName];
//           }
//         });

//         methods.reset(updatedValues);
//       }

//       return true;
//     } catch (error) {
//       console.error('Validation error:', error);
//       return false;
//     }
//   }, []);

//   return { isFormValid };
// };
