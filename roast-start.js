// Enables the "start roasting on RoastMonitor" button only while the device is
// reachable on the local network. Reused by any page that has an element with
// id="roast-start-btn" (and optionally a hint with id="roast-start-hint").
(function () {
  const btn = document.getElementById('roast-start-btn');
  if (!btn) return;
  const hint = document.getElementById('roast-start-hint');

  const TARGET = btn.getAttribute('href') || 'http://roast-monitor.local';
  const INTERVAL_MS = 2000;

  function enable() {
    btn.classList.remove('is-disabled');
    btn.removeAttribute('aria-disabled');
    if (hint) hint.style.display = 'none';
  }

  function disable() {
    btn.classList.add('is-disabled');
    btn.setAttribute('aria-disabled', 'true');
    if (hint) hint.style.display = '';
  }

  async function poll() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);
      await fetch(TARGET, { method: 'HEAD', mode: 'no-cors', signal: controller.signal });
      clearTimeout(timeoutId);
      enable();
    } catch (e) {
      disable();
    }
  }

  poll();
  setInterval(poll, INTERVAL_MS);
})();
