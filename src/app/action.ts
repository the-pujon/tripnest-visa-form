"use server"

import { travelerFormSchema } from "@/schemas/visaFormSchema"
import type { IVisaForm } from "@/interface/visaFormInterface"

export async function submitTravelForm(data: IVisaForm) {
  const validatedData = travelerFormSchema.parse(data)

  // Create FormData instance
  const formData = new FormData()

  // Add form fields
  Object.entries(validatedData).forEach(([key, value]) => {
    if (key !== "generalDocuments" && key !== "businessDocuments") {
      formData.append(key, value as string)
    }
  })

  // Add general documents
  Object.entries(validatedData.generalDocuments).forEach(([key, value]) => {
    if (value.file) {
      formData.append(`generalDocuments.${key}`, value.file)
    }
  })

  // Add business documents if present
  if (validatedData.businessDocuments) {
    Object.entries(validatedData.businessDocuments).forEach(([key, value]) => {
      if (value.file) {
        formData.append(`businessDocuments.${key}`, value.file)
      }
    })
  }

  // Simulate API call
//   await new Promise((resolve) => setTimeout(resolve, 2000))

//   return { success: true }
console.log(formData)
}

