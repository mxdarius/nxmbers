import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface AssetSearchProps {
  onSearch: (symbol: string) => void;
}

export const AssetSearch: React.FC<AssetSearchProps> = ({ onSearch }) => {
  const [symbol, setSymbol] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (symbol.trim()) {
      onSearch(symbol.toUpperCase());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md">
      <input
        type="text"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        placeholder="Enter stock or crypto symbol..."
        className="input-field pl-10"
      />
      <Search className="absolute left-3 top-2.5 h-5 w-5 text-primary-400" />
      <button
        type="submit"
        className="absolute right-2 top-1.5 px-3 py-1 text-sm bg-primary-600 hover:bg-primary-500 
                   text-white rounded transition-colors duration-200 hover:shadow-lg"
      >
        Search
      </button>
    </form>
  );
};