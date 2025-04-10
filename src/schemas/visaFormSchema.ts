import * as z from "zod"

const fileUploadSchema = z.object({
  file: z.any().nullable(),
  name: z.string(),
  uploaded: z.boolean(),
  uploadTime: z.string().optional(),
  size: z
    .object({
      current: z.number(),
      total: z.number(),
    })
    .optional(),
}).optional()

const generalDocumentsSchema = z.object({
  passportCopy: fileUploadSchema,
  passportPhoto: fileUploadSchema,
  bankStatement: fileUploadSchema,
  bankSolvency: fileUploadSchema,
  hotelBooking: fileUploadSchema.optional(),
  airTicket: fileUploadSchema.optional(),
  previousVisa: fileUploadSchema.optional(),
  marriageCertificate: fileUploadSchema.optional(),
}).optional()

const businessDocumentsSchema = z.object({
  tradeLicense: fileUploadSchema,
  memorandum: fileUploadSchema,
  companyPad: fileUploadSchema,
  visitingCard: fileUploadSchema,
}).optional()

const studentDocumentsSchema = z.object({
  studentId: fileUploadSchema,
  leaveLetter: fileUploadSchema,
  birthCertificate: fileUploadSchema,
}).optional()

const jobHolderDocumentsSchema = z.object({
  nocCertificate: fileUploadSchema,
  officialId: fileUploadSchema,
  bmdcCertificate: fileUploadSchema,
  barCouncilCertificate: fileUploadSchema,
  retirementCertificate: fileUploadSchema,
  visitingCard: fileUploadSchema,
  salaryCertificate: fileUploadSchema,
  notarizedId: fileUploadSchema,
}).optional()


export const travelerFormSchema = z.object({
  givenName: z.string().min(1, "Given name is required"),
  surname: z.string().min(1, "Surname is required"),
  phone1: z.string().min(1, "Phone number is required"),
  phone2: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(1, "Address is required"),
  notes: z.string(),
  visaType: z.string().min(1, "Visa type is required"),
  generalDocuments: generalDocumentsSchema,
  businessDocuments: businessDocumentsSchema.optional(),
  studentDocuments: studentDocumentsSchema.optional(),
  jobHolderDocuments: jobHolderDocumentsSchema.optional(),
})
