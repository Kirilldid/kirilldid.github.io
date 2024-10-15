document.querySelectorAll('.toggle-details').forEach(button => {
    button.addEventListener('click', () => {
        const jobDetails = button.nextElementSibling;
        const isExpanded = button.getAttribute('aria-expanded') === 'true';

        button.setAttribute('aria-expanded', !isExpanded);
        jobDetails.style.display = isExpanded ? 'none' : 'block';
    });
});

