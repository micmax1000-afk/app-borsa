import { useMemo, useRef, useState } from 'react'
import TradingViewWidget from './components/TradingViewWidget'
import TechnicalAnalysisWidget from './components/TechnicalAnalysisWidget'

// Watchlist di partenza: modifica liberamente simboli e nomi.
// Formato simbolo TradingView: "BORSA:TICKER"
// Esempi: FTSE MIB -> "MIL:FTSEMIB", Apple -> "NASDAQ:AAPL",
// Bitcoin -> "BITSTAMP:BTCUSD", EUR/USD -> "FX:EURUSD"
const WATCHLIST = [
  { label: 'FTSE MIB', symbol: 'INDEX:FTSEMIB' },
  { label: 'S&P 500', symbol: 'SP:SPX' },
  { label: 'Apple', symbol: 'NASDAQ:AAPL' },
  { label: 'Bitcoin', symbol: 'BITSTAMP:BTCUSD' },
  { label: 'EUR/USD', symbol: 'FX:EURUSD' }
]

function App() {
  const [symbol, setSymbol] = useState(WATCHLIST[0].symbol)
  const [showSignal, setShowSignal] = useState(false)
  const [showWatchlist, setShowWatchlist] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [query, setQuery] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)

  const currentLabel =
    WATCHLIST.find((item) => item.symbol === symbol)?.label ?? symbol.split(':').pop()

  const filteredWatchlist = useMemo(() => {
    const q = query.trim().toUpperCase()
    if (!q) return WATCHLIST
    return WATCHLIST.filter(
      (item) =>
        item.label.toUpperCase().includes(q) || item.symbol.toUpperCase().includes(q)
    )
  }, [query])

  const openSearch = () => {
    setShowSearch(true)
    setQuery('')
    setTimeout(() => searchInputRef.current?.focus(), 50)
  }

  const closeSearch = () => {
    setShowSearch(false)
    setQuery('')
  }

  const selectSymbol = (sym: string) => {
    setSymbol(sym.toUpperCase())
    closeSearch()
    setShowWatchlist(false)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      selectSymbol(query.trim())
    }
  }

  return (
    <div className="app">
      <header className="topbar">
        <button className="topbar-symbol" onClick={openSearch}>
          <span className="topbar-symbol-label">{currentLabel}</span>
          <span className="topbar-symbol-full">{symbol}</span>
        </button>
        <button className="icon-btn" onClick={openSearch} aria-label="Cerca simbolo">
          🔍
        </button>
      </header>

      <main className="chart-container">
        <TradingViewWidget symbol={symbol} />
      </main>

      <nav className="bottom-nav">
        <button
          className={`bottom-nav-item ${!showWatchlist && !showSignal ? 'active' : ''}`}
          onClick={() => {
            setShowWatchlist(false)
            setShowSignal(false)
          }}
        >
          <span className="bottom-nav-icon">📈</span>
          <span>Grafico</span>
        </button>
        <button
          className={`bottom-nav-item ${showWatchlist ? 'active' : ''}`}
          onClick={() => {
            setShowWatchlist(true)
            setShowSignal(false)
          }}
        >
          <span className="bottom-nav-icon">☰</span>
          <span>Watchlist</span>
        </button>
        <button
          className={`bottom-nav-item ${showSignal ? 'active' : ''}`}
          onClick={() => {
            setShowSignal(true)
            setShowWatchlist(false)
          }}
        >
          <span className="bottom-nav-icon">📊</span>
          <span>Segnale</span>
        </button>
      </nav>

      {showWatchlist && (
        <div className="drawer-overlay" onClick={() => setShowWatchlist(false)}>
          <div className="drawer drawer-left" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h2>Watchlist</h2>
              <button
                className="icon-btn"
                onClick={() => setShowWatchlist(false)}
                aria-label="Chiudi"
              >
                ✕
              </button>
            </div>
            <ul className="watchlist-list">
              {WATCHLIST.map((item) => (
                <li key={item.symbol}>
                  <button
                    className={item.symbol === symbol ? 'active' : ''}
                    onClick={() => selectSymbol(item.symbol)}
                  >
                    <span className="watchlist-item-label">{item.label}</span>
                    <span className="watchlist-item-symbol">{item.symbol}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {showSignal && (
        <div className="signal-overlay" onClick={() => setShowSignal(false)}>
          <div className="signal-panel" onClick={(e) => e.stopPropagation()}>
            <div className="signal-panel-header">
              <p className="signal-disclaimer">
                Indicatore algoritmico basato su medie mobili e oscillatori — non è un consiglio di investimento
              </p>
              <button
                className="signal-close"
                onClick={() => setShowSignal(false)}
                aria-label="Chiudi"
              >
                ✕
              </button>
            </div>
            <TechnicalAnalysisWidget symbol={symbol} />
          </div>
        </div>
      )}

      {showSearch && (
        <div className="search-overlay">
          <form className="search-header" onSubmit={handleSearchSubmit}>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Cerca simbolo (es. NASDAQ:TSLA)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="button" className="icon-btn" onClick={closeSearch} aria-label="Chiudi">
              ✕
            </button>
          </form>
          <ul className="search-results">
            {filteredWatchlist.map((item) => (
              <li key={item.symbol}>
                <button onClick={() => selectSymbol(item.symbol)}>
                  <span className="watchlist-item-label">{item.label}</span>
                  <span className="watchlist-item-symbol">{item.symbol}</span>
                </button>
              </li>
            ))}
            {filteredWatchlist.length === 0 && (
              <li className="search-hint">
                Premi Invio per cercare direttamente "{query}"
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

export default App
