import { useEffect, useRef, memo } from 'react'

interface TechnicalAnalysisWidgetProps {
  symbol: string
}

/**
 * Widget gratuito "Technical Analysis" di TradingView: mostra un gauge
 * aggregato Comprare/Vendere/Neutrale calcolato da medie mobili e
 * oscillatori (RSI, MACD, Stocastico, ecc.).
 *
 * IMPORTANTE: è un indicatore algoritmico, non un consiglio di
 * investimento. Non esegue operazioni: è puramente informativo.
 * Documentazione: https://www.tradingview.com/widget/technical-analysis/
 */
function TechnicalAnalysisWidget({ symbol }: TechnicalAnalysisWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    containerRef.current.innerHTML = ''

    const script = document.createElement('script')
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js'
    script.type = 'text/javascript'
    script.async = true
    script.innerHTML = JSON.stringify({
      interval: '1D',
      width: '100%',
      isTransparent: false,
      height: '100%',
      symbol: symbol,
      showIntervalTabs: true,
      locale: 'it',
      colorTheme: 'dark'
    })

    containerRef.current.appendChild(script)
  }, [symbol])

  return (
    <div className="tradingview-widget-container" ref={containerRef}>
      <div className="tradingview-widget-container__widget" />
    </div>
  )
}

export default memo(TechnicalAnalysisWidget)
