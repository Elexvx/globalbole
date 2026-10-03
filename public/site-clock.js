(() => {
  const clock = document.querySelector('[data-live-clock]');
  if (!clock) return;
  const date = clock.querySelector('[data-clock-date]');
  const time = clock.querySelector('[data-clock-time]');
  const dateFormat = new Intl.DateTimeFormat('zh-CN', {year:'numeric',month:'long',day:'numeric'});
  const timeFormat = new Intl.DateTimeFormat('zh-CN', {hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
  const update = () => {
    const now = new Date();
    clock.setAttribute('datetime', now.toISOString());
    date.textContent = dateFormat.format(now);
    time.textContent = timeFormat.format(now);
  };
  update();
  setInterval(() => { if (!document.hidden) update(); }, 1000);
  document.addEventListener('visibilitychange', update);
  window.addEventListener('pageshow', update);
})();
