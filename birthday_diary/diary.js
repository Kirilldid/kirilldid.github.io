import anime from 'https://cdn.jsdelivr.net/npm/animejs@3.2.1/lib/anime.es.js';

class DiaryBook {
    constructor(bookElement) {
        this.book = bookElement;
        this.congratulatoryMessages = [
            {
                photoSrc: 'https://images.unsplash.com/photo-1488521787991-ed70c0a771b1',
                photoCaption: 'Celebrating You',
                message: 'Your spirit brings light to our world.',
                signature: 'Family'
            },
            {
                photoSrc: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d',
                photoCaption: 'Wishing You',
                message: 'All the best on your special day and always.',
                signature: 'Friends'
            },
            {
                photoSrc: 'https://images.unsplash.com/photo-1576036719750-33dc1b9f5040',
                photoCaption: 'Congratulations',
                message: 'May your day be filled with joy, love, and laughter.',
                signature: 'Loved Ones'
            },
            {
                photoSrc: 'https://images.unsplash.com/photo-1576036719750-33dc1b9f5040',
                photoCaption: 'Congratulations',
                message: 'May your day be filled with joy, love, and laughter.',
                signature: 'Loved Ones'
            },
            {
                photoSrc: 'https://images.unsplash.com/photo-1576036719750-33dc1b9f5040',
                photoCaption: 'Congratulations',
                message: 'May your day be filled with joy, love, and laughter.',
                signature: 'Loved Ones'
            },
            {
                photoSrc: 'https://images.unsplash.com/photo-1576036719750-33dc1b9f5040',
                photoCaption: 'Congratulations',
                message: 'May your day be filled with joy, love, and laughter.',
                signature: 'Loved Ones'
            },
            {
                photoSrc: 'https://images.unsplash.com/photo-1576036719750-33dc1b9f5040',
                photoCaption: 'Congratulations',
                message: 'May your day be filled with joy, love, and laughter.',
                signature: 'Loved Ones'
            },
            {
                photoSrc: 'https://images.unsplash.com/photo-1576036719750-33dc1b9f5040',
                photoCaption: 'Congratulations',
                message: 'May your day be filled with joy, love, and laughter.',
                signature: 'Loved Ones'
            },
            {
                photoSrc: 'https://images.unsplash.com/photo-1576036719750-33dc1b9f5040',
                photoCaption: 'Congratulations',
                message: 'May your day be filled with joy, love, and laughter.',
                signature: 'Loved Ones'
            },
            {
                photoSrc: 'https://images.unsplash.com/photo-1576036719750-33dc1b9f5040',
                photoCaption: 'Congratulations',
                message: 'May your day be filled with joy, love, and laughter.',
                signature: 'Loved Ones'
            },
            {
                photoSrc: 'https://images.unsplash.com/photo-1576036719750-33dc1b9f5040',
                photoCaption: 'Congratulations',
                message: 'May your day be filled with joy, love, and laughter.',
                signature: 'Loved Ones'
            },
            {
                photoSrc: 'https://images.unsplash.com/photo-1576036719750-33dc1b9f5040',
                photoCaption: 'Congratulations',
                message: 'May your day be filled with joy, love, and laughter.',
                signature: 'Loved Ones'
            },
            {
                photoSrc: 'https://images.unsplash.com/photo-1576036719750-33dc1b9f5040',
                photoCaption: 'Congratulations',
                message: 'May your day be filled with joy, love, and laughter.',
                signature: 'Loved Ones'
            },
            {
                photoSrc: 'https://images.unsplash.com/photo-1576036719750-33dc1b9f5040',
                photoCaption: 'Congratulations',
                message: 'May your day be filled with joy, love, and laughter.',
                signature: 'Loved Ones'
            },
            {
                photoSrc: 'https://images.unsplash.com/photo-1576036719750-33dc1b9f5040',
                photoCaption: 'Congratulations',
                message: 'May your day be filled with joy, love, and laughter.',
                signature: 'Loved Ones'
            },
            {
                photoSrc: 'https://images.unsplash.com/photo-1576036719750-33dc1b9f5040',
                photoCaption: 'Congratulations',
                message: 'May your day be filled with joy, love, and laughter.',
                signature: 'Loved Ones'
            },
            {
                photoSrc: 'https://images.unsplash.com/photo-1576036719750-33dc1b9f5040',
                photoCaption: 'Congratulations',
                message: 'May your day be filled with joy, love, and laughter.',
                signature: 'Loved Ones'
            },
            {
                photoSrc: 'https://images.unsplash.com/photo-1576036719750-33dc1b9f5040',
                photoCaption: 'Congratulations',
                message: 'May your day be filled with joy, love, and laughter.',
                signature: 'Loved Ones'
            },
            {
                photoSrc: 'https://images.unsplash.com/photo-1576036719750-33dc1b9f5040',
                photoCaption: 'Congratulations',
                message: 'May your day be filled with joy, love, and laughter.',
                signature: 'Loved Ones'
            },
            {
                photoSrc: 'https://images.unsplash.com/photo-1576036719750-33dc1b9f5040',
                photoCaption: 'Congratulations',
                message: 'May your day be filled with joy, love, and laughter.',
                signature: 'Loved Ones'
            },
            {
                mediaType: 'video',
                mediaSrc: 'https://videos.pond5.com/distance-learning-home-footage-130211641_main_xxl.mp4',
                photoCaption: 'Learning Together',
                message: 'Your journey of growth and discovery inspires us all.',
                signature: 'Mentors'
            },
            {
                photoSrc: 'https://images.unsplash.com/photo-1576036719750-33dc1b9f5040',
                photoCaption: 'Congratulations',
                message: 'May your day be filled with joy, love, and laughter.',
                signature: 'Loved Ones'
            }
        ];

        this.renderPages();
        this.pages = Array.from(this.book.querySelectorAll('.page'));
        this.currentPageIndex = 0;

        this.setupScrollControls();
        this.adjustPageLayout();
        window.addEventListener('resize', () => this.adjustPageLayout());
    }

    renderPages() {
        const bookElement = this.book;
        
        const firstPage = bookElement.querySelector('.page.cover-page');
        const lastPage = bookElement.querySelector('.page.cover-page:last-child');
        bookElement.innerHTML = '';
        bookElement.appendChild(firstPage);

        this.congratulatoryMessages.forEach((pageData, index) => {
            const pageElement = document.createElement('div');
            pageElement.classList.add('page');
            
            const mediaContent = pageData.mediaType === 'video' 
                ? `<video src="${pageData.mediaSrc}" class="page-video" controls></video>`
                : `<img src="${pageData.photoSrc}" alt="${pageData.photoCaption}">`;
            
            pageElement.innerHTML = `
                <div class="page-content">
                    <div class="polaroid-photo">
                        ${mediaContent}
                        <div class="photo-caption">${pageData.photoCaption}</div>
                    </div>
                    <div class="handwritten-message">
                        <p>${pageData.message}</p>
                        <p class="signature">- ${pageData.signature}</p>
                    </div>
                </div>
            `;

            bookElement.appendChild(pageElement);
        });

        bookElement.appendChild(lastPage);
    }

    adjustPageLayout() {
        this.pages.forEach(page => {
            page.style.width = `${window.innerWidth}px`;
            page.style.height = `${window.innerHeight}px`;
        });

        this.book.style.transform = `translateX(-${this.currentPageIndex * 100}vw)`;
    }

    setupScrollControls() {
        const prevButton = document.getElementById('prev-page');
        const nextButton = document.getElementById('next-page');

        prevButton.addEventListener('click', () => this.scrollToPage('prev'));
        nextButton.addEventListener('click', () => this.scrollToPage('next'));

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

        this.book.style.transform = `translateX(-${this.currentPageIndex * 100}vw)`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const book = document.getElementById('book');
    new DiaryBook(book);
});
