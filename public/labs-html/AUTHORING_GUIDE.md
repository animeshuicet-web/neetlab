# NEETlab HTML Lab — Authoring Guide

You are building a single-file interactive chemistry lab for NEETlab.co.in.
The lab will be embedded inside a sandboxed iframe on a Next.js page.
Follow these rules exactly — they are non-negotiable for the lab to work.

---

## 1. File structure

- One folder per lab: `public/labs-html/[slug]/`
- Inside: `index.html` only (plus optional `assets/` for images/sounds)
- Slug must be lowercase, hyphenated, matches the `slug` field in `src/data/labs.ts`
- Example: `public/labs-html/periodic-trends/index.html`

## 2. HTML skeleton (copy this exactly)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Lab Title</title>
  <link rel="stylesheet" href="/labs-html/_theme.css" />
  <style>
    /* Lab-specific styles only.
       Use CSS variables from _theme.css — do NOT hardcode colors. */
  </style>
</head>
<body>
  <!-- Your lab content here -->
  <script>
    // Your lab JS here
  </script>
</body>
</html>
```

## 3. Visual rules (use the CSS variables, never hardcode)

| Use case | Variable |
|---|---|
| Page background | `var(--nl-bg)` |
| Card / panel background | `var(--nl-card)` |
| Borders, dividers | `var(--nl-border)` |
| Primary CTA, brand highlight | `var(--nl-accent)` (mole orange) |
| Secondary highlight, "correct", hint | `var(--nl-cool)` (teal) |
| Important value, "look here" | `var(--nl-warning)` (yellow) |
| Body text | `var(--nl-text)` |
| Captions, meta | `var(--nl-text-secondary)` |

Atoms (when drawing molecules):
- Carbon `var(--nl-atom-c)`, Hydrogen `var(--nl-atom-h)`, Oxygen `var(--nl-atom-o)`,
  Nitrogen `var(--nl-atom-n)`, Chlorine `var(--nl-atom-cl)`, Bond `var(--nl-bond)`
- p-orbital top lobe `var(--nl-orbital-top)`, bottom `var(--nl-orbital-bottom)`
- π electron cloud `var(--nl-pi-cloud)`

Fonts: `var(--nl-font-body)` for prose, `var(--nl-font-mono)` for formulas/numbers.
Pre-built classes: `.nl-card`, `.nl-mono`, `.nl-label`.

## 4. Layout rules

- Mobile-first. Design for ~360px width first, scale up.
- Max content width: 600px. Center horizontally. Don't stretch full-width on desktop.
- Touch targets minimum 44px × 44px.
- Canvas / interactive area: keep aspect ratio square or 4:5 portrait.
- No horizontal scrolling, ever.
- Total page height should fit the viewport without scroll where possible.
  If scroll is needed, keep controls fixed at bottom.

## 5. Tech constraints (sandbox restrictions)

The iframe runs with `sandbox="allow-scripts"`. This means:

ALLOWED:
- All vanilla JS, Canvas 2D, SVG, WebGL
- CSS animations, requestAnimationFrame
- Loading external CDN scripts via `<script src="https://cdn.jsdelivr.net/...">`
- Loading images / fonts from public CDNs

NOT ALLOWED (will silently fail or throw):
- `localStorage`, `sessionStorage`, `IndexedDB` — no persistence
- `document.cookie`
- Reading from the parent window (same-origin policy)
- Forms with submit (use buttons + JS instead)
- Service workers
- `window.open()` for popups

## 6. Allowed external libraries (from CDN)

Only use libraries that work standalone in a browser. Recommended:
- **Three.js** — `<script src="https://unpkg.com/three@0.160.0/build/three.min.js"></script>`
- **D3.js** — `<script src="https://cdn.jsdelivr.net/npm/d3@7"></script>`
- **GSAP** (animation) — `<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>`
- **MathJax** (equations) — `<script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>`

Do NOT use React, Vue, or any framework requiring a build step.

## 7. Performance budget (mid-range Android, 4GB RAM)

- Total page weight under 500KB (excluding CDN libraries cached by browser)
- Three.js scenes: stay under 50 mesh objects
- Avoid post-processing effects (bloom, SSAO) — too heavy for mobile GPU
- 60fps target; if simulation drops below, reduce particle count
- No autoplay audio. No video over 5 seconds.

## 8. Pedagogical rules

Every lab must have, in this order on the page:

1. **One-line intent** at top — what concept is this teaching? (max 12 words)
2. **The interactive thing** — the actual lab. Should be obvious how to interact.
3. **Brief takeaway** below — 1–2 sentences, what should the student notice?

Do NOT include:
- Long textual explanations (those live in the parent React page's "Learning notes" section)
- Quiz questions or scoring (out of scope)
- "Next lesson" or navigation links (parent page handles this)
- Branding or footer (parent page handles this)

## 9. Language

- Hinglish where it lands naturally. English-first for technical terms.
- Example labels: "Tap an atom", "Click to rotate", "Drag to add".
- Avoid jargon students haven't met yet. Match the chapter level.

## 10. Optional: parent-page communication

If the lab needs to tell the parent React page that the user did something
significant (completed an interaction, answered correctly), use postMessage:

```javascript
window.parent.postMessage({
  type: 'neetlab:event',
  event: 'interaction_complete',
  detail: { /* anything */ }
}, '*');
```

The parent will log this as an analytics event. Most labs won't need this.

## 11. Test before committing

- Open `index.html` directly in a browser at 360px wide — does it look right?
- Tap every button — do they respond?
- Open DevTools → Console — any errors?
- Check Network tab → does `_theme.css` load?
- Throttle CPU 4× in DevTools → still smooth?

## 12. Final checklist

- [ ] File at `public/labs-html/[slug]/index.html`
- [ ] Stylesheet linked: `<link rel="stylesheet" href="/labs-html/_theme.css" />`
- [ ] No hardcoded colors — all use CSS variables
- [ ] No localStorage / cookies / forms
- [ ] Mobile-tested at 360px width
- [ ] Console clean (no errors, no warnings)
- [ ] Slug matches the entry added to `src/data/labs.ts`