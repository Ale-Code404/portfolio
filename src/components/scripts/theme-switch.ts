const toggleMenu = (aside: HTMLElement) => {
  document.body.classList.toggle("overflow-hidden");
  aside.classList.toggle("hidden");
};

const getThemePreference = (): string => {
  const fromStorage = localStorage.getItem("theme");

  if (fromStorage && ["dark", "light"].includes(fromStorage)) {
    return fromStorage;
  }

  const system = window.matchMedia("(prefers-color-scheme: dark)");
  return system.matches ? "dark" : "light";
};

const setTheme = (root: Document, theme: string) => {
  localStorage.setItem("theme", theme);
  root.body.classList.add(theme);

  if (theme === "dark") {
    root.body.classList.add("dark");
  } else {
    root.body.classList.remove("dark");
  }
};

const toggleTheme = (root: Document) => {
  const theme = getThemePreference();

  if (theme === "dark") {
    setTheme(root, "light");
  } else {
    setTheme(root, "dark");
  }
};

const initHandlers = () => {
  const menu = document.getElementById("open-menu");
  const closeButton = document.getElementById("close-menu");
  const aside = document.getElementById("mobile-menu");
  const themeSwitches = document.querySelectorAll(".theme-switcher");

  if (menu && aside) {
    menu.addEventListener("click", () => toggleMenu(aside));
  }

  if (closeButton && aside) {
    closeButton.addEventListener("click", () => toggleMenu(aside));
  }

  if (themeSwitches && themeSwitches.length) {
    themeSwitches.forEach((item) =>
      item.addEventListener("click", () => toggleTheme(document))
    );
  }
};

document.addEventListener("astro:before-swap", (event) => {
  setTheme(event.newDocument, getThemePreference());
});

document.addEventListener("astro:after-swap", () => {
  initHandlers();
});

(() => {
  initHandlers();
  setTheme(document, getThemePreference());
})();
