---
name: Serene Stewardship
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#444651'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#757682'
  outline-variant: '#c5c5d3'
  surface-tint: '#4059aa'
  primary: '#00236f'
  on-primary: '#ffffff'
  primary-container: '#1e3a8a'
  on-primary-container: '#90a8ff'
  inverse-primary: '#b6c4ff'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#442100'
  on-tertiary: '#ffffff'
  tertiary-container: '#653400'
  on-tertiary-container: '#fc922b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b6c4ff'
  on-primary-fixed: '#00164e'
  on-primary-fixed-variant: '#264191'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffdcc3'
  tertiary-fixed-dim: '#ffb77d'
  on-tertiary-fixed: '#2f1500'
  on-tertiary-fixed-variant: '#6e3900'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 2.25rem
    fontWeight: '700'
    lineHeight: 2.75rem
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.75rem
    fontWeight: '600'
    lineHeight: 2.25rem
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.375rem
    fontWeight: '600'
    lineHeight: 1.875rem
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.75rem
    letterSpacing: -0.01em
  title-sm:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: '600'
    lineHeight: 1.5rem
  body-lg:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: 1.75rem
  body-md:
    fontFamily: Inter
    fontSize: 0.9375rem
    fontWeight: '400'
    lineHeight: 1.5rem
  body-sm:
    fontFamily: Inter
    fontSize: 0.8125rem
    fontWeight: '400'
    lineHeight: 1.25rem
  label-md:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '500'
    lineHeight: 1.25rem
  label-sm:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: 1rem
    letterSpacing: 0.04em
  metric-number:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.875rem
    fontWeight: '700'
    lineHeight: 2.25rem
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  space-xxs: 0.25rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
  gutter-mobile: 1rem
  gutter-desktop: 1.5rem
  container-max: 80rem
---

## Brand & Style

The design system embodies a serene, orderly, and deeply respectful administrative experience designed for congregation record-keeping and field service activity tracking. It balances ecclesiastical dignity with contemporary SaaS precision. The emotional tone is calm, accountable, trustworthy, and supportive—free of visual noise, anxiety-inducing patterns, or overly commercial cues.

Visual principles draw from **Corporate / Modern** refinement fused with **Minimalism**:
- **Clarity over cleverness:** Content and numerical data (hours, return visits, Bible studies) are paramount.
- **Dignified warmth:** Soft cool-slate surfaces prevent harsh glare, while restrained gold and emerald accents celebrate service milestones with understated honor.
- **Architectural order:** Structured tables, deliberate vertical rhythms, and crisp low-contrast separation replace flashy transitions and heavy decorative chrome.

## Colors

The palette establishes dependable institutional trust while honoring service achievements with deliberate accenting:

- **Primary (`#1E3A8A` / Deep Navy):** Represents authority, fidelity, and clarity. Used for primary interactive actions, navigation headers, primary stat figures, and selected states.
- **Secondary (`#10B981` / Soft Sage-Emerald):** Designates active status, completed monthly reporting, submission approvals, and the *Precursor Regular* role tier.
- **Tertiary (`#D97706` / Muted Warm Amber):** Reserved for goals in progress, reminders, special service campaigns, and the *Precursor Auxiliar* badge.
- **Neutral Palette:**
  - Base canvas: `#F8FAFC` (Slate 50) for a softened, non-fatiguing workspace.
  - Surface containers / card background: `#FFFFFF` (White) with alternating row fills using `#F1F5F9` (Slate 100).
  - Structural strokes: `#E2E8F0` (Slate 200) for subtle cell divisions and card perimeters.
  - Body and table text: `#0F172A` (Slate 900) for high-contrast primary text, and `#64748B` (Slate 500) for secondary metadata and table headers.

## Typography

Typography blends the warm, structural clarity of **Plus Jakarta Sans** for headlines and metrics with the functional neutrality and legibility of **Inter** for dense data lists, tables, and form inputs.

- **Numerals & Metrics:** Data tracking relies heavily on numerical comprehension. Plus Jakarta Sans tabular or proportional figures ensure hours, placements, and totals remain instantly scannable.
- **Labels & Microcopy:** `label-sm` applies uppercase styling with `0.04em` tracking exclusively for table headers, metadata descriptors, and categorical badges (e.g., role tags).
- **Mobile Readability:** On viewport widths under 640px, top-level headings step down via `headline-lg-mobile` to preserve multi-column alignment and avoid awkward line breaks in Spanish congregation terminology.

## Layout & Spacing

The layout is built upon an 8pt architectural rhythm, utilizing a structured 12-column responsive fluid grid anchored by a maximum width container (`80rem` / 1280px) to maintain comfortable line lengths during data entry:

- **Desktop (1024px+):** Fixed 260px left-hand navigation sidebar paired with a 12-column main operational canvas. Gutters are `1.5rem` (`space-lg`), and table padding stays comfortable (`0.875rem` vertical cell padding).
- **Tablet (768px - 1023px):** Sidebar compresses to a compact icon-plus-indicator dock (72px width). Sub-grids fold to 6 or 4 columns. Summary metric cards collapse from 4-across to a 2x2 grid.
- **Mobile (< 768px):** Single-column layout with pinned bottom or slide-over navigation. Margin compresses to `1rem` (`space-md`). Tables gracefully transform into individual card-based list records showing core metrics (Hours, Bible Studies, Reports Submitted).

## Elevation & Depth

This system avoids dramatic shadows in favor of **Tonal Layers** combined with **Low-Contrast Outlines** to preserve an atmosphere of calm and organized humility:

- **Level 0 (Base Canvas):** `#F8FAFC`. Background layer for application shells and full-page dashboards.
- **Level 1 (Card & Section Surfaces):** Pure `#FFFFFF` background bound by a crisp border (`1px solid #E2E8F0`). No drop shadow is applied in default states; hierarchy is communicated purely through value separation.
- **Level 2 (Hover & Interactive Overlays):** Used for interactive table rows, dropdown menus, and popovers. A soft, slate-tinted ambient shadow (`0 4px 12px -2px rgba(30, 41, 59, 0.06), 0 2px 4px -1px rgba(30, 41, 59, 0.03)`) paired with a `#CBD5E1` border.
- **Level 3 (Modals & Slide-out Drawers):** For monthly service record entry forms and detailed publisher profile views. A focused ambient veil (`0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.04)`) over a soft backdrop scrim (`rgba(15, 23, 42, 0.4)`).

## Shapes

The design uses **Level 1 (Soft)** shape geometry, applying subtle, humanized corners that feel structured, dependable, and contemporary without becoming playful or overly rounded:

- **Buttons, Text Inputs, and Select Controls:** `0.375rem` (6px) corner radius.
- **Cards, Panels, and Data Grids:** `0.5rem` (8px) corner radius.
- **Status Badges, Chips, and Counter Pills:** Pill radius (`9999px`) to visually distinguish classification tokens from actionable containers and buttons.

## Components

### Buttons
- **Primary:** Deep navy background (`#1E3A8A`), text white, `0.375rem` radius, bold 14px text. Hover shifts to `#1E293B` (Navy-Slate).
- **Secondary:** White background with `#E2E8F0` border and `#1E293B` text. Hover applies `#F1F5F9` surface fill.
- **Ghost/Tertiary:** No border, transparent background, text `#475569`. Hover triggers `#F1F5F9` pill.

### Role & Status Badges
Badges use pill geometry (`9999px`), uppercase `label-sm` typography, and pastel tinted backgrounds:
- **Publicador:** Background `#F1F5F9`, border `#CBD5E1`, text `#475569`.
- **Precursor Auxiliar:** Background `#FEF3C7`, border `#FDE68A`, text `#92400E` (Amber tint).
- **Precursor Regular:** Background `#D1FAE5`, border `#A7F3D0`, text `#065F46` (Emerald tint).
- **Informe Pendiente (Pending):** Light slate dot indicator; **Informe Entregado (Submitted):** Emerald solid checkmark indicator.

### Data Tables & List Views
- **Header:** Background `#F8FAFC`, uppercase `label-sm` text in `#64748B`, 44px height, subtle bottom border `#E2E8F0`.
- **Rows:** Alternating subtle white and `#FFFFFF` background with 52px minimum height. Hover transitions to `#F8FAFC`. Vertical grid lines are omitted; only horizontal dividers (`1px solid #F1F5F9`) are rendered.
- **Metric Cells:** Tabular alignment (right-aligned for hours, placements, and videos; left-aligned for publisher names and group assignments).

### Form Inputs & Monthly Slips
- Input fields use `#FFFFFF` background, `1px solid #CBD5E1` stroke, and `0.375rem` radius.
- Focus state features a clean 1px primary navy outline plus a soft 3px translucent halo (`rgba(30, 58, 138, 0.12)`).
- Time entry inputs for hours feature embedded unit labels ("hrs") on the trailing edge.

### Stat Cards (Resumen de Grupo / Congregación)
- Enclosed in Level 1 surfaces with `0.5rem` radius and `#E2E8F0` border.
- Header features secondary title with an optional icon chip, followed by prominent `metric-number` text and a contextual comparison footnote (e.g., "+4.2% vs mes anterior").