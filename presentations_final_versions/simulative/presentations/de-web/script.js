const slides = document.querySelectorAll('.slide');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const progressBar = document.getElementById('progressBar');
const currentNum = document.getElementById('currentSlideNum');
const totalNum = document.getElementById('totalSlides');

let current = 0;
totalNum.innerText = slides.length;

function update() {
  slides.forEach((s, i) => s.classList.toggle('active', i === current));
  progressBar.style.width = ((current + 1) / slides.length * 100) + '%';
  currentNum.innerText = current + 1;
  prevBtn.style.visibility = current === 0 ? 'hidden' : 'visible';
  nextBtn.innerText = current === slides.length - 1 ? 'Завершить' : 'Далее';
}

nextBtn.onclick = () => {
  if(current < slides.length - 1) {
    current++;
    update();
  } else {
    alert('Поздравляем! Вы прошли веб-презентацию.');
  }
};

prevBtn.onclick = () => {
  if(current > 0) {
    current--;
    update();
  }
};

document.onkeydown = (e) => {
  if(e.key === 'ArrowRight') nextBtn.click();
  if(e.key === 'ArrowLeft') prevBtn.click();
};

update();