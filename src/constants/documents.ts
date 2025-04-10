// import { number } from "zod";

export const GENERAL_DOCUMENTS = [
  {
    number: 1,
    label: "Passport Scanned Copy (JPG)*",
    name: "generalDocuments.passportCopy"
  },
  {
    number: 2,
    label: "Recent Passport Size Photo (3.5* 4.5mm) (JPG)*",
    name: "generalDocuments.passportPhoto"
  },
  {
    number: 3,
    label: "Bank Statement of the last 06 months (PDF)*",
    name: "generalDocuments.bankStatement"
  },
  {
    number: 4,
    label: "Bank Solvency Certificate (PDF)*",
    name: "generalDocuments.bankSolvency"
  },
  {
    number: 5,
    label: "Hotel Booking Copy",
    name: "generalDocuments.hotelBooking"
  },
  {
    number: 6,
    label: "Air Ticket Booking Copy",
    name: "generalDocuments.airTicket"
  },
  {
    number: 7,
    label: "Previous Visa Copy",
    name: "generalDocuments.previousVisa"
  },
  {
    number: 8,
    label: "Marriage Certificate or Nikahnama (if spouse's name is not on the applicant's passport)",
    name: "generalDocuments.marriageCertificate"
  }
];

export const BUSINESS_DOCUMENTS = [
  {
    number: 1,
    label: " Valid Trade license copy with notary public (English Translated)*",
    name: "businessDocuments.tradeLicense"
  },
  {
    number: 2,
    label: "Company Pad / Company Letter Head Pad. (For Businessperson)*",
    name: "businessDocuments.companyPad"
  },
  {
    number: 3,
    label: "Visiting Card",
    name: "businessDocuments.visitingCard"
  },
  {
    number: 4,
    label: "Memorandum for Limited Company. (For Business Person)",
    name: "businessDocuments.memorandum"
  }
];

export const STUDENT_DOCUMENTS = [
  {
    number: 1,
    label: "Student ID Card (For Student)*",
    name: "studentDocuments.studentId"
  },
  {
    number: 2,
    label: "Birth Certificate (Only for Child and infant) (For Student)",
    name: "studentDocuments.birthCertificate"
  },
  {
    number: 3,
    label: "Leave Letter from the EducationalInstitute. (For Student)",
    name: "studentDocuments.leaveLetter"
  }
  
];

export const JOB_HOLDER_DOCUMENTS = [
  {
    number: 1,
    label: "NOC Certificate*",
    name: "jobHolderDocuments.nocCertificate"
  },
  {
    number: 2,
    label: "Office ID card copy*",
    name: "jobHolderDocuments.officialId"
  },
   {
    number: 3,
    label: "Visiting Card Copy",
    name: "jobHolderDocuments.visitingCard"
  },
  {
    number: 4,
    label: "Salary Certificate",
    name: "jobHolderDocuments.salaryCertificate"
  },
  {
    number: 5,
    label: "BMDC Certificate of Doctors",
    name: "jobHolderDocuments.bmdcCertificate"
  },
  {
    number: 6,
    label: "Bar Council Certificate",
    name: "jobHolderDocuments.barCouncilCertificate"
  },
  {
    number: 7,
    label: "Notarized GO with an English translation (Govt. Employee)",
    name: "jobHolderDocuments.notarizedId"
  }
];



// Similar constants for other document types 