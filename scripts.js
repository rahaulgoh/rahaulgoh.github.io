console.log("Script loaded!");

/* Active Section Highlighting */
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll("header nav a");

const ul = document.querySelector("header nav ul");
const indicator = document.getElementById("nav-indicator");

function moveIndicatorTo(el) {
  if (!el) return;
  const left = el.offsetLeft - ul.scrollLeft; // account for horizontal scroll
  const width = el.offsetWidth;
  indicator.style.transform = `translateX(${left}px)`;
  indicator.style.width = `${width}px`;
}

// initial position (first link or current active)
moveIndicatorTo(document.querySelector("header nav a.active") || navLinks[0]);

// update when section changes (your observer already sets .active)
const highlight = (id) => {
  navLinks.forEach((a) => a.classList.remove("active"));
  const current = document.querySelector(`header nav a[href="#${id}"]`);
  if (current) {
    current.classList.add("active");
    moveIndicatorTo(current);
  }
};

// patch your observer callback slightly:
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) highlight(entry.target.id);
    });
  },
  { threshold: 0.5 }
);

// keep it in the right place on resize / horizontal scroll of the UL
window.addEventListener("resize", () => {
  moveIndicatorTo(document.querySelector("header nav a.active"));
});
ul.addEventListener("scroll", () => {
  moveIndicatorTo(document.querySelector("header nav a.active"));
});

// optional: preview on hover, snap back on mouseleave
navLinks.forEach((link) => {
  link.addEventListener("mouseenter", () => moveIndicatorTo(link));
  link.addEventListener("mouseleave", () =>
    moveIndicatorTo(document.querySelector("header nav a.active"))
  );
});
sections.forEach((section) => observer.observe(section));

/* Light/Dark theme toggle */
const toggle = document.getElementById("theme-toggle");
const root = document.documentElement;

// Load previously saved theme (if any)
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  root.classList.add("light-mode");
}

// Toggle and save new preference
toggle.addEventListener("click", () => {
  // enable temporary transition
  root.classList.add("theme-animating");

  // flip theme + persist
  root.classList.toggle("light-mode");
  localStorage.setItem(
    "theme",
    root.classList.contains("light-mode") ? "light" : "dark"
  );

  // remove the transition class after it finishes
  window.setTimeout(() => {
    root.classList.remove("theme-animating");
  }, 1000); // matches .35s + a little buffer
});

/* Typewriter Effect for Home Section */
function typeWriter(element, text, speed = 75, delay = 1500) {
  let i = 0;
  let deleting = false;

  function type() {
    if (!deleting && i < text.length + 1) {
      element.textContent = text.substring(0, i++);
    } else if (deleting && i >= 0) {
      element.textContent = text.substring(0, i--);
    }

    // Typing -> Deleting
    if (i === text.length + 1) {
      deleting = true;
      setTimeout(type, delay);
      return;
    }

    // Deleting -> Typing
    if (i < 0) {
      deleting = false;
      i = 0;
      setTimeout(type, 500);
      return;
    }
    setTimeout(type, deleting ? speed / 2 : speed);
  }
  type();
}

// Run the typewriter on page load:
window.addEventListener("DOMContentLoaded", () => {
  const heading = document.getElementById("home-title");
  if(!heading) return;  
  const fullText = heading.textContent.trim();
  typeWriter(heading, fullText, 70, 2000);
});

/* Dynamic Greeting */
function updateGreeting() {
  const hours = new Date().getHours();
  const greetingEl = document.getElementById("greeting");
  let greeting = "Hello there";

  if (hours < 12) greeting = "Good Morning";
  else if (hours < 18) greeting = "Good Afternoon";
  else greeting = "Good Evening";

  greetingEl.textContent = greeting;
}

updateGreeting();

/* Back to Top Button */
const backToTopBtn = document.getElementById("back-to-top");

if (backToTopBtn) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) backToTopBtn.classList.add("visible");
    else backToTopBtn.classList.remove("visible");
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}


/* Fade-in Scroll */
const observerFade = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.2 }
);

document
  .querySelectorAll("section")
  .forEach((sec) => observerFade.observe(sec));

/* Flip cards for projects */
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".project-card .card-inner");

  cards.forEach((btn) => {
    const toggle = () => {
      const flipped = btn.classList.toggle("is-flipped");
      btn.setAttribute("aria-expanded", String(flipped));
    };

    btn.addEventListener("click", (e) => {
      // Ignore clicks on back-face links so navigation still works
      if (e.target.closest("a")) return;
      toggle();
    });

    btn.addEventListener("keydown", (e) => {
      // space or enter flips
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        toggle();
      }
      // Escape flips back
      if (e.key === "Escape" && btn.classList.contains("is-flipped")) {
        e.preventDefault();
        btn.classList.remove("is-flipped");
        btn.setAttribute("aria-expanded", "false");
      }
    });
  });
});

/* 3D Tilt effect for project cards */
document.addEventListener("DOMContentLoaded", () => {
  const projectCards = document.querySelectorAll(".project-card");

  projectCards.forEach((card) => {
    const cardInner = card.querySelector(".card-inner");

    card.addEventListener("mousemove", (e) => {
      if (!cardInner) return;

      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate mouse position relative to card center (-1 to 1)
      const rotateX = (e.clientY - centerY) / (rect.height / 2);
      const rotateY = (e.clientX - centerX) / (rect.width / 2);

      // INVERTED: Apply tilt that follows mouse (tilts TOWARD cursor)
      const tiltX = rotateX * 4; // Mouse down = bottom tilts toward you (positive X rotation)
      const tiltY = rotateY * -4; // Mouse right = right side tilts toward you (negative Y rotation)

      // Set CSS custom properties for tilt
      cardInner.style.setProperty("--tilt-x", `${tiltX}deg`);
      cardInner.style.setProperty("--tilt-y", `${tiltY}deg`);
    });

    // Reset tilt when mouse leaves
    card.addEventListener("mouseleave", () => {
      if (!cardInner) return;

      cardInner.style.setProperty("--tilt-x", "0deg");
      cardInner.style.setProperty("--tilt-y", "0deg");
    });
  });
});
