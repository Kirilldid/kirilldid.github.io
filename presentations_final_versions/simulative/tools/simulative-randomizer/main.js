const minInput = document.getElementById("min-input");
const maxInput = document.getElementById("max-input");
const generateBtn = document.getElementById("generate-btn");
const resultValueEl = document.getElementById("result-value");
const rangeLabelEl = document.getElementById("range-label");
const distBarsEl = document.getElementById("dist-bars");
const distCountEl = document.getElementById("dist-count");
const seedLabelEl = document.getElementById("seed-label");

let attempts = 0;
let bucketCounts = new Array(10).fill(0);
let isGenerating = false;

function updateRangeLabel(min, max) {
  rangeLabelEl.textContent = `${min}–${max}`;
}

function getRangeBuckets(min, max) {
  const range = max - min + 1;
  const size = range / 10;
  const buckets = [];
  let start = min;
  for (let i = 0; i < 10; i++) {
    const end = i === 9 ? max : Math.floor(start + size - 1);
    buckets.push([start, end]);
    start = end + 1;
  }
  return buckets;
}

function getBucketIndex(min, max, value) {
  const buckets = getRangeBuckets(min, max);
  for (let i = 0; i < buckets.length; i++) {
    const [start, end] = buckets[i];
    if (value >= start && value <= end) return i;
  }
  return buckets.length - 1;
}

function renderDistribution() {
  distBarsEl.innerHTML = "";
  const maxCount = Math.max(...bucketCounts, 1);
  bucketCounts.forEach((count, idx) => {
    const bar = document.createElement("div");
    bar.className = "dist-bar";
    const heightFactor = count / maxCount;
    const scale = 0.15 + heightFactor * 0.85;
    bar.style.transform = `scaleY(${scale})`;
    if (count > 0 && idx === bucketCounts.lastActiveIndex) {
      bar.classList.add("dist-bar--active");
    }
    distBarsEl.appendChild(bar);
  });
}

function clearErrors() {
  minInput.classList.remove("error");
  maxInput.classList.remove("error");
}

function setError(inputEl) {
  inputEl.classList.add("error");
}

function randomIntInclusive(min, max) {
  const range = max - min + 1;
  const array = new Uint32Array(1);
  if (window.crypto && window.crypto.getRandomValues) {
    window.crypto.getRandomValues(array);
    const random = array[0] / (0xffffffff + 1);
    return min + Math.floor(random * range);
  } else {
    const random = Math.random();
    return min + Math.floor(random * range);
  }
}

function updateSeedLabel() {
  seedLabelEl.textContent =
    window.crypto && window.crypto.getRandomValues ? "crypto" : "math";
}

function generate() {
  if (isGenerating) return;

  clearErrors();

  const min = Number(minInput.value);
  const max = Number(maxInput.value);

  if (!Number.isFinite(min)) {
    setError(minInput);
    return;
  }
  if (!Number.isFinite(max)) {
    setError(maxInput);
    return;
  }
  if (max < min) {
    setError(minInput);
    setError(maxInput);
    return;
  }

  isGenerating = true;
  generateBtn.disabled = true;
  resultValueEl.classList.add("result-value--rolling");

  const duration = 1600;
  const intervalDelay = 60;
  const startTime = performance.now();

  const intervalId = setInterval(() => {
    const now = performance.now();
    if (now - startTime >= duration) {
      clearInterval(intervalId);

      const value = randomIntInclusive(min, max);
      resultValueEl.textContent = value;
      updateRangeLabel(min, max);

      attempts += 1;
      distCountEl.textContent = attempts.toString();

      const bucketIndex = getBucketIndex(min, max, value);
      bucketCounts[bucketIndex] += 1;
      bucketCounts.lastActiveIndex = bucketIndex;
      renderDistribution();

      resultValueEl.classList.remove("result-value--rolling");
      generateBtn.disabled = false;
      isGenerating = false;
      return;
    }

    const rollingValue = randomIntInclusive(min, max);
    resultValueEl.textContent = rollingValue;
  }, intervalDelay);
}

generateBtn.addEventListener("click", generate);

[minInput, maxInput].forEach((input) => {
  input.addEventListener("input", () => {
    clearErrors();
    const min = Number(minInput.value);
    const max = Number(maxInput.value);
    if (Number.isFinite(min) && Number.isFinite(max) && max >= min) {
      updateRangeLabel(min, max);
      bucketCounts = new Array(10).fill(0);
      bucketCounts.lastActiveIndex = undefined;
      attempts = 0;
      distCountEl.textContent = "0";
      renderDistribution();
    }
  });
});

updateSeedLabel();
renderDistribution();
