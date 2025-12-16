// ===================================
// Intersection Observer for Scroll Animations
// ===================================

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      // Add stagger delay for multiple elements
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, index * 100);
    }
  });
}, observerOptions);

// Observe all animated elements
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  animatedElements.forEach(el => observer.observe(el));
}

// ===================================
// Accordion for Mistakes Section
// ===================================

function toggleMistake(header) {
  const mistakeItem = header.parentElement;
  const isActive = mistakeItem.classList.contains('active');

  // Close all other items
  document.querySelectorAll('.mistake-item').forEach(item => {
    item.classList.remove('active');
  });

  // Toggle current item
  if (!isActive) {
    mistakeItem.classList.add('active');
  }
}

// ===================================
// Smooth Scroll for Anchor Links
// ===================================

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');

      // Skip if it's just "#"
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);

      if (target) {
        const offsetTop = target.offsetTop - 80; // Account for any fixed header
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ===================================
// Timeline Line Animation
// ===================================

function animateTimelineLine() {
  const timelineLine = document.querySelector('.timeline-line');
  if (!timelineLine) return;

  const timeline = document.querySelector('.timeline-wrapper');
  if (!timeline) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        timelineLine.style.animation = 'fillLine 2s ease forwards';
      }
    });
  }, { threshold: 0.2 });

  observer.observe(timeline);
}

// Add CSS animation for timeline line
const style = document.createElement('style');
style.textContent = `
  @keyframes fillLine {
    from {
      clip-path: inset(0 0 100% 0);
    }
    to {
      clip-path: inset(0 0 0 0);
    }
  }
`;
document.head.appendChild(style);

// ===================================
// Parallax Effect for Hero Section
// ===================================

function initParallax() {
  const hero = document.querySelector('.hero-section');
  if (!hero) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * 0.5;

    if (scrolled < window.innerHeight) {
      hero.style.transform = `translateY(${rate}px)`;
    }
  });
}

// ===================================
// Dynamic Spots Counter (if needed)
// ===================================

function initSpotsCounter() {
  const spotsElement = document.getElementById('spots-left');
  if (!spotsElement) return;

  // Simulate decreasing spots (optional)
  let spots = 12;
  const updateSpots = () => {
    if (spots > 5) {
      spots = Math.max(5, spots - Math.floor(Math.random() * 2));
      spotsElement.textContent = spots;
      spotsElement.style.color = spots <= 7 ? 'var(--color-pain)' : 'var(--color-primary)';
    }
  };

  // Update every 30 seconds (optional feature)
  // setInterval(updateSpots, 30000);
}

// ===================================
// Add Hover Effect to Cards
// ===================================

function initCardHoverEffects() {
  const cards = document.querySelectorAll('.pain-card, .summary-card, .mentor-card, .insight-card');

  cards.forEach(card => {
    card.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-8px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function () {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });
}

// ===================================
// Keyboard Navigation for Timeline
// ===================================

function initKeyboardNavigation() {
  let currentFocus = -1;
  const timelinePoints = document.querySelectorAll('.timeline-point');

  document.addEventListener('keydown', (e) => {
    // Only activate if we're in the timeline section
    const timeline = document.querySelector('.section-timeline');
    if (!timeline) return;

    const rect = timeline.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;

    if (!inView) return;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      currentFocus = Math.min(currentFocus + 1, timelinePoints.length - 1);
      focusTimelinePoint(currentFocus);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      currentFocus = Math.max(currentFocus - 1, 0);
      focusTimelinePoint(currentFocus);
    }
  });
}

function focusTimelinePoint(index) {
  const timelinePoints = document.querySelectorAll('.timeline-point');
  if (timelinePoints[index]) {
    timelinePoints[index].scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });

    // Add temporary highlight
    timelinePoints[index].style.transform = 'scale(1.05)';
    setTimeout(() => {
      timelinePoints[index].style.transform = 'scale(1)';
    }, 300);
  }
}

// ===================================
// Add Loading Animation
// ===================================

function initPageLoad() {
  // Fade in hero section
  const hero = document.querySelector('.hero-section');
  if (hero) {
    setTimeout(() => {
      hero.style.opacity = '1';
    }, 100);
  }
}

// ===================================
// Initialize Accordion
// ===================================

function initAccordion() {
  const mistakeHeaders = document.querySelectorAll('.mistake-header');
  mistakeHeaders.forEach(header => {
    header.addEventListener('click', () => toggleMistake(header));
  });
}

// ===================================
// Initialize All Functions
// ===================================

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initSmoothScroll();
  initAccordion();
  animateTimelineLine();
  initParallax();
  initSpotsCounter();
  initCardHoverEffects();
  initKeyboardNavigation();
  initPageLoad();

  console.log('🚀 Mentor Landing Page Initialized');
});

// ===================================
// Performance Optimization
// ===================================

// Debounce function for scroll events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Optimize scroll listener
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      // Scroll-based animations here
      ticking = false;
    });
    ticking = true;
  }
});
