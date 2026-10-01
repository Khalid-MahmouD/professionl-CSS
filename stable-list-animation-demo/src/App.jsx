import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'

// ---------------------------------------------------------------------------
// Stable identity demo
//
// Two lists share the same shape and operations. The only difference is the

// React key used when rendering:
//   - IndexKeyList uses key={index}
//   - StableKeyList uses key={item.id}
//
// Try these actions and watch the difference:
//   1. Add a new item (top or bottom) -> only the stable list animates the
//      *new* item in cleanly.
//   2. Remove an item from the middle -> only the stable list animates the
//      *removed* item out; the index-keyed list animates the wrong row.
//   3. Shuffle -> the stable list keeps every row's identity; the index-keyed
//      list treats every row as if it moved / changed.
// ---------------------------------------------------------------------------

let nextId = 1

function makeItem(label) {
  const id = nextId++
  return { id, label: `${label} #${id}` }
}

const initialItems = [
  makeItem('Apple'),
  makeItem('Banana'),
  makeItem('Cherry'),
  makeItem('Date'),
]

const listVariants = {
  hidden: { opacity: 0, y: -20, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, x: -40, scale: 0.96 },
}

function List({ title, items, onChange, useStableKeys }) {
  const addTop = () => onChange([makeItem('New'), ...items])
  const addBottom = () => onChange([...items, makeItem('New')])
  const remove = (target) =>
    onChange(items.filter((item) => item.id !== target.id))
  const shuffle = () => onChange([...items].sort(() => Math.random() - 0.5))

  return (
    <section className="list-panel">
      <h2>{title}</h2>
      <div className="controls">
        <button onClick={addTop}>Add top</button>
        <button onClick={addBottom}>Add bottom</button>
        <button onClick={shuffle}>Shuffle</button>
      </div>

      <ul className="item-list">
        <AnimatePresence mode="popLayout">
          {items.map((item, index) => (
            <motion.li
              key={useStableKeys ? item.id : index}
              layout
              variants={listVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="item"
            >
              <span className="item-label">{item.label}</span>
              <button
                className="remove-btn"
                onClick={() => remove(item)}
                aria-label={`Remove ${item.label}`}
              >
                ×
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </section>
  )
}

export default function App() {
  const [indexItems, setIndexItems] = useState(initialItems)
  const [stableItems, setStableItems] = useState(initialItems)

  const reset = () => {
    nextId = 1
    const fresh = [
      makeItem('Apple'),
      makeItem('Banana'),
      makeItem('Cherry'),
      makeItem('Date'),
    ]
    setIndexItems(fresh)
    setStableItems(fresh)
  }

  return (
    <div className="app">
      <header>
        <h1>Stable identity vs. index keys</h1>
        <p>
          Compare how reordering, filtering, and adding items behave when React
          keys are derived from array index vs. stable item identity.
        </p>
        <button onClick={reset} className="reset-btn">
          Reset both lists
        </button>
      </header>

      <main className="lists">
        <List
          title="❌ key={index}"
          items={indexItems}
          onChange={setIndexItems}
          useStableKeys={false}
        />
        <List
          title="✅ key={item.id}"
          items={stableItems}
          onChange={setStableItems}
          useStableKeys={true}
        />
      </main>
    </div>
  )
}
