import React from 'react';
import { BarChart, TrendingUp, Activity } from 'lucide-react';

interface IndicatorControlsProps {
  indicators: {
    sma: boolean;
    rsi: boolean;
    macd: boolean;
  };
  onToggle: (indicator: 'sma' | 'rsi' | 'macd') => void;
}

export const IndicatorControls: React.FC<IndicatorControlsProps> = ({
  indicators,
  onToggle,
}) => {
  return (
    <div className="flex space-x-2 mb-4">
      <button
        onClick={() => onToggle('sma')}
        className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
          indicators.sma
            ? 'bg-blue-600 text-white'
            : 'bg-white/5 hover:bg-white/10 text-gray-300'
        }`}
      >
        <BarChart className="h-4 w-4" />
        <span>Moving Averages</span>
      </button>
      
      <button
        onClick={() => onToggle('rsi')}
        className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
          indicators.rsi
            ? 'bg-blue-600 text-white'
            : 'bg-white/5 hover:bg-white/10 text-gray-300'
        }`}
      >
        <TrendingUp className="h-4 w-4" />
        <span>RSI</span>
      </button>
      
      <button
        onClick={() => onToggle('macd')}
        className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
          indicators.macd
            ? 'bg-blue-600 text-white'
            : 'bg-white/5 hover:bg-white/10 text-gray-300'
        }`}
      >
        <Activity className="h-4 w-4" />
        <span>MACD</span>
      </button>
    </div>
  );
};