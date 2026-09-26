// active-item applied to the list item when their links are clicked; updateActiveItem()

//
const mainElm = document.querySelector("main");
let checkboxElem = document.querySelector("input");
let prevElem;
function updateActiveItem(event) {
  // element.closest("li");
  // // or in an event listener:
  // event.target.closest("li");
  const clickedElement = event.target.parentElement.parentElement;

  clickedElement.className = "active-item";
  if (prevElem === clickedElement) {
    prevElem.className = "";
    prevElem = undefined;
  } else if (prevElem) {
    prevElem.className = "";
    prevElem = clickedElement;
  } else {
    prevElem = clickedElement;
  }
}
mainElm.addEventListener("click", (event) => {
  event.preventDefault();
  if (event.target.tagName !== "A") {
    return;
  }

  if (!document.startViewTransition) {
    updateActiveItem(event);
  } else {
    document.startViewTransition(() => updateActiveItem(event));
  }
});
checkboxElem.addEventListener("change", () => {
  mainElm.classList.toggle("match-element-applied");
});
