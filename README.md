# Unix Timestamp Converter

A simple web app to convert between Unix timestamps (seconds or milliseconds) and human-readable date & time. No backend — runs entirely in the browser.

## Features

- **Unix → Date**: Enter a timestamp (e.g. `1700000000` or `1700000000000`), get the date in your local timezone.
- **Date → Unix**: Pick a date and time, get the Unix timestamp in seconds.
- **Now**: One-click to fill with the current time; copy Unix or human date.

## Run locally

Open `index.html` in a browser, or serve the folder with any static server:

```bash
# Python
python3 -m http.server 8000

# Node (npx)
npx serve .
```

Then visit `http://localhost:8000` (or the port shown).

Try: https://unix-timestamp-converter-beta.vercel.app/

## License

MIT
