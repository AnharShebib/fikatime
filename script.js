result.textContent = "NEJ ❌ (" + h + ":" + String(m).padStart(2,"0") + ")";
``
function update() {
const statusEl = document.getElementById("status");
const resultEl = document.getElementById("result");
const countdownEl = document.getElementById("countdown");
const steamEl = document.getElementById("steam");

function updateFika() {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();

  if (h === 15 && m < 15) {
    result.textContent = "FIKA ☕";
  const day = now.getDay(); // 0 = söndag
  const hour = now.getHours();
  const minute = now.getMinutes();
  const second = now.getSeconds();

  const currentMinutes = hour * 60 + minute + second / 60;

  const fikaStart = 15 * 60;      // 15:00
  const fikaEnd = fikaStart + 15; // 15:15

  // Helg
  if (day === 0 || day === 6) {
    resultEl.textContent = "HELG 🎉";
    countdownEl.textContent = "";
    steamEl.style.display = "none";
    return;
  }

  // FIKA‑FÖNSTER
  if (currentMinutes >= fikaStart && currentMinutes <= fikaEnd) {
    resultEl.textContent = "FIKA ☕";
    countdownEl.textContent = "Just nu är det fika";
    steamEl.style.display = "block";
    return;
  }

  // SNART (5 min innan)
  if (currentMinutes >= fikaStart - 5 && currentMinutes < fikaStart) {
    resultEl.textContent = "SNART ☕";
    steamEl.style.display = "block";
  } else {
    result.textContent = "NEJ";
    resultEl.textContent = "NEJ";
    steamEl.style.display = "none";
  }

  // NEDRÄKNING
  let nextFika = fikaStart;
  if (currentMinutes > fikaEnd) {
    nextFika += 24 * 60;
  }

  const diffMinutes = Math.max(0, nextFika - currentMinutes);

  const h = Math.floor(diffMinutes / 60);
  const m = Math.floor(diffMinutes % 60);
  const s = Math.floor((diffMinutes * 60) % 60);

  countdownEl.textContent =
    `Nästa fika om ${
      h > 0 ? h + "h " : ""
    }${m}m ${s}s`;
}

update();
setInterval(update, 1000);
// Start
updateFika();
setInterval(updateFika, 1000);
``
