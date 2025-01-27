import { FaXmark } from "react-icons/fa6";

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SubmissionModal({ isOpen, onClose }: SubmissionModalProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center"
      onClick={handleBackdropClick}
    >
      <div className="absolute top-32 w-full max-w-md bg-white rounded-md shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-[#CCE0FF] p-6 relative">
          <button onClick={onClose} className="absolute top-2 right-2 text-black hover:text-gray-800">
            <FaXmark className="h-6 w-6" />
          </button>
          <h2 className="text-xl font-semibold text-gray-800">Checkout Summary</h2>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {/* Service Details */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-black font-semibold">Service Name</div>
            <div className="text-black font-semibold">Amount</div>
          </div>
          
          <div className="flex justify-between items-center pb-6 border-b-2 border-[#727272]">
            <div className="text-gray-800 font-medium">Thailand Visa X 1</div>
            <div className="text-gray-800 font-medium">BDT 5200</div>
          </div>
          
          {/* Total */}
          <div className="flex justify-between items-center py-6 border-gray-200">
            <div className="text-gray-800 font-medium">Total Payable</div>
            <div className="text-gray-800 font-medium">BDT 5200</div>
          </div>
          
          {/* Terms Checkbox */}
          <div className="mt-6 flex items-start gap-3">
            <input 
              type="checkbox" 
              id="terms" 
              className="mt-1 h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
              Agree to the{' '}
              <a href="#" className="text-orange-500 hover:text-orange-600">Terms & Condition</a>
              {' '}and{' '}
              <a href="#" className="text-orange-500 hover:text-orange-600">Privacy Policy</a>
            </label>
          </div>
          
          {/* Payment Button */}
          <button 
            onClick={onClose} 
            className="w-full mt-6 bg-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-600 transition-colors"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
} 