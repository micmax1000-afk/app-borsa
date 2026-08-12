import { useEffect, useRef, memo } from 'react'

interface NewsWidgetProps {
  symbol: string
  theme: 'light' | 'dark'
}

/**
 * Widget gratuito "Timeline" di TradingView: mostra le ultime notizie
 * relative al simbolo attivo. Documentazione:
 * https://www.tradingview.com/widget/timeline/
 */
function NewsWidget({ symbol, theme }: NewsWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    containerRef.current.innerHTML = ''

    const script = document.createElement('script')
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-timeline.js'
    script.type = 'text/javascript'
    script.async = true
    script.innerHTML = JSON.stringify({
      feedMode: 'symbol',
      symbol: symbol,
      colorTheme: theme,
      isTransparent: false,
      displayMode: 'regular',
      width: '100%',
      height: '100%',
      locale: 'it'
    })

    containerRef.current.appendChild(script)
  }, [symbol, theme])

  return (
    <div className="tradingview-widget-container" ref={containerRef}>
      <div className="tradingview-widget-container__widget" />
    </div>
  )
}

export default memo(NewsWidget)
