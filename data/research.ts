// Research hub: educational explainers per market segment. Not recommendations.
export type Segment = {
  slug: string; title: string; icon: string; accent: string; tagline: string; intro: string;
  facts: { k: string; v: string }[];
  concepts: { t: string; d: string }[];
  watch: string[];
  courses: string[]; // course slugs to suggest
  shortCat?: string; // shorts category to suggest
};

export const segments: Segment[] = [
  {
    slug: 'stocks', title: 'Stocks', icon: '📈', accent: 'green', tagline: 'Owning a slice of a business',
    intro: 'The equity cash market is where you buy and sell shares of listed companies on NSE and BSE. Delivery-based investing means you own the shares in your demat account; returns come from price changes and dividends.',
    facts: [{ k: 'Exchanges', v: 'NSE & BSE' }, { k: 'Regular session', v: '9:15 am – 3:30 pm IST' }, { k: 'Settlement', v: 'T+1 (T+0 optional for select stocks)' }, { k: 'Regulator', v: 'SEBI' }],
    concepts: [
      { t: 'Market capitalisation', d: 'Share price × total shares. Large, mid and small caps behave very differently in volatility and liquidity.' },
      { t: 'Valuation ratios', d: 'P/E, P/B and EV/EBITDA help compare a company with its own history and its peers. None works in isolation.' },
      { t: 'Quarterly results', d: 'Revenue, margins and guidance move prices. Learn to read the results press release, not just the headline.' },
      { t: 'Corporate actions', d: 'Dividends, bonuses, splits and buybacks change your holding and the price chart. Know what each one does.' },
    ],
    watch: ['Nifty 50 and sector index trends', 'Quarterly earnings season', 'FII / DII flows', 'RBI policy and inflation data'],
    courses: ['stock-market-foundations', 'technical-analysis-essentials'], shortCat: 'Basics',
  },
  {
    slug: 'derivatives', title: 'Derivatives', icon: '⚡', accent: 'gold', tagline: 'Futures & options on stocks and indices',
    intro: 'Equity derivatives are contracts whose value comes from a stock or an index. Futures carry an obligation; options give a right without obligation. Both use leverage, so small price moves create large gains or losses.',
    facts: [{ k: 'Exchanges', v: 'NSE & BSE' }, { k: 'Products', v: 'Index & stock futures and options' }, { k: 'Margins', v: 'SPAN + exposure margin' }, { k: 'Risk', v: 'SEBI studies show most retail F&O traders lose money' }],
    concepts: [
      { t: 'Lot size & leverage', d: 'You trade in fixed lots. Margin is a fraction of contract value, which magnifies both profit and loss.' },
      { t: 'Option premium', d: 'Premium = intrinsic value + time value. Time value decays towards expiry (theta).' },
      { t: 'Open interest', d: 'The number of open contracts. Read with price to understand whether positions are building or unwinding.' },
      { t: 'Implied volatility', d: 'The market’s expectation of movement. High IV makes options expensive; IV can collapse after events.' },
    ],
    watch: ['India VIX', 'Open interest build-up across strikes', 'Expiry-day behaviour', 'Event calendars (results, policy, budget)'],
    courses: ['futures-options-foundations', 'options-greeks-risk'], shortCat: 'F&O',
  },
  {
    slug: 'commodity', title: 'Commodity', icon: '🛢️', accent: 'pink', tagline: 'Metals, energy and agri futures',
    intro: 'Commodity derivatives let you trade bullion, base metals, energy and agricultural products. Prices are driven by global supply and demand, the US dollar and the rupee, which makes this market very different from stocks.',
    facts: [{ k: 'Exchanges', v: 'MCX (metals & energy), NCDEX (agri)' }, { k: 'Session', v: 'Non-agri trades from 9:00 am until late evening' }, { k: 'Products', v: 'Futures & options on futures' }, { k: 'Regulator', v: 'SEBI' }],
    concepts: [
      { t: 'Contract specification', d: 'Each commodity has its own lot size, tick value, expiry and delivery rules. Always read the spec first.' },
      { t: 'Global linkage', d: 'MCX gold and crude track international prices converted at USD-INR, so the rupee matters too.' },
      { t: 'Term structure', d: 'Contango and backwardation show whether far-month contracts trade above or below near-month ones.' },
      { t: 'Inventory reports', d: 'Weekly energy inventory data and crop reports often cause sharp intraday moves.' },
    ],
    watch: ['US dollar index and USD-INR', 'Crude inventories and OPEC+ decisions', 'Central-bank gold buying', 'Monsoon and crop estimates'],
    courses: ['commodity-trading-beginner', 'commodity-trading-advanced'],
  },
  {
    slug: 'currency', title: 'Currency', icon: '💱', accent: 'cyan', tagline: 'USD-INR and other currency pairs',
    intro: 'Exchange-traded currency derivatives let businesses and individuals hedge or take views on currency pairs such as USD-INR, EUR-INR, GBP-INR and JPY-INR. In India these trade on recognised exchanges within RBI and SEBI rules.',
    facts: [{ k: 'Exchanges', v: 'NSE & BSE currency segment' }, { k: 'Main pair', v: 'USD-INR' }, { k: 'Products', v: 'Currency futures & options' }, { k: 'Rules', v: 'RBI & SEBI framework' }],
    concepts: [
      { t: 'What moves the rupee', d: 'Trade balance, crude oil prices, foreign investment flows, interest-rate differentials and RBI intervention.' },
      { t: 'Hedging', d: 'Importers and exporters use currency futures to lock in rates and protect margins.' },
      { t: 'Interest-rate parity', d: 'Why the forward rate differs from the spot rate, and what the premium tells you.' },
      { t: 'Low volatility, high leverage', d: 'Currency moves look small, but contract leverage makes them meaningful. Size positions carefully.' },
    ],
    watch: ['RBI policy and forex reserves', 'US Federal Reserve decisions', 'Crude oil prices', 'FPI flows into Indian markets'],
    courses: ['futures-options-foundations'],
  },
  {
    slug: 'mutual-funds', title: 'Mutual Funds', icon: '🌱', accent: 'lime', tagline: 'Professionally managed, diversified investing',
    intro: 'A mutual fund pools money from many investors and invests it according to a stated objective. SEBI groups schemes into categories (equity, debt, hybrid, index and others) so you can compare like with like.',
    facts: [{ k: 'Regulator', v: 'SEBI (with AMFI as industry body)' }, { k: 'Pricing', v: 'Once a day at NAV' }, { k: 'Plans', v: 'Direct (lower cost) & Regular' }, { k: 'Modes', v: 'SIP, lump sum, STP, SWP' }],
    concepts: [
      { t: 'Expense ratio', d: 'The annual cost of running the fund. Small differences compound over long periods.' },
      { t: 'SIP discipline', d: 'Investing a fixed amount regularly averages your purchase cost and builds the habit.' },
      { t: 'Category & benchmark', d: 'Judge a fund against its benchmark and category peers, not against last year’s top performer.' },
      { t: 'Risk-o-meter', d: 'Every scheme shows a SEBI risk level. Match it to your goal and time horizon.' },
    ],
    watch: ['Rolling returns vs benchmark', 'Expense ratio changes', 'Portfolio overlap across your funds', 'Tax rules on capital gains'],
    courses: ['mutual-funds-investing'], shortCat: 'Investing',
  },
  {
    slug: 'ipo', title: 'IPO', icon: '🔔', accent: 'violet', tagline: 'How companies list, and how to read an offer',
    intro: 'An Initial Public Offering is when a company sells shares to the public for the first time and lists on the exchange. Investors apply through ASBA/UPI, shares are allotted (often by lottery when oversubscribed) and listing follows within days.',
    facts: [{ k: 'Boards', v: 'Mainboard & SME platforms' }, { k: 'Application', v: 'ASBA via net-banking or UPI' }, { k: 'Key document', v: 'Red Herring Prospectus (RHP)' }, { k: 'Listing', v: 'A few working days after the issue closes' }],
    concepts: [
      { t: 'Fresh issue vs OFS', d: 'Fresh issue money goes to the company; an offer for sale pays existing shareholders. The mix tells a story.' },
      { t: 'Reading the RHP', d: 'Business model, risks, financials, promoter holding and use of proceeds are all in the prospectus.' },
      { t: 'Subscription data', d: 'QIB, HNI and retail subscription levels show demand, but do not guarantee listing gains.' },
      { t: 'Grey-market noise', d: 'Unofficial grey-market premiums are unregulated and unreliable. Base decisions on the documents.' },
    ],
    watch: ['Upcoming issue calendar', 'Price band and valuation vs listed peers', 'Anchor investor list', 'Lock-in expiry dates'],
    courses: ['stock-market-foundations'], shortCat: 'Basics',
  },
];
