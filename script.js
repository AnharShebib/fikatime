const result = document.getElementById("result");

function update() {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();

  if (h === 15 && m < 15) {
    result.textContent = "FIKA ☕";
  } else {
    result.textContent = "NEJ";
  }
}

update();
setInterval(update, 1000);
