// ANYA VISUALS — navigation, booking enquiry, and small interactions
(() => {
  "use strict";

  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");
  const dropdown = document.querySelector(".nav-dropdown");
  const dropdownToggle = document.querySelector(".dropdown-toggle");
  const form = document.querySelector("#booking-form");
  const status = document.querySelector("#form-status");
  const serviceSelect = document.querySelector("#service-select");
  const methodSelect = document.querySelector("#contact-method");
  const dateInput = document.querySelector("#event-date");

  const contacts = [
    { label: "+91 76189 24280", digits: "917618924280" },
    { label: "+91 91610 10056", digits: "919161010056" },
    { label: "+91 97213 44421", digits: "919721344421" },
    { label: "+91 88749 56638", digits: "918874956638" }
  ];

  document.querySelector("#current-year").textContent = new Date().getFullYear();

  // Prevent selection of a past event date, while allowing today's date.
  if (dateInput) {
    const today = new Date();
    const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
      .toISOString().slice(0, 10);
    dateInput.min = localToday;
  }

  function closeMenu() {
    mainNav?.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Open navigation menu");
    dropdown?.classList.remove("open");
    dropdownToggle?.setAttribute("aria-expanded", "false");
  }

  menuToggle?.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
  });

  dropdownToggle?.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = dropdown.classList.toggle("open");
    dropdownToggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.querySelectorAll('.main-nav a[href^="#"]').forEach((link) => {
    link.addEventListener("click", () => {
      if (window.matchMedia("(max-width: 860px)").matches) closeMenu();
    });
  });

  document.addEventListener("click", (event) => {
    if (dropdown && !dropdown.contains(event.target)) {
      dropdown.classList.remove("open");
      dropdownToggle?.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  // Prefill the booking service when a service card's enquiry link is clicked.
  document.querySelectorAll("[data-service]").forEach((link) => {
    link.addEventListener("click", () => {
      const service = link.getAttribute("data-service");
      if (service && serviceSelect) {
        const matchingOption = [...serviceSelect.options].find((option) => option.text.trim() === service);
        if (matchingOption) serviceSelect.value = matchingOption.value;
      }
    });
  });

  // Keep navigation active state in sync with the section visible on screen.
  const navLinks = [...document.querySelectorAll('.main-nav > .nav-link[href^="#"], .main-nav a.nav-link[href^="#"]')];
  const sectionIds = ["home", "about", "services", "portfolio", "films", "contact"];
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
  }

  function clean(value) {
    return String(value || "").trim();
  }

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    status.textContent = "";

    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const name = clean(data.get("name"));
    const phone = clean(data.get("phone"));
    const email = clean(data.get("email"));
    const service = clean(data.get("service"));
    const date = clean(data.get("date")) || "Not specified";
    const location = clean(data.get("location"));
    const message = clean(data.get("message")) || "No additional requirements provided.";
    const method = clean(data.get("contactMethod"));

    if (phone.replace(/\D/g, "").length < 8) {
      status.textContent = "Please enter a valid phone number.";
      form.elements.phone.focus();
      return;
    }

    const enquiryText = [
      "Hello ANYA VISUALS, I would like to enquire about a shoot.",
      "",
      `Name: ${name}`,
      `Customer phone: ${phone}`,
      `Email: ${email || "Not provided"}`,
      `Service: ${service}`,
      `Event date: ${date}`,
      `Event location: ${location}`,
      `Additional requirements: ${message}`,
      "",
      "Please let me know about availability and next steps."
    ].join("\n");

    if (method === "email") {
      const subject = encodeURIComponent(`Booking enquiry — ${service}`);
      const body = encodeURIComponent(enquiryText);
      const mailto = `mailto:Kushwahaji275401@gmail.com?subject=${subject}&body=${body}`;
      status.textContent = "Your email app will open with the enquiry prepared. Please review and send it.";
      window.location.href = mailto;
      return;
    }

    const chosenContact = contacts[0];
    const whatsappUrl = `https://wa.me/${chosenContact.digits}?text=${encodeURIComponent(enquiryText)}`;
    status.textContent = `Opening WhatsApp for ${chosenContact.label}. Review the message and press Send in WhatsApp.`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  });
})();
