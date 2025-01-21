import * as z from "zod"

const fileUploadSchema = z.object({
  file: z.any().nullable(),
  name: z.string(),
  uploaded: z.boolean(),
  uploadTime: z.string().optional(),
})

const generalDocumentsSchema = z.object({
  passportCopy: fileUploadSchema,
  passportPhoto: fileUploadSchema,
  bankStatement: fileUploadSchema,
  bankSolvency: fileUploadSchema,
  visitingCard: fileUploadSchema,
  hotelBooking: fileUploadSchema,
  airTicket: fileUploadSchema,
})

const businessDocumentsSchema = z.object({
  tradeLicense: fileUploadSchema,
  notarizedId: fileUploadSchema,
  memorandum: fileUploadSchema,
  officePad: fileUploadSchema,
})

export const travelerFormSchema = z.object({
  givenName: z.string().min(1, "Given name is required"),
  surname: z.string().min(1, "Surname is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(1, "Address is required"),
  notes: z.string(),
  visaType: z.string().min(1, "Visa type is required"),
  generalDocuments: generalDocumentsSchema,
  businessDocuments: businessDocumentsSchema.optional(),
})

