/**
 * ResizeObserver demo
 *
 * Goal: switch a card grid between "wide" and "narrow" layouts based on the
 * grid's own width, not the viewport width.
 *
 * Why not a media query?
 *   @media (min-width: 600px) only sees the browser viewport. If this card
 *   grid lived inside a sidebar or modal, the viewport width would be wrong.
 *   ResizeObserver watches the actual element, so the component adapts to
 *   wherever it is rendered.
 */

const grid = document.querySelector('[data-card-grid]')
const widthDisplay = document.getElementById('width-display')
const sizeState = document.getElementById('size-state')
const widthSlider = document.getElementById('container-width')
const wrapper = document.querySelector('.observed-wrapper')

// The last size state we applied. Used as a guard against redundant updates.
let currentSize = null

/**
 * Apply the new size state only when it actually changes.
 *
 * This guard prevents a feedback loop: if we updated styles that changed the
 * element's dimensions on every ResizeObserver callback, the observer could
 * fire again, change the dimensions again, and loop forever. By checking
 * whether the size category (wide/narrow) changed before touching the DOM,
 * we break that cycle and avoid unnecessary layout work.
 */
function setSizeState(newSize) {
  if (newSize === currentSize) {
    // Guard: same category, nothing to do.
    return
  }

  currentSize = newSize
  grid.setAttribute('data-size', newSize)
  sizeState.textContent = newSize
}

function updateFromWidth(width) {
  // Pick a layout category from the observed width.
  const newSize = width >= 600 ? 'wide' : 'narrow'
  setSizeState(newSize)
}

const observer = new ResizeObserver((entries) => {
  for (const entry of entries) {
    // contentRect gives the element's content-box size.
    const width = entry.contentRect.width
    widthDisplay.textContent = `${Math.round(width)}px`
    updateFromWidth(width)
  }
})

observer.observe(grid)

/*
  Optional: a slider to resize the wrapper so you can see the observer react
  without dragging the browser window. This is for demo purposes only.
*/
widthSlider.addEventListener('input', () => {
  wrapper.style.width = `${widthSlider.value}px`
})
