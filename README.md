# House Price Prediction

A full-stack machine learning application for predicting house prices using multiple regression models. Built with Python FastAPI backend and React frontend.

## 🏠 Project Overview

This project demonstrates a complete machine learning pipeline for house price prediction, featuring:

- **Backend**: Python FastAPI with scikit-learn ML models
- **Frontend**: React with modern component architecture
- **Models**: Linear Regression and Random Forest Regression
- **Deployment**: Docker containerization

## 🚀 Features

- **Interactive Web Interface**: User-friendly form for inputting house features
- **Real-time Predictions**: Instant price predictions with confidence intervals
- **Multiple Models**: Comparison between Linear Regression and Random Forest
- **Feature Importance**: Visualization of feature importance for tree-based models
- **Model Health Monitoring**: API endpoints to check model status
- **Responsive Design**: Mobile-friendly interface with modern styling

## 🧠 Machine Learning Models

### 1. Linear Regression
- **Algorithm**: Ordinary Least Squares (OLS)
- **Use Case**: Baseline model for linear relationships
- **Features**: Uses standardized features for optimal performance
- **Advantages**: Fast training, interpretable coefficients, good baseline
- **Limitations**: Assumes linear relationships between features and target

### 2. Random Forest Regression
- **Algorithm**: Ensemble of decision trees with bootstrap aggregating
- **Use Case**: Captures non-linear relationships and feature interactions
- **Parameters**: 
  - `n_estimators`: Number of trees in the forest
  - `random_state=42`: For reproducible results
- **Advantages**: 
  - Handles non-linear relationships
  - Provides feature importance
  - Robust to outliers
  - Less prone to overfitting
- **Feature Importance**: Available through scikit-learn's built-in feature importance

### Model Selection Process
The application automatically selects the best performing model based on R² (coefficient of determination) score on the test set.

### Features Used for Prediction

| Feature | Description | Range | Impact |
|---------|-------------|-------|---------|
| **Square Footage** | Total living area | 100 - 10,000 sq ft | High impact on price |
| **Bedrooms** | Number of bedrooms | 1 - 10 | Moderate impact |
| **Bathrooms** | Number of bathrooms | 1 - 10 | Moderate impact |
| **Age** | Age of the house | 0 - 200 years | Moderate impact (newer = higher price) |
| **Garage** | Number of garage spaces | 0 - 5 | Low-moderate impact |
| **Location Score** | Neighborhood quality score | 1 - 10 | High impact on price |

### Model Performance Metrics

The models are evaluated using:
- **R² Score**: Coefficient of determination (explained variance)
- **RMSE**: Root Mean Square Error (prediction accuracy)
- **MAE**: Mean Absolute Error (average prediction error)

## 🏗 Architecture

### Backend Structure
```
backend/
├── app/
│   ├── api/
│   │   ├── endpoints/          # FastAPI route handlers
│   │   └── models/             # Pydantic models for request/response
│   ├── core/
│   │   └── config.py          # Application configuration
│   ├── ml/
│   │   ├── model_trainer.py   # Model training pipeline
│   │   ├── predictor.py       # Prediction service
│   │   └── models/            # Trained model files
│   └── main.py                # FastAPI application entry point
├── requirements.txt           # Python dependencies
└── start.py                  # Training and server startup script
```

### Frontend Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── common/            # Reusable UI components
│   │   └── prediction/        # Prediction-specific components
│   ├── services/
│   │   └── api.js            # API service layer
│   ├── types/
│   │   └── index.js          # Type definitions and constants
│   └── App.js                # Main application component
├── public/                    # Static assets
└── package.json              # Node.js dependencies
```

## 📋 Prerequisites

- **Python 3.11+**
- **Node.js 18+**
- **Docker** (optional, for containerized deployment)

## 🔧 Installation & Setup

### Method 1: Local Development

#### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Train model and start server
python start.py
```

The backend will be available at `http://localhost:8000`

#### Frontend Setup
```bash
# Open new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

The frontend will be available at `http://localhost:3000`

### Method 2: Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Documentation: http://localhost:8000/docs
```

## 🔄 API Endpoints

### Prediction Endpoints

#### POST `/api/v1/predict`
Predict house price based on input features.

**Request Body:**
```json
{
  "house_features": {
    "square_footage": 2000,
    "bedrooms": 3,
    "bathrooms": 2,
    "age": 10,
    "garage": 2,
    "location_score": 7.5
  }
}
```

**Response:**
```json
{
  "predicted_price": 285000.50,
  "confidence_interval": {
    "lower": 256500.45,
    "upper": 313500.55
  },
  "model_used": "random_forest",
  "input_features": {
    "square_footage": 2000,
    "bedrooms": 3,
    "bathrooms": 2,
    "age": 10,
    "garage": 2,
    "location_score": 7.5
  }
}
```

#### GET `/api/v1/feature-importance`
Get feature importance scores (available for tree-based models).

**Response:**
```json
{
  "feature_importance": {
    "square_footage": 0.4521,
    "location_score": 0.2834,
    "age": 0.1205,
    "bathrooms": 0.0821,
    "bedrooms": 0.0619,
    "garage": 0.0401
  },
  "model_type": "random_forest"
}
```

#### GET `/api/v1/model-health`
Check model status and health.

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "model_type": "random_forest"
}
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
python -m pytest tests/
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📊 Model Training Details

### Data Generation
The application generates synthetic training data with realistic relationships:
- **Sample Size**: 2000 houses for training
- **Price Calculation**: Based on weighted feature combinations with noise
- **Feature Correlations**: Realistic correlations between features (e.g., larger houses tend to have more bedrooms)

### Training Pipeline
1. **Data Generation**: Create synthetic dataset with realistic feature relationships
2. **Data Preprocessing**: Feature scaling for linear regression
3. **Model Training**: Train both Linear Regression and Random Forest
4. **Model Evaluation**: Compare models using cross-validation metrics
5. **Model Selection**: Choose best performing model based on R² score
6. **Model Persistence**: Save trained model, scaler, and metadata

### Hyperparameter Tuning
The Random Forest model uses default parameters optimized for general performance:
- **n_estimators**: 100 (default)
- **max_depth**: None (trees grow until leaves are pure)
- **min_samples_split**: 2
- **min_samples_leaf**: 1
- **random_state**: 42 (for reproducibility)

## 🎨 Frontend Features

### Components Architecture
- **Header/Footer**: Consistent branding and navigation
- **PredictionForm**: Input form with validation using react-hook-form
- **PredictionResults**: Formatted display of prediction results
- **FeatureImportance**: Interactive chart using Recharts
- **LoadingSpinner**: User feedback during API calls

### Styling
- **Styled Components**: CSS-in-JS for component styling
- **Responsive Design**: Mobile-first approach with CSS Grid/Flexbox
- **Gradient Backgrounds**: Modern visual design
- **Glass Morphism**: Semi-transparent cards with backdrop blur

## 🚀 Deployment

### Production Considerations
1. **Environment Variables**: Configure API URLs and secrets
2. **Model Versioning**: Implement model versioning strategy
3. **Monitoring**: Add logging and error tracking
4. **Security**: Implement rate limiting and input validation
5. **Performance**: Add caching for predictions
6. **Scaling**: Consider horizontal scaling for high traffic

### Environment Variables
```bash
# Backend
PYTHONPATH=/app
MODEL_PATH=app/ml/models/house_price_model.pkl

# Frontend
REACT_APP_API_URL=http://localhost:8000
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔮 Future Enhancements

- [ ] **Advanced Models**: Implement XGBoost, LightGBM, or Neural Networks
- [ ] **Real Data Integration**: Connect to real estate APIs or datasets
- [ ] **Geolocation Features**: Add map-based location selection
- [ ] **Historical Trends**: Show price trends and market analysis
- [ ] **User Authentication**: Save and track prediction history
- [ ] **A/B Testing**: Compare different model versions
- [ ] **Model Explainability**: SHAP values for individual predictions
- [ ] **Automated Retraining**: Periodic model updates with new data

## 📞 Support

For questions or issues, please open an issue on GitHub or contact the maintainers.

---

**Built with ❤️ using Python, FastAPI, React, and scikit-learn**