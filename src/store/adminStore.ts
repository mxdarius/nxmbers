import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { z } from 'zod';

export const ApiConfigSchema = z.object({
  alphavantage: z.object({
    apiKey: z.string().min(1, "API Key is required"),
    enabled: z.boolean(),
  }),
  finnhub: z.object({
    apiKey: z.string().min(1, "API Key is required"),
    enabled: z.boolean(),
  }),
  polygon: z.object({
    apiKey: z.string().min(1, "API Key is required"),
    enabled: z.boolean(),
  }),
});

export const ModelConfigSchema = z.object({
  predictionWindow: z.number().min(1).max(365),
  confidenceThreshold: z.number().min(0).max(100),
  volatilityThresholds: z.object({
    low: z.number().min(0).max(100),
    medium: z.number().min(0).max(100),
    high: z.number().min(0).max(100),
  }),
  technicalIndicators: z.object({
    sma: z.boolean(),
    ema: z.boolean(),
    rsi: z.boolean(),
    macd: z.boolean(),
  }),
});

export type ApiConfig = z.infer<typeof ApiConfigSchema>;
export type ModelConfig = z.infer<typeof ModelConfigSchema>;

interface AdminState {
  apiConfig: ApiConfig;
  modelConfig: ModelConfig;
  updateApiConfig: (config: Partial<ApiConfig>) => void;
  updateModelConfig: (config: Partial<ModelConfig>) => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      apiConfig: {
        alphavantage: {
          apiKey: '',
          enabled: false,
        },
        finnhub: {
          apiKey: '',
          enabled: false,
        },
        polygon: {
          apiKey: '',
          enabled: false,
        },
      },
      modelConfig: {
        predictionWindow: 30,
        confidenceThreshold: 75,
        volatilityThresholds: {
          low: 20,
          medium: 50,
          high: 80,
        },
        technicalIndicators: {
          sma: true,
          ema: true,
          rsi: true,
          macd: true,
        },
      },
      updateApiConfig: (config) =>
        set((state) => ({
          apiConfig: { ...state.apiConfig, ...config },
        })),
      updateModelConfig: (config) =>
        set((state) => ({
          modelConfig: { ...state.modelConfig, ...config },
        })),
    }),
    {
      name: 'mxchines-admin',
    }
  )
);