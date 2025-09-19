import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getFeatureImportance } from '../../services/api';
import { FEATURE_LABELS, ChartDataPoint, ImportanceData, HouseFeatureKey } from '../../types';

const ImportanceContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const ImportanceTitle = styled.h3`
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const ChartContainer = styled.div`
  height: 300px;
  margin-bottom: 1rem;
`;

const NoDataMessage = styled.div`
  text-align: center;
  color: #666;
  padding: 2rem;
  font-style: italic;
`;

const ModelTypeInfo = styled.div`
  background: #f8f9fa;
  padding: 0.75rem;
  border-radius: 6px;
  text-align: center;
  font-size: 0.9rem;
  color: #666;
`;

const FeatureImportance: React.FC = () => {
  const [importanceData, setImportanceData] = useState<ImportanceData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFeatureImportance();
  }, []);

  const fetchFeatureImportance = async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await getFeatureImportance();
      
      if (data.feature_importance) {
        const chartData: ChartDataPoint[] = Object.entries(data.feature_importance)
          .map(([feature, importance]) => ({
            feature: FEATURE_LABELS[feature as HouseFeatureKey] || feature,
            importance: importance,
            originalFeature: feature
          }))
          .sort((a, b) => b.importance - a.importance);
        
        setImportanceData({
          chartData,
          modelType: data.model_type
        });
      } else {
        setImportanceData(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatTooltip = (value: number): [string, string] => {
    return [`${(value * 100).toFixed(1)}%`, 'Importance'];
  };

  if (loading) {
    return (
      <ImportanceContainer>
        <ImportanceTitle>Feature Importance</ImportanceTitle>
        <NoDataMessage>Loading feature importance...</NoDataMessage>
      </ImportanceContainer>
    );
  }

  if (error) {
    return (
      <ImportanceContainer>
        <ImportanceTitle>Feature Importance</ImportanceTitle>
        <NoDataMessage>Error loading feature importance: {error}</NoDataMessage>
      </ImportanceContainer>
    );
  }

  if (!importanceData || !importanceData.chartData) {
    return (
      <ImportanceContainer>
        <ImportanceTitle>Feature Importance</ImportanceTitle>
        <NoDataMessage>
          Feature importance is not available for this model type.
          <br />
          Currently available only for tree-based models like Random Forest.
        </NoDataMessage>
      </ImportanceContainer>
    );
  }

  return (
    <ImportanceContainer>
      <ImportanceTitle>Feature Importance</ImportanceTitle>
      
      <ChartContainer>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={importanceData.chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="feature" 
              angle={-45}
              textAnchor="end"
              height={80}
              fontSize={12}
            />
            <YAxis 
              tickFormatter={(value: number) => `${(value * 100).toFixed(0)}%`}
              fontSize={12}
            />
            <Tooltip formatter={formatTooltip} />
            <Bar dataKey="importance" fill="#667eea" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
      
      <ModelTypeInfo>
        Model: {importanceData.modelType.replace('_', ' ').toUpperCase()}
      </ModelTypeInfo>
    </ImportanceContainer>
  );
};

export default FeatureImportance;