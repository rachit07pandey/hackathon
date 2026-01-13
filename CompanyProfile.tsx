import { TrendingUp, TrendingDown, DollarSign, Shield, Zap } from 'lucide-react';

interface CompanyProfileProps {
  company: any;
}

export default function CompanyProfile({ company }: CompanyProfileProps) {
  const getFinancialSafetyColor = (score: number) => {
    if (score >= 70) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getFCFStatus = (fcf: number | null) => {
    if (fcf === null) return { label: 'Unknown', color: 'text-gray-600' };
    return fcf > 0 ? { label: 'Positive', color: 'text-green-600' } : { label: 'Negative', color: 'text-red-600' };
  };

  const fcfStatus = getFCFStatus(company.free_cash_flow);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-emerald-100">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800">{company.name}</h2>
        <p className="text-sm text-gray-500 mt-1">{company.ticker}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-6 rounded-xl border border-emerald-200">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            <p className="text-sm text-gray-600">Current Price</p>
          </div>
          <p className="text-3xl font-bold text-emerald-600">
            ${company.current_price?.toFixed(2) || 'N/A'}
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <p className="text-sm text-gray-600">Market Cap</p>
          </div>
          <p className="text-3xl font-bold text-blue-600">
            {company.market_cap
              ? `$${(company.market_cap / 1e9).toFixed(2)}B`
              : 'N/A'}
          </p>
        </div>

        <div className={`p-6 rounded-xl border ${getFinancialSafetyColor(company.financial_safety || 50)}`}>
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5" />
            <p className="text-sm text-gray-600">Financial Safety</p>
          </div>
          <p className="text-3xl font-bold">
            {company.financial_safety || 50}/100
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">P/E Ratio</p>
          <p className="text-2xl font-bold text-gray-800">
            {company.pe_ratio ? company.pe_ratio.toFixed(2) : 'N/A'}
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">PEG Ratio</p>
          <p className="text-2xl font-bold text-gray-800">
            {company.peg_ratio ? company.peg_ratio.toFixed(2) : 'N/A'}
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Revenue Growth</p>
          <p className="text-2xl font-bold text-emerald-600">
            {company.revenue_growth ? `${company.revenue_growth.toFixed(2)}%` : 'N/A'}
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">EPS Growth</p>
          <p className="text-2xl font-bold text-emerald-600">
            {company.eps_growth ? `${company.eps_growth.toFixed(2)}%` : 'N/A'}
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Profit Margin</p>
          <p className="text-2xl font-bold text-gray-800">
            {company.profit_margin ? `${company.profit_margin.toFixed(2)}%` : 'N/A'}
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">ROE</p>
          <p className="text-2xl font-bold text-gray-800">
            {company.roe ? `${company.roe.toFixed(2)}%` : 'N/A'}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <p className="text-sm font-semibold text-gray-700">52-Week Range</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">High: <span className="font-bold text-green-600">${company.week_52_high?.toFixed(2) || 'N/A'}</span></p>
            <p className="text-sm text-gray-600">Low: <span className="font-bold text-green-600">${company.week_52_low?.toFixed(2) || 'N/A'}</span></p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-xl border border-orange-200">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-orange-600" />
            <p className="text-sm font-semibold text-gray-700">Free Cash Flow</p>
          </div>
          <p className={`text-3xl font-bold ${fcfStatus.color}`}>
            {company.free_cash_flow !== null
              ? `$${(company.free_cash_flow / 1e9).toFixed(2)}B`
              : 'N/A'}
          </p>
          <p className={`text-sm font-medium mt-2 ${fcfStatus.color}`}>
            {fcfStatus.label}
          </p>
        </div>
      </div>
    </div>
  );
}
