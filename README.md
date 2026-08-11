# App Borsa - Analisi Tecnica

PWA gratuita e senza server per consultare grafici di borsa con analisi
tecnica avanzata, basata sul widget "Advanced Real-Time Chart" di
TradingView (RSI, MACD, Bollinger Bands e decine di altri indicatori
selezionabili direttamente nel grafico).

## Avvio in locale

```bash
npm install
npm run dev
```

Apri l'indirizzo mostrato nel terminale (di solito http://localhost:5173).

## Personalizzare la watchlist

Modifica l'array `WATCHLIST` in `src/App.tsx`. Formato simbolo TradingView:
`BORSA:TICKER`, ad esempio:

- FTSE MIB: `MIL:FTSEMIB`
- Apple: `NASDAQ:AAPL`
- Bitcoin: `BITSTAMP:BTCUSD`
- EUR/USD: `FX:EURUSD`

Puoi anche digitare un simbolo personalizzato direttamente nell'app.

## Pubblicazione su GitHub Pages (stesso metodo di Schengen Days Calculator)

1. Crea un repository, es. `app-borsa`
2. In `vite.config.ts` verifica che `base` sia `/app-borsa/` (nome del repo)
3. Build: `npm run build` (genera la cartella `dist`)
4. Pubblica `dist` su GitHub Pages, oppure imposta un workflow GitHub
   Actions dedicato (consigliato, più affidabile del vecchio metodo)

## Icone PWA

Servono `icon-192.png` e `icon-512.png` nella cartella `public/` perché
l'app sia installabile come PWA (icona quadrata, senza trasparenza).

## Note

- I dati del widget TradingView sono gratuiti ma su alcuni mercati/piani
  possono avere un delay rispetto al tempo reale.
- Nessun backend, nessuna chiave API richiesta, nessun costo.
