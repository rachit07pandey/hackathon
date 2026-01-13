import { User, Calendar, TrendingUp } from 'lucide-react';

interface Investment {
  id: string;
  investor_name: string;
  shares_bought: number;
  investment_date: string;
  notes: string | null;
}

interface RecentInvestorActivityProps {
  investments: Investment[];
  currentPrice: number;
}

export default function RecentInvestorActivity({ investments, currentPrice }: RecentInvestorActivityProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const calculateValue = (shares: number) => {
    return (shares * currentPrice).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-emerald-100">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Recent Investor Activity</h3>

      {investments.length === 0 ? (
        <div className="text-center py-12">
          <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No recent investor activity</p>
        </div>
      ) : (
        <div className="space-y-4">
          {investments.map((investment) => (
            <div
              key={investment.id}
              className="p-4 rounded-lg border border-gray-200 hover:border-emerald-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-800 truncate">
                      {investment.investor_name}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(investment.investment_date)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="ml-13 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Shares Purchased:</span>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="font-bold text-green-600">
                      {investment.shares_bought.toLocaleString()} shares
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Investment Value (at current price):</span>
                  <span className="font-bold text-emerald-600">
                    {calculateValue(investment.shares_bought)}
                  </span>
                </div>

                {investment.notes && (
                  <div className="bg-blue-50 rounded p-2 border border-blue-200">
                    <p className="text-xs text-blue-700 italic">
                      <span className="font-medium">Note:</span> {investment.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
