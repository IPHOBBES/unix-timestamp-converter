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

## Deploy to Vercel

1. Push this folder to a GitHub repo (e.g. `unix-timestamp-converter`).
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
3. Click **Add New Project** → **Import** your repo.
4. Settings:
   - **Framework Preset**: Other (or leave as detected).
   - **Build Command**: leave empty (static site).
   - **Output Directory**: leave empty (root).
   - **Root Directory**: leave blank if the app is at the repo root.
5. Click **Deploy**. Your app will be live at `https://your-project.vercel.app`.

To use a custom name, set the project name in Vercel (e.g. `unix-converter`) for `https://unix-converter.vercel.app`.

## License

MIT
