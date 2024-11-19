import React, { useMemo, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import zoomPlugin from 'chartjs-plugin-zoom';
import { TimeSeriesData, TimeScope, TechnicalIndicators, PredictionResult } from '../types';
import { calculateSMA, calculateRSI, calculateMACD } from '../utils/indicators';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  zoomPlugin
);

interface ChartProps {
  data: TimeSeriesData[];
  prediction: PredictionResult;
  timeScope: TimeScope;
  showIndicators: {
    sma: boolean;
    rsi: boolean;
    macd: boolean;
  };
  onTimeframeSelect?: (start: Date, end: Date) => void;
}

export const PriceChart: React.FC<ChartProps> = ({ 
  data, 
  prediction, 
  timeScope,
  showIndicators,
  onTimeframeSelect
}) => {
  const chartRef = useRef<ChartJS>(null);

  const filteredData = useMemo(() => {
    if (!data.length) return [];
    
    const now = new Date();
    const filterDate = new Date();
    
    switch (timeScope) {
      case '1D':
        filterDate.setDate(now.getDate() - 1);
        break;
      case '1W':
        filterDate.setDate(now.getDate() - 7);
        break;
      case '1M':
        filterDate.setMonth(now.getMonth() - 1);
        break;
      case '3M':
        filterDate.setMonth(now.getMonth() - 3);
        break;
      case '6M':
        filterDate.setMonth(now.getMonth() - 6);
        break;
      case '1Y':
        filterDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return data;
    }
    
    return data.filter(d => new Date(d.timestamp) >= filterDate);
  }, [data, timeScope]);

  const indicators: TechnicalIndicators = useMemo(() => {
    if (!filteredData.length) {
      return {
        sma20: [],
        sma50: [],
        rsi: [],
        macd: { line: [], signal: [], histogram: [] }
      };
    }

    const prices = filteredData.map(d => d.close);
    return {
      sma20: calculateSMA(prices, 20),
      sma50: calculateSMA(prices, 50),
      rsi: calculateRSI(prices),
      macd: calculateMACD(prices)
    };
  }, [filteredData]);

  const generatePredictionPoints = () => {
    if (!prediction || !filteredData.length) return [];

    const lastPrice = filteredData[filteredData.length - 1].close;
    const lastDate = new Date(filteredData[filteredData.length - 1].timestamp);
    const predictionPoints = [];
    
    // Add current price as starting point
    predictionPoints.push({
      x: lastDate,
      y: lastPrice
    });

    // Add prediction point
    const predictionDate = new Date(lastDate);
    switch (prediction.timeframe) {
      case '24h':
        predictionDate.setDate(predictionDate.getDate() + 1);
        break;
      case '7d':
        predictionDate.setDate(predictionDate.getDate() + 7);
        break;
      case '30d':
        predictionDate.setDate(predictionDate.getDate() + 30);
        break;
    }

    predictionPoints.push({
      x: predictionDate,
      y: prediction.predictedClose
    });

    return predictionPoints;
  };

  if (!filteredData.length) {
    return (
      <div className="flex items-center justify-center h-64 bg-white/5 rounded-lg">
        <p className="text-gray-400">No data available for the selected timeframe</p>
      </div>
    );
  }

  const chartData = {
    datasets: [
      {
        label: 'Price',
        data: filteredData.map(d => ({
          x: new Date(d.timestamp),
          y: d.close
        })),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        fill: false,
      },
      {
        label: 'Prediction',
        data: generatePredictionPoints(),
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 2,
        borderDash: [5, 5],
        pointBackgroundColor: 'rgb(255, 99, 132)',
        pointRadius: [0, 6], // Only show point at the prediction end
        pointHoverRadius: [0, 8],
        fill: false,
      },
      showIndicators.sma && indicators.sma20.length ? {
        label: 'SMA 20',
        data: indicators.sma20.map((value, index) => ({
          x: new Date(filteredData[index].timestamp),
          y: value
        })),
        borderColor: 'rgba(255, 165, 0, 0.8)',
        borderWidth: 1,
        pointRadius: 0,
        fill: false,
      } : null,
      showIndicators.sma && indicators.sma50.length ? {
        label: 'SMA 50',
        data: indicators.sma50.map((value, index) => ({
          x: new Date(filteredData[index].timestamp),
          y: value
        })),
        borderColor: 'rgba(147, 112, 219, 0.8)',
        borderWidth: 1,
        pointRadius: 0,
        fill: false,
      } : null,
    ].filter(Boolean),
  };

  const options = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: timeScope === '1D' ? 'hour' : 
                timeScope === '1W' ? 'day' : 'month'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Price (£)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          callback: (value: number) => `£${value.toLocaleString('en-GB', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}`,
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: £${value.toLocaleString('en-GB', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}`;
          },
        },
      },
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: 'x',
          drag: {
            enabled: true,
            backgroundColor: 'rgba(75, 192, 192, 0.1)',
            borderColor: 'rgb(75, 192, 192)',
            borderWidth: 1,
          },
        },
        limits: {
          x: {
            min: 'original',
            max: 'original',
          },
        },
      },
    },
  };

  return (
    <div className="relative">
      <div className="absolute top-2 right-2 z-10 space-x-2">
        <button
          onClick={() => {
            if (chartRef.current) {
              chartRef.current.resetZoom();
            }
          }}
          className="px-2 py-1 text-xs bg-white/10 hover:bg-white/20 rounded"
        >
          Reset Zoom
        </button>
      </div>
      <Line ref={chartRef} data={chartData} options={options} />
      {showIndicators.rsi && indicators.rsi.length > 0 && (
        <div className="mt-4">
          <Line
            data={{
              labels: chartData.datasets[0].data.map(d => d.x),
              datasets: [{
                label: 'RSI',
                data: indicators.rsi,
                borderColor: 'rgba(255, 99, 132, 0.8)',
                fill: false,
              }],
            }}
            options={{
              ...options,
              scales: {
                ...options.scales,
                y: {
                  min: 0,
                  max: 100,
                  grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                  },
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
};