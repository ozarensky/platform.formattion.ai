# formattion platform — Design System

The brand system for the **formattion subcontractor platform**, where UK construction subcontractors do valuations, variations and timesheets. It comes from the formattion.ai brand but stands on its own: one typeface, warm paper grounds, the subcontractor's own logo and colours, and documents on pure white.

**Sources**
- Attached codebase `platform.formattion/` (read-only mount): the prior platform design system — tokens, components, guideline cards, UI kit, and the platform guideline `formattion Platform Brand.dc.html` (offline copy `formattion Platform Brand (standalone).html`, not copied here).
- Uploaded assets: `uploads/mark.svg`, `wordmark.svg`, `wordmark-bright.svg` and the seven icons — the user-edited versions are what ships in `assets/`.
- Parent brand: formattion.ai (dark palette, theme toggle); this system is the platform's own paper-ground derivative.

## Content fundamentals
- Plain, British and site-literate. Say the job: "Submit valuation", "Valuation 12 is 9 days overdue."
- British spelling. Brand name in lowercase: **formattion ai**.
- Menu items are lowercase ("valuations"). Headings and buttons use sentence case.
- We speak to you. Keep it short. Use concrete numbers ("£48,250", "9 days").
- No emoji, no exclamation marks. Don't use "unlock", "journey", "workflow" or "success!".
- Write / not:
  - "No timesheets this week yet." — not "Nothing to see here".
  - "Sent to Harlow Build. We'll tell you when they reply." — not "Success! Your submission is on its journey".

## Visual foundations
- **Type:** Helvetica Neue only, weights 300/400/500. No serif, italic or monospace.
  - Sizes: H2 44/300, page title 28/500, section 20/500, body 15/1.6, label 14/500, meta 13, menu 22/300 lowercase.
  - Eyebrows are 11px uppercase +0.14em, for section labels only. All figures are tabular.
- **Colour (light):**
  - Grounds: paper #F4EFE6, panel #ECE6DC, hover #E2DBD0, work surface #FBF9F5.
  - Ink #000000, body #4A4038, muted #9A8F82.
  - Lines: 16% and 9%. Empty slots use a 32% dashed line.
- **Colour (dark):** the swap. Ground #000000, panel #1C1F22, hover #242729, work #181A1D; ink and body both #F4EFE6.
- **Brand colour:** none of our own. `--brand`, `--brand-shade-1` and `--brand-shade-2` are empty slots filled from the subcontractor at onboarding:
  - one colour: derive two shades;
  - two or three: use them as given;
  - more than three: pick three that work on paper.
- **Status:** always a tag with a word, never colour alone.
  - Sage: paid, approved.
  - Honey: pending, in review.
  - Terracotta: overdue, rejected.
  - Powder: draft, scheduled.
- **Documents:** every PDF, valuation, invoice and report sits on pure white #FFFFFF. No tints, panels or background fills, so printing puts no ink on the background. Screen grounds are screen-only.
- **Radius:** 6 tag, 8 input or hit area, 12 card/bar/menu/table, 20 frame/panel, 999 button.
  - **Rule, no exceptions:** nested corners are concentric. Inner radius + inset = outer radius, e.g. 6 + 14 = 20, 8 + 12 = 20, 12 + 8 = 20.
  - Padding follows from the radii. A pill never sits in a card corner.
- **Backgrounds:** flat paper. No gradients (except the 32px paper fade under the bar) and no imagery in the product.
- **Glass:** only the top bar and the drop-down menu. Cream at 30% (black at 30% in dark), 20px blur, 10% fractal-noise grain, rx 12.
  - The bar is inset 10px from the viewport, or 8px inside a 20px frame.
- **Cards:** flat `--bg2` fill. No border and no shadow; tables add a 9% hairline. Swatch specimens carry a 16% hairline so they read in both modes.
- **Shadows:** none, apart from the focus ring (brand colour at 18%, 3px).
- **Hover:** text and menu items drop to 45% opacity. Primary goes ink → brand, secondary hairline → ink, icons muted → ink. Table rows get the hover fill.
- **Press:** no shrink. Active uses the brand colour.
- **Motion:** quiet and short, no bounces.
  - The cross rotates 45° (.35s, cubic-bezier(.4,0,.2,1)).
  - The menu fades and slides 16px (.3s). The theme knob slides (.3s).
- **Layout:** 1120px container, 40px gutters (20 on mobile). Content starts 150px down, under the bar. Hit targets are 44px minimum.

## Iconography
- Seven icons only, in `assets/icons/`: back, up, x, cross (menu), open, microphone, toggle. Use them through the `Icon` component (inline paths, `currentColor`).
- Icons sit bare in a 40px hit area, never inside filled circles.
- No icon libraries, no emoji, and no unicode glyphs used as icons. If there's no icon for an action, use a text label.
- Only the cross rotates.
- The theme toggle is the toggle icon drawn as a live switch: knob left for light, right for dark.

## Logo
- The top-bar logo slot on the right always carries **the subcontractor's logo**. Use their colours, never recolour it, max 36px tall (`ClientLogo`).
- "platform | formattion ai" (`Lockup`) is a stand-in, used in guidelines and formattion-owned material only.
- **The favicon and app icon are always the formattion mark on ink** (`assets/mark.svg`).
- In dark mode, use the bright wordmark (`assets/wordmark-bright.svg`).

## Index
- `styles.css` → `tokens/` (colors, typography, radius, spacing, effects, base)
- `guidelines/` — foundation cards (Colors, Type, Spacing, Brand)
- `components/core` — Icon, Button, IconButton, Input, Lockup, ClientLogo
- `components/feedback` — StatusTag
- `components/navigation` — TopBar, ThemeToggle
- `components/data` — StatCard, DataTable
- `components/people` — Avatar (40px circle, lists), Portrait (3:4, open profile)
- `ui_kits/platform` — valuations list, new valuation, valuation document
- `assets/` — wordmark, bright wordmark, mark, the 7 icons
- `SKILL.md` — agent skill entry point

**Intentional additions:**
- `ClientLogo`: a slot for the subcontractor's logo.
- `Lockup`: the stand-in lockup.
- `ThemeToggle`: the required light/dark switch.
- `DataTable` and `StatCard`: patterns from the guideline's "In use" screen.

**Fonts:** Helvetica Neue is a system face, so no webfont ships. The fallback is Helvetica, then Arial.
