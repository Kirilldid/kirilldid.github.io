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

    // Remove the confetti piece after animation
    confettiPiece.addEventListener('animationend', () => {
        confettiPiece.remove();
    });
}

function getRandomColor() {
    const colors = ['#ff5733', '#33ff57', '#3357ff', '#ff33a1', '#ffdd33'];
    return colors[Math.floor(Math.random() * colors.length)];
}
