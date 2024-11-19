export interface Asset {
  symbol: string;
  name: string;
  type: 'stock' | 'crypto';
}

export interface TimeSeriesData {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type TimeFrame = '24h' | '7d' | '30d';

export interface PredictionResult {
  predictedClose: number;
  confidence: number;
  trend: 'bullish' | 'bearish' | 'neutral';
  timeframe: TimeFrame;
  supportLevel: number;
  resistanceLevel: number;
  volatility: 'low' | 'medium' | 'high';
  signals: {
    technical: string[];
    fundamental: string[];
    sentiment: string[];
  };
  aiConfidence: {
    technical: number;
    fundamental: number;
    sentiment: number;
  };
}

export type TimeScope = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | 'ALL';

export interface TechnicalIndicators {
  sma20: number[];
  sma50: number[];
  rsi: number[];
  macd: {
    line: number[];
    signal: number[];
    histogram: number[];
  };
}