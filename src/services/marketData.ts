import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useAdminStore } from '../store/adminStore';

const ALPHAVANTAGE_BASE_URL = 'https://www.alphavantage.co/query';
const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';
const POLYGON_BASE_URL = 'https://api.polygon.io/v2';

export const useMarketData = (symbol: string) => {
  const { apiConfig } = useAdminStore();

  const fetchAlphaVantage = async () => {
    if (!apiConfig.alphavantage.enabled) return null;
    
    const response = await axios.get(ALPHAVANTAGE_BASE_URL, {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol,
        apikey: apiConfig.alphavantage.apiKey,
        outputsize: 'full',
      },
    });
    
    return response.data;
  };

  const fetchFinnhub = async () => {
    if (!apiConfig.finnhub.enabled) return null;
    
    const response = await axios.get(`${FINNHUB_BASE_URL}/quote`, {
      params: {
        symbol,
        token: apiConfig.finnhub.apiKey,
      },
    });
    
    return response.data;
  };

  const fetchPolygon = async () => {
    if (!apiConfig.polygon.enabled) return null;
    
    const response = await axios.get(
      `${POLYGON_BASE_URL}/aggs/ticker/${symbol}/range/1/day/2023-01-01/2024-12-31`,
      {
        params: {
          apiKey: apiConfig.polygon.apiKey,
        },
      }
    );
    
    return response.data;
  };

  return useQuery({
    queryKey: ['marketData', symbol],
    queryFn: async () => {
      const [alphavantageData, finnhubData, polygonData] = await Promise.all([
        fetchAlphaVantage(),
        fetchFinnhub(),
        fetchPolygon(),
      ]);

      return {
        alphavantage: alphavantageData,
        finnhub: finnhubData,
        polygon: polygonData,
      };
    },
    enabled: symbol.length > 0 && Object.values(apiConfig).some(config => config.enabled),
  });
};