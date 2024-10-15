document.addEventListener("DOMContentLoaded", function() {
    const toggleButtons = document.querySelectorAll('.toggle-details');

    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const jobDetails = this.nextElementSibling;
            if (jobDetails.style.display === "none" || jobDetails.style.display === "") {
                jobDetails.style.display = "block"; // Показываем детали
                this.textContent = "Скрыть подробности"; // Меняем текст кнопки
            } else {
                jobDetails.style.display = "none"; // Скрываем детали
                this.textContent = "Показать подробности"; // Меняем текст кнопки обратно
            }
        });
    });
});
