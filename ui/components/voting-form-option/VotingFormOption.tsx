import React from 'react';

type VotingFormData = {
  title: string;
  description: string;
  options: string[];
  criteria: string;
  startDate: Date | null;
  endDate: Date | null;
};

interface VotingOptionsFormProps {
  formData: VotingFormData;
  setFormData: React.Dispatch<React.SetStateAction<VotingFormData>>;
}

const VotingOptionsForm: React.FC<VotingOptionsFormProps> = ({
  formData,
  setFormData,
}) => {
  const handleOptionChange = (option: string, index: number) => {
    const newOptions = formData.options.map((item, i) =>
      i === index ? option : item
    );
    setFormData({ ...formData, options: newOptions });
  };

  const addOption = () => {
    setFormData({ ...formData, options: [...formData.options, ''] });
  };

  const removeOption = (index: number) => {
    const newOptions = formData.options.filter((_, i) => i !== index);
    setFormData({ ...formData, options: newOptions });
  };

  return (
    <div>
      <h3>Voting Options</h3>
      {formData.options.map((option, index) => (
        <div key={index}>
          <input
            type="text"
            value={option}
            onChange={(e) => handleOptionChange(e.target.value, index)}
            placeholder="Enter voting option"
          />
          <button onClick={() => removeOption(index)}>Remove</button>
        </div>
      ))}
      <button onClick={addOption}>Add Option</button>
    </div>
  );
};

export default VotingOptionsForm;
