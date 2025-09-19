import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PredictionForm from './components/prediction/PredictionForm';
import PredictionResults from './components/prediction/PredictionResults';
import FeatureImportance from './components/prediction/FeatureImportance';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import LoadingSpinner from './components/common/LoadingSpinner';
import { checkModelHealth } from './services/api';
import { PredictionResponse, ModelHealthResponse } from './types';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Arial', sans-serif;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  text-align: center;
`;

const App: React.FC = () => {
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [modelHealth, setModelHealth] = useState<ModelHealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkModelStatus();
  }, []);

  const checkModelStatus = async (): Promise<void> => {
    try {
      const health = await checkModelHealth();
      setModelHealth(health);
    } catch (err) {
      setError('Failed to check model status');
    }
  };

  const handlePrediction = (newPrediction: PredictionResponse): void => {
    setPrediction(newPrediction);
  };

  const handleLoading = (isLoading: boolean): void => {
    setLoading(isLoading);
  };

  const handleError = (errorMessage: string): void => {
    setError(errorMessage);
    setTimeout(() => setError(null), 5000);
  };

  return (
    <AppContainer>
      <Header />
      <MainContent>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        {modelHealth && !modelHealth.model_loaded && (
          <ErrorMessage>
            Model is not loaded. Please ensure the backend is running and the model is trained.
          </ErrorMessage>
        )}

        <ContentGrid>
          <div>
            <PredictionForm
              onPrediction={handlePrediction}
              onLoading={handleLoading}
              onError={handleError}
              disabled={!modelHealth?.model_loaded}
            />
            {loading && <LoadingSpinner />}
          </div>
          
          <div>
            {prediction && <PredictionResults prediction={prediction} />}
            <FeatureImportance />
          </div>
        </ContentGrid>
      </MainContent>
      <Footer />
    </AppContainer>
  );
};

export default App;