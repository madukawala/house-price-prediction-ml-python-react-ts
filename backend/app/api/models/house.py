from pydantic import BaseModel, Field
from typing import Dict, Any, Optional

class HouseFeatures(BaseModel):
    square_footage: float = Field(..., description="Square footage of the house", ge=100, le=10000)
    bedrooms: int = Field(..., description="Number of bedrooms", ge=1, le=10)
    bathrooms: int = Field(..., description="Number of bathrooms", ge=1, le=10)
    age: int = Field(..., description="Age of the house in years", ge=0, le=200)
    garage: int = Field(..., description="Number of garage spaces", ge=0, le=5)
    location_score: float = Field(..., description="Location score (1-10)", ge=1, le=10)

class PredictionRequest(BaseModel):
    house_features: HouseFeatures

class ConfidenceInterval(BaseModel):
    lower: float
    upper: float

class PredictionResponse(BaseModel):
    predicted_price: float
    confidence_interval: ConfidenceInterval
    model_used: str
    input_features: Dict[str, Any]

class FeatureImportanceResponse(BaseModel):
    feature_importance: Optional[Dict[str, float]]
    model_type: str

class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    model_type: Optional[str]