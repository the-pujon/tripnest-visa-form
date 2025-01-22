"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { travelerFormSchema } from "@/schemas/visaFormSchema";
import type { IVisaForm } from "@/interface/visaFormInterface";
import { FileUpload } from "@/components/form/file-upload";
import { useState } from "react";
// import { submitTravelForm } from "@/app/action";
// import { useToast } from "@/hooks/use-toast";

const defaultFileUpload = { file: null, name: "", uploaded: false };

export default function TravelForm() {
  const [showBusinessDocs, setShowBusinessDocs] = useState(false);
  // const { toast } = useToast();

  const methods = useForm<IVisaForm>({
    resolver: zodResolver(travelerFormSchema),
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
  });

  const onSubmit = async (data: IVisaForm) => {
    console.log(data);
    // try {
    //   await submitTravelForm(data)
    //   toast({
    //     title: "Success",
    //     description: "Your travel form has been submitted successfully.",
    //   })
    // // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // } catch (error) {
    //   toast({
    //     title: "Error",
    //     description: "Something went wrong. Please try again.",
    //     variant: "destructive",
    //   })
    // }
  };

  const handleVisaTypeChange = (value: string) => {
    methods.setValue("visaType", value);
    setShowBusinessDocs(value === "business");
    if (value === "business") {
      methods.setValue("businessDocuments", {
        tradeLicense: defaultFileUpload,
        notarizedId: defaultFileUpload,
        memorandum: defaultFileUpload,
        officePad: defaultFileUpload,
      });
    } else {
      methods.setValue("businessDocuments", undefined);
    }
  };
  const isFormValid = () => {
    const areGeneralDocsUploaded = Object.values(methods.getValues("generalDocuments")).every((doc) => doc.uploaded)
    const areBusinessDocsUploaded = showBusinessDocs
      ? Object.values(methods.getValues("businessDocuments") || {}).every((doc) => doc.uploaded)
      : true
    return areGeneralDocsUploaded && areBusinessDocsUploaded
  }

  return (
    <div className="w-full max-w-5xl mx-auto container">
      <FormProvider {...methods}>
        <div className="px-[100px] py-[10px] rounded mt-10 border-2">
          <div className="p-6">
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className="space-y-6"
              id="visa-form"
            >
              <div className="flex items-center gap-4">
                <h2 className="text-base font-bold text-primary">
                  Traveler 01 (Primary Contact)
                </h2>
                <div className="flex items-center gap-2">
                  <Checkbox id="myself" className="border-secondary data-[state=checked]:bg-transparent data-[state=checked]:text-secondary" />
                  <label
                    htmlFor="myself"
                    className="text-sm text-muted-foreground"
                  >
                    Myself
                  </label>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  placeholder="Given Name (First Name & Middle Name)*"
                  {...methods.register("givenName")}
                />
                <Input
                  placeholder="Surname (Last Name)*"
                  {...methods.register("surname")}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  placeholder="Phone Number*"
                  type="tel"
                  {...methods.register("phone")}
                />
                <Input
                  placeholder="Email*"
                  type="email"
                  {...methods.register("email")}
                />
              </div>

              <Input
                placeholder="Local Address*"
                {...methods.register("address")}
              />

              <Input
                placeholder="Special Notes"
                {...methods.register("notes")}
              />

              <Select onValueChange={handleVisaTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose your visa type" />
                </SelectTrigger>
                <SelectContent >
                  <SelectItem value="tourist">Tourist Visa</SelectItem>
                  <SelectItem value="business">Business Visa</SelectItem>
                  <SelectItem value="student">Student Visa</SelectItem>
                  <SelectItem value="work">Work Visa</SelectItem>
                </SelectContent>
              </Select>

              

              <div className="space-y-4">
                <h3 className="text-primary font-bold ">
                  General Documents (Mandatory for all E-Visa)
                </h3>
                <div className="grid md:grid-cols-2 gap-x-24 gap-y-9">
                  <FileUpload
                    number={1}
                    label="Passport Scanned Copy"
                    name="generalDocuments.passportCopy"
                  />
                  <FileUpload
                    number={2}
                    label="Recent Passport Size Photo"
                    name="generalDocuments.passportPhoto"
                  />
                  <FileUpload
                    number={3}
                    label="Bank Statement of the last 06 months"
                    name="generalDocuments.bankStatement"
                  />
                  <FileUpload
                    number={4}
                    label="Bank Solvency Certificate"
                    name="generalDocuments.bankSolvency"
                  />
                  <FileUpload
                    number={5}
                    label="Visiting Card Copy"
                    name="generalDocuments.visitingCard"
                  />
                  <FileUpload
                    number={6}
                    label="Hotel Booking Copy"
                    name="generalDocuments.hotelBooking"
                  />
                  <FileUpload
                    number={7}
                    label="Air Ticket Booking Copy"
                    name="generalDocuments.airTicket"
                  />
                </div>
              </div>

              {showBusinessDocs && (
                <div className="space-y-4">
                  <h3 className="text-primary font-bold">
                    Businessperson Documents
                  </h3>
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

              <Button
                type="button"
                variant="link"
                className="text-orange-500 hover:text-orange-600 p-0 h-auto font-medium"
                onClick={() => {
                  // Handle add traveler logic
                }}
              >
                + Add Traveler
              </Button>
            </form>
          </div>
        </div>
      </FormProvider>
      <div className="pt-4 flex justify-center">
        <Button
          type="submit"
          className="w-fit px-10 py-2 self-center bg-secondary hover:bg-secondary/70 transition-all duration-300 disabled:bg-secondary/50 disabled:text-black font-medium disabled:cursor-not-allowed"
          size="lg"
          form="visa-form"
          disabled={!isFormValid()}
        >
          Submit All Documents
        </Button>
      </div>
    </div>
  );
}
