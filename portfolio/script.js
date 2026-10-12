// Mark that JS is running, so the API panel can animate (and stays visible without JS)
document.documentElement.classList.add("js");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// 1. Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// 2. Mobile menu
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

function setMenu(open) {
  nav.classList.toggle("open", open);
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.textContent = open ? "Close" : "Menu";
}
menuBtn.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") setMenu(false);
});

// 3. API response panel: lines appear one by one on page load
const lines = document.querySelectorAll("#json .ln");
if (reduceMotion) {
  lines.forEach((l) => l.classList.add("on"));
} else {
  lines.forEach((line, i) => {
    setTimeout(() => line.classList.add("on"), 350 + i * 170);
  });
}

// 4. Highlight the current section in the nav
const links = document.querySelectorAll(".nav a");
const sections = [...links]
  .map((a) => document.querySelector(a.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((a) =>
            a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id)
          );
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  sections.forEach((s) => observer.observe(s));
}

// 5. Copy email button
const copyBtn = document.getElementById("copyBtn");
const copyStatus = document.getElementById("copyStatus");
const email = "manisha.v2418@gmail.com";

copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(email);
    copyBtn.textContent = "Copied";
    copyStatus.textContent = "Email address copied to clipboard.";
  } catch (err) {
    copyBtn.textContent = "Copy failed";
    copyStatus.textContent = "Could not copy. The address is " + email;
  }
  setTimeout(() => (copyBtn.textContent = "Copy email"), 2000);
});
