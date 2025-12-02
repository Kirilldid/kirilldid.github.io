// Slide Navigation System
let currentSlide = 1;
const totalSlides = 13;

// DOM Elements
const slides = document.querySelectorAll('.slide');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressContainer = document.getElementById('progress');
const currentSlideDisplay = document.getElementById('currentSlide');
const totalSlidesDisplay = document.getElementById('totalSlides');

// Initialize
function init() {
    // Set total slides
    totalSlidesDisplay.textContent = totalSlides;

    // Create progress dots
    for (let i = 1; i <= totalSlides; i++) {
        const dot = document.createElement('div');
        dot.className = 'progress-dot w-3 h-3 rounded-full bg-gray-300 cursor-pointer';
        dot.onclick = () => goToSlide(i);
        progressContainer.appendChild(dot);
    }

    // Show first slide
    showSlide(1);
    updateProgress();
}

// Show specific slide
function showSlide(n) {
    // Boundary check
    if (n < 1) n = 1;
    if (n > totalSlides) n = totalSlides;

    currentSlide = n;

    // Hide all slides
    slides.forEach(slide => {
        slide.classList.remove('active');
    });

    // Show current slide
    const targetSlide = document.querySelector(`[data-slide="${n}"]`);
    if (targetSlide) {
        targetSlide.classList.add('active');
    }

    // Update counter
    currentSlideDisplay.textContent = n;

    // Update buttons
    prevBtn.disabled = (n === 1);
    nextBtn.disabled = (n === totalSlides);

    // Update progress
    updateProgress();
}

// Update progress indicator
function updateProgress() {
    const dots = progressContainer.querySelectorAll('.progress-dot');
    dots.forEach((dot, index) => {
        if (index + 1 === currentSlide) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// Navigate to next slide
function nextSlide() {
    if (currentSlide < totalSlides) {
        showSlide(currentSlide + 1);
    }
}

// Navigate to previous slide
function prevSlide() {
    if (currentSlide > 1) {
        showSlide(currentSlide - 1);
    }
}

// Go to specific slide
function goToSlide(n) {
    showSlide(n);
}

// Event Listeners
prevBtn.addEventListener('click', prevSlide);
nextBtn.addEventListener('click', nextSlide);

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowRight':
        case ' ':
            e.preventDefault();
            nextSlide();
            break;
        case 'ArrowLeft':
            e.preventDefault();
            prevSlide();
            break;
        case 'Home':
            e.preventDefault();
            goToSlide(1);
            break;
        case 'End':
            e.preventDefault();
            goToSlide(totalSlides);
            break;
    }
});

// Interactive Elements

// Select card (for audience questions)
function selectCard(card) {
    // Remove selection from siblings
    const siblings = card.parentElement.children;
    for (let sibling of siblings) {
        sibling.classList.remove('selected');
    }

    // Add selection to clicked card
    card.classList.add('selected');

    // Show feedback if exists
    const feedback = document.getElementById('q1-feedback');
    if (feedback) {
        feedback.classList.remove('opacity-0');
        feedback.classList.add('opacity-100');
    }
}

// Toggle detail (for E2E chain and skills)
function toggleDetail(element, detailId) {
    const detail = document.getElementById(detailId);
    if (detail) {
        if (detail.classList.contains('hidden')) {
            detail.classList.remove('hidden');
            element.classList.add('selected');
        } else {
            detail.classList.add('hidden');
            element.classList.remove('selected');
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);

// Prevent accidental page navigation
window.addEventListener('beforeunload', (e) => {
    if (currentSlide > 1 && currentSlide < totalSlides) {
        e.preventDefault();
        e.returnValue = '';
    }
});

// Fullscreen helper (optional)
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// Add F11 alternative (F key)
document.addEventListener('keydown', (e) => {
    if (e.key === 'f' && e.ctrlKey) {
        e.preventDefault();
        toggleFullscreen();
    }
});
