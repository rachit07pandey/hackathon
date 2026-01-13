import { useState } from 'react';
import { Search, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface StockSearchProps {
  onStockSelect: (company: any) => void;
}

export default function StockSearch({ onStockSelect }: StockSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  const fetchStockData = async (ticker: string) => {
    try {
      setLoading(true);
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/fetch-stock-data`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ticker: ticker.toUpperCase() }),
      });

      if (!response.ok) throw new Error('Failed to fetch stock data');

      const stockData = await response.json();

      let company = await supabase
        .from('companies')
        .select('*')
        .eq('ticker', ticker.toUpperCase())
        .maybeSingle();

      if (!company.data) {
        const { data: newCompany } = await supabase
          .from('companies')
          .insert([stockData])
          .select()
          .single();

        return newCompany;
      }

      const { data: updatedCompany } = await supabase
        .from('companies')
        .update(stockData)
        .eq('ticker', ticker.toUpperCase())
        .select()
        .single();

      return updatedCompany;
    } catch (error) {
      console.error('Error fetching stock:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    const company = await fetchStockData(searchTerm);
    if (company) {
      setResults([company]);
      setShowResults(true);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowResults(false);
            }}
            placeholder="Search stock ticker (e.g., AAPL, TSLA, MSFT)"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
        >
          {loading ? <Loader className="w-5 h-5 animate-spin" /> : 'Search'}
        </button>
      </form>

      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-emerald-100 z-10">
          {results.map((stock) => (
            <button
              key={stock.id}
              onClick={() => {
                onStockSelect(stock);
                setSearchTerm('');
                setShowResults(false);
                setResults([]);
              }}
              className="w-full text-left p-4 hover:bg-emerald-50 border-b last:border-b-0 transition-colors"
            >
              <div className="font-semibold text-gray-800">{stock.ticker}</div>
              <div className="text-sm text-gray-600">{stock.name}</div>
              <div className="text-sm font-medium text-emerald-600 mt-1">
                ${stock.current_price?.toFixed(2) || 'N/A'}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
