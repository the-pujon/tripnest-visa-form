"use client"

import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { travelerFormSchema } from "@/schemas/visaFormSchema"
import type { IVisaForm } from "@/interface/visaFormInterface"
import { FileUpload } from "@/components/form/file-upload"
import {  useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Title } from "@/components/ui/title"
// import { submitTravelForm } from "./app/actions"

const defaultFileUpload = { file: null, name: "", uploaded: false }

export default function TravelForm() {
  // const [showBusinessDocs, setShowBusinessDocs] = useState(false)
  // const [showStudentDocs, setShowStudentDocs] = useState(false)
  // const [showJobHolderDocs, setShowJobHolderDocs] = useState(false)

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
      businessDocuments: undefined,
      studentDocuments: undefined,
      jobHolderDocuments: undefined,
      otherDocuments: {
        marriageCertificate: defaultFileUpload,
      },
    },
  })

  const {
    formState: { isValid, errors },
    watch,
  } = methods

  const visaType = watch("visaType")
  const generalDocs = watch("generalDocuments")
  const businessDocs = watch("businessDocuments")
  const studentDocs = watch("studentDocuments")
  const jobHolderDocs = watch("jobHolderDocuments")

  useEffect(() => {
    // setShowBusinessDocs(visaType === "business")
    // setShowStudentDocs(visaType === "student")
    // setShowJobHolderDocs(visaType === "work")
  }, [visaType])

  const isFormValid = () => {
    const areGeneralDocsUploaded = Object.values(generalDocs).every((doc) => doc.uploaded)
    const areBusinessDocsUploaded =
      visaType === "business" ? Object.values(businessDocs || {}).every((doc) => doc.uploaded) : true
    const areStudentDocsUploaded =
      visaType === "student" ? Object.values(studentDocs || {}).every((doc) => doc.uploaded) : true
    const areJobHolderDocsUploaded =
      visaType === "work" ? Object.values(jobHolderDocs || {}).every((doc) => doc.uploaded) : true
    const areOtherDocsUploaded =
      visaType === "other"
        ? Object.values(methods.getValues("otherDocuments") || {}).every((doc) => doc.uploaded)
        : true

    return (
      isValid &&
      areGeneralDocsUploaded &&
      areBusinessDocsUploaded &&
      areStudentDocsUploaded &&
      areJobHolderDocsUploaded &&
      areOtherDocsUploaded
    )
  }

  const onSubmit = async (data: IVisaForm) => {
    console.log("here")
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

    // Reset all document sections
    methods.setValue("businessDocuments", undefined)
    methods.setValue("studentDocuments", undefined)
    methods.setValue("jobHolderDocuments", undefined)

    // Set appropriate document section based on visa type
    if (value === "business") {
      methods.setValue("businessDocuments", {
        tradeLicense: defaultFileUpload,
        notarizedId: defaultFileUpload,
        memorandum: defaultFileUpload,
        officePad: defaultFileUpload,
      })
    } else if (value === "student") {
      methods.setValue("studentDocuments", {
        studentId: defaultFileUpload,
        travelLetter: defaultFileUpload,
        birthCertificate: defaultFileUpload,
      })
    } else if (value === "work") {
      methods.setValue("jobHolderDocuments", {
        nocCertificate: defaultFileUpload,
        officialId: defaultFileUpload,
        bmdcCertificate: defaultFileUpload,
        barCouncilCertificate: defaultFileUpload,
        retirementCertificate: defaultFileUpload,
      })
    } else if (value === "other") {
      methods.setValue("otherDocuments", {
        // otherDocument: defaultFileUpload,
        marriageCertificate: defaultFileUpload,
      })
    }
  }

  return (
   <div className="w-full max-w-5xl mx-auto">
     <FormProvider {...methods}>
      <div className=" bg-white shadow-md rounded-lg overflow-hidden px-28">
        <div className="p-6">
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex items-center gap-4">
              <Title>Traveler 01 (Primary Contact)</Title>
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
                error={errors.givenName?.message?.toString()}
              />
              <Input
                placeholder="Surname (Last Name)*"
                {...methods.register("surname")}
                error={errors.surname?.message?.toString()}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Input
                placeholder="Phone Number*"
                type="tel"
                {...methods.register("phone")}
                error={errors.phone?.message?.toString()}
              />
              <Input
                placeholder="Email*"
                type="email"
                {...methods.register("email")}
                error={errors.email?.message?.toString()}
              />
            </div>

            <Input
              placeholder="Local Address*"
              {...methods.register("address")}
              error={errors.address?.message?.toString()}
            />

            <Input
              placeholder="Special Notes"
              {...methods.register("notes")}
              error={errors.notes?.message?.toString()}
            />
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 [&>option:hover]:bg-[#0066FF] [&>option:checked]:bg-[#0066FF]"
              onChange={handleVisaTypeChange}
              value={visaType}
            >
              <option value="">Select document type</option>
              <option value="work">Job Holder&apos;s Documents</option>
              <option value="business">Businessperson&apos;s Documents</option>
              <option value="student">Student&apos;s Documents</option>
              <option value="other">Other Documents</option>
            </select>

            <div className="space-y-4">
              <Title>General Documents (Mandatory for all E-Visa)</Title>
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

            {visaType === "business" && (
              <div className="space-y-4">
                <Title>Businessperson Documents</Title>
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

            {visaType === "student" && (
              <div className="space-y-4">
                <Title>Student&apos;s Document</Title>
                <div className="grid md:grid-cols-2 gap-6">
                  <FileUpload number={1} label="Student ID card copy (For Student)" name="studentDocuments.studentId" />
                  <FileUpload
                    number={2}
                    label="Travel Letter or Leave Letter from the Educational Institute"
                    name="studentDocuments.travelLetter"
                  />
                  <FileUpload
                    number={3}
                    label="Birth Certificate (Only for Child & infant)"
                    name="studentDocuments.birthCertificate"
                  />
                </div>
              </div>
            )}

            {visaType === "work" && (
              <div className="space-y-4">
                <Title>Job Holder&apos;s Document</Title>
                <div className="grid md:grid-cols-2 gap-6">
                  <FileUpload number={1} label="NOC Certificate" name="jobHolderDocuments.nocCertificate" />
                  <FileUpload number={2} label="Official ID card copy" name="jobHolderDocuments.officialId" />
                  <FileUpload
                    number={3}
                    label="BMDC certificate for Doctors"
                    name="jobHolderDocuments.bmdcCertificate"
                  />
                  <FileUpload
                    number={4}
                    label="BAR Council Certificate"
                    name="jobHolderDocuments.barCouncilCertificate"
                  />
                  <FileUpload
                    number={5}
                    label="Retirement certificate"
                    name="jobHolderDocuments.retirementCertificate"
                  />
                </div>
              </div>
            )}

            {visaType === "other" && (
              <div className="space-y-4">
                <Title>Other Documents</Title>
                <div className="grid md:grid-cols-2 gap-6">
                  <FileUpload
                    number={1}
                    label="Marriage Certificate or Nikahnama (if spouse's name is not on the applicant's passport)"
                    name="otherDocuments.marriageCertificate"
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

       
          </form>
        </div>
      </div>
    </FormProvider>
    <div className="pt-4 flex justify-center">
              <button
                type="submit"
                className={` self-center py-2 px-11 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary hover:bg-primary/70 transition-all duration-500 focus:outline-none focus:ring-0 focus:ring-offset-0 ${
                  !isFormValid() ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={!isFormValid()}
              >
                Submit All Documents
              </button>
            </div>
   </div>
  )
}

