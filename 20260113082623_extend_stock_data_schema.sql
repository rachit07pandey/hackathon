/*
  # Extended Stock Analysis Schema with Real Financial Data

  1. New Tables
    - `companies` - Store company financial data and valuations
      - `id` (uuid, primary key)
      - `ticker` (text, unique) - Stock ticker symbol
      - `name` (text) - Company name
      - `current_price` (numeric) - Current stock price
      - `market_cap` (numeric) - Market capitalization
      - `pe_ratio` (numeric) - Price to Earnings ratio
      - `peg_ratio` (numeric) - PEG ratio
      - `free_cash_flow` (numeric) - Free cash flow (positive or negative)
      - `fcf_status` (text) - 'positive' or 'negative'
      - `financial_safety` (numeric) - Safety score 0-100
      - `revenue_growth` (numeric) - Revenue growth %
      - `eps_growth` (numeric) - EPS growth %
      - `debt_to_equity` (numeric) - Debt to equity ratio
      - `profit_margin` (numeric) - Net profit margin %
      - `roe` (numeric) - Return on Equity %
      - `week_52_high` (numeric) - 52-week high
      - `week_52_low` (numeric) - 52-week low
      - `updated_at` (timestamptz)

    - `recent_investments` - Track recent investor activity
      - `id` (uuid, primary key)
      - `company_id` (uuid, foreign key)
      - `investor_name` (text) - Name of investor or fund
      - `shares_bought` (numeric) - Number of shares
      - `investment_date` (date) - Date of investment
      - `notes` (text) - Investment notes
      - `created_at` (timestamptz)

    - `portfolio_recommendations` - Store user recommendations
      - `id` (uuid, primary key)
      - `analysis_id` (uuid, foreign key)
      - `company_id` (uuid, foreign key)
      - `recommended_shares` (numeric) - How many shares to buy
      - `investment_amount` (numeric) - Suggested investment amount
      - `confidence_score` (numeric) - Recommendation confidence 0-100
      - `recommendation_reason` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Public read access for company and investment data
    - Anon users can create recommendations
*/

CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticker text UNIQUE NOT NULL,
  name text NOT NULL,
  current_price numeric,
  market_cap numeric,
  pe_ratio numeric,
  peg_ratio numeric,
  free_cash_flow numeric,
  fcf_status text DEFAULT 'unknown',
  financial_safety numeric DEFAULT 50,
  revenue_growth numeric,
  eps_growth numeric,
  debt_to_equity numeric,
  profit_margin numeric,
  roe numeric,
  week_52_high numeric,
  week_52_low numeric,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS recent_investments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  investor_name text NOT NULL,
  shares_bought numeric NOT NULL,
  investment_date date NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS portfolio_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id uuid NOT NULL REFERENCES stock_analyses(id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  recommended_shares numeric NOT NULL,
  investment_amount numeric NOT NULL,
  confidence_score numeric DEFAULT 50,
  recommendation_reason text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE recent_investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view companies"
  ON companies FOR SELECT
  TO anon USING (true);

CREATE POLICY "Anyone can view recent investments"
  ON recent_investments FOR SELECT
  TO anon USING (true);

CREATE POLICY "Anyone can view recommendations"
  ON portfolio_recommendations FOR SELECT
  TO anon USING (true);

CREATE POLICY "Anyone can insert recommendations"
  ON portfolio_recommendations FOR INSERT
  TO anon WITH CHECK (true);