const navToggle = document.querySelector('[aria-controls="primary-nav"]');

const primaryNav = document.querySelector("#primary-nav");

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
