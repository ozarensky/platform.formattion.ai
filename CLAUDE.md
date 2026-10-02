# Project rules

## Scrollbars
Native scrollbars are never shown. Every DC loads assets/scroll-pill.js in <helmet>; it hides native bars and draws the brand scroll pill (assets/scroll-indicator.svg): 6px, ink, radius 999, no track, no arrows, fades out 1.2s after scrolling. Any element with overflow:auto/scroll is picked up automatically.

## Radius (no exceptions)
Nested corners are concentric: inner radius + inset = outer radius. Panels/cards are radius 20 with 8px padding, so inner work surfaces (lists, dl, buttons, empty states) are radius 12. Text, headings and pill buttons inside a card get their own 16px inset instead of card padding. Icon buttons (radius 8) sit 12px from a radius-20 edge. A pill never sits in a card corner. Check this on every new container.

## Arrows (hover rule)
Arrow icons (back, up, next) are ink at rest, bare in a 40–52px hit area. Hover moves the arrow 5px in the direction it points — `transform:translateX(-5px)` for back, `translateY(-5px)` for up, `translateX(5px)` for forward — with `transition:transform .25s cubic-bezier(.25,.46,.45,.94)`. No colour change, no opacity fade. Other icon buttons follow the design system: muted → ink.

## Camera icon
`assets/icons/camera.svg` is the brand camera (currentColor, 500 viewBox, drawn to sit at 40px). Use it for every take-a-photo action or representation — never a stand-in glyph or library icon. Bare in a 40px hit area, ink.
