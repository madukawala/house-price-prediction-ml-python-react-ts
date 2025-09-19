import joblib
import numpy as np
from typing import Dict, Any, Optional
import os

class HousePricePredictor:
    def __init__(self, model_path: str = "app/ml/models/house_price_model.pkl",
                 scaler_path: str = "app/ml/models/scaler.pkl",
                 model_info_path: str = "app/ml/models/model_info.pkl"):
        self.model_path = model_path
        self.scaler_path = scaler_path
        self.model_info_path = model_info_path
        self.model = None
        self.scaler = None
        self.model_info = None
        self.load_model()
    
    def load_model(self):
        """Load the trained model, scaler, and model info"""
        try:
            if os.path.exists(self.model_path):
                self.model = joblib.load(self.model_path)
                self.scaler = joblib.load(self.scaler_path)
                self.model_info = joblib.load(self.model_info_path)
                print(f"Model loaded successfully: {self.model_info['model_type']}")
            else:
                print("Model not found. Please train the model first.")
        except Exception as e:
            print(f"Error loading model: {e}")
    
    def validate_input(self, house_data: Dict[str, Any]) -> bool:
        """Validate input data"""
        required_features = ['square_footage', 'bedrooms', 'bathrooms', 'age', 'garage', 'location_score']
        
        for feature in required_features:
            if feature not in house_data:
                raise ValueError(f"Missing required feature: {feature}")
            
            value = house_data[feature]
            if not isinstance(value, (int, float)):
                raise ValueError(f"Feature {feature} must be a number")
            
            # Basic validation
            if feature == 'square_footage' and (value < 100 or value > 10000):
                raise ValueError("Square footage must be between 100 and 10,000")
            elif feature in ['bedrooms', 'bathrooms'] and (value < 1 or value > 10):
                raise ValueError(f"{feature} must be between 1 and 10")
            elif feature == 'age' and (value < 0 or value > 200):
                raise ValueError("Age must be between 0 and 200 years")
            elif feature == 'garage' and (value < 0 or value > 5):
                raise ValueError("Garage must be between 0 and 5")
            elif feature == 'location_score' and (value < 1 or value > 10):
                raise ValueError("Location score must be between 1 and 10")
        
        return True
    
    def predict(self, house_data: Dict[str, Any]) -> Dict[str, Any]:
        """Predict house price"""
        if self.model is None:
            raise RuntimeError("Model not loaded")
        
        # Validate input
        self.validate_input(house_data)
        
        # Prepare features
        features = ['square_footage', 'bedrooms', 'bathrooms', 'age', 'garage', 'location_score']
        X = np.array([[house_data[feature] for feature in features]])
        
        # Scale features if using linear regression
        if self.model_info['model_type'] == 'linear_regression':
            X = self.scaler.transform(X)
        
        # Make prediction
        prediction = self.model.predict(X)[0]
        
        # Calculate confidence interval (simplified)
        confidence_interval = prediction * 0.1  # ±10% as example
        
        return {
            'predicted_price': round(prediction, 2),
            'confidence_interval': {
                'lower': round(prediction - confidence_interval, 2),
                'upper': round(prediction + confidence_interval, 2)
            },
            'model_used': self.model_info['model_type'],
            'input_features': house_data
        }
    
    def get_feature_importance(self) -> Optional[Dict[str, float]]:
        """Get feature importance for tree-based models"""
        if (self.model is None or 
            self.model_info['model_type'] != 'random_forest' or
            not hasattr(self.model, 'feature_importances_')):
            return None
        
        features = ['square_footage', 'bedrooms', 'bathrooms', 'age', 'garage', 'location_score']
        importances = self.model.feature_importances_
        
        return {feature: round(importance, 4) 
                for feature, importance in zip(features, importances)}