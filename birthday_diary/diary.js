import anime from 'https://cdn.jsdelivr.net/npm/animejs@3.2.1/lib/anime.es.js';

class DiaryBook {
    constructor(bookElement) {
        this.book = bookElement;
        this.congratulatoryMessages = [
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
                message: 'Спасибо з то, что с тобой простая поездка из пункта А в пункт Б превращается в незабываемое веселое приключение.',
                signature: 'ДР НА ВОДЕ'
            },
            {
                photoSrc: '6.jpg',
                photoCaption: '2021.09.24. Красино',
                message: 'Спасибо за то, что с тобой можно всю ночь напролет говорить о самом важном под треск камина.',
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
            {
                photoSrc: '11.jpg',
                photoCaption: '2023.03.10. Стамбул',
                message: '"Спасибо салеп, ластофас и море турецкой красоты. Спасибо за то, что втягиваешь в невероятные приключения, которые мы потом будем помнить всю жизнь. "',
                signature: 'Коля и Данила'
            },
            
            {
                photoSrc: '12.jpg',
                photoCaption: '2020.08.17. Чудный Пляж, Питер',
                message: 'Спасибо за пляжи, города и километры дорог. С тобой - хоть на край света!',
                signature: 'Коля'
            },
            
            {
                photoSrc: '13.jpg',
                photoCaption: '2019. 04.19. Боуи',
                message: "Спасибо за Боуи! And you're singin' the songs, thinkin' this is the life",
                signature: 'Коля'
            },
            
            {
                mediaType: 'video',
                mediaSrc: '1.mp4',
                photoCaption: '07.01.2022 г.Балашиха',
                message: 'Спасибо, наше пение, это так красиво. Даже когда я не могу что-то спеть чисто и правильно, ты всегда «подстроишь» нужный голос и получится невероятная красота)',
                signature: 'Кузя''
            },
            
            {
                photoSrc: '14.jpg',
                photoCaption: '31.10.2023 и 07.07.2024г. Москва. Смеемся.',
                message: 'Спасибо за то, что с тобой можно говорить то, что чувствуешь и делать то, что хочешь, то есть быть свободной',
                signature: 'Кузя'
            },
            {
                photoSrc: '15.jpg',
                photoCaption: 'Везде. Всегда',
                message: 'Спасибо за то, что ты у меня есть, а вот это вот всё есть у нас!',
                signature: 'Кузя'
            },
            {
                photoSrc: '16.jpg',
                photoCaption: 'Всегда. Ну, например, 10.07.2023г. Грузия',
                message: 'За то, что ты всегда на моей стороне',
                signature: 'Кузя'
            },
            {
                photoSrc: '17.jpg',
                photoCaption: '31.10.2023г. Москва',
                message: 'Спасибо, что доверяешь их лечить',
                signature: 'Кузя'
            },
            {
                photoSrc: '18.jpg',
                photoCaption: '05.03.2019г. Под Мухой',
                message: 'Спасибо за то, что вот так смотришь на мои недостатки :)',
                signature: 'Кузя'
            },
            {
                photoSrc: '19.jpg',
                photoCaption: 'Август 2012, Ливерпуль',
                message: 'Спасибо за смелость. Благодаря тебе я разрешила себе быть ярче (и это не только про одежду :))',
                signature: 'Люба'
            },
            {
                photoSrc: '20.png',
                photoCaption: 'Все наши чаты',
                message: 'Спасибо за этимологические.',
                signature: 'Люба'
            },
            {
                photoSrc: '21.jpg',
                photoCaption: '14.07.2017., Киевская.',
                message: 'Спасибо за то, что я под крылом у Большой Птицы.',
                signature: 'Люба'
            },
            {
                photoSrc: '22.jpg',
                photoCaption: '10.07.2023., Ереван.',
                message: 'Спасибо, что знаешь обо мне что-то, чего не знаю я сама.',
                signature: 'Люба'
            },
            {
                photoSrc: '23.jpg',
                photoCaption: '2021.11.13. Балашиха',
                message: 'Спасибо за то, что хвалишь Кокосового Стэнли и даришь веру в себя.',
                signature: 'Дэнил'
            },
            {
                photoSrc: '24.jpg',
                photoCaption: '2024.07.01. Тбилиси',
                message: 'Спасибо за то, что ты моя зазноба :)',
                signature: 'Дэнил'
            },
            {
                photoSrc: '25.jpg',
                photoCaption: '...',
                message: 'Бесконечно благодарен тебе за поддержку в самые сложные моменты!',
                signature: 'Никита'
            },
            {
                photoSrc: '26.jpg',
                photoCaption: 'Все наши чаты',
                message: 'Спасибо за детство.',
                signature: 'Саша С.'
            },
            {
                photoSrc: '27.png',
                photoCaption: '07.07.23 Тбилиси ',
                message: 'Спасибо, что умеешь резко разруливать сложные штуки, находить маршрутки и выламывать двери.',
                signature: 'Илья'
            },
            {
                photoSrc: '28.png',
                photoCaption: '05.11.23 Москва и все все все',
                message: "Спасибо за It's My Life, «Неву» и 500 Miles",
                signature: 'Илья'
            },
            {
                photoSrc: '29.jpg',
                photoCaption: '29.06.24 Тбилиси',
                message: 'Спасибо за Лёху!',
                signature: 'Илья'
            },

            {
                photoSrc: '30.jpg',
                photoCaption: 'В рюбое время, в любом месте',
                message: 'Спасибо за возможность всегда стрельнуть сигаретку ;)',
                signature: 'Вася'
            },
            {
                photoSrc: '31.jpg',
                photoCaption: 'В зуме BCG',
                message: 'Спасибо за регулярные подключения на созвоны, несмотря на on the go режим!',
                signature: 'Вася'
            },
        
            {
                photoSrc: '32.jpg',
                photoCaption: '13.04.2022г. Китай-город',
                message: 'Спасибо за то, что ты такая клевая, что с тобой сразу хотят познакомить!',
                signature: 'Асхат'
            },
        
            {
                photoSrc: '33.jpg',
                photoCaption: 'Где-то на берегу Севана и не только',
                message: 'Спасибо за редкие, но от этого не менее ценные моменты обсуждения триггерящих тем и возможность совместно синхронизироваться с реальностью',
                signature: 'Кирилл'
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
