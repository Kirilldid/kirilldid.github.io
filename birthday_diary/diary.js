import anime from 'https://cdn.jsdelivr.net/npm/animejs@3.2.1/lib/anime.es.js';

class DiaryBook {
    constructor(bookElement) {
        this.book = bookElement;
        this.pages = Array.from(this.book.querySelectorAll('.page'));
        this.currentPageIndex = 0;

        this.setupScrollControls();
        this.adjustPageLayout();
        window.addEventListener('resize', () => this.adjustPageLayout());
    }

    adjustPageLayout() {
        // Ensure each page takes up full viewport width and height
        this.pages.forEach(page => {
            page.style.width = `${window.innerWidth}px`;
            page.style.height = `${window.innerHeight}px`;
        });

        // Position book to show current page
        this.book.style.transform = `translateX(-${this.currentPageIndex * 100}vw)`;
    }

    setupScrollControls() {
        const prevButton = document.getElementById('prev-page');
        const nextButton = document.getElementById('next-page');

        prevButton.addEventListener('click', () => this.scrollToPage('prev'));
        nextButton.addEventListener('click', () => this.scrollToPage('next'));

        // Keyboard and wheel navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.scrollToPage('prev');
            if (e.key === 'ArrowRight') this.scrollToPage('next');
        });

        this.book.addEventListener('wheel', (e) => {
            e.preventDefault();
            if (e.deltaX > 0) this.scrollToPage('next');
            if (e.deltaX < 0) this.scrollToPage('prev');
        }, { passive: false });
    }

    scrollToPage(direction) {
        if (direction === 'next' && this.currentPageIndex < this.pages.length - 1) {
            this.currentPageIndex++;
        } else if (direction === 'prev' && this.currentPageIndex > 0) {
            this.currentPageIndex--;
        }

        // Animate book's horizontal translation
        this.book.style.transform = `translateX(-${this.currentPageIndex * 100}vw)`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const diary = new DiaryBook(document.getElementById('book'));
});
