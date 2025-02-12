"use client";

import { IVisaForm } from "@/interface/visaFormInterface";
import { useDeleteVisaMutation, useGetVisaQuery } from "@/redux/features/visaApi";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaEye, FaTrash, FaPencilAlt, FaCheck, FaTimes } from "react-icons/fa";

interface GeneralDocuments {
  passportCopy?: { url: string };
  passportPhoto?: { url: string };
  bankStatement?: { url: string };
  bankSolvency?: { url: string };
  visitingCard?: { url: string };
  hotelBooking?: { url: string };
  airTicket?: { url: string };
}

interface Traveler {
  _id: string;
  givenName: string;
  surname: string;
  email: string;
  phone: string;
  visaType: string;
  generalDocuments: GeneralDocuments;
  subTravelers: IVisaForm[];
}

export default function TravelersPage() {
  const { data, isLoading } = useGetVisaQuery(undefined);
  const [deleteVisa] = useDeleteVisaMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTravelerId, setSelectedTravelerId] = useState<string | null>(null);

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTravelerId(null);
  };

  const openDeleteModal = (id: string) => {
    setSelectedTravelerId(id);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#FF6B00]"></div>
      </div>
    );
  }

  const requiredDocs = [
    { key: 'passportCopy', label: 'Passport' },
    { key: 'passportPhoto', label: 'Photo' },
    { key: 'bankStatement', label: 'Bank Statement' },
    { key: 'bankSolvency', label: 'Bank Solvency' },
    { key: 'visitingCard', label: 'Visiting Card' },
    { key: 'hotelBooking', label: 'Hotel Booking' },
    { key: 'airTicket', label: 'Air Ticket' }
  ] as const;

  const handleDelete = async () => {
    if (!selectedTravelerId) return;
    try {
      const loadingToast = toast.loading('Deleting visa application...');
      const response = await deleteVisa(selectedTravelerId).unwrap();
      
      toast.dismiss(loadingToast);
      
      if (response.success) {
        toast.success('Visa application deleted successfully');
      } else {
        toast.error('Failed to delete visa application');
      }
      closeModal();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('An error occurred while deleting');
      closeModal();
    }
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Visa Applications</h1>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visa Type</th>
              {requiredDocs.map(doc => (
                <th key={doc.key} className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {doc.label}
                </th>
              ))}
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sub Travelers</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data?.data.map((traveler: Traveler) => (
              <tr key={traveler._id} className="hover:bg-gray-50">
                <td className="px-3 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{traveler.givenName}</div>
                  <div className="text-sm text-gray-500">{traveler.surname}</div>
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{traveler.email}</div>
                  <div className="text-sm text-gray-500">{traveler.phone}</div>
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {traveler.visaType}
                  </span>
                </td>
                {requiredDocs.map(doc => (
                  <td key={doc.key} className="px-3 py-4 whitespace-nowrap text-center">
                    {traveler.generalDocuments?.[doc.key as keyof GeneralDocuments]?.url ? (
                      <FaCheck className="text-green-500 text-sm mx-auto" />
                    ) : (
                      <FaTimes className="text-red-500 text-sm mx-auto" />
                    )}
                  </td>
                ))}
                <td className="px-3 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {traveler.subTravelers?.length || 0}
                  </span>
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-3">
                    <Link href={`/travelers/${traveler._id}`} className="text-blue-600 hover:text-blue-900">
                      <FaEye className="text-xl" />
                    </Link>
                    <Link href={`/travelers/edit/${traveler._id}`} className="text-green-600 hover:text-green-900">
                      <FaPencilAlt className="text-xl" />
                    </Link>
                    <button onClick={() => openDeleteModal(traveler._id)} className="text-red-600 hover:text-red-900">
                      <FaTrash className="text-xl" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

         {/* Delete Confirmation Modal */}
         {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FaTrash className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Delete Visa Application
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this visa application? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
