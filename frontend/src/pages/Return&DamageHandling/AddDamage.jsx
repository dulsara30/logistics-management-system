import { useState } from 'react';
import Stepper from '../../component/DamageHandling/Stepper.jsx';
import FormStep1 from '../../component/DamageHandling/FormStep1.jsx';
import FormStep2 from '../../component/DamageHandling/FormStep2.jsx';
import FormStep3 from '../../component/DamageHandling/FormStep3.jsx';
import ReviewModal from '../../component/DamageHandling/ReviewModal.jsx'

function AddDamage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    itemName: '',
    quantity: '',
    damageType: '',
    actionRequired: '',
    description: '',
    searchTerm: '',
  });
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleReview = () => {
    setShowModal(true);
  };

  const handleEdit = () => {
    setShowModal(false);
    setCurrentStep(1);
  };

  const handleConfirm = () => {
    setShowModal(false);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setCurrentStep(1);
      setFormData({
        itemName: '',
        quantity: '',
        damageType: '',
        actionRequired: '',
        description: '',
        searchTerm: '',
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Add New Damage</h1>
      {!isSubmitted && (
        <>
          <Stepper currentStep={currentStep} />
          {currentStep === 1 && (
            <FormStep1
              formData={formData}
              setFormData={setFormData}
              onNext={handleNext}
              errors={errors}
              setErrors={setErrors}
            />
          )}
          {currentStep === 2 && (
            <FormStep2
              formData={formData}
              setFormData={setFormData}
              onNext={handleNext}
              onBack={handleBack}
              errors={errors}
              setErrors={setErrors}
            />
          )}
          {currentStep === 3 && (
            <FormStep3
              formData={formData}
              onBack={handleBack}
              onReview={handleReview}
            />
          )}
        </>
      )}
      {showModal && (
        <ReviewModal
          formData={formData}
          onEdit={handleEdit}
          onConfirm={handleConfirm}
        />
      )}
      {isSubmitted && (
        <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-semibold text-green-600">Success!</h2>
          <p className="text-gray-600 mt-2">Damage report submitted successfully.</p>
        </div>
      )}
    </div>
  );
}

export default AddDamage;