document.querySelectorAll('.toggle-details').forEach(button => {
    button.addEventListener('click', () => {
        const details = button.nextElementSibling;
        details.style.display = details.style.display === 'block' ? 'none' : 'block';
        button.textContent = button.textContent === 'Показать подробности' ? 'Скрыть подробности' : 'Показать подробности';
    });
});
