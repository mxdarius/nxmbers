import React from 'react';
import { Clock, Calendar } from 'lucide-react';
import { TimeFrame } from '../types';
import { Tooltip } from './Tooltip';

interface PredictionTimeControlsProps {
  activeTimeFrame: TimeFrame;
  onTimeFrameChange: (timeFrame: TimeFrame) => void;
}

export const PredictionTimeControls: React.FC<PredictionTimeControlsProps> = ({
  activeTimeFrame,
  onTimeFrameChange,
}) => {
  const timeFrames: { value: TimeFrame; label: string; description: string }[] = [
    {
      value: '24h',
      label: '24 Hours',
      description: 'Short-term prediction for the next 24 hours, ideal for day trading'
    },
    {
      value: '7d',
      label: '1 Week',
      description: 'Medium-term prediction for the next 7 days, suitable for swing trading'
    },
    {
      value: '30d',
      label: '1 Month',
      description: 'Long-term prediction for the next 30 days, best for position trading'
    }
  ];

  return (
    <div className="glass-panel p-4 mb-4">
      <div className="flex items-center space-x-3 mb-4">
        <Calendar className="h-5 w-5 text-primary-400" />
        <span className="text-sm font-medium text-white">Prediction Timeframe</span>
        <Tooltip content={
          <div className="space-y-2">
            <p className="font-medium text-primary-400">Prediction Timeframe</p>
            <p>Select how far into the future you want the AI to predict market movements.</p>
            <p>Longer timeframes consider more historical data and market cycles.</p>
          </div>
        } />
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        {timeFrames.map(({ value, label, description }) => (
          <Tooltip
            key={value}
            content={description}
            showIcon={false}
          >
            <button
              onClick={() => onTimeFrameChange(value)}
              className={`flex items-center justify-center space-x-2 p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTimeFrame === value
                  ? 'bg-primary-600/30 text-primary-400 ring-1 ring-primary-400'
                  : 'bg-white/5 hover:bg-white/10 text-gray-300'
              }`}
            >
              <Clock className="h-4 w-4" />
              <span>{label}</span>
            </button>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};