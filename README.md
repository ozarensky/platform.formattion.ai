# Handoff: formattion platform (subcontractor app)

## Overview
A platform for UK construction subcontractors: retentions, projects, operatives, equipment and claims, with an AI assistant ("For"). Two entry points: a one-time-code **Landing Page** (log-in) and the **Platform** behind it.

## About the design files
Everything in this bundle is a **design reference built in HTML** (Design Component format: `*.dc.html` + `support.js` runtime). It shows the intended look and behaviour; it is **not production code to ship**. Recreate these screens in the target codebase's environment (React/Next, Vue, native…) using its own patterns. If no environment exists yet, pick the best fit for a mobile-first PWA with offline tolerance (the mock includes an offline banner state).

Open `Platform.dc.html` and `Landing Page.dc.html` directly in a browser to explore. The design system bundle lives in `_ds/` (tokens as CSS custom properties in `_ds/.../tokens/*.css`, components in `_ds_bundle.js`, guide in `readme.md`).

## Fidelity
**High-fidelity.** Colours, type, spacing, radii and copy are final. Recreate pixel-accurately using the design tokens below. Data is mock (Harlow Groundworks Ltd, Aiden Cole, Tom Bailey, Kingsway depot, Lee Parker…) — replace with real models.

## Design system essentials (from `_ds` guide)
- Type: Helvetica Neue only, weights 300/400/500. H1 28/300 or 28/500 (profiles), section 20/500, body 15–16 /1.6, label 14/500, meta 13, eyebrow 11 uppercase +0.14em. Figures tabular.
- Light grounds: paper `#F4EFE6` (`--bg`), panel `#ECE6DC` (`--bg2`), hover `#E2DBD0` (`--bg3`), work surface `#FBF9F5` (`--work`). Ink `#000`, body `#4A4038`, muted `#9A8F82`. Lines 16% / 9% (`--line`, `--dim`); empty slots 32% dashed (`--dash`).
- Dark: ground `#000`, panel `#1C1F22`, hover `#242729`, work `#181A1D`, ink/body `#F4EFE6`. Toggled via `data-theme="dark"` on `<html>`.
- Status is always a word tag (StatusTag): sage = ok/paid/valid, honey = warn/pending/expiring, terracotta = bad/overdue, powder = info/draft/invited.
- Radius: 6 tag, 8 input, 12 card/list/table, 20 frame/panel, 999 button. **Nested corners are concentric, no exceptions** (inner radius + inset = outer): radius-20 card → 8px padding → radius-12 surfaces; radius-8 icon buttons sit 12px from a radius-20 edge; a pill never sits in a card corner.
- Cards: flat `--bg2`, no border, no shadow. No gradients except the 32px paper fade under the top bar. Glass only on the top bar and menu.
- Hover: text/menu items to 45% opacity; rows take `--bg3`. Motion short, `cubic-bezier(.4,0,.2,1)`, no bounces.
- Icons: only the 7 in the DS (back, up, x, cross, open, microphone, toggle). No icon libraries, no emoji.
- Copy: plain, British, sentence case, lowercase menu items, no exclamation marks. Brand lowercase "formattion ai".

## Global chrome (Platform)
- **Top bar** (`TopBar.jsx`): fixed glass bar inset 10px, 100px tall, with a 32px paper fade below. Cross icon (left, 44px hit area) opens a 260px glass menu that slides/fades in (.3s): items `today · projects · money · operatives · equipment` (22/300 lowercase), secondary `company` (18/300), footer "FORMATTION AI LTD / PLATFORM 0.1". Client logo slot on the right (max 36px tall). Theme toggle.
- **No section label** under the bar; content starts 150px from the top.
- **Content width**: 640px centred for list screens and flows; **1120px** for dashboards (Today, Project, Operative, Equipment unit, Retention, Company). 20px side gutters, 140px bottom padding.
- **Back arrow** fixed bottom-left (left 44, bottom 39, 44×44): steps through in-app history. Hidden on Today with empty history. Hover translates −5px.
- **Up arrow** fixed bottom-right (right 100 wide / 44 narrow): appears after 80% of a viewport scrolled; smooth-scrolls to top.
- **For mark** bottom-right on wide screens: spins on hover; opens the chat panel. On narrow screens the chat is a bottom bar: last reply text + input + mic.
- **Chat panel** (wide ≥1040px): fixed aside right 20 / bottom 20, 320px wide, `--bg2`, radius 20, max-height calc(100vh − 170px). While open, page content gets `padding-right: 340px` and `padding-left: 108px` (so content stays 20px clear of both the back arrow and the panel), animated .3s.
- **Offline banner** (prop `offline`): `--bg2` radius 12, "You're offline. Showing what we saved at 07:42." + "1 change waiting to sync".
- **Scrollbars**: native bars hidden everywhere; a custom 6px ink pill (`assets/scroll-indicator.svg`, radius 999) is drawn 4px from the right edge, fades in on scroll, out 1.2s later, draggable. See `assets/scroll-pill.js` and `PROJECT_RULES.md`. Applies to the page and any overflow:auto box (chat log).

## Phone layout (≤768px) — "Summary" direction, chosen
- Top bar 60px inset 8, sits below the status area (safe-area inset). 24px menu icon in a 44px hit area at top 16 / left 18; client logo 14px tall at top 28 / right 28. Content starts 108px below the safe area.
- Menu drops from 76px as a full-width glass panel (8px insets, 60px top padding). Items only as wide as their word; tapping anywhere else on the panel closes it. Page scroll locks while open.
- No back arrow and no up arrow on phones: swipe right from the left edge (start < 32px, travel > 70px) goes back; fast scroll returns to top.
- For = the mark at right 20 / bottom 24(+safe area). Tapping opens a **full-screen chat** on the paper ground: context line top-left, X top-right, empty-state prompt "Ask about <context>, or send a photo of a card, a plate or a letter.", website-style input box at the bottom (radius 20, bg2, 9% hairline, 18/300 textarea "Reply…", mic bottom-right at 50% opacity, up-arrow send appears when there is text, Enter sends). Page scroll locks while open.
- Dashboards stack in one column, 20px apart. Each card collapses: header = title 20/500 + a one-line muted summary (14px) when closed + a cross icon (rotates 45° when open). The first visible card is open by default; tapping a header opens that one and closes the rest. Summaries: Today → "4 waiting", "£28,170 held · 2 overdue", "3 live projects", "4 in the next 30 days"; Project → "4 items · 65% done", "2 on site · 1 plant", "Finish 14 Aug", "£6,200 held · 47 days overdue", "2 documents", "2 talks", "None reported"; Operative → "3 cards", "4 on record", mobile; Unit → "3 items", serial, "3 checks"; Company → "Connected", "3 people", trading name.
- Stat cards wrap at a 150px minimum (two-up on phones); figures scale 20–28px.
- Arrange mode is desktop-only.
- Alternatives explored and parked: "Panels" (desktop cards, no summaries) and "Paper" (no boxes, hairlines). Available via prop `mobileStyle`.

## Dashboard pattern (shared by Today, Project, Operative, Equipment unit, Retention, Company)
- Header block (title/summary/stat cards), then an **arrange bar**, then a **masonry** of cards.
- Cards: `--bg2`, radius 20, **padding 8** (concentric rule: inner radius 12 + 8 = 20), internal gap 12. Header row and loose text/buttons get their own 16px inset. Card title 20/500 on the left. Inner lists sit on `--work`, radius 12, rows 12px 16px with a 9% hairline between, primary 15px ink, meta 13px muted, StatusTag right-aligned. Key/value rows: label 13 muted left, value 15 ink tabular right. Empty states: 15px muted in a dashed 32% border, radius 12.
- Masonry: columns = max(1, floor((W + 20) / 440)) → 2 columns at the 1080px content width, 1 under ~860px. Each card goes under the currently shortest column; gaps are a constant 20px both ways. Positions are measured after render and animate (`top/left/width .25s`) when they change; no animation on first paint of a screen.
- **Arrange mode** ("Arrange" text link, 14px muted → ink on hover; becomes "Done"): cards get a dashed outline and `cursor: grab`; each card header shows Earlier / Later / Hide text buttons (44px hit areas). Cards are HTML5-draggable; on drag-over the order updates **live** so other cards shift out of the way; the dragged card sits at 35% opacity. "Reset" restores defaults. Hidden cards are listed as "Show <title>" dashed chips in the arrange bar. **Hide is disabled on Today.**
- Persistence: order + hidden per screen, `localStorage` key `fp-layouts` = `{ [screen]: { order: string[], hidden: string[] } }`. Unknown keys append at the end; removed keys are dropped.

## Screens
### Landing Page
One-time-code log-in: contact (mobile or email) → code → in. See `Landing Page.dc.html` (prop `demoFail` shows the error state).

### Today (dashboard, 1120)
H1 28/300 "N things need you." + date line. Cards (default order): **Needs you** (clickable action rows with tags; empty state copy "Nothing needs you. When a retention falls due, a card expires or For drafts something, it shows here first."), **Money** (key/values: held across N jobs, overdue £ · n jobs, next due, claimed waiting; link "All retentions"), **On site this week** (live projects: crew/plant counts, % done; link "All projects"), **Running out soon** (operatives and plant with warn/bad status, bad first), **What For did** (activity log, what + when).

### Projects (list, 640)
H1 "7 projects, 3 live, £… held." Rows: `--bg2` radius 12 padding 18, 2-col grid: name 16/500 · progress % right; contractor · order value left · meta right (finish date / defects to / retention status).

### Project (dashboard, 1120)
Header grid: name 28/500 + state tag + summary | three StatCards (Progress, Finish/Finished, Order). Cards: **Works** (8px progress bar `--bg3`/ink + work rows + note), **On site** (operatives then plant, each a row button opening the profile), **Dates**, **Retention** (big amount button → retention detail; then **Details** key/values), **Health and safety pack** (+ "Add a document"), **Toolbox talks** (+ "Record a talk"), **Incidents** (+ "Report an incident").

### Money (list, 640)
Eyebrow "Retentions". States via prop `listState`: loading (skeleton blocks), empty, error, populated. Populated: H1 "£… held across N jobs — n overdue." rows: project · amount 20/300 right; contractor · due label · tag. Sorted overdue → due → claimed → paid.

### Retention detail (dashboard, 1120)
Header: project name + tag + summary | StatCards Held, Due/Fell due/Paid. Cards: **Project** (contract key/values), **What For has sent** (history or empty state). Action bar: "Claim now" when overdue/due.

### Claim (flow, 640)
"Check the claim" → if no mailbox: notice card "Connect your mailbox first." and primary becomes "Connect mailbox" (goes to Company). Drafting skeleton 1.1s, then From/To/Amount rows + editable letter textarea. Primary "Send the claim" (disabled when empty) → Sent screen.

### Operatives (list, 640)
H1 "N operatives, 1 card expiring." Rows with 40px Avatar, name, trade · cards, tag. **Waiting** section for pending (to approve / invited; disabled when not actionable). Dashed invite block + "Invite an operative".

### Invite flow (640)
Fields: First name, Mobile (hint: "The link goes by text and lasts 7 days. They can come back to it until they submit; then it closes."), Starts on (optional). Preview "What they'll get". Primary "Send the link" (needs name >1 char and ≥10 digits). → Invited screen: "Sent to <name> on <mobile>." and row "link open until <date> or until they submit", tag `invited`. Business rule: link reusable for 7 days, form state is kept between opens, link closes on submit; For nudges after 2 days.

### Approve (640)
"Check <name>'s cards": photo tiles, Details form (Full name, Trade, Mobile, Emergency contact — prefilled "by For"), Cards list read by For + note. Primary "Approve and add", secondary "Ask for a retake". → Approved: "<name> is on the books."

### Operative profile (dashboard, 1120)
Header panel: Portrait 120 wide (3:4) + name 28/500, trade, where this week, tag. Cards: **Cards** (+ "Read from photos by For, checked by you on <date>."), **Training** (or empty state; "Add training"), **Details** (mobile, started, NI, emergency).

### Equipment (list, 640) and Equipment unit (dashboard, 1120)
List rows: name, meta, tag, check line. Dashed "Add equipment" block. Unit: name + tag + check line; cards **Certificates and checks**, **Details**, **Recent checks**.

### Company (dashboard, 1120)
"Harlow Groundworks Ltd". Cards: **Mailbox** (address, provider/last checked, tag connected/not connected; "Connect mailbox" primary when missing), **People** (+ "Add a person"), **Details**.

## Interactions & behaviour
- Navigation keeps an in-app history stack; menu picks reset it. Every navigation scrolls to top.
- Action bar (bottom, scrolls with content): primary pill button, optional secondary. Labels per screen listed above.
- Chat: submitting a message appends "You" bubble (`--bg3`, 10px 14px) and a "For" reply after 900ms ("Looking at <context> now…"). Context = current project/operative/unit/retention.
- Theme: follows `data-theme` on `<html>`; client logo swaps to the bright lockup in dark.
- Tweaks/props on Platform: `listState` (loading/empty/error/populated), `offline`, `mailboxConnected`, `clientLogo`.

## State
screen, history[], selected ids (selId, opId, unitId, candId, pjId), invite form, invites[], approved[], claimed{} (persisted `fp-claimed`), draft/drafting, chatOpen, messages[], ask, mailbox, arranging, dragging, layouts{} (persisted `fp-layouts`), masonry positions (derived), wide (≥1040), scrolled (>80% viewport).

## Pending (not designed yet)
- Operative's own phone screens (open link → photograph cards → submit; form saves between opens, closes on submit).
- Claim send must require a connected mailbox (flow is mocked; enforce server-side).
- Applications and variations under Money.

## Files
- `Mobile Preview.dc.html` + `ios-frame.jsx` — phone canvas: `Platform.dc.html?top=54&m=summary&screen=…` deep links (`screen`: today/projects/money/operatives/equipment/company/project&id=/operative&id=/unit&id=/detail&id=/invite/approve&id=).
- `Platform.dc.html` — all platform screens, logic and mock data (`RETENTIONS`, `PROJECTS`, `OPERATIVES`, `EQUIPMENT`, `PENDING`, `PEOPLE`).
- `Landing Page.dc.html` — one-time-code log-in.
- `TopBar.jsx` — glass top bar + menu.
- `support.js` — DC runtime (reference only).
- `assets/` — lockups, mark, wordmarks, scroll pill script + pictogram.
- `_ds/` — formattion Platform Design System: tokens, components bundle, guide.
- `PROJECT_RULES.md` — scrollbar rule.
