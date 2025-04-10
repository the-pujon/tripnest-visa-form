import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import type { IVisaForm } from "@/interface/visaFormInterface";

export function TravelerBasicInfo() {
  const { register, formState: { errors } } = useFormContext<IVisaForm>();

  return (
    <>
      <div className="grid md:grid-cols-2 gap-4">
        <Input
          placeholder="Given Name (First Name & Middle Name)*"
          {...register("givenName")}
          error={errors.givenName?.message?.toString()}
        />
        <Input
          placeholder="Surname (Last Name)*"
          {...register("surname")}
          error={errors.surname?.message?.toString()}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Input
          placeholder="Phone Number 1*"
          type="tel"
          {...register("phone1")}
          error={errors.phone1?.message?.toString()}
        />
        
        <Input
          placeholder="Email*"
          type="email"
          {...register("email")}
          error={errors.email?.message?.toString()}
        />
         <Input
          placeholder="Phone Number 2*"
          type="tel"
          {...register("phone2")}
          error={errors.phone2?.message?.toString()}
        />
      </div>

      <Input
        placeholder="Current Address*"
        {...register("address")}
        error={errors.address?.message?.toString()}
      />

      <Input
        placeholder="Special Notes"
        {...register("notes")}
        error={errors.notes?.message?.toString()}
      />
    </>
  );
} 