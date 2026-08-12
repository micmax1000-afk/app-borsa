import { useEffect, useRef, memo } from 'react'

interface TickerWidgetProps {
  symbol: string
  theme?: 'light' | 'dark'
}

/**
 * Incorpora il widget gratuito "Single Ticker" di TradingView: mostra
 * prezzo e variazione % del simbolo attivo, come nell'header dell'app
 * ufficiale. Documentazione: https://www.tradingview.com/widget/single-quote/
 */
function TickerWidget({ symbol, theme = 'dark' }: TickerWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    containerRef.current.innerHTML = ''

    const script = document.createElement('script')
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js'
    script.type = 'text/javascript'
    script.async = true
    script.innerHTML = JSON.stringify({
      symbol: symbol,
      width: '100%',
      locale: 'it',
      colorTheme: theme,
      isTransparent: true
    })

    containerRef.current.appendChild(script)
  }, [symbol, theme])

  return (
    <div className="tradingview-widget-container ticker-widget" ref={containerRef}>
      <div className="tradingview-widget-container__widget" />
    </div>
  )
}

export default memo(TickerWidget)
