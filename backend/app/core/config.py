from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "House Price Prediction"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000"]
    
    # Model settings
    MODEL_PATH: str = "app/ml/models/house_price_model.pkl"
    SCALER_PATH: str = "app/ml/models/scaler.pkl"
    
    class Config:
        case_sensitive = True

settings = Settings()