document.addEventListener("DOMContentLoaded", function() {
    // Находим контейнер для всех вакансий
    const experienceSection = document.querySelector('.experience');

    // Устанавливаем начальное состояние для кнопок и блоков с деталями
    const toggleButtons = experienceSection.querySelectorAll('.toggle-details');
    toggleButtons.forEach(button => {
        const jobDetails = button.closest('.job').querySelector('.job-details');
        jobDetails.style.display = "none"; // Скрываем детали при загрузке страницы
        button.setAttribute('aria-expanded', 'false'); // Устанавливаем начальное состояние aria
    });

    // Используем делегирование событий на секции опыта работы
    experienceSection.addEventListener('click', function(event) {
        if (event.target.classList.contains('toggle-details')) {
            const button = event.target;
            const jobDetails = button.closest('.job').querySelector('.job-details');

            // Проверяем текущее состояние отображения блока с деталями
            if (jobDetails.style.display === "none" || jobDetails.style.display === "") {
                jobDetails.style.display = "block"; // Показываем детали
                button.textContent = "Скрыть подробности"; // Меняем текст кнопки
                button.setAttribute('aria-expanded', 'true'); // Обновляем атрибут aria
            } else {
                jobDetails.style.display = "none"; // Скрываем детали
                button.textContent = "Показать подробности"; // Меняем текст кнопки обратно
                button.setAttribute('aria-expanded', 'false'); // Обновляем атрибут aria
            }
        }
    });
});
