// --- Existing Variables ---
const menuIcon = document.querySelector('.menu');
const mainNav = document.querySelector('.main-nav'); // Gradient Layer
const textNav = document.querySelector('.text-nav'); // Text Layer
const navItems = document.querySelectorAll('.text-nav li, .text-nav .nav-tagline, .text-nav .nav-contact-info'); // Include tagline and contact info
const navLinks = document.querySelectorAll('.text-nav a');
const body = document.body;

const scrollIndicator = document.getElementById('scroll-indicator');
const scrollHint = document.querySelector('.scroll-down-hint');
const experienceSection = document.getElementById('experience');
let lastScrollTop = 0;
const scrollThreshold = 10;
const topThreshold = 50;

// --- Testimonial Carousel Variables ---
const carousel = document.querySelector('.testimonial-carousel');
const items = document.querySelectorAll('.testimonial-item');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
let selectedIndex = 0;
let cellCount = items.length;
let rotation = 0;
let radius, theta;

function calculateCarouselGeometry() {
    if (!carousel || !items.length) return;
    const carouselContainer = document.querySelector('.testimonial-carousel-container');
    if (!carouselContainer) return;
    const containerWidth = carouselContainer.offsetWidth;
    const itemWidth = containerWidth * 0.8;
    theta = 360 / cellCount;
    const halfItemWidth = itemWidth / 2;
    const angleInRadians = (theta / 2) * (Math.PI / 180);
    radius = halfItemWidth / Math.tan(angleInRadians);
    items.forEach((item, i) => {
        const cellAngle = theta * i;
        item.style.transform = `rotateY(${cellAngle}deg) translateZ(${radius}px)`;
        item.style.opacity = (i === selectedIndex) ? '1' : '0.7';
    });
    rotateCarousel();
}

function rotateCarousel() {
    if (!carousel || radius === undefined) return;
    rotation = Math.round(selectedIndex / cellCount * -360);
    carousel.style.transform = `translateZ(${-radius}px) rotateY(${rotation}deg)`;
    items.forEach((item, i) => {
         const normalizedIndex = (selectedIndex % cellCount + cellCount) % cellCount;
         item.style.opacity = (i === normalizedIndex) ? '1' : '0.7';
    });
}

// --- Footer Current Year ---
function setFooterYear() {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

// --- Menu Open/Close Function ---
function closeMenu() {
    if (menuIcon) menuIcon.classList.remove('active');
    if (mainNav) mainNav.classList.remove('is-open');
    if (textNav) textNav.classList.remove('is-open');
    body.classList.remove('menu-open');
}

 // --- Stagger Animation Setup ---
function setupMenuStagger() {
    navItems.forEach((item, index) => {
        // Use data-stagger value if present, otherwise use index
        const staggerIndex = item.dataset.stagger || (index + 1);
        item.style.setProperty('--stagger-index', staggerIndex);
    });
}

// --- Event Listeners ---
if (menuIcon && mainNav && textNav) {
  menuIcon.addEventListener('click', () => {
    const isOpen = menuIcon.classList.toggle('active');
    mainNav.classList.toggle('is-open', isOpen);
    textNav.classList.toggle('is-open', isOpen);
    body.classList.toggle('menu-open', isOpen);
    if (isOpen) { menuIcon.classList.remove('menu-hidden'); }
  });
}
// Close menu when clicking a link (allow default navigation)
navLinks.forEach(link => { link.addEventListener('click', closeMenu); });

if (prevBtn) { prevBtn.addEventListener('click', () => { selectedIndex--; rotateCarousel(); }); }
if (nextBtn) { nextBtn.addEventListener('click', () => { selectedIndex++; rotateCarousel(); }); }

function handleScroll() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrollPercent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
  if (scrollIndicator) { scrollIndicator.style.width = scrollPercent + '%'; }
  
  // Fade scroll hint when halfway down the page
  if (scrollHint) {
    const fadeThreshold = 35;
    const fadeStart = 20;
    let opacity = 1;
    
    if (scrollPercent >= fadeStart) {
      opacity = 1 - ((scrollPercent - fadeStart) / (fadeThreshold - fadeStart));
      opacity = Math.max(0, Math.min(1, opacity));
    }
    
    scrollHint.style.opacity = opacity.toString();
    scrollHint.style.visibility = opacity === 0 ? 'hidden' : 'visible';
  }

  // Menu visibility logic
  if (menuIcon) {
    if (scrollTop > lastScrollTop && scrollTop > topThreshold) {
      menuIcon.classList.add('menu-hidden');
    } else {
      menuIcon.classList.remove('menu-hidden');
    }
  }
  lastScrollTop = scrollTop;
}
window.addEventListener('scroll', handleScroll, false);

// --- Initial Setup ---
function initializePage() {
    if(menuIcon) { menuIcon.classList.remove('menu-hidden'); }
    handleScroll();
    setFooterYear();
    setupMenuStagger(); // Set up stagger indices
    setTimeout(() => { calculateCarouselGeometry(); }, 100);
}
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => { calculateCarouselGeometry(); }, 250);
});
window.addEventListener('load', initializePage);


function showSupportMessage() {
  document.getElementById('supportModal').classList.remove('hidden');
}

function hideSupportMessage() {
  document.getElementById('supportModal').classList.add('hidden');
}

// Close modal when clicking outside
document.getElementById('supportModal').addEventListener('click', function(e) {
  if (e.target === this) {
      hideSupportMessage();
  }
});