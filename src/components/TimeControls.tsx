import React from 'react';
import { TimeScope } from '../types';

interface TimeControlsProps {
  activeScope: TimeScope;
  onScopeChange: (scope: TimeScope) => void;
}

const scopes: TimeScope[] = ['1D', '1W', '1M', '3M', '6M', '1Y', 'ALL'];

export const TimeControls: React.FC<TimeControlsProps> = ({ activeScope, onScopeChange }) => {
  return (
    <div className="flex space-x-2 mb-4">
      {scopes.map((scope) => (
        <button
          key={scope}
          onClick={() => onScopeChange(scope)}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
            activeScope === scope
              ? 'bg-blue-600 text-white'
              : 'bg-white/5 hover:bg-white/10 text-gray-300'
          }`}
        >
          {scope}
        </button>
      ))}
    </div>
  );
};