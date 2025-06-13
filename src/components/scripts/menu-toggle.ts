const toggleMenu = (aside: HTMLElement) => {
  document.body.classList.toggle("overflow-hidden");
  aside.classList.toggle("hidden");
};

const initHandlers = () => {
  const menu = document.getElementById("open-menu");
  const closeButton = document.getElementById("close-menu");
  const aside = document.getElementById("mobile-menu");

  if (menu && aside) {
    menu.addEventListener("click", () => toggleMenu(aside));
  }

  if (closeButton && aside) {
    closeButton.addEventListener("click", () => toggleMenu(aside));
  }
};

document.addEventListener("astro:after-swap", () => {
  initHandlers();
});

(() => {
  initHandlers();
})();
