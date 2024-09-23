document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Здесь можно добавить логику для отправки формы
    alert('Ваше сообщение отправлено!'); // Временно, для тестирования

    // Очистка формы
    this.reset();
});
