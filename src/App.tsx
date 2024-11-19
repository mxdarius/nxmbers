import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Activity, BarChart3, Settings } from 'lucide-react';
import { AssetSearch } from './components/AssetSearch';
import { PriceChart } from './components/Chart';
import { PredictionCard } from './components/PredictionCard';
import { TimeControls } from './components/TimeControls';
import { IndicatorControls } from './components/IndicatorControls';
import { PredictionTimeControls } from './components/PredictionTimeControls';
import { AdminPortal } from './pages/AdminPortal';
import { useMarketData } from './services/marketData';
import { usePrediction } from './services/predictions';
import { TimeScope, TimeFrame } from './types';

function App() {
  const [symbol, setSymbol] = useState<string>('');
  const [timeScope, setTimeScope] = useState<TimeScope>('1M');
  const [predictionTimeFrame, setPredictionTimeFrame] = useState<TimeFrame>('24h');
  const [indicators, setIndicators] = useState({
    sma: false,
    rsi: false,
    macd: false,
  });

  const { data: marketData, isLoading: isMarketDataLoading } = useMarketData(symbol);
  const { data: prediction, isLoading: isPredictionLoading } = usePrediction(symbol, predictionTimeFrame);

  const handleSearch = (newSymbol: string) => {
    setSymbol(newSymbol);
  };

  const toggleIndicator = (indicator: 'sma' | 'rsi' | 'macd') => {
    setIndicators(prev => ({
      ...prev,
      [indicator]: !prev[indicator]
    }));
  };

  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminPortal />} />
        <Route path="/" element={
          <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-900 via-gray-900 to-black">
            <nav className="glass-panel border-b border-white/10">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-primary-500/20 backdrop-blur-sm animate-glow">
                      <Activity className="h-8 w-8 text-primary-400" />
                    </div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-purple-400">
                      MXCHINES
                    </h1>
                  </div>
                  <div className="flex items-center space-x-4">
                    <AssetSearch onSearch={handleSearch} />
                    <Link
                      to="/admin"
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <Settings className="h-6 w-6 text-primary-400" />
                    </Link>
                  </div>
                </div>
              </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {symbol ? (
                <div className="mb-8 space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-primary-500/10">
                      <BarChart3 className="h-6 w-6 text-primary-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-white/90">{symbol} Analysis</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                      <div className="glass-panel p-6">
                        <TimeControls
                          activeScope={timeScope}
                          onScopeChange={setTimeScope}
                        />
                        <PredictionTimeControls
                          activeTimeFrame={predictionTimeFrame}
                          onTimeFrameChange={setPredictionTimeFrame}
                        />
                        <IndicatorControls
                          indicators={indicators}
                          onToggle={toggleIndicator}
                        />
                        {isMarketDataLoading ? (
                          <div className="flex items-center justify-center h-64">
                            <p className="text-gray-400">Loading market data...</p>
                          </div>
                        ) : (
                          <PriceChart 
                            data={marketData?.alphavantage?.['Time Series (Daily)'] || []}
                            prediction={prediction}
                            timeScope={timeScope}
                            showIndicators={indicators}
                          />
                        )}
                      </div>
                    </div>
                    
                    <div>
                      {isPredictionLoading ? (
                        <div className="glass-panel p-6">
                          <p className="text-gray-400">Generating prediction...</p>
                        </div>
                      ) : (
                        <PredictionCard 
                          prediction={prediction}
                          currentPrice={marketData?.finnhub?.c || 0}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="p-4 rounded-full bg-primary-500/20 backdrop-blur-sm w-24 h-24 mx-auto mb-6 flex items-center justify-center animate-glow">
                    <Activity className="h-12 w-12 text-primary-400" />
                  </div>
                  <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-purple-400">
                    Welcome to MXCHINES
                  </h2>
                  <p className="text-gray-400 max-w-2xl mx-auto">
                    Enter a stock or cryptocurrency symbol above to begin analyzing market trends 
                    and receiving AI-powered predictions.
                  </p>
                </div>
              )}
            </main>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;