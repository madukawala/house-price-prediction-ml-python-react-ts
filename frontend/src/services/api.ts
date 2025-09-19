import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  API_ENDPOINTS, 
  HouseFeatures, 
  PredictionResponse, 
  FeatureImportanceResponse, 
  ModelHealthResponse,
  PredictionRequest
} from '../types';

const API_BASE_URL: string = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const predictHousePrice = async (houseFeatures: HouseFeatures): Promise<PredictionResponse> => {
  try {
    const requestData: PredictionRequest = {
      house_features: houseFeatures
    };
    
    const response: AxiosResponse<PredictionResponse> = await api.post(
      API_ENDPOINTS.PREDICT, 
      requestData
    );
    
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error('Failed to predict house price');
  }
};

export const getFeatureImportance = async (): Promise<FeatureImportanceResponse> => {
  try {
    const response: AxiosResponse<FeatureImportanceResponse> = await api.get(
      API_ENDPOINTS.FEATURE_IMPORTANCE
    );
    
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error('Failed to get feature importance');
  }
};

export const checkModelHealth = async (): Promise<ModelHealthResponse> => {
  try {
    const response: AxiosResponse<ModelHealthResponse> = await api.get(
      API_ENDPOINTS.MODEL_HEALTH
    );
    
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error('Failed to check model health');
  }
};

export default api;