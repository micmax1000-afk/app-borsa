import { useEffect, useRef, memo } from 'react'

interface TradingViewWidgetProps {
  symbol: string
  theme?: 'light' | 'dark'
  /** Versione leggera per la griglia multi-grafico: niente indicatori né barre */
  compact?: boolean
}

/**
 * Incorpora il widget gratuito "Advanced Real-Time Chart" di TradingView.
 * Documentazione: https://www.tradingview.com/widget/advanced-chart/
 *
 * Include di serie: selezione indicatori (RSI, MACD, Bollinger, medie
 * mobili, Stocastico, ecc.), disegno di trendline, più timeframe,
 * confronto simboli, tutto gestito dall'utente direttamente nel grafico.
 */
function TradingViewWidget({ symbol, theme = 'dark', compact = false }: TradingViewWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Pulisce il widget precedente prima di ricrearlo con il nuovo simbolo
    containerRef.current.innerHTML = ''

    const script = document.createElement('script')
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
    script.type = 'text/javascript'
    script.async = true
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: symbol,
      interval: 'D',
      timezone: 'Europe/Rome',
      theme: theme,
      style: '1',
      locale: 'it',
      enable_publishing: false,
      // Indicatori precaricati all'apertura del grafico; l'utente può
      // aggiungerne/rimuoverne altri dal menu "Indicatori" nel widget
      studies: compact ? [] : ['STD;RSI', 'STD;MACD', 'STD;Bollinger_Bands'],
      hide_top_toolbar: compact,
      hide_side_toolbar: compact,
      hide_legend: compact,
      allow_symbol_change: !compact,
      support_host: 'https://www.tradingview.com'
    })

    containerRef.current.appendChild(script)
  }, [symbol, theme, compact])

  return (
    <div className="tradingview-widget-container" ref={containerRef}>
      <div className="tradingview-widget-container__widget" />
    </div>
  )
}

export default memo(TradingViewWidget)
