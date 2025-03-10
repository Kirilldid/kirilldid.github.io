import anime from 'https://cdn.jsdelivr.net/npm/animejs@3.2.1/lib/anime.es.js';

class DiaryBook {
    constructor(bookElement) {
        this.book = bookElement;
        this.congratulatoryMessages = [
            /*
            {
                mediaType: 'video',
                mediaSrc: '1.MOV',
                photoCaption: '07.01.2022 г.Балашиха',
                message: 'Спасибо, наше пение, это так красиво. Даже когда я не могу что-то спеть чисто и правильно, ты всегда «подстроишь» нужный голос и получится невероятная красота)',
                signature: 'Кузя''
            },
            */
            {
                photoSrc: '2.jpg',
                photoCaption: '2018.03.17. Водный',
                message: 'Спасибо за твистер в тесноте и другие тусовки на Кронштадском!',
                signature: 'ДР В ТЕСНОТЕ'
            },
            {
                photoSrc: '3.jpg',
                photoCaption: '2021.04.30. Красино',
                message: 'Спасибо за прогулки в пустоте, песни в коровнике, и остальную спонтанную движуху!',
                signature: 'ДР В ПУСТОТЕ'
            },
            {
                photoSrc: '4.jpg',
                photoCaption: '2021.06.18. Красино',
                message: 'Спасибо за то, что с тобой даже самые душные летние дни становятся легкими и незабываемыми. Благодарим за всё неблагозвучное и социально неприемлимое.',
                signature: 'ДР В ДУХОТЕ'
            },
            {
                photoSrc: '5.jpg',
                photoCaption: '2021.08.13. Михалёво',
                message: 'Спасибо за колёса, с тобой обычная поездка преврашается в трип на озеро.',
                signature: 'ДР НА ВОДЕ'
            },
            {
                photoSrc: '6.jpg',
                photoCaption: '2021.09.24. Красино',
                message: 'Спасибо за тёплые слова у камина.',
                signature: 'ДР У КАМИНА'
            },
            {
                photoSrc: '7.jpg',
                photoCaption: '2021.12.04. Люсиновская',
                message: 'Спасибо за перекуры в подьезде, Клубничную Молли и угадайки в темноте.',
                signature: 'ДР В ТЕМНОТЕ'
            },
            {
                photoSrc: '8.jpg',
                photoCaption: '2022.02.11. Михалёво',
                message: 'Спасибо за поездки в багажнике, прогулки по сугробам и огонёк добра в мерзлоте.',
                signature: 'ДР В МЕРЗЛОТЕ'
            },
            {
                photoSrc: '9.jpg',
                photoCaption: '2024.07.01. Тбилиси',
                message: 'Спасибо за теплый коллектив и командную работу!',
                signature: 'ДР В ВКУСНОТЕ'
            },
            {
                photoSrc: '10.jpg',
                photoCaption: '2021.11.13. Китай-Город',
                message: 'Спасибо за Дайкири, Штиле Нахт и Зазнобу:)',
                signature: 'Коля'
            },
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
