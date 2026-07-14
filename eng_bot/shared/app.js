const TelegramApp = (() => {
  const tg = window.Telegram?.WebApp;
  let _params = null;

  function init() {
    if (tg) {
      tg.ready();
      tg.expand();
      tg.setHeaderColor("#ffffff");
      tg.setBackgroundColor("#fafafa");
    }
    _params = parseParams();
    return _params;
  }

  function parseParams() {
    const url = new URL(window.location.href);
    const params = {};
    for (const [key, value] of url.searchParams.entries()) {
      params[key] = value;
    }
    return {
      lesson: params.lesson ? parseInt(params.lesson) : null,
      exercise: params.exercise || null,
      session: params.session || null,
      userId: params.user ? parseInt(params.user) : null,
      review: params.review === "1",
      source: params.source || "direct",
      mode: params.mode || "demo",
    };
  }

  function getParams() {
    return _params || parseParams();
  }

  function getUserId() {
    if (tg?.initDataUnsafe?.user?.id) {
      return tg.initDataUnsafe.user.id;
    }
    return getParams().userId;
  }

  function close() {
    if (tg) tg.close();
  }

  function showConfirm(message, callback) {
    if (tg) {
      tg.showConfirm(message, callback);
    } else {
      callback(confirm(message));
    }
  }

  return { init, getParams, getUserId, close, showConfirm };
})();

window.TelegramApp = TelegramApp;
