document.querySelectorAll('.toggle-details').forEach(button => {
    button.addEventListener('click', () => {
        const details = button.nextElementSibling;
        details.style.display = details.style.display === 'block' ? 'none' : 'block';
        button.textContent = button.textContent === 'Показать подробности' ? 'Скрыть подробности' : 'Показать подробности';
        
        // Добавление анимации при показе/скрытии
        if (details.style.display === 'block') {
            details.style.opacity = '1';
            details.style.transition = 'opacity 0.5s ease-in-out';
        } else {
            details.style.opacity = '0';
            details.style.transition = 'opacity 0.5s ease-in-out';
        }
    });
});
