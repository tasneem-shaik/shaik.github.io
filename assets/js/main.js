// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Smooth scroll for internal links (keeps it professional)
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const id = link.getAttribute("href");
    if (!id || id.length < 2) return;

    const target = document.querySelector(id);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// Email form: opens mail client (no backend required)
const form = document.getElementById("mailForm");
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("mName").value.trim();
  const email = document.getElementById("mEmail").value.trim();
  const msg = document.getElementById("mMsg").value.trim();

  const subject = encodeURIComponent(`Portfolio contact from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${msg}`);

  // Replace with your email
  window.location.href = `mailto:tasneem.shaik.2711@gmail.com?subject=${subject}&body=${body}`;
});
