const menuBtn = document.getElementById("menuBtn");
const nav = document.querySelector(".nav");
const overlay = document.getElementById("overlay");
const closeBtn = document.getElementById("closeBtn");
const submenuLinks = document.querySelectorAll("[data-submenu]");

submenuLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    if (isMobile) {
      e.preventDefault();
      const submenuId = link.getAttribute("data-submenu");
      const submenu = document.getElementById(submenuId);
      const arrow = link.querySelector(".arrow");

      submenu.classList.toggle("active");
      arrow.classList.toggle("rotated");
    }
  });
});

function isMobile() {
  return window.innerWidth < 768;
}

window.addEventListener("resize", () => {
  if (!isMobile) {
    closeMenu();
  }
});

menuBtn.addEventListener("click", () => {
  nav.classList.add("active");
  overlay.classList.add("active");
});

function closeMenu() {
  nav.classList.remove("active");
  overlay.classList.remove("active");
}

closeBtn.addEventListener("click", closeMenu);
overlay.addEventListener("click", closeMenu);
