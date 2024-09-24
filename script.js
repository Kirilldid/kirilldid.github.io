document.getElementById('confetti-btn').addEventListener('click', () => {
    for (let i = 0; i < 100; i++) {
        createConfetti();
    }
});

function createConfetti() {
    const confettiPiece = document.createElement('div');
    confettiPiece.className = 'confetti-piece';
    confettiPiece.style.left = Math.random() * 100 + 'vw';
    confettiPiece.style.backgroundColor = getRandomColor();
    document.getElementById('confetti').appendChild(confettiPiece);

    confettiPiece.addEventListener('animationend', () => {
        confettiPiece.remove();
    });
}

function getRandomColor() {
    const colors = ['#ff5733', '#33ff57', '#3357ff', '#ff33a1', '#ffdd33', '#ffff00'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function openModal(src) {
    const modal = document.getElementById("modal");
    const modalImg = document.getElementById("modal-img");
    modal.style.display = "block";
    modalImg.src = src;
}

function closeModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
}
