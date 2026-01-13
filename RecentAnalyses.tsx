import { Clock } from 'lucide-react';

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

interface RecentAnalysesProps {
  analyses: Analysis[];
}

export default function RecentAnalyses({ analyses }: RecentAnalysesProps) {
  const getScoreColor = (score: number) => {
    if (score >= 70) return 'bg-green-100 text-green-700 border-green-200';
    if (score >= 50) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-red-100 text-red-700 border-red-200';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100 sticky top-8">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 text-emerald-600" />
        <h3 className="text-lg font-bold text-gray-800">Recent Analyses</h3>
      </div>

      {analyses.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400 text-sm">No analyses yet</p>
          <p className="text-gray-400 text-xs mt-1">Start by analyzing your first stock</p>
        </div>
      ) : (
        <div className="space-y-3">
          {analyses.map((analysis) => (
            <div
              key={analysis.id}
              className="p-4 rounded-lg border border-gray-200 hover:border-emerald-200 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-800 truncate">
                    {analysis.company_name}
                  </h4>
                  {analysis.ticker_symbol && (
                    <p className="text-xs text-gray-500">{analysis.ticker_symbol}</p>
                  )}
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getScoreColor(analysis.analysis_score)}`}>
                  {analysis.analysis_score}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                <div>
                  <p className="text-gray-500">Rev</p>
                  <p className="font-semibold text-gray-700">{analysis.revenue_growth}%</p>
                </div>
                <div>
                  <p className="text-gray-500">EPS</p>
                  <p className="font-semibold text-gray-700">{analysis.eps_growth}%</p>
                </div>
                <div>
                  <p className="text-gray-500">PEG</p>
                  <p className="font-semibold text-gray-700">{analysis.peg_ratio}</p>
                </div>
              </div>

              <p className="text-xs text-gray-400">
                {formatDate(analysis.created_at)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
