// Elenco di titoli comuni incluso nell'app: la ricerca funziona anche
// senza internet e senza server. Formato simbolo TradingView "BORSA:TICKER".
// "k" contiene parole chiave aggiuntive per la ricerca.

export type KnownSymbol = { symbol: string; label: string; k?: string }

export const KNOWN_SYMBOLS: KnownSymbol[] = [
  // Indici
  { symbol: 'INDEX:FTSEMIB', label: 'FTSE MIB', k: 'italia milano borsa italiana' },
  { symbol: 'SP:SPX', label: 'S&P 500', k: 'sp500 usa america' },
  { symbol: 'NASDAQ:NDX', label: 'Nasdaq 100', k: 'usa tecnologia' },
  { symbol: 'DJ:DJI', label: 'Dow Jones', k: 'usa' },
  { symbol: 'XETR:DAX', label: 'DAX', k: 'germania francoforte' },
  { symbol: 'EURONEXT:PX1', label: 'CAC 40', k: 'francia parigi' },
  { symbol: 'TVC:UKX', label: 'FTSE 100', k: 'londra uk regno unito' },
  { symbol: 'TVC:SX5E', label: 'Euro Stoxx 50', k: 'europa' },
  { symbol: 'TVC:NI225', label: 'Nikkei 225', k: 'giappone tokyo' },
  { symbol: 'TVC:VIX', label: 'VIX', k: 'volatilità paura' },
  { symbol: 'TVC:DXY', label: 'Indice Dollaro (DXY)', k: 'dollaro usd' },

  // Materie prime e titoli di Stato
  { symbol: 'TVC:GOLD', label: 'Oro', k: 'gold xau' },
  { symbol: 'TVC:SILVER', label: 'Argento', k: 'silver xag' },
  { symbol: 'TVC:USOIL', label: 'Petrolio WTI', k: 'oil greggio crude' },
  { symbol: 'TVC:UKOIL', label: 'Petrolio Brent', k: 'oil greggio crude' },
  { symbol: 'NYMEX:NG1!', label: 'Gas naturale', k: 'gas natural' },
  { symbol: 'TVC:IT10Y', label: 'BTP 10 anni (rendimento)', k: 'btp italia bond spread' },
  { symbol: 'TVC:DE10Y', label: 'Bund 10 anni (rendimento)', k: 'bund germania bond spread' },
  { symbol: 'TVC:US10Y', label: 'Treasury USA 10 anni (rendimento)', k: 'treasury bond usa' },

  // Azioni italiane (Borsa di Milano)
  { symbol: 'MIL:ENI', label: 'Eni' },
  { symbol: 'MIL:ISP', label: 'Intesa Sanpaolo', k: 'banca' },
  { symbol: 'MIL:UCG', label: 'UniCredit', k: 'banca' },
  { symbol: 'MIL:ENEL', label: 'Enel' },
  { symbol: 'MIL:STLAM', label: 'Stellantis', k: 'fiat auto' },
  { symbol: 'MIL:RACE', label: 'Ferrari', k: 'auto' },
  { symbol: 'MIL:G', label: 'Generali', k: 'assicurazioni' },
  { symbol: 'MIL:TIT', label: 'Telecom Italia (TIM)', k: 'tim' },
  { symbol: 'MIL:LDO', label: 'Leonardo', k: 'difesa' },
  { symbol: 'MIL:PRY', label: 'Prysmian' },
  { symbol: 'MIL:MONC', label: 'Moncler', k: 'lusso' },
  { symbol: 'MIL:STMMI', label: 'STMicroelectronics', k: 'stm chip semiconduttori' },
  { symbol: 'MIL:TEN', label: 'Tenaris' },
  { symbol: 'MIL:PST', label: 'Poste Italiane' },
  { symbol: 'MIL:BMPS', label: 'Monte dei Paschi di Siena', k: 'mps banca' },
  { symbol: 'MIL:BAMI', label: 'Banco BPM', k: 'banca' },
  { symbol: 'MIL:BPE', label: 'BPER Banca', k: 'banca' },
  { symbol: 'MIL:MB', label: 'Mediobanca', k: 'banca' },
  { symbol: 'MIL:FBK', label: 'FinecoBank', k: 'banca fineco' },
  { symbol: 'MIL:BGN', label: 'Banca Generali', k: 'banca' },
  { symbol: 'MIL:AZM', label: 'Azimut' },
  { symbol: 'MIL:UNI', label: 'Unipol', k: 'assicurazioni' },
  { symbol: 'MIL:SRG', label: 'Snam', k: 'gas' },
  { symbol: 'MIL:TRN', label: 'Terna' },
  { symbol: 'MIL:IG', label: 'Italgas', k: 'gas' },
  { symbol: 'MIL:A2A', label: 'A2A' },
  { symbol: 'MIL:HER', label: 'Hera' },
  { symbol: 'MIL:ERG', label: 'ERG' },
  { symbol: 'MIL:CPR', label: 'Campari' },
  { symbol: 'MIL:AMP', label: 'Amplifon' },
  { symbol: 'MIL:DIA', label: 'DiaSorin' },
  { symbol: 'MIL:REC', label: 'Recordati', k: 'farmaceutica' },
  { symbol: 'MIL:INW', label: 'Inwit' },
  { symbol: 'MIL:IP', label: 'Interpump' },
  { symbol: 'MIL:NEXI', label: 'Nexi', k: 'pagamenti' },
  { symbol: 'MIL:SPM', label: 'Saipem' },
  { symbol: 'MIL:PIRC', label: 'Pirelli', k: 'pneumatici' },
  { symbol: 'MIL:IVG', label: 'Iveco' },
  { symbol: 'MIL:BC', label: 'Brunello Cucinelli', k: 'lusso' },
  { symbol: 'MIL:LTMC', label: 'Lottomatica' },

  // Azioni USA
  { symbol: 'NASDAQ:AAPL', label: 'Apple' },
  { symbol: 'NASDAQ:MSFT', label: 'Microsoft' },
  { symbol: 'NASDAQ:NVDA', label: 'NVIDIA', k: 'chip semiconduttori ai' },
  { symbol: 'NASDAQ:AMZN', label: 'Amazon' },
  { symbol: 'NASDAQ:GOOGL', label: 'Alphabet (Google)', k: 'google' },
  { symbol: 'NASDAQ:META', label: 'Meta Platforms', k: 'facebook instagram' },
  { symbol: 'NASDAQ:TSLA', label: 'Tesla', k: 'auto' },
  { symbol: 'NASDAQ:AVGO', label: 'Broadcom', k: 'chip' },
  { symbol: 'NASDAQ:NFLX', label: 'Netflix' },
  { symbol: 'NASDAQ:AMD', label: 'AMD', k: 'chip' },
  { symbol: 'NASDAQ:INTC', label: 'Intel', k: 'chip' },
  { symbol: 'NASDAQ:ADBE', label: 'Adobe' },
  { symbol: 'NASDAQ:COST', label: 'Costco' },
  { symbol: 'NASDAQ:PEP', label: 'PepsiCo' },
  { symbol: 'NASDAQ:CSCO', label: 'Cisco' },
  { symbol: 'NASDAQ:QCOM', label: 'Qualcomm', k: 'chip' },
  { symbol: 'NASDAQ:PYPL', label: 'PayPal' },
  { symbol: 'NASDAQ:PLTR', label: 'Palantir' },
  { symbol: 'NASDAQ:ASML', label: 'ASML (USA)', k: 'chip' },
  { symbol: 'NYSE:TSM', label: 'TSMC', k: 'taiwan chip' },
  { symbol: 'NYSE:BRK.B', label: 'Berkshire Hathaway B', k: 'buffett' },
  { symbol: 'NYSE:JPM', label: 'JPMorgan Chase', k: 'banca' },
  { symbol: 'NYSE:GS', label: 'Goldman Sachs', k: 'banca' },
  { symbol: 'NYSE:BAC', label: 'Bank of America', k: 'banca' },
  { symbol: 'NYSE:V', label: 'Visa' },
  { symbol: 'NYSE:MA', label: 'Mastercard' },
  { symbol: 'NYSE:KO', label: 'Coca-Cola' },
  { symbol: 'NYSE:MCD', label: "McDonald's" },
  { symbol: 'NYSE:DIS', label: 'Disney' },
  { symbol: 'NYSE:WMT', label: 'Walmart' },
  { symbol: 'NYSE:NKE', label: 'Nike' },
  { symbol: 'NYSE:XOM', label: 'Exxon Mobil', k: 'petrolio' },
  { symbol: 'NYSE:CVX', label: 'Chevron', k: 'petrolio' },
  { symbol: 'NYSE:JNJ', label: 'Johnson & Johnson' },
  { symbol: 'NYSE:PFE', label: 'Pfizer' },
  { symbol: 'NYSE:LLY', label: 'Eli Lilly' },
  { symbol: 'NYSE:UNH', label: 'UnitedHealth' },
  { symbol: 'NYSE:PG', label: 'Procter & Gamble' },
  { symbol: 'NYSE:HD', label: 'Home Depot' },
  { symbol: 'NYSE:ORCL', label: 'Oracle' },
  { symbol: 'NYSE:IBM', label: 'IBM' },
  { symbol: 'NYSE:BA', label: 'Boeing' },
  { symbol: 'NYSE:UBER', label: 'Uber' },
  { symbol: 'NYSE:SPOT', label: 'Spotify' },

  // Azioni europee
  { symbol: 'XETR:SAP', label: 'SAP' },
  { symbol: 'XETR:SIE', label: 'Siemens' },
  { symbol: 'XETR:ALV', label: 'Allianz', k: 'assicurazioni' },
  { symbol: 'XETR:DTE', label: 'Deutsche Telekom' },
  { symbol: 'XETR:BMW', label: 'BMW', k: 'auto' },
  { symbol: 'XETR:MBG', label: 'Mercedes-Benz', k: 'auto' },
  { symbol: 'XETR:VOW3', label: 'Volkswagen', k: 'auto' },
  { symbol: 'XETR:ADS', label: 'Adidas' },
  { symbol: 'XETR:RHM', label: 'Rheinmetall', k: 'difesa' },
  { symbol: 'EURONEXT:MC', label: 'LVMH', k: 'lusso' },
  { symbol: 'EURONEXT:OR', label: "L'Oréal", k: 'oreal' },
  { symbol: 'EURONEXT:TTE', label: 'TotalEnergies', k: 'petrolio' },
  { symbol: 'EURONEXT:AIR', label: 'Airbus' },
  { symbol: 'EURONEXT:SAN', label: 'Sanofi' },
  { symbol: 'EURONEXT:ASML', label: 'ASML', k: 'chip olanda' },
  { symbol: 'SIX:NESN', label: 'Nestlé', k: 'nestle svizzera' },
  { symbol: 'SIX:NOVN', label: 'Novartis', k: 'svizzera' },
  { symbol: 'SIX:ROG', label: 'Roche', k: 'svizzera' },
  { symbol: 'LSE:SHEL', label: 'Shell', k: 'petrolio' },
  { symbol: 'LSE:HSBA', label: 'HSBC', k: 'banca' },
  { symbol: 'LSE:AZN', label: 'AstraZeneca' },
  { symbol: 'BME:SAN', label: 'Banco Santander', k: 'banca spagna' },
  { symbol: 'BME:ITX', label: 'Inditex (Zara)', k: 'zara spagna' },
  { symbol: 'OMXCOP:NOVO_B', label: 'Novo Nordisk', k: 'danimarca' },

  // ETF
  { symbol: 'MIL:SWDA', label: 'iShares Core MSCI World (Acc)', k: 'etf mondo world' },
  { symbol: 'MIL:VWCE', label: 'Vanguard FTSE All-World (Acc)', k: 'etf mondo world' },
  { symbol: 'MIL:CSSPX', label: 'iShares Core S&P 500 (Acc)', k: 'etf sp500' },
  { symbol: 'MIL:EIMI', label: 'iShares Core MSCI Emerging Markets', k: 'etf emergenti' },
  { symbol: 'AMEX:SPY', label: 'SPDR S&P 500 ETF', k: 'etf sp500' },
  { symbol: 'NASDAQ:QQQ', label: 'Invesco QQQ (Nasdaq 100)', k: 'etf nasdaq' },
  { symbol: 'AMEX:GLD', label: 'SPDR Gold Shares', k: 'etf oro gold' },

  // Criptovalute
  { symbol: 'BITSTAMP:BTCUSD', label: 'Bitcoin', k: 'btc crypto' },
  { symbol: 'BITSTAMP:BTCEUR', label: 'Bitcoin / Euro', k: 'btc crypto' },
  { symbol: 'BITSTAMP:ETHUSD', label: 'Ethereum', k: 'eth crypto' },
  { symbol: 'BINANCE:SOLUSDT', label: 'Solana', k: 'sol crypto' },
  { symbol: 'BINANCE:XRPUSDT', label: 'XRP', k: 'ripple crypto' },
  { symbol: 'BINANCE:BNBUSDT', label: 'BNB', k: 'binance crypto' },
  { symbol: 'BINANCE:DOGEUSDT', label: 'Dogecoin', k: 'doge crypto' },
  { symbol: 'BINANCE:ADAUSDT', label: 'Cardano', k: 'ada crypto' },

  // Valute
  { symbol: 'FX:EURUSD', label: 'EUR/USD', k: 'euro dollaro cambio' },
  { symbol: 'FX:GBPUSD', label: 'GBP/USD', k: 'sterlina dollaro cambio' },
  { symbol: 'FX:USDJPY', label: 'USD/JPY', k: 'dollaro yen cambio' },
  { symbol: 'FX:EURGBP', label: 'EUR/GBP', k: 'euro sterlina cambio' },
  { symbol: 'FX:EURCHF', label: 'EUR/CHF', k: 'euro franco svizzero cambio' },
  { symbol: 'FX:EURJPY', label: 'EUR/JPY', k: 'euro yen cambio' },
  { symbol: 'FX:USDCHF', label: 'USD/CHF', k: 'dollaro franco cambio' },
  { symbol: 'FX:AUDUSD', label: 'AUD/USD', k: 'dollaro australiano cambio' },
  { symbol: 'FX:USDCAD', label: 'USD/CAD', k: 'dollaro canadese cambio' }
]

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

/** Cerca nell'elenco integrato: ogni parola digitata deve comparire */
export function searchKnownSymbols(query: string, limit = 15): KnownSymbol[] {
  const words = normalize(query).split(/\s+/).filter(Boolean)
  if (words.length === 0) return []
  return KNOWN_SYMBOLS.filter((s) => {
    const hay = normalize(`${s.label} ${s.symbol} ${s.k ?? ''}`)
    return words.every((w) => hay.includes(w))
  }).slice(0, limit)
}
