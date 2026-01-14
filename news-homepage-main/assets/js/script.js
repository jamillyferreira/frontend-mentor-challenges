const menuBtn = document.getElementById("menuBtn");
const closeBtn = document.getElementById("closeBtn");
const nav = document.querySelector(".nav");
const overlay = document.querySelector(".overlay");
const navLinks = document.querySelectorAll(".nav__link");
const body = document.body;

function openMenu() {
  nav.classList.add("active");
  overlay.classList.add("active");
  menuBtn.classList.add("hidden");
  closeBtn.classList.add("active");
  body.classList.add("menu-open");
}

function closeMenu() {
  nav.classList.remove("active");
  overlay.classList.remove("active");
  closeBtn.classList.remove("active");
  menuBtn.classList.remove("hidden");
  body.classList.remove("menu-open");
}

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && nav.classList.contains("active")) {
    closeMenu();
  }
});

menuBtn.addEventListener("click", openMenu);
closeBtn.addEventListener("click", closeMenu);
overlay.addEventListener("click", closeMenu);
