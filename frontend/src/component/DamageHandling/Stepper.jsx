function Stepper({ currentStep }) {
    return (
      <div className="flex items-center justify-center my-6">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${currentStep === 1 ? 'bg-blue-600' : 'bg-gray-300'}`}>
          1
        </div>
        <div className={`w-16 h-1 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${currentStep === 2 ? 'bg-blue-600' : 'bg-gray-300'}`}>
          2
        </div>
        <div className={`w-16 h-1 ${currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${currentStep === 3 ? 'bg-blue-600' : 'bg-gray-300'}`}>
          3
        </div>
      </div>
    );
  }
  
  export default Stepper;  