import React from 'react';

type VotingFormData = {
  title: string;
  description: string;
  options: string[];
  criteria: string;
  startDate: Date | null;
  endDate: Date | null;
};

interface ReviewSubmitProps {
  formData: VotingFormData;
}

const ReviewSubmit: React.FC<ReviewSubmitProps> = ({ formData }) => {
  const handleSubmit = () => {
    console.log('Submitting', formData);
    // Submit formData to your backend or state management
  };

  return (
    <div>
      <h3>Review Your Voting</h3>
      <p>
        <strong>Title:</strong> {formData.title}
      </p>
      <p>
        <strong>Description:</strong> {formData.description}
      </p>
      <p>
        <strong>Options:</strong>
      </p>
      <ul>
        {formData.options.map((option, index) => (
          <li key={index}>{option}</li>
        ))}
      </ul>
      <p>
        <strong>Criteria:</strong> {formData.criteria}
      </p>
      <p>
        <strong>Start Date:</strong> {formData.startDate?.toString()}
      </p>
      <p>
        <strong>End Date:</strong> {formData.endDate?.toString()}
      </p>
      <button onClick={handleSubmit}>Submit Voting</button>
    </div>
  );
};

export default ReviewSubmit;
