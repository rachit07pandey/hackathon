import { CheckCircle, AlertTriangle, XCircle, TrendingUp, BarChart3, Calculator } from 'lucide-react';

interface Analysis {
  id: string;
  company_name: string;
  ticker_symbol: string;
  revenue_growth: number;
  eps_growth: number;
  peg_ratio: number;
  analysis_score: number;
  created_at: string;
}

interface AnalysisResultsProps {
  analysis: Analysis;
}

export default function AnalysisResults({ analysis }: AnalysisResultsProps) {
  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 70) return <CheckCircle className="w-8 h-8" />;
    if (score >= 50) return <AlertTriangle className="w-8 h-8" />;
    return <XCircle className="w-8 h-8" />;
  };

  const getScoreLabel = (score: number) => {
    if (score >= 70) return 'Strong Investment';
    if (score >= 50) return 'Moderate Investment';
    return 'Weak Investment';
  };

  const getScoreDescription = (score: number) => {
    if (score >= 70) {
      return 'This stock shows strong fundamentals with good growth and valuation metrics. Consider it for your portfolio.';
    }
    if (score >= 50) {
      return 'This stock has decent metrics but shows some concerns. Do more research before investing.';
    }
    return 'This stock shows weak fundamentals. Be cautious and consider other opportunities.';
  };

  const getMetricStatus = (value: number, type: 'revenue' | 'eps' | 'peg') => {
    if (type === 'peg') {
      if (value < 1) return { color: 'text-green-600', label: 'Excellent' };
      if (value < 1.5) return { color: 'text-yellow-600', label: 'Good' };
      if (value < 2) return { color: 'text-orange-600', label: 'Fair' };
      return { color: 'text-red-600', label: 'Poor' };
    } else {
      if (value > 20) return { color: 'text-green-600', label: 'Excellent' };
      if (value > 10) return { color: 'text-yellow-600', label: 'Good' };
      if (value > 0) return { color: 'text-orange-600', label: 'Fair' };
      return { color: 'text-red-600', label: 'Poor' };
    }
  };

  const revenueStatus = getMetricStatus(analysis.revenue_growth, 'revenue');
  const epsStatus = getMetricStatus(analysis.eps_growth, 'eps');
  const pegStatus = getMetricStatus(analysis.peg_ratio, 'peg');

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-emerald-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Analysis Results
      </h2>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-xl font-semibold text-gray-800">
            {analysis.company_name}
          </h3>
          {analysis.ticker_symbol && (
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
              {analysis.ticker_symbol}
            </span>
          )}
        </div>
      </div>

      <div className={`flex items-center gap-4 p-6 rounded-xl border-2 mb-8 ${
        analysis.analysis_score >= 70 ? 'bg-green-50 border-green-200' :
        analysis.analysis_score >= 50 ? 'bg-yellow-50 border-yellow-200' :
        'bg-red-50 border-red-200'
      }`}>
        <div className={getScoreColor(analysis.analysis_score)}>
          {getScoreIcon(analysis.analysis_score)}
        </div>
        <div className="flex-1">
          <div className="flex items-baseline gap-3 mb-1">
            <span className={`text-4xl font-bold ${getScoreColor(analysis.analysis_score)}`}>
              {analysis.analysis_score}
            </span>
            <span className="text-gray-600">/ 100</span>
          </div>
          <p className={`font-semibold ${getScoreColor(analysis.analysis_score)}`}>
            {getScoreLabel(analysis.analysis_score)}
          </p>
        </div>
      </div>

      <p className="text-gray-600 mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        {getScoreDescription(analysis.analysis_score)}
      </p>

      <div className="space-y-4">
        <h4 className="font-semibold text-gray-700 mb-4">Metric Breakdown</h4>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            <div>
              <p className="text-sm text-gray-600">Revenue Growth</p>
              <p className="text-xl font-bold text-gray-800">{analysis.revenue_growth}%</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${revenueStatus.color} bg-white border`}>
            {revenueStatus.label}
          </span>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <div>
              <p className="text-sm text-gray-600">EPS Growth</p>
              <p className="text-xl font-bold text-gray-800">{analysis.eps_growth}%</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${epsStatus.color} bg-white border`}>
            {epsStatus.label}
          </span>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Calculator className="w-5 h-5 text-emerald-600" />
            <div>
              <p className="text-sm text-gray-600">PEG Ratio</p>
              <p className="text-xl font-bold text-gray-800">{analysis.peg_ratio}</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${pegStatus.color} bg-white border`}>
            {pegStatus.label}
          </span>
        </div>
      </div>
    </div>
  );
}
