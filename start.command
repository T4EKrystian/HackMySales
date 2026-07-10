#!/bin/zsh
# HackMySales — start lokalnego podglądu (dwuklik w Finderze)
cd "$(dirname "$0")"

if ! command -v npm >/dev/null 2>&1; then
  echo "Brak Node.js. Zainstaluj: https://nodejs.org (LTS) albo: brew install node"
  echo "Potem uruchom ten plik ponownie."
  read -k 1 -s "?Naciśnij dowolny klawisz, aby zamknąć…"
  exit 1
fi

if [ ! -d node_modules ]; then
  echo "Pierwsze uruchomienie — instaluję zależności (1–2 min)…"
  npm install
fi

echo "Startuję serwer deweloperski… (zatrzymanie: Ctrl+C)"
( sleep 4 && open "http://localhost:3000" ) &
npm run dev
