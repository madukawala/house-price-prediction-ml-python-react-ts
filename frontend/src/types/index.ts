// House feature types
export interface HouseFeatures {
  square_footage: number;
  bedrooms: number;
  bathrooms: number;
  age: number;
  garage: number;
  location_score: number;
}

// API request/response types
export interface PredictionRequest {
  house_features: HouseFeatures;
}

export interface ConfidenceInterval {
  lower: number;
  upper: number;
}

export interface PredictionResponse {
  predicted_price: number;
  confidence_interval: ConfidenceInterval;
  model_used: string;
  input_features: HouseFeatures;
}

export interface FeatureImportanceResponse {
  feature_importance: Record<string, number> | null;
  model_type: string;
}

export interface ModelHealthResponse {
  status: string;
  model_loaded: boolean;
  model_type: string | null;
}

// Form validation types
export interface FormFieldValidation {
  required: string;
  min?: { value: number; message: string };
  max?: { value: number; message: string };
}

export interface FormField {
  name: keyof HouseFeatures;
  label: string;
  type: string;
  step?: string;
  validation: FormFieldValidation;
}

// Chart data types
export interface ChartDataPoint {
  feature: string;
  importance: number;
  originalFeature: string;
}

export interface ImportanceData {
  chartData: ChartDataPoint[];
  modelType: string;
}

// Component prop types
export interface PredictionFormProps {
  onPrediction: (prediction: PredictionResponse) => void;
  onLoading: (loading: boolean) => void;
  onError: (error: string) => void;
  disabled: boolean;
}

export interface PredictionResultsProps {
  prediction: PredictionResponse | null;
}

export interface LoadingSpinnerProps {
  text?: string;
}

// Constants
export const HOUSE_FEATURES = {
  SQUARE_FOOTAGE: 'square_footage' as const,
  BEDROOMS: 'bedrooms' as const,
  BATHROOMS: 'bathrooms' as const,
  AGE: 'age' as const,
  GARAGE: 'garage' as const,
  LOCATION_SCORE: 'location_score' as const
} as const;

export const API_ENDPOINTS = {
  PREDICT: '/api/v1/predict',
  FEATURE_IMPORTANCE: '/api/v1/feature-importance',
  MODEL_HEALTH: '/api/v1/model-health'
} as const;

export const FEATURE_LABELS: Record<keyof HouseFeatures, string> = {
  [HOUSE_FEATURES.SQUARE_FOOTAGE]: 'Square Footage',
  [HOUSE_FEATURES.BEDROOMS]: 'Bedrooms',
  [HOUSE_FEATURES.BATHROOMS]: 'Bathrooms',
  [HOUSE_FEATURES.AGE]: 'Age (years)',
  [HOUSE_FEATURES.GARAGE]: 'Garage Spaces',
  [HOUSE_FEATURES.LOCATION_SCORE]: 'Location Score (1-10)'
};

// Utility types
export type HouseFeatureKey = keyof HouseFeatures;
export type ApiEndpoint = typeof API_ENDPOINTS[keyof typeof API_ENDPOINTS];