import React from 'react';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Brain, Info } from 'lucide-react';
import { PredictionResult } from '../types';
import { Tooltip } from './Tooltip';

interface PredictionCardProps {
  prediction: PredictionResult;
  currentPrice: number;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({ prediction, currentPrice }) => {
  const percentageChange = prediction?.predictedClose && currentPrice
    ? ((prediction.predictedClose - currentPrice) / currentPrice) * 100
    : 0;
  
  const getTrendIcon = () => {
    switch (prediction?.trend) {
      case 'bullish':
        return <TrendingUp className="h-6 w-6 text-green-400" />;
      case 'bearish':
        return <TrendingDown className="h-6 w-6 text-red-400" />;
      default:
        return <Minus className="h-6 w-6 text-gray-400" />;
    }
  };

  const getVolatilityColor = () => {
    switch (prediction?.volatility) {
      case 'high':
        return 'text-red-400';
      case 'medium':
        return 'text-yellow-400';
      case 'low':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  const formatGBP = (value: number) => {
    return value.toLocaleString('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  if (!prediction) {
    return (
      <div className="glass-panel p-6">
        <p className="text-gray-400">No prediction data available</p>
      </div>
    );
  }

  const timeFrameLabels = {
    '24h': '24 Hours',
    '7d': '1 Week',
    '30d': '1 Month'
  };

  return (
    <div className="glass-panel p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Tooltip
          content={
            <div className="space-y-2">
              <p className="font-medium text-primary-400">AI-Powered Prediction</p>
              <p>Our advanced AI model analyzes multiple data points including:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-300">
                <li>Historical price patterns</li>
                <li>Market sentiment</li>
                <li>Technical indicators</li>
                <li>Trading volume</li>
                <li>Market correlations</li>
              </ul>
            </div>
          }
        >
          <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-purple-400">
            AI Prediction
          </h3>
        </Tooltip>
        <Tooltip
          content={
            <div>
              <p className="font-medium text-primary-400">Market Trend</p>
              <p>Current market direction based on AI analysis</p>
            </div>
          }
          showIcon={false}
        >
          {getTrendIcon()}
        </Tooltip>
      </div>
      
      <div className="space-y-6">
        <div className="glass-panel p-4">
          <Tooltip
            content={
              <div className="space-y-2">
                <p className="font-medium text-primary-400">Price Prediction</p>
                <p>Expected price movement based on:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-300">
                  <li>Technical analysis</li>
                  <li>Market sentiment</li>
                  <li>Historical patterns</li>
                </ul>
              </div>
            }
          >
            <p className="text-gray-400 text-sm">
              Predicted Price ({timeFrameLabels[prediction.timeframe || '24h']})
            </p>
          </Tooltip>
          <p className="text-2xl font-bold text-white mt-1">
            {formatGBP(prediction.predictedClose || 0)}
          </p>
          <p className={`text-lg font-semibold mt-1 ${
            percentageChange > 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {percentageChange > 0 ? '+' : ''}{percentageChange.toFixed(2)}%
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="glass-panel p-3">
            <Tooltip
              content={
                <div>
                  <p className="font-medium text-primary-400">Support Level</p>
                  <p>Price level where buying pressure is expected to prevent further decline</p>
                </div>
              }
            >
              <p className="text-gray-400 text-sm">Support</p>
            </Tooltip>
            <p className="text-lg font-semibold text-white mt-1">
              {formatGBP(prediction.supportLevel || 0)}
            </p>
          </div>
          <div className="glass-panel p-3">
            <Tooltip
              content={
                <div>
                  <p className="font-medium text-primary-400">Resistance Level</p>
                  <p>Price level where selling pressure is expected to prevent further rise</p>
                </div>
              }
            >
              <p className="text-gray-400 text-sm">Resistance</p>
            </Tooltip>
            <p className="text-lg font-semibold text-white mt-1">
              {formatGBP(prediction.resistanceLevel || 0)}
            </p>
          </div>
        </div>
        
        <div className="glass-panel p-4">
          <div className="flex items-center justify-between mb-3">
            <Tooltip
              content={
                <div>
                  <p className="font-medium text-primary-400">AI Confidence Levels</p>
                  <p>Confidence scores for different aspects of the prediction:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-300">
                    <li>Technical: Based on price patterns and indicators</li>
                    <li>Fundamental: Based on market and economic data</li>
                    <li>Sentiment: Based on market mood and news analysis</li>
                  </ul>
                </div>
              }
            >
              <p className="text-gray-400 text-sm">AI Confidence Levels</p>
            </Tooltip>
            <Brain className="h-4 w-4 text-primary-400" />
          </div>
          <div className="space-y-3">
            {prediction.aiConfidence && Object.entries(prediction.aiConfidence).map(([key, value]) => (
              <div key={key}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400 capitalize">{key}</span>
                  <span className="text-gray-300">{value}%</span>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-1.5">
                  <div
                    className="bg-gradient-to-r from-primary-500 to-purple-500 h-1.5 rounded-full"
                    style={{ width: `${value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-3">
          <div className="flex items-center space-x-2">
            <AlertTriangle className={`h-4 w-4 ${getVolatilityColor()}`} />
            <Tooltip
              content={
                <div>
                  <p className="font-medium text-primary-400">Market Volatility</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-300">
                    <li>Low: Stable price movement</li>
                    <li>Medium: Moderate price swings</li>
                    <li>High: Large price fluctuations</li>
                  </ul>
                </div>
              }
            >
              <p className="text-gray-400 text-sm">
                Volatility: <span className={`capitalize ${getVolatilityColor()}`}>
                  {prediction.volatility || 'unknown'}
                </span>
              </p>
            </Tooltip>
          </div>
        </div>

        <div className="space-y-2">
          {prediction.signals && Object.entries(prediction.signals).map(([category, signals]) => (
            Array.isArray(signals) && signals.length > 0 && (
              <div key={category} className="glass-panel p-3">
                <Tooltip
                  content={
                    <div>
                      <p className="font-medium text-primary-400">{category} Signals</p>
                      <p>Key market indicators and patterns identified by our AI</p>
                    </div>
                  }
                >
                  <p className="text-sm font-medium text-primary-400 capitalize mb-2">
                    {category} Signals
                  </p>
                </Tooltip>
                <ul className="space-y-1">
                  {signals.map((signal, index) => (
                    <li key={index} className="text-sm text-gray-400">• {signal}</li>
                  ))}
                </ul>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
};