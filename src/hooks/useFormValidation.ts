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

        // console.log("values", values);
        const gnv = values.generalDocuments

        console.log("gnv", gnv?.airTicket);
        console.log(typeof gnv);
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

        const nonOptionalGeneralDocs = [
          'passportCopy',
          'passportPhoto',
          'bankStatement',
          'bankSolvency',
        ];

        const generalDocsValid = nonOptionalGeneralDocs.every((docName) => {
          const doc = values.generalDocuments?.[docName as keyof typeof values.generalDocuments];
          return doc && doc.uploaded && doc.file;
        });

        if (!generalDocsValid) return false;
        
        // Check specific documents based on visa type (non-optional fields for the selected visa type)
        let specificDocsValid = false;

        if (values.visaType === 'business') {
          const businessDocs = values.businessDocuments;
          const nonOptionalBusinessDocs = ['tradeLicense', 'companyPad']; // Required fields for business visa
          specificDocsValid = nonOptionalBusinessDocs.every((docName) => {
            const doc = businessDocs?.[docName as keyof typeof businessDocs];
            return doc && doc.uploaded && doc.file;
          });
        } else if (values.visaType === 'student') {
          const studentDocs = values.studentDocuments;
          const nonOptionalStudentDocs = ['studentId']; // Required fields for student visa
          specificDocsValid = nonOptionalStudentDocs.every((docName) => {
            const doc = studentDocs?.[docName as keyof typeof studentDocs];
            return doc && doc.uploaded && doc.file;
          });
        } else if (values.visaType === 'jobHolder') {
          const jobHolderDocs = values.jobHolderDocuments;
          const nonOptionalJobHolderDocs = ['nocCertificate', 'officialId']; // Required fields for job holder visa
          specificDocsValid = nonOptionalJobHolderDocs.every((docName) => {
            const doc = jobHolderDocs?.[docName as keyof typeof jobHolderDocs];
            return doc && doc.uploaded && doc.file;
          });
        }

        if (!specificDocsValid) return false;

        // // Create a new form values object to avoid mutating the original
        const updatedValues = { ...values };

        // // Clear other document types
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