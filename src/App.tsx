import { useEffect, useMemo, useRef, useState } from 'react'
import TradingViewWidget from './components/TradingViewWidget'
import TechnicalAnalysisWidget from './components/TechnicalAnalysisWidget'
import TickerWidget from './components/TickerWidget'
import NewsWidget from './components/NewsWidget'

type WatchlistItem = { label: string; symbol: string }
type WatchlistTab = { id: string; name: string; items: WatchlistItem[] }
type RemoteResult = { symbol: string; label: string; exchange: string }
type Theme = 'light' | 'dark'
type MainView = 'chart' | 'multi'

// Lista di partenza: usata solo la prima volta, poi l'utente la
// personalizza dall'app e viene salvata sul dispositivo.
// Formato simbolo TradingView: "BORSA:TICKER"
const DEFAULT_ITEMS: WatchlistItem[] = [
  { label: 'FTSE MIB', symbol: 'INDEX:FTSEMIB' },
  { label: 'S&P 500', symbol: 'SP:SPX' },
  { label: 'Apple', symbol: 'NASDAQ:AAPL' },
  { label: 'Bitcoin', symbol: 'BITSTAMP:BTCUSD' },
  { label: 'EUR/USD', symbol: 'FX:EURUSD' }
]

const STORAGE_LISTS = 'appBorsa:lists'
const STORAGE_ACTIVE_LIST = 'appBorsa:activeListId'
const STORAGE_LAST_SYMBOL = 'appBorsa:lastSymbol'
const STORAGE_RECENTS = 'appBorsa:recents'
const STORAGE_THEME = 'appBorsa:theme'
const STORAGE_MULTI = 'appBorsa:multiSymbols'
const MAX_RECENTS = 8

function makeId() {
  return Math.random().toString(36).slice(2, 9)
}

function loadLists(): WatchlistTab[] {
  try {
    const raw = localStorage.getItem(STORAGE_LISTS)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
    // Migrazione da vecchia struttura a lista singola, se presente
    const legacy = localStorage.getItem('appBorsa:watchlist')
    if (legacy) {
      const items = JSON.parse(legacy)
      if (Array.isArray(items) && items.length > 0) {
        return [{ id: 'default', name: 'Preferiti', items }]
      }
    }
  } catch {
    // ignora
  }
  return [{ id: 'default', name: 'Preferiti', items: DEFAULT_ITEMS }]
}

function loadActiveListId(lists: WatchlistTab[]): string {
  try {
    const raw = localStorage.getItem(STORAGE_ACTIVE_LIST)
    if (raw && lists.some((l) => l.id === raw)) return raw
  } catch {
    // ignora
  }
  return lists[0].id
}

function loadLastSymbol(fallback: string): string {
  try {
    const raw = localStorage.getItem(STORAGE_LAST_SYMBOL)
    if (raw) return raw
  } catch {
    // ignora
  }
  return fallback
}

function loadRecents(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_RECENTS)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignora
  }
  return []
}

function loadTheme(): Theme {
  try {
    const raw = localStorage.getItem(STORAGE_THEME)
    if (raw === 'light' || raw === 'dark') return raw
  } catch {
    // ignora
  }
  return 'dark'
}

function loadMultiSymbols(fallback: string[]): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_MULTI)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length === 4) return parsed
    }
  } catch {
    // ignora
  }
  return fallback
}

function labelFromSymbol(symbol: string): string {
  return symbol.includes(':') ? symbol.split(':')[1] : symbol
}

function App() {
  const [lists, setLists] = useState<WatchlistTab[]>(loadLists)
  const [activeListId, setActiveListId] = useState<string>(() => loadActiveListId(loadLists()))
  const activeList = lists.find((l) => l.id === activeListId) ?? lists[0]

  const [symbol, setSymbolState] = useState(() => loadLastSymbol(activeList.items[0]?.symbol ?? DEFAULT_ITEMS[0].symbol))
  const [recents, setRecents] = useState<string[]>(loadRecents)
  const [theme, setTheme] = useState<Theme>(loadTheme)
  const [mainView, setMainView] = useState<MainView>('chart')
  const [multiSymbols, setMultiSymbols] = useState<string[]>(() =>
    loadMultiSymbols(
      Array.from({ length: 4 }, (_, i) => activeList.items[i]?.symbol ?? DEFAULT_ITEMS[i % DEFAULT_ITEMS.length].symbol)
    )
  )

  const [showSignal, setShowSignal] = useState(false)
  const [showNews, setShowNews] = useState(false)
  const [showWatchlist, setShowWatchlist] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [query, setQuery] = useState('')
  const [remoteResults, setRemoteResults] = useState<RemoteResult[]>([])
  const [searching, setSearching] = useState(false)

  const searchInputRef = useRef<HTMLInputElement>(null)
  const touchStartX = useRef<number | null>(null)

  // Persistenza
  useEffect(() => {
    localStorage.setItem(STORAGE_LISTS, JSON.stringify(lists))
  }, [lists])

  useEffect(() => {
    localStorage.setItem(STORAGE_ACTIVE_LIST, activeListId)
  }, [activeListId])

  useEffect(() => {
    localStorage.setItem(STORAGE_LAST_SYMBOL, symbol)
  }, [symbol])

  useEffect(() => {
    localStorage.setItem(STORAGE_RECENTS, JSON.stringify(recents))
  }, [recents])

  useEffect(() => {
    localStorage.setItem(STORAGE_THEME, theme)
    document.body.classList.toggle('theme-light', theme === 'light')
  }, [theme])

  useEffect(() => {
    localStorage.setItem(STORAGE_MULTI, JSON.stringify(multiSymbols))
  }, [multiSymbols])

  // Ricerca simboli live su TradingView (best-effort: se il servizio non
  // risponde per via del browser, restano comunque watchlist + invio manuale)
  useEffect(() => {
    const q = query.trim()
    if (q.length < 2) {
      setRemoteResults([])
      return
    }
    const controller = new AbortController()
    setSearching(true)
    const timer = setTimeout(() => {
      fetch(
        `https://symbol-search.tradingview.com/symbol_search/v3/?text=${encodeURIComponent(
          q
        )}&hl=1&lang=it&domain=production`,
        { signal: controller.signal }
      )
        .then((res) => res.json())
        .then((data) => {
          const symbols = (data?.symbols ?? data ?? [])
            .slice(0, 12)
            .map((item: any) => ({
              symbol: `${item.exchange}:${item.symbol}`,
              label: (item.description || item.symbol || '').replace(/<\/?em>/g, ''),
              exchange: item.exchange || ''
            }))
            .filter((item: RemoteResult) => item.symbol)
          setRemoteResults(symbols)
        })
        .catch(() => setRemoteResults([]))
        .finally(() => setSearching(false))
    }, 300)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [query])

  const currentLabel =
    activeList.items.find((item) => item.symbol === symbol)?.label ?? labelFromSymbol(symbol)

  const filteredWatchlist = useMemo(() => {
    const q = query.trim().toUpperCase()
    if (!q) return activeList.items
    return activeList.items.filter(
      (item) =>
        item.label.toUpperCase().includes(q) || item.symbol.toUpperCase().includes(q)
    )
  }, [query, activeList])

  const recentItems = useMemo(
    () =>
      recents
        .filter((s) => s !== symbol)
        .slice(0, MAX_RECENTS)
        .map((s) => ({ symbol: s, label: labelFromSymbol(s) })),
    [recents, symbol]
  )

  const openSearch = () => {
    setShowSearch(true)
    setQuery('')
    setRemoteResults([])
    setTimeout(() => searchInputRef.current?.focus(), 50)
  }

  const closeSearch = () => {
    setShowSearch(false)
    setQuery('')
    setRemoteResults([])
  }

  const selectSymbol = (sym: string) => {
    const upper = sym.toUpperCase()
    setSymbolState(upper)
    setRecents((prev) => [upper, ...prev.filter((s) => s !== upper)].slice(0, MAX_RECENTS))
    closeSearch()
    setShowWatchlist(false)
    setMainView('chart')
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      selectSymbol(query.trim())
    }
  }

  const updateActiveListItems = (updater: (items: WatchlistItem[]) => WatchlistItem[]) => {
    setLists((prev) =>
      prev.map((l) => (l.id === activeListId ? { ...l, items: updater(l.items) } : l))
    )
  }

  const addToWatchlist = (sym: string, label: string) => {
    const upper = sym.toUpperCase()
    updateActiveListItems((items) =>
      items.some((item) => item.symbol === upper) ? items : [...items, { label, symbol: upper }]
    )
  }

  const removeFromWatchlist = (sym: string) => {
    updateActiveListItems((items) => items.filter((item) => item.symbol !== sym))
  }

  const moveItem = (index: number, direction: 1 | -1) => {
    updateActiveListItems((items) => {
      const target = index + direction
      if (target < 0 || target >= items.length) return items
      const copy = [...items]
      ;[copy[index], copy[target]] = [copy[target], copy[index]]
      return copy
    })
  }

  const addList = () => {
    const name = window.prompt('Nome della nuova lista:')
    if (!name || !name.trim()) return
    const id = makeId()
    setLists((prev) => [...prev, { id, name: name.trim(), items: [] }])
    setActiveListId(id)
  }

  const deleteList = (id: string) => {
    if (lists.length <= 1) return
    const list = lists.find((l) => l.id === id)
    if (!list) return
    if (!window.confirm(`Eliminare la lista "${list.name}"?`)) return
    setLists((prev) => prev.filter((l) => l.id !== id))
    if (activeListId === id) {
      setActiveListId(lists.find((l) => l.id !== id)?.id ?? lists[0].id)
    }
  }

  const changeSymbolBy = (direction: 1 | -1) => {
    const items = activeList.items
    if (items.length < 2) return
    const index = items.findIndex((item) => item.symbol === symbol)
    if (index === -1) return
    const nextIndex = (index + direction + items.length) % items.length
    selectSymbol(items[nextIndex].symbol)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(delta) < 45) return
    changeSymbolBy(delta < 0 ? 1 : -1)
  }

  const isInWatchlist = (sym: string) => activeList.items.some((item) => item.symbol === sym)

  const cycleMultiSlot = (slotIndex: number) => {
    const pool = activeList.items.length > 0 ? activeList.items.map((i) => i.symbol) : DEFAULT_ITEMS.map((i) => i.symbol)
    setMultiSymbols((prev) => {
      const current = prev[slotIndex]
      const currentIndex = pool.indexOf(current)
      let next = pool[(currentIndex + 1) % pool.length]
      // evita di duplicare un simbolo già mostrato in un altro riquadro
      let attempts = 0
      while (prev.includes(next) && attempts < pool.length) {
        const i = pool.indexOf(next)
        next = pool[(i + 1) % pool.length]
        attempts++
      }
      const copy = [...prev]
      copy[slotIndex] = next
      return copy
    })
  }

  const shareSymbol = async () => {
    const shareData = {
      title: 'App Borsa',
      text: `Guarda ${currentLabel} (${symbol}) su App Borsa`
    }
    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(shareData.text)
        window.alert('Copiato negli appunti')
      }
    } catch {
      // l'utente ha annullato la condivisione: nessuna azione necessaria
    }
  }

  return (
    <div className="app">
      <header
        className="topbar"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <button className="topbar-symbol" onClick={openSearch}>
          <span className="topbar-symbol-label">{currentLabel}</span>
          <span className="topbar-symbol-full">{symbol}</span>
        </button>
        <div className="topbar-ticker">
          <TickerWidget symbol={symbol} theme={theme} />
        </div>
        <button
          className="icon-btn"
          onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
          aria-label="Cambia tema"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <button className="icon-btn" onClick={shareSymbol} aria-label="Condividi">
          📤
        </button>
        <button className="icon-btn" onClick={openSearch} aria-label="Cerca simbolo">
          🔍
        </button>
      </header>

      <main className="chart-container">
        {mainView === 'chart' && <TradingViewWidget symbol={symbol} theme={theme} />}

        {mainView === 'multi' && (
          <div className="multi-grid">
            {multiSymbols.map((sym, i) => (
              <div className="multi-cell" key={i}>
                <div className="multi-cell-header">
                  <span>{labelFromSymbol(sym)}</span>
                  <button
                    className="multi-cycle-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      cycleMultiSlot(i)
                    }}
                    aria-label="Cambia simbolo"
                  >
                    ⟳
                  </button>
                </div>
                <div className="multi-cell-chart" onClick={() => selectSymbol(sym)}>
                  <TradingViewWidget symbol={sym} theme={theme} />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <nav className="bottom-nav">
        <button
          className={`bottom-nav-item ${mainView === 'chart' && !showWatchlist && !showSignal && !showNews ? 'active' : ''}`}
          onClick={() => {
            setMainView('chart')
            setShowWatchlist(false)
            setShowSignal(false)
            setShowNews(false)
          }}
        >
          <span className="bottom-nav-icon">📈</span>
          <span>Grafico</span>
        </button>
        <button
          className={`bottom-nav-item ${mainView === 'multi' ? 'active' : ''}`}
          onClick={() => {
            setMainView('multi')
            setShowWatchlist(false)
            setShowSignal(false)
            setShowNews(false)
          }}
        >
          <span className="bottom-nav-icon">🔲</span>
          <span>Multi</span>
        </button>
        <button
          className={`bottom-nav-item ${showWatchlist ? 'active' : ''}`}
          onClick={() => {
            setShowWatchlist(true)
            setShowSignal(false)
            setShowNews(false)
          }}
        >
          <span className="bottom-nav-icon">☰</span>
          <span>Watchlist</span>
        </button>
        <button
          className={`bottom-nav-item ${showNews ? 'active' : ''}`}
          onClick={() => {
            setShowNews(true)
            setShowSignal(false)
            setShowWatchlist(false)
          }}
        >
          <span className="bottom-nav-icon">📰</span>
          <span>News</span>
        </button>
        <button
          className={`bottom-nav-item ${showSignal ? 'active' : ''}`}
          onClick={() => {
            setShowSignal(true)
            setShowWatchlist(false)
            setShowNews(false)
          }}
        >
          <span className="bottom-nav-icon">📊</span>
          <span>Segnale</span>
        </button>
      </nav>

      <div
        className={`drawer-overlay ${showWatchlist ? 'open' : ''}`}
        onClick={() => setShowWatchlist(false)}
      >
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

          <div className="list-tabs">
            {lists.map((l) => (
              <button
                key={l.id}
                className={`list-tab ${l.id === activeListId ? 'active' : ''}`}
                onClick={() => setActiveListId(l.id)}
                onDoubleClick={() => deleteList(l.id)}
              >
                {l.name}
              </button>
            ))}
            <button className="list-tab list-tab-add" onClick={addList} aria-label="Nuova lista">
              +
            </button>
          </div>
          {lists.length > 1 && (
            <p className="list-hint">Doppio tocco su una scheda per eliminarla</p>
          )}

          <ul className="watchlist-list">
            {activeList.items.map((item, index) => (
              <li key={item.symbol} className="watchlist-row">
                <div className="reorder-col">
                  <button
                    className="reorder-btn"
                    disabled={index === 0}
                    onClick={() => moveItem(index, -1)}
                    aria-label="Sposta su"
                  >
                    ▲
                  </button>
                  <button
                    className="reorder-btn"
                    disabled={index === activeList.items.length - 1}
                    onClick={() => moveItem(index, 1)}
                    aria-label="Sposta giù"
                  >
                    ▼
                  </button>
                </div>
                <button
                  className={item.symbol === symbol ? 'active' : ''}
                  onClick={() => selectSymbol(item.symbol)}
                >
                  <span className="watchlist-item-label">{item.label}</span>
                  <span className="watchlist-item-symbol">{item.symbol}</span>
                </button>
                <button
                  className="watchlist-remove"
                  onClick={() => removeFromWatchlist(item.symbol)}
                  aria-label={`Rimuovi ${item.label}`}
                >
                  ✕
                </button>
              </li>
            ))}
            {activeList.items.length === 0 && (
              <li className="search-hint">
                Lista vuota — aggiungi simboli dalla ricerca 🔍
              </li>
            )}
          </ul>
        </div>
      </div>

      <div
        className={`signal-overlay ${showSignal ? 'open' : ''}`}
        onClick={() => setShowSignal(false)}
      >
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
          {showSignal && <TechnicalAnalysisWidget symbol={symbol} theme={theme} />}
        </div>
      </div>

      <div
        className={`signal-overlay news-overlay ${showNews ? 'open' : ''}`}
        onClick={() => setShowNews(false)}
      >
        <div className="signal-panel news-panel" onClick={(e) => e.stopPropagation()}>
          <div className="signal-panel-header">
            <p className="signal-disclaimer">News · {currentLabel}</p>
            <button
              className="signal-close"
              onClick={() => setShowNews(false)}
              aria-label="Chiudi"
            >
              ✕
            </button>
          </div>
          {showNews && <NewsWidget symbol={symbol} theme={theme} />}
        </div>
      </div>

      <div className={`search-overlay ${showSearch ? 'open' : ''}`}>
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
          {!query.trim() && recentItems.length > 0 && (
            <>
              <li className="search-section-title">Recenti</li>
              {recentItems.map((item) => (
                <li key={`recent-${item.symbol}`}>
                  <button onClick={() => selectSymbol(item.symbol)}>
                    <span className="watchlist-item-label">{item.label}</span>
                    <span className="watchlist-item-symbol">{item.symbol}</span>
                  </button>
                </li>
              ))}
            </>
          )}

          {filteredWatchlist.length > 0 && (
            <li className="search-section-title">{activeList.name}</li>
          )}
          {filteredWatchlist.map((item) => (
            <li key={item.symbol} className="search-result-row">
              <button onClick={() => selectSymbol(item.symbol)}>
                <span className="watchlist-item-label">{item.label}</span>
                <span className="watchlist-item-symbol">{item.symbol}</span>
              </button>
            </li>
          ))}

          {query.trim().length >= 2 && (
            <li className="search-section-title">
              {searching ? 'Ricerca in corso…' : 'Altri risultati'}
            </li>
          )}
          {remoteResults
            .filter((r) => !isInWatchlist(r.symbol))
            .map((item) => (
              <li key={item.symbol} className="search-result-row">
                <button onClick={() => selectSymbol(item.symbol)}>
                  <span className="watchlist-item-label">{item.label}</span>
                  <span className="watchlist-item-symbol">
                    {item.symbol} · {item.exchange}
                  </span>
                </button>
                <button
                  className="watchlist-add"
                  onClick={(e) => {
                    e.stopPropagation()
                    addToWatchlist(item.symbol, item.label)
                  }}
                  aria-label={`Aggiungi ${item.label} alla watchlist`}
                >
                  +
                </button>
              </li>
            ))}

          {query.trim() && filteredWatchlist.length === 0 && remoteResults.length === 0 && !searching && (
            <li className="search-hint">
              Premi Invio per caricare direttamente "{query}"
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}

export default App
