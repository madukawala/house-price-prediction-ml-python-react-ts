#!/usr/bin/env python3

import sys
import os
import subprocess
from pathlib import Path

def train_model():
    """Train the machine learning model"""
    print("Training machine learning model...")
    try:
        from app.ml.model_trainer import HousePriceModelTrainer
        trainer = HousePriceModelTrainer()
        results = trainer.run_training_pipeline()
        
        print("\nTraining completed successfully!")
        print("Model performance:")
        for model_name, metrics in results.items():
            print(f"  {model_name}: R² = {metrics['r2']:.4f}, RMSE = ${metrics['rmse']:,.2f}")
        
        return True
    except Exception as e:
        print(f"Error training model: {e}")
        return False

def start_server():
    """Start the FastAPI server"""
    print("Starting FastAPI server...")
    try:
        subprocess.run([
            sys.executable, "-m", "uvicorn", 
            "app.main:app", 
            "--host", "0.0.0.0", 
            "--port", "8000", 
            "--reload"
        ], cwd=Path(__file__).parent)
    except KeyboardInterrupt:
        print("\nServer stopped.")
    except Exception as e:
        print(f"Error starting server: {e}")

def main():
    """Main entry point"""
    print("House Price Prediction Backend Setup")
    print("=" * 40)
    
    # Check if model exists
    model_path = Path("app/ml/models/house_price_model.pkl")
    
    if not model_path.exists():
        print("Model not found. Training new model...")
        if not train_model():
            print("Failed to train model. Exiting.")
            sys.exit(1)
    else:
        print("Model found. Skipping training.")
    
    # Start server
    start_server()

if __name__ == "__main__":
    main()