# Stable list identity animation demo

A side-by-side React demo showing why stable item identities matter when lists are reordered or filtered, and how to animate new items correctly.

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

## 1. Explain: Why do stable item identities matter?

React uses the `key` prop to tell one list element apart from another. A key is
how React decides:

- which DOM node belongs to which piece of data
- whether a component should be mounted, unmounted, or updated in place
- which animation / transition state belongs to which item

When you use `key={index}`:

```jsx
items.map((item, index) => <li key={index}>{item.label}</li>)
```

the key is tied to the *position*, not the *item*. As soon as you reorder,
filter, or add to the front of the list, the same index now points to a
different item. React reuses the existing DOM node for that index and simply
updates its content. The result:

- **Wrong component state** is kept with the wrong data.
- **Animations fire on the wrong element** — e.g. removing the second item
  animates the *third* item out because its index changed from `2` to `1`.
- **New items don't animate in** cleanly when inserted at the top; they inherit
  the existing DOM node and just overwrite it.

When you use a stable identifier (`key={item.id}`), each item keeps its own DOM
node, its own component state, and its own animation state no matter where it
moves in the list.

## 2. Apply: Animate a new item while keeping final layout clear

In `src/App.jsx` the list items are wrapped with `motion.li`:

```jsx
<motion.li
  key={item.id}
  layout
  variants={{
    hidden: { opacity: 0, y: -20, scale: 0.96 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, x: -40, scale: 0.96 },
  }}
  initial="hidden"
  animate="visible"
  exit="exit"
  transition={{ duration: 0.35, ease: 'easeOut' }}
>
  …
</motion.li>
```

What this does:

- `initial="hidden"` → `animate="visible"` fades the new item from `opacity: 0`
  and slides it from `translateY(-20px)` to its final position.
- `layout` tells Framer Motion to smoothly animate the item to its new position
  when the list reorders, so the final layout is always clear and never jumps.
- `exit="exit"` animates a removed item out before React removes its DOM node.
- `AnimatePresence mode="popLayout"` lets exiting items pop out of the layout
  flow so the remaining items reflow cleanly.

The final layout is never obscured: entering items land in their target
positions, exiting items leave, and the rest slide into place.

## 3. Debug: Replace index-based animation with identity-based animation

The demo renders two identical lists. The only difference is the key:

```jsx
// ❌ Buggy
<motion.li key={index}>…</motion.li>

// ✅ Fixed
<motion.li key={item.id}>…</motion.li>
```

Try each operation and compare the two panels:

| Action | `key={index}` | `key={item.id}` |
|--------|---------------|-----------------|
| Add to top | Existing top item is reused; no enter animation for the new item. | New item animates in; existing items slide down. |
| Remove from middle | The item *after* the removed one animates out, because its index changed. | The exact removed item animates out. |
| Shuffle | Every item looks like it changed identity; state/animations are confused. | Each item keeps its own node and animates to its new position. |

The fix is literally changing one line: derive the React `key` from a stable
property of the data (`item.id`) instead of the array index.

## Key takeaway

Use `key={item.id}` (or any stable, unique value from your data) whenever the
list can be reordered, filtered, or edited. Reserve `key={index}` only for
static, append-only lists where each row never moves or changes meaning.
