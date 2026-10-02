// formattion scroll pill — replaces native scrollbars with the pictogram (assets/scroll-indicator.svg): a 6px ink pill, nothing else.
(function () {
  const css = document.createElement('style');
  css.textContent = `
    html, body, [data-scroll-pill] { scrollbar-width: none; -ms-overflow-style: none; }
    html::-webkit-scrollbar, body::-webkit-scrollbar, [data-scroll-pill]::-webkit-scrollbar { display: none; width: 0; height: 0; }
    .fp-pill { position: fixed; right: 4px; top: 0; width: 6px; border-radius: 999px; background: var(--ink, #000); opacity: 0; transition: opacity .3s cubic-bezier(.4,0,.2,1); z-index: 2147483000; cursor: default; touch-action: none; pointer-events: auto; }
    .fp-pill.show { opacity: 1; }
    .fp-pill[data-local] { position: absolute; }
  `;
  document.head.appendChild(css);

  function attach(target) {
    const isWin = target === window;
    const el = isWin ? document.documentElement : target;
    const pill = document.createElement('div');
    pill.className = 'fp-pill';
    if (!isWin) { pill.setAttribute('data-local', ''); if (getComputedStyle(el).position === 'static') el.style.position = 'relative'; el.setAttribute('data-scroll-pill', ''); }
    (isWin ? document.body : el).appendChild(pill);
    let hide, dragging = false, startY = 0, startTop = 0;
    const m = () => isWin
      ? { sh: el.scrollHeight, ch: window.innerHeight, st: window.scrollY }
      : { sh: el.scrollHeight, ch: el.clientHeight, st: el.scrollTop };
    function update(flash) {
      const { sh, ch, st } = m();
      if (sh <= ch + 1) { pill.classList.remove('show'); return; }
      const h = Math.max(32, Math.round(ch * ch / sh) - 8);
      const y = 4 + (st / (sh - ch)) * (ch - h - 8);
      pill.style.height = h + 'px';
      pill.style.top = (isWin ? y : y + st) + 'px';
      if (flash !== false) { pill.classList.add('show'); clearTimeout(hide); if (!dragging) hide = setTimeout(() => pill.classList.remove('show'), 1200); }
    }
    pill.addEventListener('pointerdown', e => {
      dragging = true; startY = e.clientY; startTop = m().st; pill.setPointerCapture(e.pointerId); e.preventDefault();
    });
    pill.addEventListener('pointermove', e => {
      if (!dragging) return;
      const { sh, ch } = m(); const h = pill.offsetHeight;
      const to = startTop + (e.clientY - startY) * (sh - ch) / (ch - h - 8);
      if (isWin) window.scrollTo(0, to); else el.scrollTop = to;
    });
    pill.addEventListener('pointerup', () => { dragging = false; update(); });
    (isWin ? window : el).addEventListener('scroll', () => update(), { passive: true });
    pill.addEventListener('pointerenter', () => { pill.classList.add('show'); clearTimeout(hide); });
    pill.addEventListener('pointerleave', () => update());
    new ResizeObserver(() => update(false)).observe(isWin ? document.body : el);
    update(false);
    el._fpPill = true;
  }

  function scan() {
    document.querySelectorAll('*').forEach(n => {
      if (n._fpPill || n.classList.contains('fp-pill')) return;
      const o = getComputedStyle(n).overflowY;
      if ((o === 'auto' || o === 'scroll') && n !== document.documentElement && n !== document.body) attach(n);
    });
  }
  function init() {
    attach(window);
    scan();
    new MutationObserver(() => { clearTimeout(init._t); init._t = setTimeout(scan, 100); }).observe(document.body, { childList: true, subtree: true });
  }
  if (document.body) init(); else document.addEventListener('DOMContentLoaded', init);
})();
