(function () {
  'use strict';

  const unixInput = document.getElementById('unix-input');
  const unixOutput = document.getElementById('unix-output');
  const unixError = document.getElementById('unix-error');
  const dateInput = document.getElementById('date-input');
  const datePickerToggle = document.getElementById('date-picker-toggle');
  const dateOutput = document.getElementById('date-output');
  const dateError = document.getElementById('date-error');
  const nowUnix = document.getElementById('now-unix');
  const nowHuman = document.getElementById('now-human');
  const btnNow = document.getElementById('btn-now');
  const copyNowUnix = document.getElementById('copy-now-unix');
  const copyNowHuman = document.getElementById('copy-now-human');
  const copyDateUnix = document.getElementById('copy-date-unix');
  const hasFlatpickr = typeof window.flatpickr === 'function';
  let datePicker = null;

  if (hasFlatpickr) {
    dateInput.type = 'text';
    datePicker = window.flatpickr(dateInput, {
      enableTime: true,
      enableSeconds: true,
      time_24hr: false,
      allowInput: false,
      dateFormat: 'd/m/Y, h:i:S K',
      clickOpens: false,
      position: 'above right',
      onReady: [installCustomMonthMenu],
      onMonthChange: [syncCustomMonthMenu],
      onYearChange: [syncCustomMonthMenu]
    });
  }

  function installCustomMonthMenu(selectedDates, dateStr, instance) {
    const calendar = instance.calendarContainer;
    const monthSelect = calendar.querySelector('.flatpickr-monthDropdown-months');
    if (!monthSelect || calendar.querySelector('.custom-month-button')) return;

    const monthNames = instance.l10n.months.longhand;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'custom-month-button';
    button.setAttribute('aria-haspopup', 'listbox');
    button.setAttribute('aria-expanded', 'false');

    const menu = document.createElement('div');
    menu.className = 'custom-month-menu';
    menu.setAttribute('role', 'listbox');
    menu.hidden = true;

    monthNames.forEach(function (month, index) {
      const option = document.createElement('button');
      option.type = 'button';
      option.className = 'custom-month-option';
      option.setAttribute('role', 'option');
      option.dataset.month = String(index);
      option.textContent = month;
      option.addEventListener('click', function (event) {
        event.stopPropagation();
        instance.changeMonth(index, false);
        closeCustomMonthMenu(instance);
      });
      menu.appendChild(option);
    });

    monthSelect.hidden = true;
    monthSelect.insertAdjacentElement('afterend', button);
    button.insertAdjacentElement('afterend', menu);

    button.addEventListener('click', function (event) {
      event.stopPropagation();
      const isOpen = !menu.hidden;
      menu.hidden = isOpen;
      button.setAttribute('aria-expanded', String(!isOpen));
    });

    document.addEventListener('click', function () {
      closeCustomMonthMenu(instance);
    });

    instance._customMonthMenu = { button, menu };
    syncCustomMonthMenu(null, null, instance);
  }

  function syncCustomMonthMenu(selectedDates, dateStr, instance) {
    if (!instance._customMonthMenu) return;
    const monthNames = instance.l10n.months.longhand;
    const currentMonth = instance.currentMonth;
    const button = instance._customMonthMenu.button;
    button.textContent = monthNames[currentMonth];
    instance._customMonthMenu.menu.querySelectorAll('.custom-month-option').forEach(function (option) {
      const selected = Number(option.dataset.month) === currentMonth;
      option.classList.toggle('selected', selected);
      option.setAttribute('aria-selected', String(selected));
    });
  }

  function closeCustomMonthMenu(instance) {
    if (!instance._customMonthMenu) return;
    instance._customMonthMenu.menu.hidden = true;
    instance._customMonthMenu.button.setAttribute('aria-expanded', 'false');
  }

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
    const ms = num < 1e11 ? num * 1000 : num;
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
    const selectedDate = datePicker && datePicker.selectedDates.length > 0
      ? datePicker.selectedDates[0]
      : (dateInput.value ? new Date(dateInput.value) : null);

    if (!selectedDate) {
      dateOutput.textContent = 'Pick a date & time';
      copyDateUnix.hidden = true;
      return;
    }

    const ms = selectedDate.getTime();
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
    if (datePicker) {
      datePicker.setDate(new Date(ms), true);
    } else {
      dateInput.value = toDateTimeLocal(ms);
    }
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

  function toggleDatePicker() {
    if (datePicker) {
      if (datePicker.isOpen) {
        datePicker.close();
        return;
      }
      datePicker.open();
      return;
    }

    if (document.activeElement === dateInput) {
      dateInput.blur();
      return;
    }

    dateInput.focus();
    try {
      if (typeof dateInput.showPicker === 'function') {
        dateInput.showPicker();
        return;
      }
      dateInput.click();
    } catch (e) {}
  }

  unixInput.addEventListener('input', unixToDate);
  unixInput.addEventListener('paste', function () { setTimeout(unixToDate, 0); });
  dateInput.addEventListener('input', dateToUnix);
  dateInput.addEventListener('change', dateToUnix);
  datePickerToggle.addEventListener('pointerdown', function (event) {
    event.preventDefault();
  });
  datePickerToggle.addEventListener('click', toggleDatePicker);
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
