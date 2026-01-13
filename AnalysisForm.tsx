import { useState } from 'react';
import { TrendingUp, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AnalysisFormProps {
  onAnalysisComplete: (analysis: any) => void;
}

export default function AnalysisForm({ onAnalysisComplete }: AnalysisFormProps) {
  const [formData, setFormData] = useState({
    companyName: '',
    tickerSymbol: '',
    revenueGrowth: '',
    epsGrowth: '',
    pegRatio: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculateScore = (revenue: number, eps: number, peg: number) => {
    let score = 50;

    if (revenue > 20) score += 15;
    else if (revenue > 10) score += 10;
    else if (revenue > 0) score += 5;
    else score -= 5;

    if (eps > 20) score += 15;
    else if (eps > 10) score += 10;
    else if (eps > 0) score += 5;
    else score -= 5;

    if (peg < 1) score += 20;
    else if (peg < 1.5) score += 10;
    else if (peg < 2) score += 5;
    else score -= 10;

    return Math.max(0, Math.min(100, score));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const revenue = parseFloat(formData.revenueGrowth);
      const eps = parseFloat(formData.epsGrowth);
      const peg = parseFloat(formData.pegRatio);

      if (isNaN(revenue) || isNaN(eps) || isNaN(peg)) {
        throw new Error('Please enter valid numbers for all metrics');
      }

      const analysisScore = calculateScore(revenue, eps, peg);

      const { data, error: supabaseError } = await supabase
        .from('stock_analyses')
        .insert([
          {
            company_name: formData.companyName,
            ticker_symbol: formData.tickerSymbol,
            revenue_growth: revenue,
            eps_growth: eps,
            peg_ratio: peg,
            analysis_score: analysisScore
          }
        ])
        .select()
        .single();

      if (supabaseError) throw supabaseError;

      if (data) {
        onAnalysisComplete(data);
        setFormData({
          companyName: '',
          tickerSymbol: '',
          revenueGrowth: '',
          epsGrowth: '',
          pegRatio: ''
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-emerald-100">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-6 h-6 text-emerald-600" />
        <h2 className="text-2xl font-bold text-gray-800">Analyze a Stock</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name
            </label>
            <input
              type="text"
              required
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              placeholder="e.g., Apple Inc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ticker Symbol
              <span className="text-gray-400 text-xs ml-2">(optional)</span>
            </label>
            <input
              type="text"
              value={formData.tickerSymbol}
              onChange={(e) => setFormData({ ...formData, tickerSymbol: e.target.value.toUpperCase() })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              placeholder="e.g., AAPL"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Revenue Growth (%)
            <span className="text-gray-500 text-xs ml-2">How fast are sales growing?</span>
          </label>
          <input
            type="number"
            step="0.01"
            required
            value={formData.revenueGrowth}
            onChange={(e) => setFormData({ ...formData, revenueGrowth: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            placeholder="e.g., 15.5"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            EPS Growth (%)
            <span className="text-gray-500 text-xs ml-2">How much are earnings increasing?</span>
          </label>
          <input
            type="number"
            step="0.01"
            required
            value={formData.epsGrowth}
            onChange={(e) => setFormData({ ...formData, epsGrowth: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            placeholder="e.g., 12.3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            PEG Ratio
            <span className="text-gray-500 text-xs ml-2">Is the stock fairly valued?</span>
          </label>
          <input
            type="number"
            step="0.01"
            required
            value={formData.pegRatio}
            onChange={(e) => setFormData({ ...formData, pegRatio: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            placeholder="e.g., 0.85"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? 'Analyzing...' : 'Analyze Stock'}
        </button>
      </form>
    </div>
  );
}
