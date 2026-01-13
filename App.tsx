import { useState, useEffect } from 'react';
import { TrendingUp, Info, BarChart3, Calculator } from 'lucide-react';
import { supabase } from './lib/supabase';
import AnalysisForm from './components/AnalysisForm';
import AnalysisResults from './components/AnalysisResults';
import RecentAnalyses from './components/RecentAnalyses';
import InfoCard from './components/InfoCard';
import StockSearch from './components/StockSearch';
import CompanyProfile from './components/CompanyProfile';
import InvestmentRecommendation from './components/InvestmentRecommendation';
import RecentInvestorActivity from './components/RecentInvestorActivity';

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

interface Company {
  id: string;
  ticker: string;
  name: string;
  current_price: number;
  market_cap: number;
  pe_ratio: number;
  peg_ratio: number;
  free_cash_flow: number;
  financial_safety: number;
  revenue_growth: number;
  eps_growth: number;
  debt_to_equity: number;
  profit_margin: number;
  roe: number;
  week_52_high: number;
  week_52_low: number;
}

interface Investment {
  id: string;
  investor_name: string;
  shares_bought: number;
  investment_date: string;
  notes: string | null;
}

function App() {
  const [currentAnalysis, setCurrentAnalysis] = useState<Analysis | null>(null);
  const [recentAnalyses, setRecentAnalyses] = useState<Analysis[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [investorActivity, setInvestorActivity] = useState<Investment[]>([]);
  const [userBudget, setUserBudget] = useState(10000);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    fetchRecentAnalyses();
  }, []);

  const fetchRecentAnalyses = async () => {
    const { data } = await supabase
      .from('stock_analyses')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (data) {
      setRecentAnalyses(data);
    }
  };

  const handleNewAnalysis = (analysis: Analysis) => {
    setCurrentAnalysis(analysis);
    fetchRecentAnalyses();
  };

  const handleStockSelect = async (company: Company) => {
    setSelectedCompany(company);
    const { data } = await supabase
      .from('recent_investments')
      .select('*')
      .eq('company_id', company.id)
      .order('investment_date', { ascending: false })
      .limit(10);

    if (data) {
      setInvestorActivity(data);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="w-12 h-12 text-emerald-600" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              GreenInvesta
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Your beginner-friendly stock analysis tool. Learn to evaluate stocks using key financial metrics.
          </p>

          <button
            onClick={() => setShowInfo(!showInfo)}
            className="mt-4 inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            <Info className="w-5 h-5" />
            <span className="text-sm font-medium">What do these metrics mean?</span>
          </button>
        </header>

        {showInfo && (
          <div className="mb-8 grid md:grid-cols-3 gap-4">
            <InfoCard
              icon={<BarChart3 className="w-6 h-6" />}
              title="Revenue Growth"
              description="Shows how fast a company's sales are increasing. Higher is generally better, indicating business expansion."
              example="20% means revenue grew by 20% compared to last year"
            />
            <InfoCard
              icon={<TrendingUp className="w-6 h-6" />}
              title="EPS Growth"
              description="Earnings Per Share growth shows if a company is becoming more profitable. Positive growth is good for investors."
              example="15% means earnings per share increased by 15%"
            />
            <InfoCard
              icon={<Calculator className="w-6 h-6" />}
              title="PEG Ratio"
              description="Price/Earnings to Growth ratio. A PEG under 1.0 may indicate an undervalued stock. Lower values suggest better value."
              example="0.8 might indicate good value, 2.0 might be overvalued"
            />
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Search Real Stocks</h2>
              <StockSearch onStockSelect={handleStockSelect} />
            </div>

            {selectedCompany && (
              <>
                <CompanyProfile company={selectedCompany} />
                <InvestmentRecommendation company={selectedCompany} userBudget={userBudget} />
              </>
            )}

            {investorActivity.length > 0 && selectedCompany && (
              <RecentInvestorActivity
                investments={investorActivity}
                currentPrice={selectedCompany.current_price || 0}
              />
            )}
          </div>

          <div>
            <RecentAnalyses analyses={recentAnalyses} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-emerald-100 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Manual Stock Analysis</h2>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <AnalysisForm onAnalysisComplete={handleNewAnalysis} />

              {currentAnalysis && (
                <AnalysisResults analysis={currentAnalysis} />
              )}
            </div>

            <div>
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-100">
                <h3 className="font-bold text-gray-800 mb-4">Your Investment Budget</h3>
                <div className="space-y-3">
                  <div className="text-3xl font-bold text-emerald-600">
                    ${userBudget.toLocaleString()}
                  </div>
                  <input
                    type="number"
                    value={userBudget}
                    onChange={(e) => setUserBudget(parseFloat(e.target.value) || 0)}
                    min="0"
                    className="w-full px-4 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Enter your budget"
                  />
                  <p className="text-xs text-gray-600">Adjust this to see how many shares you can buy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>Educational tool for learning stock analysis. Not financial advice.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
