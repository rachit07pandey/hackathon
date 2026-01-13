import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface StockData {
  ticker: string;
  name: string;
  current_price: number;
  market_cap: number | null;
  pe_ratio: number | null;
  dividend_yield: number | null;
  week_52_high: number | null;
  week_52_low: number | null;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { ticker } = await req.json();

    if (!ticker) {
      return new Response(
        JSON.stringify({ error: "Ticker symbol required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const finnhubKey = Deno.env.get("FINNHUB_API_KEY") || "sandbox";
    const baseUrl = "https://finnhub.io/api/v1";

    const [quoteRes, profileRes] = await Promise.all([
      fetch(`${baseUrl}/quote?symbol=${ticker}&token=${finnhubKey}`),
      fetch(`${baseUrl}/stock/profile2?symbol=${ticker}&token=${finnhubKey}`),
    ]);

    const quote = await quoteRes.json();
    const profile = await profileRes.json();

    const stockData: StockData = {
      ticker: ticker,
      name: profile.name || ticker,
      current_price: quote.c || 0,
      market_cap: profile.marketCapitalization ? profile.marketCapitalization * 1000000 : null,
      pe_ratio: quote.pc ? quote.c / quote.pc : null,
      dividend_yield: profile.finnhubIndustry ? 0 : null,
      week_52_high: quote.h || null,
      week_52_low: quote.l || null,
    };

    return new Response(JSON.stringify(stockData), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Failed to fetch stock data",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});