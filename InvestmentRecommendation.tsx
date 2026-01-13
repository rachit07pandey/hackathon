import { AlertCircle, CheckCircle, Target } from 'lucide-react';

interface InvestmentRecommendationProps {
  company: any;
  userBudget: number;
}

export default function InvestmentRecommendation({ company, userBudget }: InvestmentRecommendationProps) {
  const calculateRecommendation = () => {
    if (!company.current_price || userBudget <= 0) {
      return { shares: 0, confidence: 0, reason: 'Invalid data' };
    }

    let confidence = 50;
    let reasoning: string[] = [];

    if (company.financial_safety >= 70) {
      confidence += 15;
      reasoning.push('Strong financial safety');
    } else if (company.financial_safety >= 50) {
      confidence += 5;
      reasoning.push('Moderate financial safety');
    } else {
      confidence -= 15;
      reasoning.push('Weak financial position');
    }

    if (company.free_cash_flow > 0) {
      confidence += 15;
      reasoning.push('Positive free cash flow');
    } else if (company.free_cash_flow < 0) {
      confidence -= 15;
      reasoning.push('Negative free cash flow');
    }

    if (company.peg_ratio && company.peg_ratio < 1) {
      confidence += 10;
      reasoning.push('Undervalued (PEG < 1)');
    } else if (company.peg_ratio && company.peg_ratio > 2) {
      confidence -= 10;
      reasoning.push('Potentially overvalued');
    }

    if (company.revenue_growth > 15) {
      confidence += 10;
      reasoning.push('Strong revenue growth');
    } else if (company.revenue_growth < 0) {
      confidence -= 10;
      reasoning.push('Declining revenue');
    }

    if (company.eps_growth > 15) {
      confidence += 10;
      reasoning.push('Strong earnings growth');
    }

    if (company.roe && company.roe > 15) {
      confidence += 5;
      reasoning.push('High return on equity');
    }

    confidence = Math.max(0, Math.min(100, confidence));
    const recommendedShares = Math.floor(userBudget / (company.current_price || 1));

    return {
      shares: recommendedShares,
      confidence: confidence,
      reason: reasoning.join(' • ')
    };
  };

  const recommendation = calculateRecommendation();
  const investmentAmount = recommendation.shares * (company.current_price || 0);

  const getConfidenceColor = (score: number) => {
    if (score >= 70) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getRecommendationStatus = (score: number) => {
    if (score >= 70) return 'Strong Buy';
    if (score >= 60) return 'Buy';
    if (score >= 50) return 'Hold';
    if (score >= 40) return 'Sell';
    return 'Strong Sell';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-emerald-100">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Investment Recommendation</h3>

      <div className={`p-6 rounded-xl border mb-6 ${getConfidenceColor(recommendation.confidence)}`}>
        <div className="flex items-start gap-4">
          <div className="mt-1">
            {recommendation.confidence >= 70 ? (
              <CheckCircle className="w-8 h-8" />
            ) : (
              <AlertCircle className="w-8 h-8" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-4xl font-bold">{recommendation.confidence}</span>
              <span className="text-lg text-gray-600">/ 100</span>
            </div>
            <p className="font-bold text-lg mb-1">{getRecommendationStatus(recommendation.confidence)}</p>
            <p className="text-sm">{recommendation.reason}</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200">
          <p className="text-xs text-gray-600 mb-1">Budget</p>
          <p className="text-2xl font-bold text-blue-600">${userBudget.toFixed(2)}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
          <p className="text-xs text-gray-600 mb-1">Price Per Share</p>
          <p className="text-2xl font-bold text-purple-600">${company.current_price?.toFixed(2) || '0'}</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-4 rounded-lg border border-emerald-200">
          <p className="text-xs text-gray-600 mb-1">Total Investment</p>
          <p className="text-2xl font-bold text-emerald-600">${investmentAmount.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <div className="flex items-start gap-3">
          <Target className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
          <div>
            <p className="font-bold text-blue-900 mb-2">Recommended Purchase</p>
            <p className="text-blue-800">
              <span className="text-3xl font-bold">{recommendation.shares}</span>
              <span className="text-lg ml-2">shares</span>
            </p>
            <p className="text-sm text-blue-700 mt-2">
              This will invest approximately {((investmentAmount / userBudget) * 100).toFixed(0)}% of your budget.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-xs text-gray-600">
        <p className="font-medium text-gray-700 mb-2">Disclaimer:</p>
        <p>This is an educational recommendation based on fundamental analysis. Not financial advice. Always do your own research and consult with a financial advisor before investing.</p>
      </div>
    </div>
  );
}
