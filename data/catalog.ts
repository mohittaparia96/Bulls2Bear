// Sample catalogue — edit freely. Prices are in rupees here; the seed converts them to paise.
// Chapters marked `free: true` are open previews; everything else requires purchase.
export type SeedChapter = { slug: string; title: string; summary: string; min: number; free?: boolean };
export type SeedCourse = {
  slug: string; title: string; subtitle: string; category: string; level: string; description: string;
  outcomes: string[]; price: number; mrp: number; accent: 'green' | 'lime' | 'gold' | 'cyan' | 'violet' | 'pink'; icon: string; chapters: SeedChapter[];
};

export const catalog: SeedCourse[] = [
  {
    // A fully FREE course (price 0): every chapter is open, no checkout needed.
    slug: 'market-basics-starter', title: 'Market Basics Starter Kit', subtitle: 'Your free first step into the stock market',
    category: 'Foundation', level: 'Beginner', icon: '🚀', accent: 'lime', price: 0, mrp: 0,
    description: 'A free, no-jargon crash course: what bull and bear markets are, what moves prices, and the beginner mistakes to avoid before you invest a rupee.',
    outcomes: ['The difference between bull and bear markets', 'What really moves a stock price', 'How to build your first watchlist', 'The 5 most common beginner mistakes'],
    chapters: [
      { slug: 'bull-vs-bear', title: 'Bull vs Bear Markets', summary: 'The two moods of every market, explained with real Nifty history.', min: 7, free: true },
      { slug: 'what-moves-prices', title: 'What Moves Stock Prices?', summary: 'Earnings, news, interest rates and crowd psychology.', min: 9, free: true },
      { slug: 'first-watchlist', title: 'Build Your First Watchlist', summary: 'Pick, track and learn from 10 stocks — without buying any.', min: 8, free: true },
      { slug: 'beginner-mistakes', title: '5 Beginner Mistakes to Avoid', summary: 'Tips groups, over-trading, no stop-loss and more.', min: 10, free: true },
    ],
  },
  {
    slug: 'stock-market-foundations', title: 'Stock Market Foundations', subtitle: 'From zero to confidently placing your first trade',
    category: 'Foundation', level: 'Beginner', icon: '📊', accent: 'green', price: 1499, mrp: 2999,
    description: 'Understand how Indian markets really work — exchanges, indices, order types, demat accounts, settlement and the language every investor needs before risking a single rupee.',
    outcomes: ['How NSE, BSE, SEBI and brokers fit together', 'Market, limit, stop-loss and GTT orders', 'Reading a stock quote and market depth', 'Building a simple, risk-aware first portfolio'],
    chapters: [
      { slug: 'welcome', title: 'Welcome to bulls2bear', summary: 'What this course covers and how to get the most from it.', min: 6, free: true },
      { slug: 'how-markets-work', title: 'How the Stock Market Works', summary: 'Exchanges, regulators, brokers and depositories explained simply.', min: 14, free: true },
      { slug: 'demat-and-trading', title: 'Demat & Trading Accounts', summary: 'Opening accounts, KYC, charges and choosing a broker.', min: 12 },
      { slug: 'indices', title: 'Nifty, Sensex & Sector Indices', summary: 'What indices measure and why they matter.', min: 11 },
      { slug: 'order-types', title: 'Order Types Masterclass', summary: 'Market, limit, SL, SL-M, GTT and AMO orders with live examples.', min: 18 },
      { slug: 'reading-quotes', title: 'Reading Quotes & Market Depth', summary: 'Bid/ask, volume, circuits and the order book.', min: 13 },
      { slug: 'first-portfolio', title: 'Building Your First Portfolio', summary: 'Diversification, position sizing and long-term thinking.', min: 16 },
    ],
  },
  {
    slug: 'technical-analysis-essentials', title: 'Technical Analysis Essentials', subtitle: 'Read price charts like a professional',
    category: 'Technical Analysis', level: 'Beginner → Intermediate', icon: '🕯️', accent: 'cyan', price: 2999, mrp: 5999,
    description: 'Learn market structure, candlesticks, support & resistance, trendlines, volume and indicators — and, more importantly, when not to trust them.',
    outcomes: ['Identify trend, range and reversal structures', 'Draw support/resistance and trendlines objectively', 'Use RSI, MACD and moving averages in context', 'Build a rules-based chart checklist'],
    chapters: [
      { slug: 'intro', title: 'Why Charts Matter', summary: 'Price discounts everything — and what that really means.', min: 8, free: true },
      { slug: 'candlesticks', title: 'Candlestick Anatomy', summary: 'Bodies, wicks and what each candle tells you.', min: 15, free: true },
      { slug: 'market-structure', title: 'Market Structure: HH, HL, LH, LL', summary: 'Reading trends without any indicator.', min: 17 },
      { slug: 'support-resistance', title: 'Support & Resistance', summary: 'Zones, flips and false breakouts.', min: 19 },
      { slug: 'trendlines-channels', title: 'Trendlines & Channels', summary: 'Drawing them consistently, every time.', min: 14 },
      { slug: 'chart-patterns', title: 'Classic Chart Patterns', summary: 'Flags, triangles, head & shoulders, double tops.', min: 22 },
      { slug: 'volume', title: 'Volume Analysis', summary: 'Confirming moves with participation.', min: 12 },
      { slug: 'indicators', title: 'RSI, MACD & Moving Averages', summary: 'Using indicators as confirmation, not signals.', min: 21 },
      { slug: 'checklist', title: 'Your Chart Checklist', summary: 'Putting it all together into a repeatable process.', min: 10 },
    ],
  },
  {
    slug: 'futures-options-foundations', title: 'Futures & Options Foundations', subtitle: 'Derivatives demystified — the right way',
    category: 'F&O', level: 'Beginner → Intermediate', icon: '⚡', accent: 'gold', price: 3999, mrp: 7999,
    description: 'Build a rock-solid understanding of futures, calls, puts, expiry, moneyness, margins and option payoffs before you ever touch a derivatives contract.',
    outcomes: ['How futures pricing, margin and MTM work', 'Calls, puts, premium, strike and expiry', 'Payoff diagrams for every basic position', 'Why most retail F&O traders lose — and how to avoid it'],
    chapters: [
      { slug: 'what-are-derivatives', title: 'What Are Derivatives?', summary: 'Forwards, futures and options in plain language.', min: 10, free: true },
      { slug: 'futures-basics', title: 'Futures: Lot Size, Margin & MTM', summary: 'How a futures position really behaves.', min: 18 },
      { slug: 'calls', title: 'Call Options Explained', summary: 'Buying vs selling calls with payoff charts.', min: 20 },
      { slug: 'puts', title: 'Put Options Explained', summary: 'Hedging and directional puts.', min: 19 },
      { slug: 'moneyness', title: 'ITM, ATM, OTM & Option Chain', summary: 'Reading the NSE option chain like a pro.', min: 16 },
      { slug: 'expiry-settlement', title: 'Expiry, Settlement & Physical Delivery', summary: 'What happens on expiry day — avoid nasty surprises.', min: 13 },
      { slug: 'sebi-study', title: 'The SEBI F&O Study: Lessons', summary: 'What the data says about retail outcomes.', min: 11 },
    ],
  },
  {
    slug: 'options-greeks-risk', title: 'Options Greeks & Risk Management', subtitle: 'Think in probabilities, not predictions',
    category: 'F&O', level: 'Intermediate → Advanced', icon: '🧮', accent: 'violet', price: 4999, mrp: 9999,
    description: 'Master delta, gamma, theta, vega and implied volatility, then use them to size positions and build defined-risk strategies.',
    outcomes: ['Intuition for each Greek with live charts', 'Implied volatility, IV crush and event risk', 'Spreads, straddles, strangles and iron condors', 'Position sizing and max-loss planning'],
    chapters: [
      { slug: 'why-greeks', title: 'Why Greeks Matter', summary: 'The dashboard of every option position.', min: 9, free: true },
      { slug: 'delta-gamma', title: 'Delta & Gamma', summary: 'Direction and acceleration.', min: 21 },
      { slug: 'theta', title: 'Theta: The Cost of Time', summary: 'Time decay and how sellers earn it.', min: 17 },
      { slug: 'vega-iv', title: 'Vega & Implied Volatility', summary: 'IV, IV percentile and IV crush.', min: 23 },
      { slug: 'spreads', title: 'Vertical Spreads', summary: 'Defined-risk directional trades.', min: 19 },
      { slug: 'neutral-strategies', title: 'Straddles, Strangles & Iron Condors', summary: 'Trading ranges and volatility.', min: 24 },
      { slug: 'position-sizing', title: 'Position Sizing & Max Loss', summary: 'Survive first, profit second.', min: 15 },
    ],
  },
  {
    slug: 'trading-psychology', title: 'Trading Psychology & Discipline', subtitle: 'Master the trader behind the screen',
    category: 'Mindset', level: 'All levels', icon: '🧠', accent: 'pink', price: 999, mrp: 1999,
    description: 'Create a repeatable process for journaling, managing emotions, handling losing streaks and reviewing decisions objectively.',
    outcomes: ['Recognise FOMO, revenge trading and overconfidence', 'Build and maintain a trading journal', 'Pre-market and post-market routines', 'Handling drawdowns without blowing up'],
    chapters: [
      { slug: 'mindset', title: "The Trader's Mindset", summary: 'Why process beats prediction.', min: 9, free: true },
      { slug: 'biases', title: 'Cognitive Biases in Markets', summary: 'The traps your brain sets for you.', min: 14, free: true },
      { slug: 'journaling', title: 'Journaling That Works', summary: 'A template you will actually use.', min: 12 },
      { slug: 'routines', title: 'Daily Routines', summary: 'Pre-market prep and post-market review.', min: 11 },
      { slug: 'drawdowns', title: 'Surviving Drawdowns', summary: 'Rules for when things go wrong.', min: 13 },
    ],
  },
  {
    slug: 'mutual-funds-investing', title: 'Mutual Funds & Long-Term Investing', subtitle: 'Grow wealth slowly, steadily and sensibly',
    category: 'Investing', level: 'Beginner', icon: '🌱', accent: 'lime', price: 1299, mrp: 2499,
    description: 'Understand SIPs, index funds, asset allocation, taxation and how to evaluate a fund — the calm, long-term side of the market.',
    outcomes: ['Equity, debt, hybrid and index funds', 'SIP, STP, SWP and lumpsum strategies', 'Expense ratio, direct vs regular plans', 'Capital gains tax basics in India'],
    chapters: [
      { slug: 'why-invest', title: 'Why Invest at All?', summary: 'Inflation, compounding and time.', min: 8, free: true },
      { slug: 'fund-types', title: 'Types of Mutual Funds', summary: 'Picking the right category for your goal.', min: 15 },
      { slug: 'sip', title: 'SIPs & Rupee-Cost Averaging', summary: 'The power of automation.', min: 12 },
      { slug: 'evaluating-funds', title: 'Evaluating a Fund', summary: 'Returns, ratios and red flags.', min: 17 },
      { slug: 'asset-allocation', title: 'Asset Allocation', summary: 'The decision that drives most of your returns.', min: 14 },
      { slug: 'tax', title: 'Taxation Basics', summary: 'LTCG, STCG and tax-saving ELSS.', min: 13 },
    ],
  },
  {
    slug: 'commodity-trading-beginner', title: 'Commodity Trading for Beginners', subtitle: 'Gold, silver, crude and MCX — explained from scratch',
    category: 'Commodity', level: 'Beginner', icon: '🛢️', accent: 'gold', price: 1999, mrp: 3999,
    description: 'Learn how commodity markets work in India: MCX and NCDEX, contract specifications, margins and what drives gold, silver, crude oil and agri prices.',
    outcomes: ['How MCX and NCDEX commodity futures work', 'Reading a contract: lot size, tick value and expiry', 'What moves gold, silver, crude and natural gas', 'Margin, MTM and the risk of leverage'],
    chapters: [
      { slug: 'what-are-commodities', title: 'What Are Commodities?', summary: 'Metals, energy and agri — and why they trade differently from stocks.', min: 9, free: true },
      { slug: 'mcx-ncdex', title: 'MCX, NCDEX & Market Timings', summary: 'Who runs the market, who regulates it and when it trades.', min: 11, free: true },
      { slug: 'contract-specs', title: 'Reading a Contract Specification', summary: 'Lot size, tick size, tick value, expiry and delivery.', min: 14 },
      { slug: 'bullion', title: 'Gold & Silver', summary: 'Safe havens, the rupee and global prices.', min: 15 },
      { slug: 'energy', title: 'Crude Oil & Natural Gas', summary: 'Inventories, OPEC+ and the overnight session.', min: 16 },
      { slug: 'margin-risk', title: 'Margins, MTM & Risk', summary: 'Why leverage cuts both ways — and how to size positions.', min: 13 },
    ],
  },
  {
    slug: 'commodity-trading-advanced', title: 'Advanced Commodity Trading', subtitle: 'Global drivers, spreads, options and hedging',
    category: 'Commodity', level: 'Advanced', icon: '🥇', accent: 'cyan', price: 3999, mrp: 7999,
    description: 'Go beyond the basics: read global macro, seasonality and term structure, trade spreads and commodity options, and understand how businesses hedge.',
    outcomes: ['Dollar, rates and global cues that move commodities', 'Contango, backwardation and rollovers', 'Calendar and inter-commodity spreads', 'Options on commodity futures and hedging'],
    chapters: [
      { slug: 'global-drivers', title: 'Global Drivers: Dollar, Rates & Supply', summary: 'Connecting macro news to MCX prices.', min: 12, free: true },
      { slug: 'term-structure', title: 'Contango, Backwardation & Rollovers', summary: 'Reading the futures curve.', min: 17 },
      { slug: 'seasonality', title: 'Seasonality & Inventory Data', summary: 'Using weekly reports and seasonal patterns.', min: 15 },
      { slug: 'spreads', title: 'Calendar & Inter-Commodity Spreads', summary: 'Trading relationships instead of direction.', min: 19 },
      { slug: 'options', title: 'Options on Commodity Futures', summary: 'How they differ from equity options.', min: 18 },
      { slug: 'hedging', title: 'Hedging for Businesses & Investors', summary: 'How jewellers, refiners and farmers manage price risk.', min: 16 },
    ],
  },
];
