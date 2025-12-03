// ссылки на элементы админки
const configToggle = document.getElementById("configToggle");
const configPanel = document.getElementById("configForm");

const topicInput = document.getElementById("topic");
const subtitleInput = document.getElementById("subtitle");
const speakerNameInput = document.getElementById("speakerName");
const speakerRoleInput = document.getElementById("speakerRole");
const speakerTagsInput = document.getElementById("speakerTags");
const datetimeInput = document.getElementById("datetime");
const orgLabelInput = document.getElementById("orgLabel");

// отображение
const viewTopic = document.getElementById("viewTopic");
const viewSubtitle = document.getElementById("viewSubtitle");
const viewSpeakerName = document.getElementById("viewSpeakerName");
const viewSpeakerRole = document.getElementById("viewSpeakerRole");
const viewAvatar = document.getElementById("viewAvatar");
const viewTags = document.getElementById("viewTags");
const viewOrgLabel = document.getElementById("viewOrgLabel");

// таймер
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const timerLabel = document.getElementById("timerLabel");
const timerSub = document.getElementById("timerSub");
const timerDate = document.getElementById("timerDate");

// показать/скрыть панель
configToggle.addEventListener("click", () => {
  const isOpen = configToggle.getAttribute("data-open") === "true";
  configToggle.setAttribute("data-open", String(!isOpen));
  configPanel.classList.toggle("hidden", isOpen);
});

// обновление текстов из админки
function updateTexts() {
  viewTopic.textContent = topicInput.value || "Тема вебинара";
  viewSubtitle.textContent = subtitleInput.value || "";
  viewSpeakerName.textContent = speakerNameInput.value || "Имя Фамилия";
  viewSpeakerRole.textContent = speakerRoleInput.value || "Должность спикера";
  viewAvatar.textContent = (speakerNameInput.value || "А").trim().charAt(0) || "А";

  viewTags.innerHTML = "";
  (speakerTagsInput.value || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .forEach((tag) => {
      const span = document.createElement("span");
      span.className = "tag";
      span.textContent = tag;
      viewTags.appendChild(span);
    });

  viewOrgLabel.textContent = orgLabelInput.value || "SIMULATIVE";

  const raw = datetimeInput.value;
  if (raw) {
    const d = new Date(raw + ":00+03:00");
    if (!isNaN(d.getTime())) {
      const opts = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      };
      timerDate.textContent =
        "Старт эфира: " + d.toLocaleString("ru-RU", opts) + " (МСК)";
    }
  } else {
    timerDate.textContent = "Дата и время появятся после выбора.";
  }
}

configPanel.addEventListener("input", updateTexts);

// таймер, использует значение из datetimeInput
function getTargetDate() {
  const raw = datetimeInput.value;
  if (!raw) return null;
  try {
    return new Date(raw + ":00+03:00");
  } catch {
    return null;
  }
}

function updateCountdown() {
  const target = getTargetDate();
  if (!target) {
    timerLabel.textContent = "скоро начнём эфир";
    minutesEl.textContent = "--";
    secondsEl.textContent = "--";
    timerSub.textContent = "Укажите дату и время эфира в панели сверху.";
    return;
  }

  const now = new Date();
  const diff = target - now;

  if (diff <= 0) {
    minutesEl.textContent = "00";
    secondsEl.textContent = "00";
    timerLabel.textContent = "уже в эфире";
    timerSub.textContent = "Эфир должен идти. Проверьте ссылку на комнату.";
    return;
  }

  const totalSeconds = Math.floor(diff / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;

  minutesEl.textContent = String(m).padStart(2, "0");
  secondsEl.textContent = String(s).padStart(2, "0");
  timerLabel.textContent = "скоро начнём эфир";

  if (totalSeconds <= 60) {
    timerSub.textContent = "Через минуту начинаем — подготовьтесь к старту.";
  } else if (totalSeconds <= 5 * 60) {
    timerSub.textContent =
      "До старта осталось несколько минут — проверьте звук и материалы.";
  } else {
    timerSub.textContent =
      "Эфир готовится. Пока есть время — соберите вопросы к спикеру.";
  }
}

setInterval(updateCountdown, 1000);
updateTexts();
updateCountdown();

/* анимация графика */

const barsContainer = document.getElementById("barsContainer");
const linePath = document.getElementById("linePath");
const svg = document.getElementById("lineSvg");

const BAR_COUNT = 10;

// создаём столбики по всей ширине
for (let i = 0; i < BAR_COUNT; i++) {
  const bar = document.createElement("div");
  bar.className = "chart-bar";
  bar.style.height = 40 + Math.random() * 120 + "px";
  barsContainer.appendChild(bar);
}

// анимация высоты столбиков
setInterval(() => {
  document.querySelectorAll(".chart-bar").forEach((bar) => {
    const h = 50 + Math.random() * 150;
    bar.style.height = h + "px";
  });
}, 1000);

// генерация линии
function generateCurve() {
  const rect = svg.getBoundingClientRect();
  const w = rect.width || 1;
  const h = rect.height || 1;

  const points = [];
  for (let i = 0; i < 8; i++) {
    const x = (i / 7) * w;
    const y = h - (Math.random() * h * 0.8 + h * 0.1);
    points.push([x, y]);
  }

  let d = `M ${points[0][0]},${points[0][1]}`;
  for (let i = 1; i < points.length; i++) {
    d += ` L ${points[i][0]},${points[i][1]}`;
  }
  linePath.setAttribute("d", d);
}

function animateCurve() {
  generateCurve();
  linePath.style.opacity = "1";
  setTimeout(() => {
    linePath.style.opacity = "0";
  }, 3000);
}

animateCurve();
setInterval(animateCurve, 5000);
