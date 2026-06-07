# Unix Timestamp Converter

A simple web app to convert between Unix timestamps (seconds or milliseconds) and human-readable date and time. No backend - everything runs in the browser.

## Features

- **Unix → Date**: Enter a timestamp (e.g. `1700000000` or `1700000000000`), get the date in your local timezone.
- **Date → Unix**: Pick a local date and time with the calendar, then copy the Unix timestamp in seconds.
- **Now**: Fill both converters with the current time and copy either representation.
- **Resilient date input**: Falls back to the browser's native date and time picker if the calendar library is unavailable.

Try it: https://iphobbes.github.io/unix-timestamp-converter/

## License

MIT
