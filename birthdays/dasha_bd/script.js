document.addEventListener('DOMContentLoaded', () => {
    const openModalBtn = document.getElementById('openModalBtn');
    const giftModal = document.getElementById('giftModal');
    const modalBackdrop = giftModal.querySelector('.modal-backdrop');
    const closeModalBtn = giftModal.querySelector('.close-button');

    // Function to open the modal
    const openModal = () => {
        giftModal.classList.add('show');
        // Optional: prevent body scroll when modal is open
        // document.body.style.overflow = 'hidden';
    };

    // Function to close the modal
    const closeModal = () => {
        giftModal.classList.remove('show');
         // Optional: restore body scroll
        // document.body.style.overflow = 'auto';
    };

    // Event listener for the button
    openModalBtn.addEventListener('click', openModal);

    // Event listener for closing the modal by clicking backdrop
    modalBackdrop.addEventListener('click', closeModal);

    // Event listener for closing the modal by clicking the close button
    closeModalBtn.addEventListener('click', closeModal);

    // Optional: Close modal with Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && giftModal.classList.contains('show')) {
            closeModal();
        }
    });
});
