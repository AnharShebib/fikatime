/* =========================
   Design tokens
========================= */
:root {
  --bg: #0b0f1a;
  --bg-accent: #11182a;
  --card-bg: rgba(20, 28, 50, 0.75);
  --border: rgba(255, 255, 255, 0.12);

  --text-main: #f1f4ff;
  --text-muted: #9aa4c7;
  --accent: #7dd3fc;
  --accent-strong: #38bdf8;
  --success: #86efac;
  --danger: #fb7185;

  --radius-lg: 22px;
  --radius-md: 14px;
}

/* =========================
   Reset
========================= */
* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
  background: var(--bg);
  color: var(--text-main);
}

/* =========================
   Background
========================= */
.background {
  position: fixed;
  inset: 0;
  background:
    radial-gradient(800px 400px at 20% -10%, #1e2a52, transparent 60%),
    radial-gradient(900px 500px at 80% 0%, #0e7490, transparent 55%),
    linear-gradient(180deg, var(--bg), #050812);
  z-index: -1;
}

/* =========================
   Layout
========================= */
.layout {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
}

/* =========================
   Card
========================= */
.card {
  width: min(720px, 100%);
  background: var(--card-bg);
  backdrop-filter: blur(18px);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  box-shadow:
    0 30px 80px rgba(0, 0, 0, 0.45),
    inset 0 0 0 1px rgba(255, 255, 255, 0.02);
  padding: 28px;
  animation: fadeIn 0.8s ease;
}

/* =========================
   Header
========================= */
.card-header {
  text-align: center;
  margin-bottom: 24px;
}

.logo {
  margin: 0;
  font-size: 32px;
  font-weight: 900;
  letter-spacing: 0.4px;
}

.subtitle {
  margin-top: 6px;
  color: var(--text-muted);
  font-size: 15px;
}

/* =========================
   Content
========================= */
.content {
  text-align: center;
  padding: 16px 0 24px;
}

.status {
  min-height: 18px;
  color: var(--text-muted);
}

.result {
  font-size: 46px;
  font-weight: 900;
  margin: 10px 0;
  letter-spacing: 0.5px;
}

.countdown {
  color: var(--text-muted);
  font-size: 16px;
}

/* =========================
   Button
========================= */
.btn {
  margin-top: 18px;
  background: linear-gradient(135deg, var(--accent), var(--accent-strong));
  border: none;
  border-radius: var(--radius-md);
  padding: 14px 20px;
  font-weight: 800;
  font-size: 15px;
  color: #04131f;
  cursor: pointer;
  box-shadow:
    0 10px 30px rgba(56, 189, 248, 0.35);
  transition: transform 0.1s ease, box-shadow 0.1s ease;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 38px rgba(56, 189, 248, 0.45);
}

.btn:active {
  transform: translateY(0);
}

/* =========================
   Steam / pulse
========================= */
.steam {
  margin-top: 10px;
  opacity: 0.75;
  animation: steam 1.2s infinite ease-in-out;
}

.pulse {
  animation: pulse 1.2s infinite ease-in-out;
}

/* =========================
   Race
========================= */
.race {
  margin-top: 22px;
}

.track {
  position: relative;
  height: 42px;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.06),
    rgba(255, 255, 255, 0.1)
  );
  border: 1px solid var(--border);
  overflow: hidden;
}

.finish {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.9;
}

.cupWrap {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  transition: left 0.15s linear;
  padding-left: 12px;
}

.cup {
  font-size: 22px;
}

.race-text {
  margin-top: 10px;
  font-size: 13px;
  color: var(--text-muted);
  text-align: center;
}

/* =========================
   Footer
========================= */
.footer {
  margin-top: 26px;
  text-align: center;
  font-size: 12px;
  color: var(--text-muted);
  opacity: 0.8;
}

/* =========================
   Animations
========================= */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.04); }
}

@keyframes steam {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.9; }
}
``
