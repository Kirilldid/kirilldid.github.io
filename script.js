document.addEventListener("DOMContentLoaded", function() {
    const toggleButtons = document.querySelectorAll('.toggle-details');

    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const job = this.closest('.job');
            const jobDetails = job.querySelector('.job-details');

            // Проверяем текущее состояние отображения блока с деталями
            if (jobDetails.style.display === "none" || jobDetails.style.display === "") {
                jobDetails.style.display = "block"; // Показываем детали
                this.textContent = "Скрыть подробности"; // Меняем текст кнопки
                this.setAttribute('aria-expanded', 'true'); // Обновляем атрибут aria
            } else {
                jobDetails.style.display = "none"; // Скрываем детали
                this.textContent = "Показать подробности"; // Меняем текст кнопки обратно
                this.setAttribute('aria-expanded', 'false'); // Обновляем атрибут aria
            }
        });
    });

    // Устанавливаем начальное состояние для кнопок и блоков с деталями
    toggleButtons.forEach(button => {
        const jobDetails = button.closest('.job').querySelector('.job-details');
        jobDetails.style.display = "none"; // Скрываем детали при загрузке страницы
        button.setAttribute('aria-expanded', 'false'); // Устанавливаем начальное состояние aria
    });
});
