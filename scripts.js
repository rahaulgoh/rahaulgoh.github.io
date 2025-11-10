console.log("Script loaded!");

/* Active Section Highlighting */
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll('header nav a');

const ul = document.querySelector('header nav ul');
const indicator = document.getElementById('nav-indicator');

function moveIndicatorTo(el) {
  if (!el) return;
  const left = el.offsetLeft - ul.scrollLeft; // account for horizontal scroll
  const width = el.offsetWidth;
  indicator.style.transform = `translateX(${left}px)`;
  indicator.style.width = `${width}px`;
}

// initial position (first link or current active)
moveIndicatorTo(document.querySelector('header nav a.active') || navLinks[0]);

// update when section changes (your observer already sets .active)
const highlight = (id) => {
  navLinks.forEach(a => a.classList.remove('active'));
  const current = document.querySelector(`header nav a[href="#${id}"]`);
  if (current) { current.classList.add('active'); moveIndicatorTo(current); }
};

// patch your observer callback slightly:
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) highlight(entry.target.id);
  });
}, { threshold: 0.5 });

// keep it in the right place on resize / horizontal scroll of the UL
window.addEventListener('resize', () => {
  moveIndicatorTo(document.querySelector('header nav a.active'));
});
ul.addEventListener('scroll', () => {
  moveIndicatorTo(document.querySelector('header nav a.active'));
});

// optional: preview on hover, snap back on mouseleave
navLinks.forEach(link => {
  link.addEventListener('mouseenter', () => moveIndicatorTo(link));
  link.addEventListener('mouseleave', () =>
    moveIndicatorTo(document.querySelector('header nav a.active'))
  );
});
sections.forEach(section => observer.observe(section));


/* Light/Dark theme toggle */ 
const toggle = document.getElementById('theme-toggle');
const root = document.documentElement;

// Load previously saved theme (if any)
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  root.classList.add('light-mode');
}

// Toggle and save new preference
toggle.addEventListener('click', () => {
  root.classList.toggle('light-mode');
  localStorage.setItem(
    'theme',
    root.classList.contains('light-mode') ? 'light' : 'dark'
  );
});

/* Contact form with Validation */
document.querySelector('form').addEventListener('submit', e => {
    e.preventDefault();
    const name = document.querySelector('#name').value.trim();
    const email = document.querySelector('#email').value.trim();
    if(!name || !email.includes('@')){
        alert('Please enter a valid name and email address.');
        return;
    }
    alert('Thank you for reaching out, ' + name + '! I will get back to you soon.');
    e.target.reset();
});