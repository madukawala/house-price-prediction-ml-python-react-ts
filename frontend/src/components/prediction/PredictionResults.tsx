import React from 'react';
import styled from 'styled-components';
import { FEATURE_LABELS, PredictionResultsProps, HouseFeatureKey } from '../../types';

const ResultsContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const ResultsTitle = styled.h2`
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const PriceDisplay = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const PredictedPrice = styled.div`
  font-size: 3rem;
  font-weight: bold;
  color: #28a745;
  margin-bottom: 0.5rem;
`;

const ConfidenceInterval = styled.div`
  color: #666;
  font-size: 1rem;
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 2rem;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const DetailCard = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #667eea;
`;

const DetailLabel = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.25rem;
`;

const DetailValue = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
`;

const ModelInfo = styled.div`
  background: #e3f2fd;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  text-align: center;
  color: #1565c0;
  font-size: 0.9rem;
`;

const PredictionResults: React.FC<PredictionResultsProps> = ({ prediction }) => {
  if (!prediction) return null;

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatFeatureValue = (key: HouseFeatureKey, value: number): string => {
    if (key === 'location_score') return value.toFixed(1);
    if (key === 'square_footage') return `${value} sq ft`;
    if (key === 'age') return `${value} years`;
    return value.toString();
  };

  return (
    <ResultsContainer>
      <ResultsTitle>Prediction Results</ResultsTitle>
      
      <PriceDisplay>
        <PredictedPrice>
          {formatCurrency(prediction.predicted_price)}
        </PredictedPrice>
        <ConfidenceInterval>
          Range: {formatCurrency(prediction.confidence_interval.lower)} - {formatCurrency(prediction.confidence_interval.upper)}
        </ConfidenceInterval>
      </PriceDisplay>

      <DetailsGrid>
        {Object.entries(prediction.input_features).map(([key, value]) => {
          const featureKey = key as HouseFeatureKey;
          return (
            <DetailCard key={key}>
              <DetailLabel>{FEATURE_LABELS[featureKey] || key}</DetailLabel>
              <DetailValue>
                {formatFeatureValue(featureKey, value)}
              </DetailValue>
            </DetailCard>
          );
        })}
      </DetailsGrid>

      <ModelInfo>
        Model Used: {prediction.model_used.replace('_', ' ').toUpperCase()}
      </ModelInfo>
    </ResultsContainer>
  );
};

export default PredictionResults;