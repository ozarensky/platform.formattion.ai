/* @ds-bundle: {"format":4,"namespace":"FormattionPlatformDesignSystem_d1b4df","components":[{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"ClientLogo","sourcePath":"components/core/ClientLogo.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"ICON_NAMES","sourcePath":"components/core/Icon.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Input","sourcePath":"components/core/Input.jsx"},{"name":"Lockup","sourcePath":"components/core/Lockup.jsx"},{"name":"DataTable","sourcePath":"components/data/DataTable.jsx"},{"name":"StatCard","sourcePath":"components/data/StatCard.jsx"},{"name":"StatusTag","sourcePath":"components/feedback/StatusTag.jsx"},{"name":"ThemeToggle","sourcePath":"components/navigation/ThemeToggle.jsx"},{"name":"TopBar","sourcePath":"components/navigation/TopBar.jsx"},{"name":"Avatar","sourcePath":"components/people/Avatar.jsx"},{"name":"Portrait","sourcePath":"components/people/Portrait.jsx"}],"sourceHashes":{"components/core/Button.jsx":"537f45ea8a3e","components/core/ClientLogo.jsx":"a909f998b292","components/core/Icon.jsx":"bd2ec3db5d53","components/core/IconButton.jsx":"36a8c6b0f9f0","components/core/Input.jsx":"7be987a656ac","components/core/Lockup.jsx":"b91f9b81b7ae","components/data/DataTable.jsx":"77ac38122511","components/data/StatCard.jsx":"c3453dbc4e6d","components/feedback/StatusTag.jsx":"63b4d57e8183","components/navigation/ThemeToggle.jsx":"17b1b1245ba3","components/navigation/TopBar.jsx":"738a49d03e69","components/people/Avatar.jsx":"1952c28a95a1","components/people/Portrait.jsx":"996fa29a4b01","ui_kits/platform/Screens.jsx":"6e5942a878cc"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.FormattionPlatformDesignSystem_d1b4df = window.FormattionPlatformDesignSystem_d1b4df || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Button.jsx
try { (() => {
/** Pill button. primary: ink pill, brand on hover. secondary: hairline pill. text: plain label. */
function Button({
  variant = 'primary',
  children,
  onClick,
  disabled,
  type = 'button',
  style
}) {
  const [h, setH] = React.useState(false);
  const base = {
    height: 44,
    padding: variant === 'text' ? '0 12px' : '0 22px',
    borderRadius: 999,
    font: '500 14px ' + "var(--sans)",
    cursor: disabled ? 'default' : 'pointer',
    opacity: disabled ? 0.45 : 1,
    transition: 'background .2s, border-color .2s, opacity .15s',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    whiteSpace: 'nowrap'
  };
  const v = variant === 'primary' ? {
    border: 'none',
    background: h && !disabled ? 'var(--brand)' : 'var(--ink)',
    color: 'var(--bg)'
  } : variant === 'secondary' ? {
    border: '1px solid ' + (h && !disabled ? 'var(--ink)' : 'var(--line)'),
    background: 'transparent',
    color: 'var(--ink)'
  } : {
    border: 'none',
    background: 'transparent',
    color: 'var(--ink)',
    opacity: disabled ? 0.45 : h ? 0.45 : 1
  };
  return React.createElement('button', {
    type,
    disabled,
    onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      ...base,
      ...v,
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/ClientLogo.jsx
try { (() => {
/** The subcontractor's logo slot. Shows the client's image, or an empty dashed slot. */
function ClientLogo({
  src,
  alt = 'Client logo',
  height = 36
}) {
  if (src) return React.createElement('img', {
    src,
    alt,
    style: {
      height,
      maxWidth: 220,
      objectFit: 'contain',
      display: 'block'
    }
  });
  return React.createElement('span', {
    style: {
      width: 160,
      height,
      border: '1px dashed var(--dash)',
      borderRadius: 6,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 13,
      color: 'var(--muted)'
    }
  }, 'Client logo');
}
Object.assign(__ds_scope, { ClientLogo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/ClientLogo.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
const ICONS = {
  "back": {
    "vb": "0 0 301.9 219.53",
    "body": "<g> <path fill=\"currentColor\" d=\"M45.09,89.76c-3.56,3.56-1.04,9.64,3.99,9.64h242.44c5.73-.01,10.38,4.64,10.38,10.37s-4.65,10.38-10.38,10.38H49.08c-5.03,0-7.57,6.06-4.02,9.62,21.6,21.59,72.05,72.03,72.05,72.03,4.05,4.05,4.05,10.63,0,14.68-4.05,4.05-10.63,4.05-14.68,0,0,0-75.34-75.34-99.41-99.41-4.05-4.05-4.02-10.59.03-14.64L102.44,3.04c4.05-4.05,10.63-4.05,14.68,0,4.05,4.05,4.05,10.63,0,14.68L45.09,89.76Z\"></path> </g>"
  },
  "up": {
    "vb": "0 0 219.53 301.9",
    "body": "<g> <path fill=\"currentColor\" d=\"M129.77,45.09c-3.56-3.56-9.64-1.04-9.64,3.99v242.44c.01,5.73-4.64,10.38-10.37,10.38s-10.38-4.65-10.38-10.38V49.08c0-5.03-6.06-7.57-9.62-4.02-21.59,21.6-72.03,72.05-72.03,72.05-4.05,4.05-10.63,4.05-14.68,0-4.05-4.05-4.05-10.63,0-14.68,0,0,75.34-75.34,99.41-99.41,4.05-4.05,10.59-4.02,14.64.03l99.4,99.38c4.05,4.05,4.05,10.63,0,14.68-4.05,4.05-10.63,4.05-14.68,0l-72.04-72.04Z\"></path> </g>"
  },
  "x": {
    "vb": "0 0 219.54 219.53",
    "body": "<g> <path fill=\"currentColor\" d=\"M216.49,201.8l-74.03-74.03c-9.94-9.94-9.94-26.06,0-36L216.5,17.72c4.05-4.05,4.05-10.63,0-14.68h0c-4.05-4.05-10.63-4.05-14.68,0l-74.04,74.04c-9.94,9.94-26.06,9.94-36,0L17.72,3.04c-4.05-4.05-10.63-4.05-14.68,0h0c-4.05,4.05-4.05,10.63,0,14.68l75.29,75.29c9.25,9.25,9.25,24.25,0,33.5L3.05,201.8c-4.05,4.05-4.05,10.63,0,14.68h0c4.05,4.05,10.63,4.05,14.68,0l75.28-75.28c9.25-9.25,24.25-9.25,33.5,0l75.28,75.28c4.05,4.05,10.63,4.05,14.68,0h0c4.05-4.05,4.05-10.63,0-14.68Z\"></path> </g>"
  },
  "cross": {
    "vb": "0 0 301.86 301.86",
    "body": "<g> <path fill=\"currentColor\" d=\"M291.48,140.55h-104.7c-14.06,0-25.46-11.4-25.46-25.46V10.38c0-5.73-4.65-10.38-10.38-10.38h0c-5.73,0-10.38,4.65-10.38,10.38v104.71c0,14.06-11.4,25.46-25.46,25.46H10.38c-5.73,0-10.38,4.65-10.38,10.38h0c0,5.73,4.65,10.38,10.38,10.38h106.48c13.08,0,23.69,10.61,23.69,23.69v106.47c0,5.73,4.65,10.38,10.38,10.38h0c5.73,0,10.38-4.65,10.38-10.38v-106.47c0-13.08,10.61-23.69,23.69-23.69h106.47c5.73,0,10.38-4.65,10.38-10.38h0c0-5.73-4.65-10.38-10.38-10.38Z\"></path> </g>"
  },
  "open": {
    "vb": "0 0 246.65 128.26",
    "body": "<g> <g> <rect fill=\"currentColor\" x=\"0\" y=\"107.5\" width=\"246.64\" height=\"20.76\" rx=\"10.38\" ry=\"10.38\"></rect> <rect fill=\"currentColor\" x=\"0\" y=\"0\" width=\"246.64\" height=\"20.76\" rx=\"10.38\" ry=\"10.38\"></rect> </g> </g>"
  },
  "microphone": {
    "vb": "0 0 178.65 326.47",
    "body": "<g> <g> <rect fill=\"currentColor\" x=\"27.31\" y=\"0\" width=\"124.04\" height=\"219.68\" rx=\"62.02\" ry=\"62.02\"></rect> <path fill=\"currentColor\" d=\"M167.07,126.99v29.3c0,40.66-30.1,76.42-70.6,80.05-46.07,4.14-84.9-32.19-84.9-77.42v-31.93c0-3.2-2.59-5.79-5.79-5.79h0c-3.2,0-5.79,2.59-5.79,5.79v31.93c0,40.32,26.88,74.41,63.65,85.45,11.6,3.48,19.89,13.67,19.89,25.78v50.52c0,3.2,2.59,5.79,5.79,5.79h0c3.2,0,5.79-2.59,5.79-5.79v-50.52c0-12.12,8.29-22.3,19.89-25.78,36.77-11.04,63.64-45.13,63.64-85.45v-31.93c0-3.2-2.59-5.79-5.79-5.79h0c-3.2,0-5.79,2.59-5.79,5.79Z\"></path> </g> </g>"
  },
  "toggle": {
    "vb": "0 0 274.28 178.65",
    "body": "<g> <g> <rect fill=\"currentColor\" x=\"122.94\" y=\"27.29\" width=\"124.04\" height=\"124.04\" rx=\"62.02\" ry=\"62.02\" transform=\"translate(95.65 274.27) rotate(-90)\"></rect> <path fill=\"currentColor\" d=\"M184.96,0h-95.64C39.99,0,0,39.99,0,89.32h0c0,49.33,39.99,89.32,89.32,89.32h95.64c49.33,0,89.32-39.99,89.32-89.32h0C274.28,39.99,234.29,0,184.96,0ZM262.71,89.33c0,42.94-34.81,77.75-77.75,77.75h-95.64c-42.94,0-77.75-34.81-77.75-77.75h0C11.57,46.39,46.38,11.58,89.32,11.58h95.64c42.94,0,77.75,34.81,77.75,77.75h0Z\"></path> </g> </g>"
  }
};

/** Renders one of the site's default icons. Colour follows currentColor. */
function Icon({
  name,
  size = 20,
  color,
  style,
  title
}) {
  const ic = ICONS[name];
  if (!ic) return null;
  const [,, w, h] = ic.vb.split(' ').map(Number);
  return React.createElement('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: ic.vb,
    role: title ? 'img' : 'presentation',
    'aria-label': title,
    style: {
      height: size,
      width: size * w / h,
      display: 'block',
      flexShrink: 0,
      color,
      ...style
    },
    dangerouslySetInnerHTML: {
      __html: ic.body
    }
  });
}
const ICON_NAMES = ["back", "up", "x", "cross", "open", "microphone", "toggle"];
Object.assign(__ds_scope, { Icon, ICON_NAMES });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
/** Bare icon in a 40px hit area (rx 8). Muted → ink on hover; active = brand. */
function IconButton({
  icon,
  onClick,
  active,
  title,
  size = 18
}) {
  const [h, setH] = React.useState(false);
  return React.createElement('button', {
    type: 'button',
    title,
    'aria-label': title,
    onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      width: 40,
      height: 40,
      borderRadius: 8,
      border: 'none',
      background: 'transparent',
      padding: 0,
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: active ? 'var(--brand)' : h ? 'var(--ink)' : 'var(--muted)',
      transition: 'color .15s'
    }
  }, React.createElement(__ds_scope.Icon, {
    name: icon,
    size
  }));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/Input.jsx
try { (() => {
/** Labelled input on the work surface. rx 8, 44px, brand focus ring. */
function Input({
  label,
  value,
  defaultValue,
  placeholder,
  suffix,
  hint,
  onChange,
  type = 'text'
}) {
  const [f, setF] = React.useState(false);
  return React.createElement('label', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, label && React.createElement('span', {
    style: {
      fontSize: 14,
      fontWeight: 500,
      color: 'var(--ink)'
    }
  }, label), React.createElement('span', {
    style: {
      height: 44,
      borderRadius: 8,
      background: 'var(--work)',
      border: '1px solid ' + (f ? 'var(--brand)' : 'var(--line)'),
      boxShadow: f ? 'var(--focus-ring)' : 'none',
      display: 'flex',
      alignItems: 'center',
      padding: '0 14px',
      gap: 8,
      transition: 'border-color .15s'
    }
  }, React.createElement('input', {
    type,
    value,
    defaultValue,
    placeholder,
    onChange,
    onFocus: () => setF(true),
    onBlur: () => setF(false),
    style: {
      flex: 1,
      minWidth: 0,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      font: '400 15px var(--sans)',
      color: 'var(--ink)',
      fontVariantNumeric: 'tabular-nums'
    }
  }), suffix && React.createElement('span', {
    style: {
      color: 'var(--muted)',
      fontSize: 15
    }
  }, suffix)), hint && React.createElement('span', {
    style: {
      fontSize: 13,
      color: 'var(--muted)'
    }
  }, hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Input.jsx", error: String((e && e.message) || e) }); }

// components/core/Lockup.jsx
try { (() => {
/** "platform | formattion ai" — the stand-in lockup. In product, ClientLogo leads the bar. */
function Lockup({
  height = 18,
  base = 'assets/'
}) {
  return React.createElement('span', {
    style: {
      display: 'inline-flex',
      alignItems: 'baseline',
      gap: Math.round(height * 0.78)
    }
  }, React.createElement('span', {
    style: {
      fontSize: height * 1.1,
      fontWeight: 500,
      color: 'var(--ink)',
      lineHeight: 1
    }
  }, 'platform'), React.createElement('span', {
    style: {
      width: 1,
      height,
      background: 'var(--line)'
    }
  }), React.createElement('img', {
    src: base + 'wordmark.svg',
    alt: 'formattion ai',
    style: {
      height,
      display: 'var(--wm-light)'
    }
  }), React.createElement('img', {
    src: base + 'wordmark-bright.svg',
    alt: 'formattion ai',
    style: {
      height,
      display: 'var(--wm-dark)'
    }
  }));
}
Object.assign(__ds_scope, { Lockup });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Lockup.jsx", error: String((e && e.message) || e) }); }

// components/data/DataTable.jsx
try { (() => {
/** Work-surface table. columns: [{key,label,width,align}]. Cells may be nodes (e.g. StatusTag). */
function DataTable({
  columns = [],
  rows = [],
  onRowClick
}) {
  const tpl = columns.map(c => c.width || 'minmax(0,1fr)').join(' ');
  const cell = (c, v, head) => React.createElement('span', {
    key: c.key,
    style: {
      textAlign: c.align || 'left',
      minWidth: 0
    }
  }, v);
  return React.createElement('div', {
    style: {
      background: 'var(--work)',
      borderRadius: 12,
      border: '1px solid var(--dim)',
      overflowX: 'auto'
    }
  }, React.createElement('div', {
    style: {
      minWidth: 520,
      display: 'flex',
      flexDirection: 'column'
    }
  }, React.createElement('div', {
    style: {
      display: 'grid',
      gridTemplateColumns: tpl,
      gap: 16,
      padding: '12px 18px',
      fontSize: 13,
      color: 'var(--muted)',
      borderBottom: '1px solid var(--dim)'
    }
  }, columns.map(c => cell(c, c.label))), rows.map((r, i) => React.createElement('div', {
    key: i,
    onClick: onRowClick ? () => onRowClick(r, i) : undefined,
    onMouseEnter: onRowClick ? e => e.currentTarget.style.background = 'var(--bg3)' : undefined,
    onMouseLeave: onRowClick ? e => e.currentTarget.style.background = 'transparent' : undefined,
    style: {
      display: 'grid',
      gridTemplateColumns: tpl,
      gap: 16,
      padding: '14px 18px',
      fontSize: 15,
      color: 'var(--ink)',
      alignItems: 'center',
      borderBottom: i < rows.length - 1 ? '1px solid var(--dim)' : 'none',
      fontVariantNumeric: 'tabular-nums',
      cursor: onRowClick ? 'pointer' : 'default'
    }
  }, columns.map(c => cell(c, r[c.key]))))));
}
Object.assign(__ds_scope, { DataTable });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/DataTable.jsx", error: String((e && e.message) || e) }); }

// components/data/StatCard.jsx
try { (() => {
/** Panel with a meta label and a 28px light tabular figure. */
function StatCard({
  label,
  value
}) {
  return React.createElement('div', {
    style: {
      background: 'var(--bg2)',
      borderRadius: 12,
      padding: 18,
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, React.createElement('span', {
    style: {
      fontSize: 13,
      color: 'var(--muted)'
    }
  }, label), React.createElement('span', {
    style: {
      fontSize: 28,
      fontWeight: 300,
      color: 'var(--ink)',
      fontVariantNumeric: 'tabular-nums',
      letterSpacing: '-0.02em',
      lineHeight: 1.2
    }
  }, value));
}
Object.assign(__ds_scope, { StatCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/StatCard.jsx", error: String((e && e.message) || e) }); }

// components/feedback/StatusTag.jsx
try { (() => {
const T = {
  ok: ['--ok-fg', '--ok-bg'],
  warn: ['--warn-fg', '--warn-bg'],
  bad: ['--bad-fg', '--bad-bg'],
  info: ['--info-fg', '--info-bg']
};
/** Status as a tag with a word. rx 6. */
function StatusTag({
  tone = 'info',
  children
}) {
  const [fg, bg] = T[tone] || T.info;
  return React.createElement('span', {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      background: 'var(' + bg + ')',
      color: 'var(' + fg + ')',
      fontSize: 13,
      fontWeight: 500,
      lineHeight: 1.4,
      padding: '4px 10px',
      borderRadius: 6,
      whiteSpace: 'nowrap'
    }
  }, children);
}
Object.assign(__ds_scope, { StatusTag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/StatusTag.jsx", error: String((e && e.message) || e) }); }

// components/navigation/ThemeToggle.jsx
try { (() => {
const TRACK = 'M184.96,0h-95.64C39.99,0,0,39.99,0,89.32h0c0,49.33,39.99,89.32,89.32,89.32h95.64c49.33,0,89.32-39.99,89.32-89.32h0C274.28,39.99,234.29,0,184.96,0ZM262.71,89.33c0,42.94-34.81,77.75-77.75,77.75h-95.64c-42.94,0-77.75-34.81-77.75-77.75h0C11.57,46.39,46.38,11.58,89.32,11.58h95.64c42.94,0,77.75,34.81,77.75,77.75h0Z';
/** Light/dark switch. Knob left = light, right = dark. Sets data-theme on <html> and remembers the choice. */
function ThemeToggle({
  width = 34,
  dark: darkProp,
  onChange
}) {
  const [dark, setDark] = React.useState(() => {
    if (darkProp != null) return darkProp;
    try {
      return localStorage.getItem('fp-theme') === 'dark';
    } catch (e) {
      return false;
    }
  });
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    try {
      localStorage.setItem('fp-theme', dark ? 'dark' : 'light');
    } catch (e) {}
  }, [dark]);
  const h = Math.round(width * 178.65 / 274.28);
  return React.createElement('button', {
    type: 'button',
    'aria-label': 'Toggle dark mode',
    onClick: () => {
      setDark(!dark);
      onChange && onChange(!dark);
    },
    style: {
      padding: '12px 6px',
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      display: 'block'
    }
  }, React.createElement('svg', {
    viewBox: '0 0 274.28 178.65',
    style: {
      width,
      height: h,
      display: 'block'
    }
  }, React.createElement('rect', {
    x: dark ? 122.94 : 27.29,
    y: 27.29,
    width: 124.04,
    height: 124.04,
    rx: 62.02,
    ry: 62.02,
    style: {
      fill: 'var(--ink)',
      transition: 'x .3s cubic-bezier(.4,0,.2,1)'
    }
  }), React.createElement('path', {
    d: TRACK,
    style: {
      fill: 'var(--ink)'
    }
  })));
}
Object.assign(__ds_scope, { ThemeToggle });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/ThemeToggle.jsx", error: String((e && e.message) || e) }); }

// components/navigation/TopBar.jsx
try { (() => {
const GLASS = {
  background: 'var(--glass)',
  backdropFilter: 'var(--blur-glass)',
  WebkitBackdropFilter: 'var(--blur-glass)',
  borderRadius: 12
};
const NOISE = {
  position: 'absolute',
  inset: 0,
  backgroundImage: 'var(--noise)',
  backgroundSize: '200px 200px',
  opacity: 0.1,
  pointerEvents: 'none',
  borderRadius: 'inherit'
};
/** Glass top bar + drop-down menu. Cross left (rotates 45°), client logo right, theme toggle at the menu foot. */
function TopBar({
  items = [],
  current,
  onSelect,
  footer = [],
  logoSrc,
  position = 'fixed',
  inset = 10,
  defaultOpen = false
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  const P = position,
    i = inset;
  return React.createElement(React.Fragment, null, React.createElement('div', {
    style: {
      position: P,
      top: i,
      left: i,
      right: i,
      height: 100,
      ...GLASS,
      zIndex: 300,
      pointerEvents: 'none',
      overflow: 'hidden'
    }
  }, React.createElement('div', {
    style: NOISE
  })), React.createElement('div', {
    style: {
      position: P,
      top: i + 100,
      left: i,
      right: i,
      height: 32,
      background: 'linear-gradient(to bottom, var(--bg), var(--fade0))',
      zIndex: 299,
      pointerEvents: 'none'
    }
  }), React.createElement('button', {
    type: 'button',
    'aria-label': open ? 'Close menu' : 'Open menu',
    onClick: () => setOpen(!open),
    style: {
      position: P,
      top: i + 34,
      left: 65,
      width: 32,
      height: 32,
      padding: 0,
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      zIndex: 500,
      color: 'var(--ink)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'transform .35s var(--ease)',
      transform: open ? 'rotate(45deg)' : 'none'
    }
  }, React.createElement(__ds_scope.Icon, {
    name: 'cross',
    size: 32
  })), React.createElement('div', {
    style: {
      position: P,
      top: i + 32,
      right: 65,
      zIndex: 400
    }
  }, React.createElement(__ds_scope.ClientLogo, {
    src: logoSrc
  })), React.createElement('nav', {
    style: {
      position: P,
      top: i + 110,
      left: i,
      bottom: i,
      width: 260,
      ...GLASS,
      zIndex: 450,
      paddingTop: 40,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      opacity: open ? 1 : 0,
      transform: open ? 'translateX(0)' : 'translateX(-16px)',
      pointerEvents: open ? 'auto' : 'none',
      transition: 'opacity .3s ease, transform .3s ease'
    }
  }, React.createElement('div', {
    style: NOISE
  }), items.map(it => React.createElement('a', {
    key: it,
    href: '#',
    onClick: e => {
      e.preventDefault();
      setOpen(false);
      onSelect && onSelect(it);
    },
    onMouseEnter: e => e.currentTarget.style.opacity = 0.45,
    onMouseLeave: e => e.currentTarget.style.opacity = 1,
    style: {
      position: 'relative',
      zIndex: 1,
      display: 'block',
      padding: '6px 0',
      margin: '0 0 12px 28px',
      fontWeight: current === it ? 500 : 300,
      fontSize: 22,
      lineHeight: 1,
      letterSpacing: '-0.01em',
      color: 'var(--ink)',
      transition: 'opacity .15s'
    }
  }, it)), React.createElement('div', {
    style: {
      position: 'relative',
      zIndex: 2,
      margin: 'auto 0 8px 26px'
    }
  }, React.createElement(__ds_scope.ThemeToggle, null)), React.createElement('div', {
    style: {
      position: 'relative',
      zIndex: 2,
      margin: '0 20px 20px 32px',
      display: 'flex',
      flexDirection: 'column',
      gap: 5
    }
  }, footer.map(f => React.createElement('span', {
    key: f,
    style: {
      fontSize: 10,
      letterSpacing: '0.1em',
      color: 'var(--muted)'
    }
  }, f)))));
}
Object.assign(__ds_scope, { TopBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/TopBar.jsx", error: String((e && e.message) || e) }); }

// components/people/Avatar.jsx
try { (() => {
/** Circle profile image for lists. Initials on --bg3 when no photo. */
function Avatar({
  src,
  name = '',
  size = 40
}) {
  const ini = name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('');
  return React.createElement('span', {
    style: {
      width: size,
      height: size,
      borderRadius: 999,
      background: 'var(--bg3)',
      border: '1px solid var(--line)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      flexShrink: 0,
      fontSize: Math.round(size * 0.33),
      fontWeight: 500,
      color: 'var(--muted)'
    }
  }, src ? React.createElement('img', {
    src,
    alt: name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    }
  }) : ini);
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/people/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/people/Portrait.jsx
try { (() => {
/** 3:4 portrait holder for an open profile. rx 12 — sits in a 20px panel with 8px inset. */
function Portrait({
  src,
  name = '',
  width = 140
}) {
  const ini = name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('');
  return React.createElement('span', {
    style: {
      width,
      aspectRatio: '3 / 4',
      borderRadius: 12,
      background: 'var(--bg3)',
      border: '1px solid var(--line)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      fontSize: 28,
      fontWeight: 300,
      color: 'var(--muted)'
    }
  }, src ? React.createElement('img', {
    src,
    alt: name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    }
  }) : ini);
}
Object.assign(__ds_scope, { Portrait });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/people/Portrait.jsx", error: String((e && e.message) || e) }); }

// ui_kits/platform/Screens.jsx
try { (() => {
const NS = (() => {
  for (const k of Object.keys(window)) {
    try {
      const v = window[k];
      if (v && typeof v === 'object' && v.Button && v.TopBar) return v;
    } catch (e) {}
  }
  return {};
})();
const {
  Button,
  Input,
  StatusTag,
  StatCard,
  DataTable,
  TopBar
} = NS;
const ROWS = [{
  no: 14,
  period: 'September 2026',
  gross: '£48,250',
  tone: 'info',
  s: 'Draft'
}, {
  no: 13,
  period: 'August 2026',
  gross: '£52,100',
  tone: 'warn',
  s: 'Awaiting approval'
}, {
  no: 12,
  period: 'July 2026',
  gross: '£46,900',
  tone: 'bad',
  s: 'Overdue'
}, {
  no: 11,
  period: 'June 2026',
  gross: '£44,300',
  tone: 'ok',
  s: 'Paid'
}];
function Header({
  meta,
  title,
  action
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      gap: 16,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--muted)'
    }
  }, meta), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 28,
      lineHeight: 1.2,
      fontWeight: 500,
      color: 'var(--ink)',
      letterSpacing: '-0.01em'
    }
  }, title)), action);
}
function ValuationsList({
  go
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 28
    }
  }, /*#__PURE__*/React.createElement(Header, {
    meta: "Riverside Block C \xB7 Harlow Build Ltd",
    title: "Valuations",
    action: /*#__PURE__*/React.createElement(Button, {
      onClick: () => go('new')
    }, "New valuation")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(StatCard, {
    label: "Applied to date",
    value: "\xA3412,800"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Paid",
    value: "\xA3364,550"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Retention held",
    value: "\xA320,640"
  })), /*#__PURE__*/React.createElement(DataTable, {
    onRowClick: () => go('doc'),
    columns: [{
      key: 'no',
      label: 'No.',
      width: '60px'
    }, {
      key: 'period',
      label: 'Period'
    }, {
      key: 'gross',
      label: 'Gross',
      width: '120px',
      align: 'right'
    }, {
      key: 'status',
      label: 'Status',
      width: '170px'
    }],
    rows: ROWS.map(r => ({
      ...r,
      status: /*#__PURE__*/React.createElement(StatusTag, {
        tone: r.tone
      }, r.s)
    }))
  }));
}
function NewValuation({
  go
}) {
  const [q, setQ] = React.useState('124.5');
  const [rate, setRate] = React.useState('38.50');
  const total = (parseFloat(q) || 0) * (parseFloat(rate) || 0);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 28,
      maxWidth: 720
    }
  }, /*#__PURE__*/React.createElement(Header, {
    meta: "Valuation 15 \xB7 October 2026",
    title: "New valuation"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg2)',
      borderRadius: 20,
      padding: 12,
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Measured quantity",
    value: q,
    onChange: e => setQ(e.target.value),
    suffix: "m\xB2"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Rate",
    value: rate,
    onChange: e => setRate(e.target.value),
    suffix: "\xA3/m\xB2"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      borderTop: '1px solid var(--dim)',
      paddingTop: 20
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 500,
      color: 'var(--ink)'
    }
  }, "Gross this period"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 40,
      fontWeight: 300,
      color: 'var(--ink)',
      fontVariantNumeric: 'tabular-nums',
      letterSpacing: '-0.02em'
    }
  }, "\xA3", total.toLocaleString('en-GB', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: () => go('doc')
  }, "Submit valuation"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    onClick: () => go('list')
  }, "Save draft"), /*#__PURE__*/React.createElement(Button, {
    variant: "text",
    onClick: () => go('list')
  }, "Cancel")));
}
function ValuationDoc({
  go
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(Header, {
    meta: "Application for payment \xB7 PDF preview",
    title: "Valuation 14",
    action: /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      onClick: () => go('list')
    }, "Back to valuations")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#FFFFFF',
      color: '#000',
      maxWidth: 640,
      width: '100%',
      aspectRatio: '1/1.414',
      padding: 48,
      display: 'flex',
      flexDirection: 'column',
      gap: 28,
      border: '1px solid var(--line)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 140,
      height: 32,
      border: '1px dashed rgba(28,24,20,0.32)',
      borderRadius: 6,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 12,
      color: '#9A8F82'
    }
  }, "Client logo"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: '#4A4038',
      textAlign: 'right',
      lineHeight: 1.6
    }
  }, "Valuation 14", /*#__PURE__*/React.createElement("br", null), "30 September 2026")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 500
    }
  }, "Application for payment \u2014 Riverside Block C"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      fontSize: 13,
      fontVariantNumeric: 'tabular-nums'
    }
  }, [['Measured work', '£44,120.00'], ['Variations', '£4,130.00'], ['Gross this period', '£48,250.00'], ['Retention (5%)', '−£2,412.50'], ['Due', '£45,837.50']].map(([a, b], i) => /*#__PURE__*/React.createElement("div", {
    key: a,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '10px 0',
      borderBottom: '1px solid rgba(0,0,0,0.12)',
      fontWeight: i === 4 ? 500 : 400
    }
  }, /*#__PURE__*/React.createElement("span", null, a), /*#__PURE__*/React.createElement("span", null, b)))), /*#__PURE__*/React.createElement("span", {
    style: {
      marginTop: 'auto',
      fontSize: 11,
      color: '#4A4038'
    }
  }, "Printed on white \u2014 no background ink.")));
}
function App() {
  const [screen, setScreen] = React.useState('list');
  const map = {
    valuations: 'list',
    'new valuation': 'new',
    documents: 'doc'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh'
    }
  }, /*#__PURE__*/React.createElement(TopBar, {
    items: ['overview', 'valuations', 'new valuation', 'variations', 'timesheets', 'documents'],
    current: screen === 'list' ? 'valuations' : screen === 'new' ? 'new valuation' : 'documents',
    onSelect: i => map[i] && setScreen(map[i]),
    footer: ['signed in as Dan Pryce', 'sign out']
  }), /*#__PURE__*/React.createElement("main", {
    style: {
      maxWidth: 1120,
      margin: '0 auto',
      padding: '150px 40px 96px'
    }
  }, screen === 'list' && /*#__PURE__*/React.createElement(ValuationsList, {
    go: setScreen
  }), screen === 'new' && /*#__PURE__*/React.createElement(NewValuation, {
    go: setScreen
  }), screen === 'doc' && /*#__PURE__*/React.createElement(ValuationDoc, {
    go: setScreen
  })));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/platform/Screens.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.ClientLogo = __ds_scope.ClientLogo;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.ICON_NAMES = __ds_scope.ICON_NAMES;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Lockup = __ds_scope.Lockup;

__ds_ns.DataTable = __ds_scope.DataTable;

__ds_ns.StatCard = __ds_scope.StatCard;

__ds_ns.StatusTag = __ds_scope.StatusTag;

__ds_ns.ThemeToggle = __ds_scope.ThemeToggle;

__ds_ns.TopBar = __ds_scope.TopBar;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Portrait = __ds_scope.Portrait;

})();
