import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
import joblib
import os
from typing import Tuple, Dict, Any

class HousePriceModelTrainer:
    def __init__(self):
        self.models = {
            'linear_regression': LinearRegression(),
            'random_forest': RandomForestRegressor(random_state=42)
        }
        self.scaler = StandardScaler()
        self.best_model = None
        self.model_name = None
        
    def generate_sample_data(self, n_samples: int = 1000) -> pd.DataFrame:
        """Generate sample house data for training"""
        np.random.seed(42)
        
        data = {
            'square_footage': np.random.normal(2000, 500, n_samples),
            'bedrooms': np.random.randint(1, 6, n_samples),
            'bathrooms': np.random.randint(1, 4, n_samples),
            'age': np.random.randint(0, 50, n_samples),
            'garage': np.random.randint(0, 3, n_samples),
            'location_score': np.random.uniform(1, 10, n_samples),
        }
        
        df = pd.DataFrame(data)
        
        # Ensure reasonable values
        df['square_footage'] = np.clip(df['square_footage'], 500, 5000)
        df['bathrooms'] = np.minimum(df['bathrooms'], df['bedrooms'])
        
        # Generate price based on features with some noise
        price = (
            df['square_footage'] * 100 +
            df['bedrooms'] * 5000 +
            df['bathrooms'] * 8000 +
            (50 - df['age']) * 1000 +
            df['garage'] * 3000 +
            df['location_score'] * 10000 +
            np.random.normal(0, 10000, n_samples)
        )
        
        df['price'] = np.clip(price, 50000, 1000000)
        
        return df
    
    def prepare_data(self, df: pd.DataFrame) -> Tuple[np.ndarray, np.ndarray]:
        """Prepare features and target"""
        features = ['square_footage', 'bedrooms', 'bathrooms', 'age', 'garage', 'location_score']
        X = df[features].values
        y = df['price'].values
        
        return X, y
    
    def train_models(self, X: np.ndarray, y: np.ndarray) -> Dict[str, Dict[str, Any]]:
        """Train multiple models and return metrics"""
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        results = {}
        
        for name, model in self.models.items():
            if name == 'linear_regression':
                # Use scaled data for linear regression
                model.fit(X_train_scaled, y_train)
                y_pred = model.predict(X_test_scaled)
            else:
                # Random Forest doesn't need scaling
                model.fit(X_train, y_train)
                y_pred = model.predict(X_test)
                
            # Calculate metrics
            mse = mean_squared_error(y_test, y_pred)
            rmse = np.sqrt(mse)
            mae = mean_absolute_error(y_test, y_pred)
            r2 = r2_score(y_test, y_pred)
            
            results[name] = {
                'model': model,
                'mse': mse,
                'rmse': rmse,
                'mae': mae,
                'r2': r2,
                'predictions': y_pred[:10].tolist(),
                'actual': y_test[:10].tolist()
            }
        
        # Select best model based on R2 score
        best_model_name = max(results.keys(), key=lambda k: results[k]['r2'])
        self.best_model = results[best_model_name]['model']
        self.model_name = best_model_name
        
        return results
    
    def save_model(self, model_path: str = "app/ml/models/house_price_model.pkl",
                   scaler_path: str = "app/ml/models/scaler.pkl"):
        """Save the trained model and scaler"""
        os.makedirs(os.path.dirname(model_path), exist_ok=True)
        joblib.dump(self.best_model, model_path)
        joblib.dump(self.scaler, scaler_path)
        
        # Save model info
        model_info = {
            'model_type': self.model_name,
            'features': ['square_footage', 'bedrooms', 'bathrooms', 'age', 'garage', 'location_score']
        }
        joblib.dump(model_info, "app/ml/models/model_info.pkl")
    
    def run_training_pipeline(self):
        """Complete training pipeline"""
        print("Generating sample data...")
        df = self.generate_sample_data(2000)
        
        print("Preparing data...")
        X, y = self.prepare_data(df)
        
        print("Training models...")
        results = self.train_models(X, y)
        
        print("Saving best model...")
        self.save_model()
        
        return results

if __name__ == "__main__":
    trainer = HousePriceModelTrainer()
    results = trainer.run_training_pipeline()
    
    print("\nModel Training Results:")
    print("=" * 50)
    for model_name, metrics in results.items():
        print(f"\n{model_name.upper()}:")
        print(f"  R² Score: {metrics['r2']:.4f}")
        print(f"  RMSE: ${metrics['rmse']:,.2f}")
        print(f"  MAE: ${metrics['mae']:,.2f}")