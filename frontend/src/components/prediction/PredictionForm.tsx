import React from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { predictHousePrice } from '../../services/api';
import {
  HOUSE_FEATURES,
  FEATURE_LABELS,
  HouseFeatures,
  PredictionFormProps,
  FormField
} from '../../types';

const FormContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const FormTitle = styled.h2`
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Form = styled.form`
  display: grid;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  color: #555;
  font-weight: 500;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
  
  &:disabled {
    background-color: #f8f9fa;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;
  margin-top: 1rem;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorText = styled.span`
  color: #dc3545;
  font-size: 0.8rem;
  margin-top: 0.25rem;
`;

const PredictionForm: React.FC<PredictionFormProps> = ({ 
  onPrediction, 
  onLoading, 
  onError, 
  disabled 
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<HouseFeatures>({
    defaultValues: {
      [HOUSE_FEATURES.SQUARE_FOOTAGE]: 2000,
      [HOUSE_FEATURES.BEDROOMS]: 3,
      [HOUSE_FEATURES.BATHROOMS]: 2,
      [HOUSE_FEATURES.AGE]: 10,
      [HOUSE_FEATURES.GARAGE]: 2,
      [HOUSE_FEATURES.LOCATION_SCORE]: 7
    }
  });

  const onSubmit = async (data: HouseFeatures): Promise<void> => {
    onLoading(true);
    try {
      const prediction = await predictHousePrice(data);
      onPrediction(prediction);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      onLoading(false);
    }
  };

  const formFields: FormField[] = [
    {
      name: HOUSE_FEATURES.SQUARE_FOOTAGE,
      label: FEATURE_LABELS[HOUSE_FEATURES.SQUARE_FOOTAGE],
      type: 'number',
      validation: {
        required: 'Square footage is required',
        min: { value: 100, message: 'Minimum 100 sq ft' },
        max: { value: 10000, message: 'Maximum 10,000 sq ft' }
      }
    },
    {
      name: HOUSE_FEATURES.BEDROOMS,
      label: FEATURE_LABELS[HOUSE_FEATURES.BEDROOMS],
      type: 'number',
      validation: {
        required: 'Number of bedrooms is required',
        min: { value: 1, message: 'Minimum 1 bedroom' },
        max: { value: 10, message: 'Maximum 10 bedrooms' }
      }
    },
    {
      name: HOUSE_FEATURES.BATHROOMS,
      label: FEATURE_LABELS[HOUSE_FEATURES.BATHROOMS],
      type: 'number',
      validation: {
        required: 'Number of bathrooms is required',
        min: { value: 1, message: 'Minimum 1 bathroom' },
        max: { value: 10, message: 'Maximum 10 bathrooms' }
      }
    },
    {
      name: HOUSE_FEATURES.AGE,
      label: FEATURE_LABELS[HOUSE_FEATURES.AGE],
      type: 'number',
      validation: {
        required: 'Age is required',
        min: { value: 0, message: 'Age cannot be negative' },
        max: { value: 200, message: 'Maximum 200 years' }
      }
    },
    {
      name: HOUSE_FEATURES.GARAGE,
      label: FEATURE_LABELS[HOUSE_FEATURES.GARAGE],
      type: 'number',
      validation: {
        required: 'Garage spaces is required',
        min: { value: 0, message: 'Minimum 0 garage spaces' },
        max: { value: 5, message: 'Maximum 5 garage spaces' }
      }
    },
    {
      name: HOUSE_FEATURES.LOCATION_SCORE,
      label: FEATURE_LABELS[HOUSE_FEATURES.LOCATION_SCORE],
      type: 'number',
      step: '0.1',
      validation: {
        required: 'Location score is required',
        min: { value: 1, message: 'Minimum score is 1' },
        max: { value: 10, message: 'Maximum score is 10' }
      }
    }
  ];

  return (
    <FormContainer>
      <FormTitle>House Details</FormTitle>
      <Form onSubmit={handleSubmit(onSubmit)}>
        {formFields.map((field) => (
          <FormGroup key={field.name}>
            <Label>{field.label}</Label>
            <Input
              type={field.type}
              step={field.step}
              disabled={disabled || isSubmitting}
              {...register(field.name, field.validation)}
            />
            {errors[field.name] && (
              <ErrorText>{errors[field.name]?.message}</ErrorText>
            )}
          </FormGroup>
        ))}
        
        <SubmitButton 
          type="submit" 
          disabled={disabled || isSubmitting}
        >
          {isSubmitting ? 'Predicting...' : 'Predict Price'}
        </SubmitButton>
      </Form>
    </FormContainer>
  );
};

export default PredictionForm;