# Relaunch12x — Design System

## Stil-DNA
Editorial Magazine + E-Ink Paper + Swiss Modernism 2.0
Sandiges Papier. Ruhige Kraft. Chirurgischer Akzent.

---

## Farben (Sacred — Brand Tokens)

| Token | Hex | CSS Variable | Einsatz |
|-------|-----|-------------|---------|
| Sand | #f5f0e8 | `--sand` | Primärer Hintergrund |
| Sand Dark | #ebe5d9 | `--sand-dark` | Hover, Card-BG |
| Ink | #1A1A1A | `--ink` | Text Primary, Dark Sections |
| Ink Light | #555555 | `--ink-light` | Text Secondary |
| Ultraviolett | #2400E5 | `--ultraviolett` | Accent — sparsam |
| UV Glow | rgba(36,0,229,0.15) | `--uv-glow` | Hover, Fokus |
| White | #FFFFFF | `--white` | Selektive helle Sections |

### Farbverteilung
- 70% Sand (#f5f0e8) — Hauptflächen
- 15% Ink (#1A1A1A) — Dark Sections (Problem, Prozess, CTA)
- 10% Weiß (#FFFFFF) — Selektive Sections
- 5% Ultraviolett (#2400E5) — CTAs, Links, Highlights

---

## Typografie (Sacred — Brand Tokens)

### Font Stack
- **Headlines:** Source Serif 4 (600–700)
- **Headlines kursiv:** Source Serif 4 Italic (600)
- **Body:** Inter (400–600)
- **Mono/Zahlen:** JetBrains Mono (500–700)

### Größen-Skala (clamp-basiert, responsive)

| Token | CSS | Verwendung |
|-------|-----|-----------|
| `--text-hero` | `clamp(2.75rem, 6vw + 1rem, 5.5rem)` | Hero H1 |
| `--text-display` | `clamp(2rem, 4vw + 0.5rem, 3.5rem)` | Statement-Zitate |
| `--text-h2` | `clamp(1.875rem, 3vw + 0.5rem, 3rem)` | Section Headlines |
| `--text-h3` | `clamp(1.25rem, 2vw + 0.25rem, 1.75rem)` | Sub-Headlines |
| `--text-body` | `clamp(1rem, 1vw + 0.5rem, 1.125rem)` | Fließtext |
| `--text-small` | `clamp(0.875rem, 0.5vw + 0.5rem, 0.9375rem)` | Captions, Labels |
| `--text-mono` | `clamp(0.875rem, 1vw + 0.25rem, 1.125rem)` | Code, Zahlen |

### Typografie-Regeln
- Kursiv (*) für Schlüsselwörter: `<em>` → Source Serif 4 Italic 600
- Maximal 2–3 kursive Wörter pro Absatz
- Keine Ausrufezeichen
- Kurze Sätze (max 20 Wörter)

---

## Spacing (clamp-basiert)

| Token | CSS | Verwendung |
|-------|-----|-----------|
| `--space-section` | `clamp(80px, 12vw, 180px)` | Zwischen Sections |
| `--space-section-sm` | `clamp(48px, 6vw, 80px)` | Innerhalb Sections |
| `--space-component` | `clamp(24px, 3vw, 48px)` | Zwischen Komponenten |
| `--space-element` | `clamp(12px, 2vw, 24px)` | Zwischen Elementen |
| `--space-xs` | `8px` | Minimaler Abstand |

### Layout
- Max-width Container: `1280px`
- Content-width: `960px`
- Padding horizontal: `clamp(20px, 5vw, 64px)`

---

## Border & Shadows

| Token | CSS |
|-------|-----|
| `--radius-sm` | `4px` |
| `--radius-md` | `8px` |
| `--radius-lg` | `12px` |
| `--shadow-card` | `0 1px 3px rgba(26,26,26,0.06)` |
| `--shadow-card-hover` | `0 4px 16px rgba(26,26,26,0.08)` |
| `--border-subtle` | `1px solid rgba(26,26,26,0.08)` |
| `--border-strong` | `1px solid rgba(26,26,26,0.15)` |

---

## Animation Technology Stack

| Layer | Technologie | Bundle | Zweck |
|-------|------------|--------|-------|
| 1 (CSS) | `animation-timeline: view()`, `@property`, discrete | 0KB | Scroll-reveals, gradient-text, counters |
| 2a | Lenis | 3KB | Smooth Scroll |
| 2b | GSAP SplitText + ScrollTrigger | ~40KB | Headline char-by-char reveals |
| 2c | Generative SVG (Simplex Noise) | ~5KB | Brand-spezifische organische Formen |
| 2d | WebGL Mesh Gradient Shader | ~10KB | Hero-Hintergrund (Stripe-style) |
| 3 | View Transitions API + Speculation Rules | 0KB | Page-Transitions |
| **Total** | | **~58KB** | |

### Animation Tokens

| Token | Wert | Verwendung |
|-------|------|-----------|
| `--ease-default` | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` | Standard-Ease |
| `--ease-smooth` | `cubic-bezier(0.22, 1, 0.36, 1)` | Elegante Bewegungen |
| `--duration-fast` | `150ms` | Hover, Mikro-Interaktionen |
| `--duration-normal` | `300ms` | Übergänge |
| `--duration-slow` | `600ms` | Section-Reveals |
| `--duration-dramatic` | `1200ms` | Hero-Animationen |

### Progressive Enhancement
```
Kein JS:    CSS scroll-driven + statisches SVG + Grain + Gradient-Text
JS loaded:  GSAP Headlines + Lenis + Generative SVG
WebGL OK:   Shader Hero-Background
Full:       Alles aktiv
```

---

## Visual Techniques Palette

1. **Grain/Noise-Textur** — SVG feTurbulence Overlay auf Sand-Sections
2. **Asymmetrische Grids** — 40/60, 60/40 Splits wechselnd
3. **Pull Quotes** — Source Serif 4 Italic, kursiv, übergroß
4. **Monospace-Zahlen** — JetBrains Mono für "60", "12", Prozess-Nummern
5. **Dark Contrast Sections** — #1A1A1A mit Dot-Grid oder Glow
6. **Scroll-Reveals** — Fade-up + blur via `animation-timeline: view()`
7. **Dot Grid Pattern** — Subtiles Punktraster auf Dark Sections
8. **UV Glow** — Radial-gradient hinter Akzent-Elementen auf Dark BG
9. **SplitText Headlines** — GSAP char-by-char für Hero + CTA
10. **WebGL Mesh Gradient** — Animierter Shader-Background im Hero

---

## Responsive Rules

### Hero Visuals — Mobile Varianten
| Visual Type | Mobile Strategie |
|------------|-----------------|
| Knowledge Graph SVG | max-width: 320px, viewBox responsive |
| Dashboard Mockup | Cards vertikal stacken, flow layout |
| Horizontal Journey | Vertikale Timeline ersetzen |
| Bento Grid | 1 Spalte mobile, 2 tablet, 3 desktop |
| Terminal Mockup | Full-width, text-xs |
| WebGL Shader | CSS gradient fallback auf mobile |

### Component Patterns
- `flex-col lg:flex-row` für alle Text+Visual-Splits
- `relative sm:absolute` für Hero Visuals
- `hidden sm:block` / `sm:hidden` für verschiedene Mobile/Desktop-Layouts
- SVG viewBox ist responsive — max-width steuert Größe

---

## Anti-Patterns (VERBOTEN)

- Pastellige Gradients
- Blaue Gradients + weiße Cards
- Stock-Illustrations
- Cookie-Cutter SaaS-Layouts
- Generische Icons als Content-Ersatz
- Emoji als Icons
- Marketing-Deutsch ("ganzheitlich", "maßgeschneidert")
- Ausrufezeichen
- Mehr als 2 Hero-Typography-Momente pro Seite
- Default Tailwind-Farben
- Zentrierte Symmetrie überall
