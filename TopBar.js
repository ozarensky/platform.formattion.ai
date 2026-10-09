// Project copy of the design system's TopBar, extended with a `secondary` list rendered at the menu foot beside the theme toggle.
// Mobile (≤768px) follows the formattion.ai site: 60px bar inset 8, 24px menu icon in a 44px hit area at 16/18, 14px logo at 28/28, full-width menu dropping from 76px.
(function () {
  const DS = () => window.FormattionPlatformDesignSystem_d1b4df;
  const GLASS = { background: 'var(--glass)', backdropFilter: 'var(--blur-glass)', WebkitBackdropFilter: 'var(--blur-glass)', borderRadius: 12 };
  const NOISE = { position: 'absolute', inset: 0, backgroundImage: 'var(--noise)', backgroundSize: '200px 200px', opacity: 0.1, pointerEvents: 'none', borderRadius: 'inherit' };
  function useMobile() {
    const q = () => typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;
    const [m, setM] = React.useState(q());
    React.useEffect(() => { const mq = window.matchMedia('(max-width: 768px)'); const f = () => setM(mq.matches); mq.addEventListener('change', f); return () => mq.removeEventListener('change', f); }, []);
    return m;
  }
  function PlatformTopBar({ items = [], secondary = [], current, onSelect, footer = [], logoSrc, position = 'fixed', inset = 10, defaultOpen = false, safeTop = 0 }) {
    const { Icon, ClientLogo, ThemeToggle } = DS();
    const [open, setOpen] = React.useState(defaultOpen);
    const mobile = useMobile();
    const P = position, i = mobile ? 8 : inset, barH = mobile ? 60 : 100, s = mobile ? (+safeTop || 0) : 0;
    const T = (n) => s || mobile ? 'calc(' + (n + s) + 'px + env(safe-area-inset-top, 0px))' : n;
    React.useEffect(() => { document.documentElement.setAttribute('data-menu-open', open ? '1' : '0'); }, [open]);
    const link = (it, sec) => React.createElement('a', { key: it, href: '#', onClick: e => { e.preventDefault(); setOpen(false); onSelect && onSelect(it); },
      onMouseEnter: e => (e.currentTarget.style.opacity = 0.45), onMouseLeave: e => (e.currentTarget.style.opacity = 1),
      style: { position: 'relative', zIndex: 1, display: 'inline-block', alignSelf: 'flex-start', width: 'max-content', padding: '6px 0', margin: sec ? '0 0 4px ' + (mobile ? 20 : 28) + 'px' : '0 0 12px ' + (mobile ? 20 : 28) + 'px', fontWeight: current === it ? 500 : 300, fontSize: sec ? 18 : 22, lineHeight: 1, letterSpacing: '-0.01em', color: 'var(--ink)', transition: 'opacity .15s' } }, it);
    const navStyle = mobile
      ? { top: T(76), left: 8, right: 8, bottom: 8, width: 'auto', paddingTop: 60, transform: open ? 'translateY(0)' : 'translateY(-16px)' }
      : { top: i + 110, left: i, bottom: i, width: 260, paddingTop: 40, transform: open ? 'translateX(0)' : 'translateX(-16px)' };
    return React.createElement(React.Fragment, null,
      open && React.createElement('div', { 'aria-hidden': true, onClick: () => setOpen(false), style: { position: P, inset: 0, zIndex: 440, background: 'transparent' } }),
      React.createElement('div', { style: { position: P, top: T(i), left: i, right: i, height: barH, ...GLASS, zIndex: 300, pointerEvents: 'none', overflow: 'hidden' } }, React.createElement('div', { style: NOISE })),
      React.createElement('div', { style: { position: P, top: mobile ? T(i + barH) : i + barH, left: i, right: i, height: 32, background: 'linear-gradient(to bottom, var(--bg), var(--fade0))', zIndex: 299, pointerEvents: 'none' } }),
      React.createElement('button', { type: 'button', 'aria-label': open ? 'Close menu' : 'Open menu', onClick: () => setOpen(!open),
        style: { position: P, top: mobile ? T(16) : i + 28, left: mobile ? 18 : 44, width: 44, height: 44, padding: 0, border: 'none', background: 'none', cursor: 'pointer', zIndex: 500, color: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform .35s var(--ease)', transform: open ? 'rotate(45deg)' : 'none' } },
        React.createElement(Icon, { name: 'cross', size: mobile ? 24 : 32 })),
      React.createElement('div', { style: { position: P, top: mobile ? T(28) : i + 32, right: mobile ? 28 : 65, zIndex: 400, height: mobile ? 14 : 'auto', display: 'flex', alignItems: 'center' } }, React.createElement(ClientLogo, { src: logoSrc, height: mobile ? 14 : undefined })),
      React.createElement('nav', { onClick: e => { if (e.target === e.currentTarget || e.target.getAttribute('data-nav-bg') === '1') setOpen(false); }, style: { position: P, ...navStyle, ...GLASS, zIndex: 450, display: 'flex', flexDirection: 'column', overflow: 'hidden', opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none', transition: 'opacity .3s ease, transform .3s ease' } },
        React.createElement('div', { style: NOISE }),
        React.createElement('div', { 'data-nav-bg': '1', 'aria-hidden': true, style: { position: 'absolute', inset: 0, zIndex: 0 } }),
        items.map(it => link(it, false)),
        React.createElement('div', { style: { position: 'relative', zIndex: 2, marginTop: 'auto', display: 'flex', flexDirection: 'column' } }, secondary.map(it => link(it, true))),
        React.createElement('div', { style: { position: 'relative', zIndex: 2, margin: '0 0 8px ' + (mobile ? 18 : 26) + 'px' } }, React.createElement(ThemeToggle, null)),
        React.createElement('div', { style: { position: 'relative', zIndex: 2, margin: '0 20px 20px ' + (mobile ? 24 : 32) + 'px', display: 'flex', flexDirection: 'column', gap: 5 } },
          footer.map(f => React.createElement('span', { key: f, style: { fontSize: 10, letterSpacing: '0.1em', color: 'var(--muted)' } }, f)))));
  }
  window.PlatformTopBar = PlatformTopBar;
})();
