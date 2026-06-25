# Design System — CV & Portfolio

Specification for recreating the CV and portfolio in Figma. Aligned with the static portfolio (`portfolio/`) aesthetic: minimal, dark, technical.

---

## Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `bg-primary` | `#0a0a0a` | Page background |
| `bg-secondary` | `#111111` | Cards, sections |
| `bg-tertiary` | `#1a1a1a` | Hover states, borders |
| `text-primary` | `#ededed` | Headings, body |
| `text-secondary` | `#a1a1a1` | Subtitles, metadata |
| `text-muted` | `#6b6b6b` | Labels, captions |
| `accent` | `#3b82f6` | Links, highlights, CTA |
| `accent-hover` | `#2563eb` | Link hover |
| `border` | `#262626` | Dividers, card borders |
| `success` | `#22c55e` | Status badges (optional) |

### Contrast

- Body text on `bg-primary`: minimum 7:1 (WCAG AAA for normal text).
- Secondary text on `bg-primary`: minimum 4.5:1.

---

## Typography

### Font stack

- **Primary:** Inter (or system-ui fallback: `-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`)
- **Monospace:** JetBrains Mono (or `"SF Mono", Consolas, monospace`) — for tech labels, dates, stack tags

### Scale (A4 CV)

| Token | Size | Weight | Line height | Usage |
|-------|------|--------|-------------|-------|
| `display` | 28px | 600 | 1.2 | Name |
| `h1` | 18px | 600 | 1.3 | Section titles |
| `h2` | 14px | 600 | 1.4 | Job titles, project names |
| `h3` | 12px | 500 | 1.4 | Subsection labels |
| `body` | 11px | 400 | 1.5 | Paragraphs, bullet points |
| `small` | 10px | 400 | 1.4 | Dates, locations, metadata |
| `caption` | 9px | 400 | 1.3 | Footer, GDPR note |
| `mono` | 10px | 400 | 1.4 | Tech stack tags |

### Scale (Portfolio web)

| Token | Size | Weight | Line height | Usage |
|-------|------|--------|-------------|-------|
| `hero` | 48px / 32px mobile | 600 | 1.1 | Hero headline |
| `section` | 24px | 600 | 1.2 | Section headings |
| `card-title` | 16px | 600 | 1.3 | Card headings |
| `body` | 16px | 400 | 1.6 | Body text |
| `small` | 14px | 400 | 1.5 | Metadata |

---

## Layout — A4 CV

### Page

- **Size:** 210 × 297 mm (A4)
- **Margins:** 20 mm top/bottom, 18 mm left/right
- **Content width:** 174 mm
- **Grid:** 12 columns, 8 px gutter (optional for two-column sections)

### Structure

```
┌─────────────────────────────────────┐
│  HEADER (name, role, contacts)      │  ~40 mm
├─────────────────────────────────────┤
│  PROFILE (2–3 lines)                │  ~25 mm
├─────────────────────────────────────┤
│  EXPERIENCE                         │
│    └ entry (title, company, dates)  │
│    └ bullets (3–5 per role)         │  ~80 mm
├─────────────────────────────────────┤
│  EDUCATION                          │  ~35 mm
├─────────────────────────────────────┤
│  SKILLS (grouped tags)              │  ~40 mm
├─────────────────────────────────────┤
│  LANGUAGES                          │  ~15 mm
├─────────────────────────────────────┤
│  GDPR / footer                      │  ~12 mm
└─────────────────────────────────────┘
```

### Two-column variant (optional)

- Left column (35%): contacts, skills, languages
- Right column (65%): profile, experience, education

---

## Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `space-xs` | 4px | Inline gaps |
| `space-sm` | 8px | Between related elements |
| `space-md` | 16px | Between list items |
| `space-lg` | 24px | Between subsections |
| `space-xl` | 32px | Between major sections |
| `space-2xl` | 48px | Page section breaks |

### CV-specific

- Section title to first entry: 12px
- Entry title to bullets: 6px
- Between experience entries: 20px
- Bullet indent: 12px, bullet gap: 6px

---

## Components

### Header block

- Name (`display`), role (`h2`, `text-secondary`)
- Contact row: email, phone, GitHub, LinkedIn — `small`, `text-secondary`, inline with `·` separator

### Section title

- `h1`, uppercase or small-caps optional
- Bottom border 1px `border` or accent underline 2px `accent`
- Margin-bottom: `space-md`

### Experience entry

- Job title (`h2`) + company (`body`, `text-secondary`) on same line or stacked
- Date range (`small`, `mono`, `text-muted`) right-aligned or below
- Bullet list (`body`, 3–5 items max per role)

### Skill group

- Label (`h3`, `text-muted`)
- Tag row: pill shape, `bg-tertiary`, `mono` 10px, padding 4px 8px, gap 6px

### Language row

- Language name + level, table or inline (`small`)

### Portfolio — Nav

- Fixed top, `bg-primary` 90% opacity, backdrop blur
- Links `text-secondary`, hover `text-primary`

### Portfolio — Card

- `bg-secondary`, border 1px `border`, radius 8px, padding `space-lg`
- Hover: border `accent` at 50% opacity

### Portfolio — Tag

- Same as skill tag; used in capabilities section

### Portfolio — CTA link

- `accent` color, underline on hover, optional arrow `→`

---

## Sections (Portfolio)

1. **Hero** — name, headline, one-line tagline, primary CTA (contact / CV)
2. **About** — 2–3 sentences, professional tone
3. **Experience** — timeline or card list (role, company, period, bullets)
4. **Capabilities** — grouped skill tags
5. **Selected work** — 3–4 cards, title + short description (no proprietary details)
6. **Contact** — email, GitHub, LinkedIn placeholder, links to CV Markdown
7. **Footer** — copyright, repo link

---

## Export

### PDF (CV)

- **Format:** PDF
- **Color profile:** sRGB
- **Resolution:** vector (text as outlines optional for print)
- **Filename:** `luca-muroni-cv-it.pdf`, `luca-muroni-cv-en.pdf`
- **Print:** A4, no bleed unless professional print

### PNG (Portfolio / social)

- **CV preview:** 1240 × 1754 px (A4 at 150 DPI) or 2480 × 3508 (300 DPI)
- **OG image:** 1200 × 630 px — hero + name + headline
- **Avatar / profile:** 400 × 400 px

### SVG

- Logo/monogram if created
- Icons: inline SVG, 24×24 viewBox
- Export strokes expanded, fonts outlined for portability

### Web assets

- Favicon: 32×32, 180×180 (apple-touch)
- Prefer SVG favicon where supported

---

## Figma file structure (recommended)

```
📁 CV
  📄 A4 — IT
  📄 A4 — EN
📁 Portfolio
  📄 Desktop 1440
  📄 Tablet 768
  📄 Mobile 375
📁 Components
  📄 Header, Section, ExperienceEntry, SkillTag, Card, Nav, Footer
📁 Tokens
  📄 Colors, Typography, Spacing
```

---

## Accessibility notes

- Minimum touch target 44×44 px on mobile
- Focus ring: 2px `accent` outline, 2px offset
- Do not rely on color alone for hierarchy — use weight and size
