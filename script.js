(function () {
  'use strict';

  const unixInput = document.getElementById('unix-input');
  const unixOutput = document.getElementById('unix-output');
  const unixError = document.getElementById('unix-error');
  const dateInput = document.getElementById('date-input');
  const dateOutput = document.getElementById('date-output');
  const dateError = document.getElementById('date-error');
  const nowUnix = document.getElementById('now-unix');
  const nowHuman = document.getElementById('now-human');
  const btnNow = document.getElementById('btn-now');
  const copyNowUnix = document.getElementById('copy-now-unix');
  const copyNowHuman = document.getElementById('copy-now-human');
  const copyDateUnix = document.getElementById('copy-date-unix');

  function showError(el, message) {
    el.textContent = message;
    el.hidden = false;
  }

  function clearError(el) {
    el.textContent = '';
    el.hidden = true;
  }

  function formatHumanDate(ms) {
    const d = new Date(ms);
    return d.toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'medium',
      hour12: true
    });
  }

  function parseUnixInput(raw) {
    const s = String(raw).trim();
    if (!s) return { ok: false, error: 'Enter a timestamp' };
    const num = Number(s);
    if (Number.isNaN(num) || !Number.isFinite(num)) return { ok: false, error: 'Not a valid number' };
    if (num < 0) return { ok: false, error: 'Timestamp must be ≥ 0' };
    let ms = num;
    if (num <= 1e12) ms = num * 1000;
    if (ms > 864000000000000) return { ok: false, error: 'Timestamp too large' };
    return { ok: true, ms };
  }

  function unixToDate() {
    clearError(unixError);
    const result = parseUnixInput(unixInput.value);
    if (!result.ok) {
      showError(unixError, result.error);
      unixOutput.textContent = '—';
      return;
    }
    unixOutput.textContent = formatHumanDate(result.ms);
  }

  function dateToUnix() {
    clearError(dateError);
    const value = dateInput.value;
    if (!value) {
      dateOutput.textContent = 'Pick a date & time';
      copyDateUnix.hidden = true;
      return;
    }
    const ms = new Date(value).getTime();
    if (Number.isNaN(ms)) {
      showError(dateError, 'Invalid date');
      dateOutput.textContent = '—';
      copyDateUnix.hidden = true;
      return;
    }
    const sec = Math.floor(ms / 1000);
    dateOutput.textContent = String(sec);
    copyDateUnix.hidden = false;
  }

  function toDateTimeLocal(ms) {
    const d = new Date(ms);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const h = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    const s = String(d.getSeconds()).padStart(2, '0');
    return y + '-' + m + '-' + day + 'T' + h + ':' + min + ':' + s;
  }

  function setNow() {
    const ms = Date.now();
    const sec = Math.floor(ms / 1000);
    nowUnix.textContent = String(sec);
    nowHuman.textContent = formatHumanDate(ms);
    unixInput.value = String(sec);
    dateInput.value = toDateTimeLocal(ms);
    clearError(unixError);
    clearError(dateError);
    unixOutput.textContent = formatHumanDate(ms);
    dateOutput.textContent = String(sec);
    copyDateUnix.hidden = false;
  }

  function copyToClipboard(text, btn) {
    navigator.clipboard.writeText(text).then(
      function () {
        btn.classList.add('copied');
        btn.textContent = 'Copied';
        setTimeout(function () {
          btn.classList.remove('copied');
          btn.textContent = 'Copy';
        }, 2000);
      },
      function () {
        btn.textContent = 'Failed';
        setTimeout(function () { btn.textContent = 'Copy'; }, 2000);
      }
    );
  }

  unixInput.addEventListener('input', unixToDate);
  unixInput.addEventListener('paste', function () { setTimeout(unixToDate, 0); });
  dateInput.addEventListener('input', dateToUnix);
  dateInput.addEventListener('change', dateToUnix);
  btnNow.addEventListener('click', setNow);

  copyNowUnix.addEventListener('click', function () {
    copyToClipboard(nowUnix.textContent, copyNowUnix);
  });
  copyNowHuman.addEventListener('click', function () {
    copyToClipboard(nowHuman.textContent, copyNowHuman);
  });
  copyDateUnix.addEventListener('click', function () {
    copyToClipboard(dateOutput.textContent, copyDateUnix);
  });

  setNow();
})();
