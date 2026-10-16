---
version: alpha
omitted:
  - section: colors
    reason: Canonical values live in src/index.css CSS custom properties.
  - section: typography
    reason: Runtime font stacks are maintained in src/index.css.
  - section: rounded
    reason: Runtime geometry is maintained in src/index.css.
  - section: spacing
    reason: Runtime responsive spacing is maintained in src/index.css.
  - section: components
    reason: React components consume semantic CSS classes from src/index.css.
---

# Workout Routine Builder design

## Product and audience

A personal weekly training planner for people choosing exercises and editing sets and reps. The main job is planning a week, not tracking completed workouts. English interface. Existing local storage remains the persistence owner until the backend phase.

## Visual direction

A training log: slate workspace, white surfaces, deep blue accent, compact utility labels and strong condensed headings. The signature is seven stacked day rows with a blue edge only on planned days. No decorative gradients, emoji headings, floating cards or fabricated activity.

## Tokens and runtime ownership

`src/index.css` is the canonical runtime token source. CSS custom properties own surface, ink, muted text, accent, accent-soft, line and scrollbar colors. Components use semantic classes rather than duplicate inline values. Display: Arial Narrow / Avenir Next Condensed / Impact; body: Avenir Next / Segoe UI; utility: system monospace. System fonts avoid external requests and font swaps.

## Layout and components

`App` owns the shell and truthful planned-day count. `ExerciseList` owns local search, initial-letter filters, custom exercise form and native day selectors. Native OS popup styling and interaction are intentional. `Planner` owns day rows and prescription fields. Desktop: 340px library beside flexible planner; mobile: library above planner. Natural document scrolling, bounded library scrolling.

## Interaction and accessibility

Native buttons and fields, visible focus, always visible removal controls, explicit labels and search clear action. Empty days are unplanned, not automatically rest days. Search/filter state is transient local discovery state, not URL state. No backend, authentication or syncing claims. Existing deletion behavior is retained for this visual phase; undo and storage recovery remain follow-up work. Reduced motion and forced colors have global fallbacks.

## Verification

Run existing Jest tests, build, lint and premium static audit; inspect desktop and mobile in a real browser. Existing data validation/storage risks remain separately identified.
