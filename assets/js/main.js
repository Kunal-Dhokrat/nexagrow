/* =========================================================
   NexaGrow Digital — Main JavaScript
   ========================================================= */

(function () {
  "use strict";

  /* ---------- Preloader ---------- */
  window.addEventListener("load", function () {
    setTimeout(function () {
      var preloader = document.getElementById("preloader");
      if (preloader) preloader.classList.add("hidden");
    }, 1600);
  });

  /* ---------- Navbar Scroll ---------- */
  var navbar = document.getElementById("navbar");
  var scrollTopBtn = document.getElementById("scrollTop");
  var notifBar = document.querySelector(".notif-bar");

  function getNotifHeight() {
    return notifBar ? notifBar.offsetHeight : 0;
  }

  function updateNavbarTop() {
    if (!navbar) return;
    var scrollY = window.scrollY || window.pageYOffset;
    if (scrollY > 60) {
      navbar.style.top = "0px";
      if (notifBar) notifBar.style.transform = "translateY(-100%)";
    } else {
      navbar.style.top = getNotifHeight() + "px";
      if (notifBar) notifBar.style.transform = "translateY(0)";
    }
  }

  function handleScroll() {
    var scrollY = window.scrollY || window.pageYOffset;
    if (navbar) {
      if (scrollY > 60) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    }
    updateNavbarTop();
    if (scrollTopBtn) {
      if (scrollY > 400) {
        scrollTopBtn.classList.add("visible");
      } else {
        scrollTopBtn.classList.remove("visible");
      }
    }
    // AOS trigger
    triggerAOS();
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", updateNavbarTop, { passive: true });
  handleScroll();

  /* ---------- Scroll To Top ---------- */
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Mobile Menu ---------- */
  var hamburger = document.querySelector(".hamburger");
  var mobileMenu = document.querySelector(".mobile-menu");
  var mobileOverlay = document.querySelector(".mobile-overlay");
  var mobileClose = document.querySelector(".mobile-close");

  function openMenu() {
    if (mobileMenu) mobileMenu.classList.add("open");
    if (mobileOverlay) mobileOverlay.classList.add("open");
    if (hamburger) hamburger.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeMenu() {
    if (mobileMenu) mobileMenu.classList.remove("open");
    if (mobileOverlay) mobileOverlay.classList.remove("open");
    if (hamburger) hamburger.classList.remove("open");
    document.body.style.overflow = "";
  }

  if (hamburger) hamburger.addEventListener("click", openMenu);
  if (mobileOverlay) mobileOverlay.addEventListener("click", closeMenu);
  if (mobileClose) mobileClose.addEventListener("click", closeMenu);

  /* Mobile accordion */
  document.querySelectorAll(".mobile-nav-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var sub = this.nextElementSibling;
      if (sub) {
        sub.style.display = sub.style.display === "block" ? "none" : "block";
        this.classList.toggle("open");
      }
    });
  });

  /* ---------- AOS (Animate on Scroll) ---------- */
  function triggerAOS() {
    var elements = document.querySelectorAll("[data-aos]:not(.aos-animate)");
    elements.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      var delay = parseInt(el.getAttribute("data-aos-delay") || 0);
      if (rect.top < window.innerHeight - 80) {
        setTimeout(function () {
          el.classList.add("aos-animate");
        }, delay);
      }
    });
  }
  triggerAOS();

  /* ---------- Counter Animation ---------- */
  var countersStarted = false;
  function startCounters() {
    if (countersStarted) return;
    var counters = document.querySelectorAll("[data-count]");
    if (!counters.length) return;

    // Check if any counter is in view
    var inView = false;
    counters.forEach(function (c) {
      var rect = c.getBoundingClientRect();
      if (rect.top < window.innerHeight) inView = true;
    });
    if (!inView) return;

    countersStarted = true;
    counters.forEach(function (counter) {
      var target = parseInt(counter.getAttribute("data-count"));
      var duration = 2000;
      var start = 0;
      var startTime = null;
      var suffix = counter.getAttribute("data-suffix") || "";

      function updateCounter(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = Math.floor(eased * target);
        counter.textContent = current.toLocaleString() + suffix;
        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target.toLocaleString() + suffix;
        }
      }
      requestAnimationFrame(updateCounter);
    });
  }
  window.addEventListener("scroll", startCounters, { passive: true });
  startCounters();

  /* ---------- FAQ Accordion ---------- */
  document.querySelectorAll(".faq-question").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = this.closest(".faq-item");
      var isOpen = item.classList.contains("open");
      // Close all
      document.querySelectorAll(".faq-item.open").forEach(function (openItem) {
        openItem.classList.remove("open");
      });
      // Open clicked
      if (!isOpen) item.classList.add("open");
    });
  });

  /* ---------- Portfolio Filter Tabs ---------- */
  var filterBtns = document.querySelectorAll("[data-filter]");
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var filter = this.getAttribute("data-filter");
      filterBtns.forEach(function (b) { b.classList.remove("active"); });
      this.classList.add("active");

      document.querySelectorAll("[data-category]").forEach(function (item) {
        if (filter === "all" || item.getAttribute("data-category") === filter) {
          item.style.display = "";
          item.style.opacity = "0";
          setTimeout(function () { item.style.opacity = "1"; item.style.transition = "opacity 0.4s ease"; }, 50);
        } else {
          item.style.display = "none";
        }
      });
    });
  });

  /* ---------- Smooth Scroll Links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        closeMenu();
      }
    });
  });

  /* ---------- Testimonial Slider ---------- */
  var sliderTrack = document.querySelector(".testimonial-track");
  if (sliderTrack) {
    var slides = sliderTrack.querySelectorAll(".testimonial-slide");
    var current = 0;
    var total = slides.length;
    var autoplay;

    function goTo(index) {
      current = (index + total) % total;
      sliderTrack.style.transform = "translateX(-" + (current * 100) + "%)";
      document.querySelectorAll(".slider-dot").forEach(function (d, i) {
        d.classList.toggle("active", i === current);
      });
    }

    var prevBtn = document.querySelector(".slider-prev");
    var nextBtn = document.querySelector(".slider-next");
    if (prevBtn) prevBtn.addEventListener("click", function () { goTo(current - 1); resetAutoplay(); });
    if (nextBtn) nextBtn.addEventListener("click", function () { goTo(current + 1); resetAutoplay(); });

    document.querySelectorAll(".slider-dot").forEach(function (dot, i) {
      dot.addEventListener("click", function () { goTo(i); resetAutoplay(); });
    });

    function resetAutoplay() {
      clearInterval(autoplay);
      autoplay = setInterval(function () { goTo(current + 1); }, 5000);
    }
    resetAutoplay();
  }

  /* ---------- Floating WhatsApp Particles ---------- */
  function createParticles() {
    var container = document.querySelector(".hero-particles");
    if (!container) return;
    var colors = ["#2563EB", "#7C3AED", "#F59E0B", "#3B82F6"];
    for (var i = 0; i < 15; i++) {
      var p = document.createElement("div");
      p.className = "particle";
      var size = Math.random() * 60 + 20;
      p.style.cssText = [
        "width:" + size + "px",
        "height:" + size + "px",
        "left:" + Math.random() * 100 + "%",
        "background:" + colors[Math.floor(Math.random() * colors.length)],
        "animation-duration:" + (Math.random() * 15 + 10) + "s",
        "animation-delay:" + (Math.random() * 10) + "s"
      ].join(";");
      container.appendChild(p);
    }
  }
  createParticles();

  /* ---------- Form WhatsApp Redirect ---------- */
  function formToWhatsApp(form, phoneNumber) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var fields = [];
      form.querySelectorAll("input, select, textarea").forEach(function (field) {
        if (field.name && field.value.trim()) {
          fields.push(field.getAttribute("data-label") || field.name + ": " + field.value.trim());
        }
      });
      var message = "Hello NexaGrow Digital! 👋\n\n" + fields.join("\n") + "\n\nPlease contact me. Thank you!";
      var url = "https://wa.me/" + phoneNumber + "?text=" + encodeURIComponent(message);
      window.open(url, "_blank");
    });
  }

  document.querySelectorAll("[data-whatsapp-form]").forEach(function (form) {
    formToWhatsApp(form, "919876543210");
  });

  /* ---------- Cookie Banner ---------- */
  var cookieBanner = document.getElementById("cookie-banner");
  if (cookieBanner && !localStorage.getItem("cookie-accepted")) {
    setTimeout(function () {
      cookieBanner.classList.add("show");
    }, 3000);
    var acceptBtn = cookieBanner.querySelector(".cookie-accept");
    if (acceptBtn) {
      acceptBtn.addEventListener("click", function () {
        localStorage.setItem("cookie-accepted", "1");
        cookieBanner.style.opacity = "0";
        setTimeout(function () { cookieBanner.remove(); }, 400);
      });
    }
  } else if (cookieBanner) {
    cookieBanner.remove();
  }

  /* ---------- Active Nav Link ---------- */
  var currentPath = window.location.pathname;
  document.querySelectorAll(".nav-link").forEach(function (link) {
    var href = link.getAttribute("href");
    if (href && currentPath.endsWith(href)) {
      link.classList.add("active");
    }
  });

  /* ---------- Typed Text Effect (Hero) ---------- */
  var typedEl = document.querySelector(".typed-text");
  if (typedEl) {
    var words = typedEl.getAttribute("data-words").split(",");
    var wi = 0;
    var ci = 0;
    var isDeleting = false;
    var speed = 100;

    function type() {
      var current = words[wi % words.length].trim();
      if (isDeleting) {
        typedEl.textContent = current.substring(0, ci - 1);
        ci--;
        speed = 60;
      } else {
        typedEl.textContent = current.substring(0, ci + 1);
        ci++;
        speed = 100;
      }
      if (!isDeleting && ci === current.length) {
        speed = 2000;
        isDeleting = true;
      } else if (isDeleting && ci === 0) {
        isDeleting = false;
        wi++;
        speed = 400;
      }
      setTimeout(type, speed);
    }
    type();
  }

  /* ---------- Sticky CTA on Scroll ---------- */
  var stickyCta = document.querySelector(".sticky-bottom-cta");
  if (stickyCta) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 600) {
        stickyCta.style.transform = "translateY(0)";
        stickyCta.style.opacity = "1";
      } else {
        stickyCta.style.transform = "translateY(100%)";
        stickyCta.style.opacity = "0";
      }
    });
  }

  console.log("🚀 NexaGrow Digital – Website Initialized");
})();
