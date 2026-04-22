const status = document.getElementById("status");
const result = document.getElementById("result");
const countdown = document.getElementById("countdown");

const race = document.getElementById("raceContainer");
const cupWrap = document.getElementById("cupWrap");
const steam = document.getElementById("steam");

// knapp
const checkInBtn = document.getElementById("checkInBtn");

// localStorage-nyckel
const CHECKIN_KEY = "fikaCheckin";

// hjälpfunktion för datumnyckel (så check-in bara gäller samma dag)
function todayKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// spara check-in (endast om inom fönster)
function handleCheckIn() {
  const now = new Date();
  const hour = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const currentTotal = hour * 60 + minutes + seconds / 60;

  const fikaStart = 15 * 60;       // 15:00
  const fikaEnd = fikaStart + 15;  // 15:15

  if (currentTotal >= fikaStart && currentTotal <= fikaEnd) {
    localStorage.setItem(
      CHECKIN_KEY,
      JSON.stringify({
        day: todayKey(now),
        checkedAtMinutes: currentTotal,
      })
    );
  }
}

checkInBtn?.addEventListener("click", handleCheckIn);

function checkFika() {
  const now = new Date();

  const day = now.getDay(); // 0 = söndag, 6 = lördag
  const hour = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const currentTotal = hour * 60 + minutes + seconds / 60;

  const fikaStart = 15 * 60;        // 15:00
  const fikaEnd = fikaStart + 15;   // 15:15

  // tider för check-in-resultat och missat
  const fikaYesUntil = 16 * 60;     // 16:00
  const fikaMissAt = 16 * 60 + 15;  // 16:15

  const isWeekend = (day === 0 || day === 6);
  const isFridayAfterFika = (day === 5 && currentTotal > fikaEnd);

  result.classList.remove("pulse");
  if (steam) steam.style.display = "none";

  // visa/dölj check-in-knappen
  const showCheckInButton = (!isWeekend && !isFridayAfterFika &&
    currentTotal >= fikaStart && currentTotal <= fikaEnd);

  if (checkInBtn) checkInBtn.style.display = showCheckInButton ? "inline-block" : "none";

  // läs check-in status
  let checkedInToday = false;
  try {
    const raw = localStorage.getItem(CHECKIN_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (data?.day === todayKey(now) && typeof data.checkedAtMinutes === "number") {
        // gäller om check-in gjordes inom 15:00–15:15 och innan 16:00
        if (
          data.checkedAtMinutes >= fikaStart &&
          data.checkedAtMinutes <= fikaEnd &&
          currentTotal < fikaYesUntil
        ) {
          checkedInToday = true;
        }
      }
    }
  } catch (e) {
    // om localStorage-data är trasig, ignorera
  }

  /* ===== HELG ===== */
  if (isWeekend || isFridayAfterFika) {
    status.textContent = "";
    result.textContent = "NU ÄR DET HELG 🎉";

    if (race) race.style.display = "none";
    if (checkInBtn) checkInBtn.style.display = "none";

    // nästa måndag 15:00
    let daysUntilMonday = (8 - day) % 7;
    if (daysUntilMonday === 0) daysUntilMonday = 7;

    const totalMinutes =
      daysUntilMonday * 24 * 60 +
      (fikaStart - currentTotal);

    const h = Math.floor(totalMinutes / 60);
    const m = Math.floor(totalMinutes % 60);

    countdown.textContent = `Nästa fika om ${h}h ${m}m (måndag 15:00)`;
    return;
  }

  /* ===== RACE ===== */
  if (currentTotal >= 14 * 60 + 45) {
    if (race) race.style.display = "block";

    const raceStart = 14 * 60 + 45;
    const duration = 15 * 60; // sekunder
    const elapsed = (currentTotal - raceStart) * 60;

    let progress = elapsed / duration;
    if (progress > 1) progress = 1;

    if (race && cupWrap) {
      const trackWidth = race.offsetWidth - 60; // lite marginal
      cupWrap.style.left = (progress * trackWidth) + "px";
    }
  } else {
    if (race) race.style.display = "none";
  }

  /* ===== CHECK-IN ÖVERSTYR (FIKA JA TILL 16:00) ===== */
  if (checkedInToday) {
    status.textContent = "";
    result.textContent = "FIKA JA ☕";
    countdown.textContent = "Du är incheckad till 16:00 ✅";
    return;
  }

  /* ===== SNART ===== */
  if (currentTotal >= fikaStart - 5 && currentTotal < fikaStart) {
    status.textContent = "";
    result.textContent = "SNART ☕";
    result.classList.add("pulse");
    if (steam) steam.style.display = "block";
    countdown.textContent = "";
  }

  /* ===== FIKA-FÖNSTER (KNAPPEN SYNS HÄR) ===== */
  else if (currentTotal >= fikaStart && currentTotal <= fikaEnd) {
    status.textContent = "";
    result.textContent = "CHECKA IN ☕";
    countdown.textContent = "Klicka på knappen för att få FIKA JA till 16:00";
  }

  /* ===== EFTER FIKA: MISSAT VID 16:15 (OM EJ INCHECKAD) ===== */
  else if (currentTotal >= fikaMissAt) {
    status.textContent = "";
    result.textContent = "FIKA MISSAT ❌";
    countdown.textContent = "";
  }

  /* ===== NEJ (SOM VANLIGT) ===== */
  else {
    status.textContent = "";
    result.textContent = "NEJ";

    let nextFika = fikaStart;
    if (currentTotal > fikaEnd) {
      nextFika = fikaStart + 24 * 60;
    }

    const diff = Math.max(0, nextFika - currentTotal);

    const h = Math.floor(diff / 60);
    const m = Math.floor(diff % 60);
    const s = Math.floor((diff * 60) % 60);

    countdown.textContent = `Nästa fika om ${h > 0 ? h + "h " : ""}${m}m ${s}s`;
  }
}

// säker start när DOM är laddad
document.addEventListener("DOMContentLoaded", () => {
  checkFika();
  setInterval(checkFika, 1000);
});
``
