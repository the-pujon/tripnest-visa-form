"use client";
import { useDeleteSubTravelerMutation, useGetVisaByIdQuery } from "@/redux/features/visaApi";
import { useParams } from "next/navigation";
import React from "react";
import { FaFilePdf } from "react-icons/fa";
import Image from "next/image";
import toast from "react-hot-toast";
import Link from "next/link";

const TravelerDetails = () => {
  const { id } = useParams();
  const { data: visaData } = useGetVisaByIdQuery(id as string);
  const [deleteSub] = useDeleteSubTravelerMutation();
  const visa = visaData?.data;

  console.log(visaData)

  const DocumentLink = ({
    url,
    type,
  }: {
    url: string | undefined;
    type: "pdf" | "image";
  }) => {
    if (!url) return null;

    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="block">
        {type === "pdf" ? (
          <FaFilePdf className="text-red-500 text-3xl hover:text-red-600 transition-colors" />
        ) : (
          <div className="relative w-[100px] h-[100px]">
            <Image
              src={url}
              alt="Document"
              fill
              className="rounded-lg object-cover"
            />
          </div>
        )}
      </a>
    );
  };

  const DocumentSection = ({
    title,
    documents,
  }: {
    title: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    documents: any;
  }) => (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(documents || {}).map(
          ([key, value]: [string, unknown]) =>
            key !== "_id" && (
              <div key={key} className="p-4 bg-white rounded-lg shadow">
                <p className="text-sm font-medium mb-2 capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </p>
                <DocumentLink
                  url={(value as { url?: string })?.url}
                  type={
                    (value as { url?: string })?.url
                      ?.toLowerCase()
                      .includes(".pdf")
                      ? "pdf"
                      : "image"
                  }
                />
              </div>
            )
        )}
      </div>
    </div>
  );

  const TravelerInfo = ({
    traveler,
    isSubTraveler = false,
  }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    traveler: any;
    isSubTraveler?: boolean;
  }) => (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex justify-between items-start">
        <h2 className="text-2xl font-bold mb-4">
          {isSubTraveler ? "Sub Traveler" : "Main Traveler"} Information
        </h2>
        {isSubTraveler && (
        <div className="flex items-center">
          <Link href={`/travelers/${visa._id}/sub-traveler/${traveler._id}`} className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors mr-2">
            Edit
          </Link>
            <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            onClick={() => {
              deleteSub({ id: visa._id, subTravelerId: traveler._id });
              toast.success("Subtraveler Deleted succesfully ")
            }}
          >
            Delete
          </button>
        </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <p className="font-semibold">Name:</p>
          <p>
            {traveler.givenName} {traveler.surname}
          </p>
        </div>
        <div>
          <p className="font-semibold">Phone:</p>
          <p>{traveler.phone}</p>
        </div>
        <div>
          <p className="font-semibold">Email:</p>
          <p>{traveler.email}</p>
        </div>
        <div>
          <p className="font-semibold">Address:</p>
          <p>{traveler.address}</p>
        </div>
        <div>
          <p className="font-semibold">Visa Type:</p>
          <p className="capitalize">{traveler.visaType}</p>
        </div>
        <div>
          <p className="font-semibold">Notes:</p>
          <p>{traveler.notes}</p>
        </div>
      </div>

      <DocumentSection
        title="General Documents"
        documents={traveler.generalDocuments}
      />
      {traveler.otherDocuments &&
        Object.keys(traveler.otherDocuments).length > 0 && (
          <DocumentSection
            title="Other Documents"
            documents={traveler.otherDocuments}
          />
        )}

        {
          traveler.businessDocuments && (
            <DocumentSection
              title="Business Documents"
              documents={traveler.businessDocuments}
            />
          )
        }

        {
          traveler.studentDocuments && (
            <DocumentSection
              title="Student Documents"
              documents={traveler.studentDocuments}
            />
          )
        }

        {
          traveler.jobHolderDocuments && (
            <DocumentSection
              title="Job Holder Documents"
              documents={traveler.jobHolderDocuments}
            />
          )
        }
    </div>
  );

  if (!visa) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <TravelerInfo traveler={visa} />

      {visa.subTravelers && visa.subTravelers.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6">Sub Travelers</h2>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {visa.subTravelers.map((subTraveler: any, index: number) => (
           <div key={subTraveler._id}>
            <h2  className="text-lg font-medium mb-6">Sub Traveler {index + 1}</h2>
            <TravelerInfo
              key={index}
              traveler={subTraveler}
              isSubTraveler={true}
            />
           </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TravelerDetails;
