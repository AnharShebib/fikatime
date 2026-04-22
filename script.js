(() => {
  "use strict";

  // Kör först när DOM är redo (så vi aldrig fastnar på "Laddar…")
  document.addEventListener("DOMContentLoaded", () => {

    // ----- Elements (måste matcha index.html) -----
    const statusEl = document.getElementById("status");
    const resultEl = document.getElementById("result");
    const countdownEl = document.getElementById("countdown");

    const raceEl = document.getElementById("raceContainer");
    const cupWrapEl = document.getElementById("cupWrap");
    const steamEl = document.getElementById("steam");
    const checkInBtn = document.getElementById("checkInBtn");

    // ----- Settings -----
    const CHECKIN_KEY = "fikaCheckin";

    const FIKA_START = 15 * 60;          // 15:00
    const FIKA_END = FIKA_START + 15;    // 15:15

    const FIKA_YES_UNTIL = 16 * 60;      // 16:00 (incheckad gäller till)
    const FIKA_MISS_AT = 16 * 60 + 15;   // 16:15 -> "missat" om ej incheckad

    const RACE_START = 14 * 60 + 45;     // 14:45
    const RACE_DURATION_SEC = 15 * 60;  // 15 min

    // ----- Helpers -----
    function todayKey(d) {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    }

    function nowMinutes(d) {
      return d.getHours() * 60 + d.getMinutes() + d.getSeconds() / 60;
    }

    function setText(el, text) {
      if (el) el.textContent = text;
    }

    function show(el, yes) {
      if (el) el.style.display = yes ? "" : "none";
    }

    function safeParse(json) {
      try { return JSON.parse(json); } catch { return null; }
    }

    // ----- Check-in -----
    function handleCheckIn() {
      const now = new Date();
      const current = nowMinutes(now);

      if (current >= FIKA_START && current <= FIKA_END) {
        localStorage.setItem(CHECKIN_KEY, JSON.stringify({
          day: todayKey(now),
          checkedAtMinutes: current
        }));
      }
    }

    if (checkInBtn) {
      checkInBtn.addEventListener("click", handleCheckIn);
    }

    function isCheckedInToday(now, current) {
      const raw = localStorage.getItem(CHECKIN_KEY);
      if (!raw) return false;

      const data = safeParse(raw);
      if (!data) return false;

      if (data.day !== todayKey(now)) return false;
      if (typeof data.checkedAtMinutes !== "number") return false;

      // Check-in måste ha skett i 15:00–15:15 och gäller bara fram till 16:00
      return (
        data.checkedAtMinutes >= FIKA_START &&
        data.checkedAtMinutes <= FIKA_END &&
        current < FIKA_YES_UNTIL
      );
    }

    // ----- UI Reset each tick -----
    function resetTickUI() {
      // vi använder inte "status" till något stort just nu, men behåller
      setText(statusEl, "");

      if (resultEl) resultEl.classList.remove("pulse");
      show(steamEl, false);
    }

    // ----- Main loop -----
    function tick() {
      const now = new Date();
      const day = now.getDay(); // 0=sön,6=lör
      const current = nowMinutes(now);

      const isWeekend = (day === 0 || day === 6);
      const isFridayAfterFika = (day === 5 && current > FIKA_END);

      resetTickUI();

      // Visa/dölj checkin-knapp endast under fönstret
      const showCheckInButton =
        (!isWeekend && !isFridayAfterFika &&
          current >= FIKA_START && current <= FIKA_END);

      if (checkInBtn) show(checkInBtn, showCheckInButton);

      // Race (14:45 → 15:00)
      if (raceEl && cupWrapEl) {
        if (current >= RACE_START && !isWeekend && !isFridayAfterFika) {
          show(raceEl, true);

          const elapsedSec = (current - RACE_START) * 60;
          let progress = elapsedSec / RACE_DURATION_SEC;
          if (progress < 0) progress = 0;
          if (progress > 1) progress = 1;

          // Flytta koppen över spåret (raceEl bredd - marginal)
          const trackWidth = raceEl.offsetWidth - 60;
          cupWrapEl.style.left = (progress * trackWidth) + "px";
        } else {
          show(raceEl, false);
        }
      }

      // HELG-läge (lör/sön eller fre efter fika)
      if (isWeekend || isFridayAfterFika) {
        setText(resultEl, "NU ÄR DET HELG 🎉");
        setText(countdownEl, "");

        // Nästa måndag 15:00
        let daysUntilMonday = (8 - day) % 7;
        if (daysUntilMonday === 0) daysUntilMonday = 7;

        const minsUntil =
          daysUntilMonday * 24 * 60 + (FIKA_START - current);

        const h = Math.floor(minsUntil / 60);
        const m = Math.floor(minsUntil % 60);

        setText(countdownEl, `Nästa fika om ${h}h ${m}m (måndag 15:00)`);
        return;
      }

      // Check-in överstyr: FIKA JA till 16:00
      if (isCheckedInToday(now, current)) {
        setText(resultEl, "FIKA JA ☕");
        setText(countdownEl, "Du är incheckad till 16:00 ✅");
        return;
      }

      // SNART (5 minuter innan)
      if (current >= FIKA_START - 5 && current < FIKA_START) {
        setText(resultEl, "SNART ☕");
        if (resultEl) resultEl.classList.add("pulse");
        show(steamEl, true);
        setText(countdownEl, "");
        return;
      }

      // FIKA-fönster
      if (current >= FIKA_START && current <= FIKA_END) {
        setText(resultEl, "CHECKA IN ☕");
        setText(countdownEl, "Klicka på knappen för att få FIKA JA till 16:00");
        return;
      }

      // Missat
      if (current >= FIKA_MISS_AT) {
        setText(resultEl, "FIKA MISSAT ❌");
        setText(countdownEl, "");
        return;
      }

      // Standard: NEJ + nedräkning till nästa fika
      setText(resultEl, "NEJ");

      let nextFika = FIKA_START;
      if (current > FIKA_END) nextFika = FIKA_START + 24 * 60;

      const diff = Math.max(0, nextFika - current);
      const h = Math.floor(diff / 60);
      const m = Math.floor(diff % 60);
      const s = Math.floor((diff * 60) % 60);

      setText(countdownEl, `Nästa fika om ${h > 0 ? h + "h " : ""}${m}m ${s}s`);
    }

    // Start direkt + tick varje sekund
    tick();
    setInterval(tick, 1000);
  });
})();
``
