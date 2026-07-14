const UI = (() => {
  const BOT_USERNAME = "hexlet_eng_learning_bot";

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

  function buildResultUrl(params, score, total, wrongIds) {
    const lessonId = params.lesson || 1;
    const limitedWrong = (wrongIds || []).slice(0, 5);
    const encoded = limitedWrong
      .map((id) => id.replace(/_/g, "Z").replace(/ /g, "X"))
      .join("-");
    const payload = `r_${lessonId}_${score}_${total}${encoded ? "_" + encoded : ""}`;
    return `https://t.me/${BOT_USERNAME}?start=${payload}`;
  }

  return { renderShell, setProgress, renderResult, buildResultUrl };
})();

window.UI = UI;
