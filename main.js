const navToggle = document.querySelector('[aria-controls="primary-nav"]');

const primaryNav = document.querySelector("#primary-nav");

window.addEventListener("unhandledrejection", (event) => {
  const reason = event.reason;

  if (
    reason instanceof DOMException &&
    reason.name === "AbortError" &&
    reason.message === "Transition was skipped"
  ) {
    event.preventDefault();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  navToggle.addEventListener("click", () => {
    const navOpen = navToggle.getAttribute("aria-expanded");

    if (navOpen === "false") {
      navToggle.setAttribute("aria-expanded", "true");
    } else {
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
});
