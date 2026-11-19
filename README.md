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

## App Android (APK)

L'app è disponibile anche come APK Android per uso personale, creato con
[Capacitor](https://capacitorjs.com/) direttamente da GitHub Actions
(workflow `.github/workflows/android.yml`) a ogni push.

**Scaricare e installare**
1. Dal telefono apri https://github.com/micmax1000-afk/app-borsa/releases/latest
2. Scarica `app-borsa.apk` e aprilo
3. Se richiesto, consenti l'installazione di app da questa origine (Chrome o
   "File")
4. Per aggiornare basta installare l'APK nuovo sopra quello vecchio: la
   watchlist resta salvata

**Differenze rispetto al sito**
- Ricerca dei titoli: nell'APK prova anche la ricerca online di TradingView,
  che nel browser è bloccata. In ogni caso c'è un elenco di titoli comuni
  integrato (`src/symbols.ts`) che funziona anche offline.
- Il tasto Indietro di Android chiude il pannello aperto.

**Build in locale** (serve Android Studio / Android SDK):

```bash
npm run build:android
cd android && ./gradlew assembleDebug
```

L'APK è firmato con una chiave di prova inclusa nel repository
(`android/app/app-borsa-debug.keystore`): va bene per uso personale, non per
il Play Store.
