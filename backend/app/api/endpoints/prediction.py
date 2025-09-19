from fastapi import APIRouter, HTTPException
from app.api.models.house import (
    PredictionRequest, 
    PredictionResponse, 
    FeatureImportanceResponse,
    HealthResponse
)
from app.ml.predictor import HousePricePredictor

router = APIRouter()
predictor = HousePricePredictor()

@router.post("/predict", response_model=PredictionResponse)
async def predict_house_price(request: PredictionRequest):
    """Predict house price based on features"""
    try:
        house_data = request.house_features.dict()
        result = predictor.predict(house_data)
        return PredictionResponse(**result)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@router.get("/feature-importance", response_model=FeatureImportanceResponse)
async def get_feature_importance():
    """Get feature importance from the model"""
    try:
        importance = predictor.get_feature_importance()
        model_type = predictor.model_info['model_type'] if predictor.model_info else "unknown"
        return FeatureImportanceResponse(
            feature_importance=importance,
            model_type=model_type
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get feature importance: {str(e)}")

@router.get("/model-health", response_model=HealthResponse)
async def check_model_health():
    """Check if the model is loaded and ready"""
    model_loaded = predictor.model is not None
    model_type = predictor.model_info['model_type'] if predictor.model_info else None
    
    return HealthResponse(
        status="healthy" if model_loaded else "model_not_loaded",
        model_loaded=model_loaded,
        model_type=model_type
    )