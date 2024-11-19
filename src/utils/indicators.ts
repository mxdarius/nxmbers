export const calculateSMA = (data: number[], period: number): number[] => {
  if (!data.length || period <= 0) return [];
  
  const sma = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      sma.push(null);
      continue;
    }
    const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    sma.push(sum / period);
  }
  return sma;
};

export const calculateRSI = (data: number[], period: number = 14): number[] => {
  if (data.length < 2) return [];
  
  const rsi = [];
  const gains = [];
  const losses = [];

  // Calculate price changes
  for (let i = 1; i < data.length; i++) {
    const change = data[i] - data[i - 1];
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? -change : 0);
  }

  // Handle empty data case
  if (gains.length === 0 || losses.length === 0) {
    return Array(data.length).fill(50);
  }

  // Calculate initial average gain and loss
  const avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
  const avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;

  let prevAvgGain = avgGain;
  let prevAvgLoss = avgLoss;

  // Fill initial values with null
  for (let i = 0; i < period; i++) {
    rsi.push(null);
  }

  // Calculate RSI
  for (let i = period; i < data.length; i++) {
    const currentGain = gains[i - 1];
    const currentLoss = losses[i - 1];

    const smoothedAvgGain = (prevAvgGain * (period - 1) + currentGain) / period;
    const smoothedAvgLoss = (prevAvgLoss * (period - 1) + currentLoss) / period;

    prevAvgGain = smoothedAvgGain;
    prevAvgLoss = smoothedAvgLoss;

    const rs = smoothedAvgLoss === 0 ? 100 : smoothedAvgGain / smoothedAvgLoss;
    const currentRSI = 100 - (100 / (1 + rs));

    rsi.push(currentRSI);
  }

  return rsi;
};

export const calculateMACD = (data: number[], fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) => {
  if (data.length < Math.max(fastPeriod, slowPeriod, signalPeriod)) {
    return {
      line: [],
      signal: [],
      histogram: []
    };
  }

  const ema = (data: number[], period: number) => {
    if (data.length === 0) return [];
    
    const k = 2 / (period + 1);
    const emaData = [data[0]];
    
    for (let i = 1; i < data.length; i++) {
      emaData.push(data[i] * k + emaData[i - 1] * (1 - k));
    }
    
    return emaData;
  };

  const fastEMA = ema(data, fastPeriod);
  const slowEMA = ema(data, slowPeriod);
  const macdLine = fastEMA.map((fast, i) => fast - slowEMA[i]);
  const signalLine = ema(macdLine, signalPeriod);
  const histogram = macdLine.map((macd, i) => macd - signalLine[i]);

  return {
    line: macdLine,
    signal: signalLine,
    histogram: histogram
  };
};