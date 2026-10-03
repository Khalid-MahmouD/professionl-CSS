# Scroll-Driven Animations — Practical Exercises

Based on Kevin Powell's Frontend Masters lesson and your existing Fungi Finders site.

---

## Quick Concept Review

Scroll-driven animations link an element's animation progress to a **scroll timeline** instead of elapsed time.

Two built-in timelines:

1. `scroll()` — tracks the scroll progress of a scroll container (usually `scroll(root block)`).
2. `view()` — tracks how a single element moves through the viewport.

Key properties:

- `animation-timeline: scroll(root block);`
- `animation-timeline: view();`
- `animation-range` / `animation-range-start` / `animation-range-end` — control when the animation starts and ends relative to the viewport.
- Common range values: `cover`, `contain`, `entry`, `exit`, `entry-crossing`, `exit-crossing`.

Important rules:

- Use `linear` timing for scroll-driven animations so progress maps 1:1 with scroll.
- Use `both` or `forwards` so the element holds its final frame.
- Treat scroll-driven effects as **progressive enhancement**: the page must be readable without them.
- Wrap in `@supports (animation-timeline: scroll())` when needed.
- Respect `prefers-reduced-motion`.

---

## What's Already in Your Project

Your `index.css` already uses `view()` in two places:

```css
.hero {
  animation: fade-out forwards;
  animation-timeline: view();
  animation-range-start: exit;
}

.card {
  animation: fade-in forwards;
  animation-timeline: view();
}
```

Open `index.html`, scroll down, and watch:

- The hero section fades out as it leaves the viewport (`exit` range).
- Each card fades in as it enters the viewport.

---

## Exercise 1 — Build a Scroll Progress Bar

Create a fixed progress bar at the top of the viewport that grows from `0%` to `100%` width as the user scrolls down the page.

### Requirements

1. Add a `<div class="scroll-progress"></div>` right after the opening `<body>` tag in `scroll-driven-demo.html`.
2. Style it with `position: fixed; inset: 0 0 auto 0; height: 6px; background: var(--text-brand); transform-origin: left;`.
3. Animate it with `animation: grow linear both; animation-timeline: scroll(root block);`.
4. Provide a `@supports` fallback so unsupported browsers just don't show the bar (or show it fully visible).

### Starter keyframe

```css
@keyframes grow {
  from {
    scale: 0 1;
  }
  to {
    scale: 1 1;
  }
}
```

### Checklist

- [ ] Bar is fixed to the top.
- [ ] Width grows smoothly with scroll.
- [ ] Works on both short and tall pages.
- [ ] Unsupported browsers still look fine.

---

## Exercise 2 — Reveal Sections on Scroll

Make each content section fade in **and** slide up slightly as it enters the viewport.

### Requirements

1. Add a class `.reveal-on-scroll` to each `<section>` in `scroll-driven-demo.html`.
2. Define a keyframe that goes from `opacity: 0; translate: 0 3rem;` to `opacity: 1; translate: 0 0;`.
3. Tie it to `view()` with `animation-range: entry 0% cover 40%;`.
4. Use `animation-fill-mode: both`.

### Checklist

- [ ] Each section is invisible at first, then reveals as it scrolls in.
- [ ] Motion is subtle (3rem is enough).
- [ ] Final state is fully readable.
- [ ] Reduced-motion users see content immediately.

---

## Exercise 3 — Fix the Existing Hero Fade

Your current `.hero` fade uses `animation-range-start: exit;` but no `animation-range-end`. That means the animation plays from when the hero starts exiting until it is fully out of view.

### Requirements

1. Make the hero fade out **completely before it is 50% out of the viewport**.
2. Use `animation-range: exit 0% exit 50%;`.
3. Add a `@supports` block so browsers without scroll-driven animations still see the hero normally (no fade).

### Checklist

- [ ] Hero is fully visible at the top.
- [ ] It fades out quickly as the user starts scrolling.
- [ ] Unsupported browsers show the hero with no fade.

---

## Exercise 4 — Horizontal Scroll Gallery

Build a horizontal image gallery that the user scrolls through vertically, but the gallery moves horizontally based on vertical scroll progress.

### Requirements

1. Create a `.horizontal-scroll-section` that is much taller than the viewport (e.g., `height: 300vh`).
2. Inside it, place a sticky track `.horizontal-track` with `display: flex; gap: 2rem;`.
3. Use `animation-timeline: scroll(root block);` on the track to translate it horizontally as the page scrolls.
4. Add several image cards so the track is wider than the viewport.

### Keyframe idea

```css
@keyframes slide-horizontal {
  from {
    translate: 0 0;
  }
  to {
    translate: calc(-100% + 100vw) 0;
  }
}
```

### Checklist

- [ ] Vertical scroll moves the gallery horizontally.
- [ ] Gallery starts fully left and ends fully right.
- [ ] Sticky container keeps the gallery in view while scrolling.
- [ ] Reduced-motion users can still see all images (stack them vertically as a fallback).

---

## Exercise 5 — Apply Scroll-Driven Animations to Fungi Finders

Go back to `index.html` and `index.css` and improve the existing animations.

### Tasks

1. Add a scroll progress bar to `index.html`.
2. Refactor `.hero` and `.card` animations inside `@supports (animation-timeline: view())`.
3. Add a `prefers-reduced-motion` media query that disables the fade effects.
4. Add a subtle parallax effect to one of the section images using `view()`.

### Checklist

- [ ] Progress bar appears at the top of every page.
- [ ] Animations only apply where supported.
- [ ] Motion-sensitive users get a static, readable page.
- [ ] No essential content depends on the animation.

---

## Submission / Self-Review

After completing each exercise, ask yourself:

1. Does the page look correct if scroll-driven animations are not supported?
2. Does the page look correct with `prefers-reduced-motion: reduce`?
3. Is the final state of every animated element readable?
4. Is the motion subtle and purposeful?

Test in Chrome/Edge (best support) and at least one browser that does not support scroll-driven animations (e.g., Firefox without flags or older Safari) to verify your fallbacks.
