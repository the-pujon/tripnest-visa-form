"use client"

import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FileUpload } from "@/components/form/file-upload"
import { useState, useEffect } from "react"
import { IVisaForm } from "@/interface/visaFormInterface"
import { travelerFormSchema } from "@/schemas/visaFormSchema"
import { Input } from "@/components/ui/input"

const defaultFileUpload = { file: null, name: "", uploaded: false }

export default function TravelForm() {
  const [showBusinessDocs, setShowBusinessDocs] = useState(false)

  const methods = useForm<IVisaForm>({
    resolver: zodResolver(travelerFormSchema),
    mode: "onChange",
    defaultValues: {
      givenName: "",
      surname: "",
      phone: "",
      email: "",
      address: "",
      notes: "",
      visaType: "",
      generalDocuments: {
        passportCopy: defaultFileUpload,
        passportPhoto: defaultFileUpload,
        bankStatement: defaultFileUpload,
        bankSolvency: defaultFileUpload,
        visitingCard: defaultFileUpload,
        hotelBooking: defaultFileUpload,
        airTicket: defaultFileUpload,
      },
      businessDocuments: showBusinessDocs
        ? {
            tradeLicense: defaultFileUpload,
            notarizedId: defaultFileUpload,
            memorandum: defaultFileUpload,
            officePad: defaultFileUpload,
          }
        : undefined,
    },
  })

  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    formState: { isValid, errors },
    watch,
  } = methods

  const visaType = watch("visaType")
  const generalDocs = watch("generalDocuments")
  const businessDocs = watch("businessDocuments")

  useEffect(() => {
    setShowBusinessDocs(visaType === "business")
  }, [visaType])

  const isFormValid = () => {
    const areGeneralDocsUploaded = Object.values(generalDocs).every((doc) => doc.uploaded)
    const areBusinessDocsUploaded = showBusinessDocs
      ? Object.values(businessDocs || {}).every((doc) => doc.uploaded)
      : true
    return isValid && areGeneralDocsUploaded && areBusinessDocsUploaded
  }

  const onSubmit = async (data: IVisaForm) => {
    console.log(data)
    // try {
    //   await submitTravelForm(data)
    //   alert("Your travel form has been submitted successfully.")
    // } catch (error) {
    //   alert("Something went wrong. Please try again.")
    // }
  }

  const handleVisaTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    methods.setValue("visaType", value)
    setShowBusinessDocs(value === "business")
    if (value === "business") {
      methods.setValue("businessDocuments", {
        tradeLicense: defaultFileUpload,
        notarizedId: defaultFileUpload,
        memorandum: defaultFileUpload,
        officePad: defaultFileUpload,
      })
    } else {
      methods.setValue("businessDocuments", undefined)
    }
  }

  return (
    <FormProvider {...methods}>
      <div className="w-full max-w-3xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-medium text-[#008299]">Traveler 01 (Primary Contact)</h2>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="myself" className="rounded text-orange-500 focus:ring-orange-500" />
                <label htmlFor="myself" className="text-sm text-gray-600">
                  Myself
                </label>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Input
                placeholder="Given Name (First Name & Middle Name)*"
                {...methods.register("givenName")}
                error={errors.givenName?.message}
              />
              <Input
                placeholder="Surname (Last Name)*"
                {...methods.register("surname")}
                error={errors.surname?.message}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Input
                placeholder="Phone Number*"
                type="tel"
                {...methods.register("phone")}
                error={errors.phone?.message}
              />
              <Input
                placeholder="Email*"
                type="email"
                {...methods.register("email")}
                error={errors.email?.message}
              />
            </div>

            <Input
              placeholder="Local Address*"
              {...methods.register("address")}
              error={errors.address?.message}
            />

            <Input
              placeholder="Special Notes"
              {...methods.register("notes")}
              error={errors.notes?.message}
            />

            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
              onChange={handleVisaTypeChange}
            >
              <option value="">Choose your visa type</option>
              <option value="tourist">Tourist Visa</option>
              <option value="business">Business Visa</option>
              <option value="student">Student Visa</option>
              <option value="work">Work Visa</option>
            </select>

            <div className="space-y-4">
              <h3 className="text-[#008299] font-medium">General Documents (Mandatory for all E-Visa)</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <FileUpload number={1} label="Passport Scanned Copy" name="generalDocuments.passportCopy" />
                <FileUpload number={2} label="Recent Passport Size Photo" name="generalDocuments.passportPhoto" />
                <FileUpload
                  number={3}
                  label="Bank Statement of the last 06 months"
                  name="generalDocuments.bankStatement"
                />
                <FileUpload number={4} label="Bank Solvency Certificate" name="generalDocuments.bankSolvency" />
                <FileUpload number={5} label="Visiting Card Copy" name="generalDocuments.visitingCard" />
                <FileUpload number={6} label="Hotel Booking Copy" name="generalDocuments.hotelBooking" />
                <FileUpload number={7} label="Air Ticket Booking Copy" name="generalDocuments.airTicket" />
              </div>
            </div>

            {showBusinessDocs && (
              <div className="space-y-4">
                <h3 className="text-[#008299] font-medium">Businessperson Documents</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <FileUpload
                    number={1}
                    label="Valid Trade license copy with notary public (English Translation)"
                    name="businessDocuments.tradeLicense"
                  />
                  <FileUpload
                    number={2}
                    label="Notarized ID with an English translation (Govt. Employee)"
                    name="businessDocuments.notarizedId"
                  />
                  <FileUpload
                    number={3}
                    label="Memorandum for Limited Company (For Businessperson)"
                    name="businessDocuments.memorandum"
                  />
                  <FileUpload
                    number={4}
                    label="Office Pad / Company Letter Head Pad (For Businessperson)"
                    name="businessDocuments.officePad"
                  />
                </div>
              </div>
            )}

            <button
              type="button"
              className="text-[#FF6B00] hover:text-[#FF6B00]/80 font-medium"
              onClick={() => {
                // Handle add traveler logic
              }}
            >
              + Add Traveler
            </button>

            <div className="pt-4">
              <button
                type="submit"
                className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-[#FF6B00] bg-[#F4B69C]/20 hover:bg-[#F4B69C]/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F4B69C] ${
                  !isFormValid() ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={!isFormValid()}
              >
                Submit All Documents
              </button>
            </div>
          </form>
        </div>
      </div>
    </FormProvider>
  )
}

