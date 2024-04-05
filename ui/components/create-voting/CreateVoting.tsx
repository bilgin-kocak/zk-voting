import React, { useState } from 'react';
import VotingOptionsForm from '../voting-form-option/VotingFormOption';
import ReviewSubmit from '../review-submit/ReviewSubmit';
import './CreateVotingsPage.module.scss';

type VotingFormData = {
  title: string;
  description: string;
  options: string[];
  criteria: string;
  startDate: Date | null;
  endDate: Date | null;
};

// Initial empty form state
const initialFormData: VotingFormData = {
  title: '',
  description: '',
  options: [],
  criteria: '',
  startDate: null,
  endDate: null,
};

const CreateVotingsPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<VotingFormData>(initialFormData);

  const nextStep = () => setCurrentStep(currentStep + 1);
  const prevStep = () => setCurrentStep(currentStep - 1);

  // Handlers for form data changes go here

  return (
    <div className="wizardContainer">
      {/* Conditional rendering based on currentStep */}
      {currentStep === 1 && (
        <BasicInfoForm formData={formData} setFormData={setFormData} />
      )}
      {currentStep === 2 && (
        <VotingOptionsForm formData={formData} setFormData={setFormData} />
      )}
      {currentStep === 3 && <ReviewSubmit formData={formData} />}

      <div className="wizardControls">
        {currentStep > 1 && <button onClick={prevStep}>Previous</button>}
        {currentStep < 3 && <button onClick={nextStep}>Next</button>}
        {/* Add submission logic to the last step */}
      </div>
    </div>
  );
};

export default CreateVotingsPage;

type StepProps = {
  formData: VotingFormData;
  setFormData: React.Dispatch<React.SetStateAction<VotingFormData>>;
};

const BasicInfoForm: React.FC<StepProps> = ({ formData, setFormData }) => {
  // Implement the form. Use formData and setFormData to manage state
  return <div>Form Content Here</div>;
};
