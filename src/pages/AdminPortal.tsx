import React from 'react';
import { Settings, Database, Brain } from 'lucide-react';
import { useAdminStore, ApiConfigSchema, ModelConfigSchema } from '../store/adminStore';
import { Tooltip } from '../components/Tooltip';

export const AdminPortal: React.FC = () => {
  const { apiConfig, modelConfig, updateApiConfig, updateModelConfig } = useAdminStore();

  const handleApiConfigChange = (provider: string, field: string, value: string | boolean) => {
    const newConfig = {
      ...apiConfig,
      [provider]: {
        ...apiConfig[provider as keyof typeof apiConfig],
        [field]: value,
      },
    };

    try {
      ApiConfigSchema.parse(newConfig);
      updateApiConfig(newConfig);
    } catch (error) {
      console.error('Invalid API configuration:', error);
    }
  };

  const handleModelConfigChange = (
    field: string,
    value: number | boolean | Record<string, number | boolean>
  ) => {
    const newConfig = {
      ...modelConfig,
      [field]: value,
    };

    try {
      ModelConfigSchema.parse(newConfig);
      updateModelConfig(newConfig);
    } catch (error) {
      console.error('Invalid model configuration:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-900 via-gray-900 to-black p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center space-x-3">
          <Settings className="h-8 w-8 text-primary-400" />
          <h1 className="text-3xl font-bold text-white">Admin Portal</h1>
        </div>

        <section className="glass-panel p-6 space-y-6">
          <div className="flex items-center space-x-2">
            <Database className="h-6 w-6 text-primary-400" />
            <h2 className="text-xl font-semibold text-white">Market Data APIs</h2>
          </div>

          {Object.entries(apiConfig).map(([provider, config]) => (
            <div key={provider} className="space-y-3">
              <h3 className="text-lg font-medium text-white capitalize">{provider}</h3>
              <div className="grid gap-4">
                <div className="flex items-center space-x-4">
                  <input
                    type="text"
                    placeholder="API Key"
                    value={config.apiKey}
                    onChange={(e) => handleApiConfigChange(provider, 'apiKey', e.target.value)}
                    className="input-field flex-1"
                  />
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={config.enabled}
                      onChange={(e) => handleApiConfigChange(provider, 'enabled', e.target.checked)}
                      className="form-checkbox h-5 w-5 text-primary-500"
                    />
                    <span className="text-white">Enabled</span>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="glass-panel p-6 space-y-6">
          <div className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-primary-400" />
            <h2 className="text-xl font-semibold text-white">Model Configuration</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Prediction Window (days)
              </label>
              <input
                type="number"
                value={modelConfig.predictionWindow}
                onChange={(e) => handleModelConfigChange('predictionWindow', parseInt(e.target.value))}
                className="input-field w-full"
                min="1"
                max="365"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confidence Threshold (%)
              </label>
              <input
                type="number"
                value={modelConfig.confidenceThreshold}
                onChange={(e) => handleModelConfigChange('confidenceThreshold', parseInt(e.target.value))}
                className="input-field w-full"
                min="0"
                max="100"
              />
            </div>

            <div>
              <h3 className="text-lg font-medium text-white mb-3">Volatility Thresholds</h3>
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(modelConfig.volatilityThresholds).map(([level, value]) => (
                  <div key={level}>
                    <label className="block text-sm font-medium text-gray-300 mb-2 capitalize">
                      {level} (%)
                    </label>
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => handleModelConfigChange('volatilityThresholds', {
                        ...modelConfig.volatilityThresholds,
                        [level]: parseInt(e.target.value),
                      })}
                      className="input-field w-full"
                      min="0"
                      max="100"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-white mb-3">Technical Indicators</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(modelConfig.technicalIndicators).map(([indicator, enabled]) => (
                  <label key={indicator} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={(e) => handleModelConfigChange('technicalIndicators', {
                        ...modelConfig.technicalIndicators,
                        [indicator]: e.target.checked,
                      })}
                      className="form-checkbox h-5 w-5 text-primary-500"
                    />
                    <span className="text-white uppercase">{indicator}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};