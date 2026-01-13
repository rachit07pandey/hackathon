/*
  # Create Stock Analyses Table

  1. New Tables
    - `stock_analyses`
      - `id` (uuid, primary key) - Unique identifier for each analysis
      - `company_name` (text) - Name of the company being analyzed
      - `ticker_symbol` (text) - Stock ticker symbol (optional)
      - `revenue_growth` (numeric) - Revenue growth percentage
      - `eps_growth` (numeric) - EPS (Earnings Per Share) growth percentage
      - `peg_ratio` (numeric) - PEG (Price/Earnings to Growth) ratio
      - `analysis_score` (numeric) - Calculated score based on metrics
      - `created_at` (timestamptz) - Timestamp of analysis creation
  
  2. Security
    - Enable RLS on `stock_analyses` table
    - Add policy for anyone to insert analyses (public access for beginners)
    - Add policy for anyone to read analyses (public access)
  
  3. Notes
    - This is a beginner-friendly educational tool
    - Public access allows users to learn without authentication barriers
    - Analysis score helps beginners understand stock health at a glance
*/

CREATE TABLE IF NOT EXISTS stock_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  ticker_symbol text DEFAULT '',
  revenue_growth numeric NOT NULL,
  eps_growth numeric NOT NULL,
  peg_ratio numeric NOT NULL,
  analysis_score numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE stock_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert stock analyses"
  ON stock_analyses
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can view stock analyses"
  ON stock_analyses
  FOR SELECT
  TO anon
  USING (true);