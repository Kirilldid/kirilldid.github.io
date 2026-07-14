/**
 * Reusable UI components for exercise pages
 */
const UI = (() => {
  function renderShell(title, subtitle, content) {
    return `
      <div class="app-shell">
        <div class="app-header">
          <div class="app-title">${title}</div>
          ${subtitle ? `<div class="app-subtitle">${subtitle}</div>` : ""}
        </div>
        <div class="progress-bar" id="progress-bar" style="display:none">
          <div class="progress-fill" id="progress-fill" style="width:0%"></div>
        </div>
        <div id="content">${content}</div>
        <div class="spacer"></div>
        <div class="actions" id="actions"></div>
      </div>
    `;
  }

  function setProgress(current, total) {
    const bar = document.getElementById("progress-bar");
    const fill = document.getElementById("progress-fill");
    if (bar && fill) {
      bar.style.display = "block";
      fill.style.width = `${((current) / total) * 100}%`;
    }
  }

  function renderResult(score, total, wrongWords) {
    const pct = Math.round((score / total) * 100);
    let wordsHtml = "";
    if (wrongWords && wrongWords.length > 0) {
      wordsHtml = `
        <div class="result-words">
          <div style="font-weight:600;margin-bottom:8px">Слова для повторения:</div>
          ${wrongWords
            .map(
              (w) => `
            <div class="result-word-item">
              <span>${w.word}</span>
              <span class="tag tag-danger">${w.translation}</span>
            </div>
          `
            )
            .join("")}
        </div>
      `;
    }

    return `
      <div class="result-screen fade-in">
        <div class="result-score">${pct}%</div>
        <div class="result-label">${score} из ${total} правильно</div>
        ${wordsHtml}
      </div>
    `;
  }

  function generateResultPayload(params, score, total, wrongWordIds) {
    return {
      type: "exercise_result",
      lesson: params.lesson,
      exercise: params.exercise,
      session: params.session,
      userId: params.userId,
      score,
      total,
      pct: Math.round((score / total) * 100),
      wrongWords: wrongWordIds,
      timestamp: Date.now(),
    };
  }

  function saveLocalResult(payload) {
    const key = `eng_result_${payload.exercise}_${payload.session}`;
    localStorage.setItem(key, JSON.stringify(payload));
    const history = JSON.parse(localStorage.getItem("eng_result_history") || "[]");
    history.push(key);
    localStorage.setItem("eng_result_history", JSON.stringify(history));
  }

  function sendResultToBot(params, score, total, wrongWordIds) {
    const payload = generateResultPayload(params, score, total, wrongWordIds);
    saveLocalResult(payload);
    TelegramApp.sendData(JSON.stringify(payload));
  }

  return { renderShell, setProgress, renderResult, generateResultPayload, saveLocalResult, sendResultToBot };
})();

window.UI = UI;
