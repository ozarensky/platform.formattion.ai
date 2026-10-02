# Project rules

## Scrollbars
Native scrollbars are never shown. Every DC loads assets/scroll-pill.js in <helmet>; it hides native bars and draws the brand scroll pill (assets/scroll-indicator.svg): 6px, ink, radius 999, no track, no arrows, fades out 1.2s after scrolling. Any element with overflow:auto/scroll is picked up automatically.

## Radius (no exceptions)
Nested corners are concentric: inner radius + inset = outer radius. Panels/cards are radius 20 with 8px padding, so inner work surfaces (lists, dl, buttons, empty states) are radius 12. Text, headings and pill buttons inside a card get their own 16px inset instead of card padding. Icon buttons (radius 8) sit 12px from a radius-20 edge. A pill never sits in a card corner. Check this on every new container.
