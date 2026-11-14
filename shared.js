/* ══════════════════════════════════════════
   AgriGenie AI — Shared JS (shared.js)
   ══════════════════════════════════════════ */

// ── SIDEBAR BUILDER ──────────────────────────────────────────
const NAV = [
  { icon:'📊', label:'Dashboard',        href:'index.html',     section:'main' },
  { icon:'🤖', label:'AI Advisory',      href:'advisory.html',  section:'main', badge:'AI' },
  { icon:'📷', label:'Disease Detection',href:'disease.html',   section:'main', badge:'AI' },
  { icon:'🌦', label:'Weather',          href:'weather.html',   section:'main' },
  { icon:'🗣', label:'Voice Assistant',  href:'voice.html',     section:'tools' },
  { icon:'📈', label:'Market Prices',    href:'market.html',    section:'tools' },
  { icon:'📉', label:'Analytics',        href:'analytics.html', section:'tools' },
  { icon:'👤', label:'My Profile',       href:'profile.html',   section:'account' },
  { icon:'⚙️', label:'Admin Panel',      href:'admin.html',     section:'account' },
];

function buildSidebar(activePage) {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  let html = `
    <div class="sidebar-logo">
      <div class="logo-icon">🌾</div>
      <div class="logo-text">Agri<span>Genie</span></div>
    </div>`;

  let lastSection = '';
  NAV.forEach(item => {
    if (item.section !== lastSection) {
      const labels = { main:'Main', tools:'Tools', account:'Account' };
      html += `<div class="nav-section">${labels[item.section]}</div>`;
      lastSection = item.section;
    }
    const active = activePage === item.href ? 'active' : '';
    const badge  = item.badge ? `<span class="nav-badge">${item.badge}</span>` : '';
    html += `<a class="nav-item ${active}" href="${item.href}"><span class="nav-emoji">${item.icon}</span>${item.label}${badge}</a>`;
  });

  const user = getCurrentUser();
  const initials = (user.name || 'RK').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  html += `
    <div class="sidebar-bottom">
      <div class="user-card" onclick="location.href='profile.html'" title="View Profile" style="display:flex;align-items:center;gap:10px">
        <div class="user-avatar">${initials}</div>
        <div style="flex:1;min-width:0">
          <div class="user-name" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${user.name}</div>
          <div class="user-role">${user.role || 'Farmer · Indore'}</div>
        </div>
        <button onclick="event.stopPropagation();logoutUser()" title="Logout (लॉग आउट)" style="background:rgba(255,255,255,0.06);border:1px solid var(--glass-border);color:var(--text-muted);cursor:pointer;font-size:14px;padding:6px 8px;border-radius:8px;transition:all .2s" onmouseover="this.style.background='rgba(248,113,113,0.2)';this.style.color='#f87171'" onmouseout="this.style.background='rgba(255,255,255,0.06)';this.style.color='var(--text-muted)'">🚪</button>
      </div>
    </div>`;

  sidebar.innerHTML = html;
}

// ── USER AUTHENTICATION & SESSION ────────────────────────────
function getCurrentUser() {
  try {
    const raw = localStorage.getItem('agrigenie_user');
    if (raw) {
      const u = JSON.parse(raw);
      if (u && u.name) return u;
    }
  } catch (e) {}
  return {
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@example.com',
    phone: '9876543210',
    role: 'Farmer · Indore',
    loggedIn: false
  };
}

function checkAuth(shouldRedirect = false) {
  const user = getCurrentUser();
  const isLoginPage = window.location.pathname.toLowerCase().endsWith('login.html');
  if (shouldRedirect && !user.loggedIn && !isLoginPage) {
    window.location.href = 'login.html';
  }
  return user;
}

function logoutUser() {
  localStorage.removeItem('agrigenie_user');
  showToast('👋', 'Logged Out', 'Redirecting to login...');
  setTimeout(() => {
    window.location.href = 'login.html';
  }, 600);
}

// ── TOPBAR BUILDER ───────────────────────────────────────────
function buildTopbar(title) {
  const tb = document.getElementById('topbar');
  if (!tb) return;
  tb.innerHTML = `
    <div class="topbar-title">${title}</div>
    <div class="topbar-actions">
      <div class="topbar-btn"><div class="live-dot"></div><span>AI Live</span></div>
      <div class="topbar-btn" onclick="triggerNotification()">🔔</div>
      <div class="topbar-btn" id="lang-btn" onclick="toggleLang()">🇮🇳 Hindi</div>
      <div class="topbar-btn" onclick="toggleTheme()" id="theme-btn">☀️</div>
    </div>`;
}

// ── TOAST ────────────────────────────────────────────────────
function showToast(icon, title, msg) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `<div class="toast-icon">${icon}</div><div><div class="toast-title">${title}</div><div class="toast-msg">${msg}</div></div>`;
  container.appendChild(t);
  setTimeout(() => t.remove(), 4200);
}

function triggerNotification() {
  const n = [
    ['🌧','Rain Alert','Heavy rain tomorrow — skip irrigation'],
    ['🐛','Pest Warning','Aphid activity detected in your region'],
    ['💰','Price Alert','Wheat up 5.2% — good time to sell!'],
    ['💧','Irrigation Reminder','Field A irrigation scheduled tomorrow'],
  ];
  const r = n[Math.floor(Math.random() * n.length)];
  showToast(...r);
}

// ── THEME ────────────────────────────────────────────────────
function toggleTheme() {
  document.body.classList.toggle('light-mode');
  const btn = document.getElementById('theme-btn');
  if (btn) btn.textContent = document.body.classList.contains('light-mode') ? '🌙' : '☀️';
}

// ── LANGUAGE ─────────────────────────────────────────────────
let isHindi = true;
function toggleLang() {
  isHindi = !isHindi;
  const btn = document.getElementById('lang-btn');
  if (btn) btn.textContent = isHindi ? '🇮🇳 Hindi' : '🇬🇧 English';
  showToast('🌐', 'Language Changed', isHindi ? 'Hindi mode on' : 'English mode on');
}

// ── EMERGENCY ────────────────────────────────────────────────
function emergencyHelp() {
  showToast('🆘', 'Emergency Mode', 'Connecting to nearest Krishi Vigyan Kendra...');
  setTimeout(() => showToast('📞', 'Helpline', '1800-180-1551 — Free farmer support'), 1600);
}

// ── CLAUDE AI CALL ───────────────────────────────────────────
async function askClaude(systemPrompt, userMessage, maxTokens = 700) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }]
    })
  });
  const data = await response.json();
  return data.content.map(i => i.text || '').join('');
}

// ── EMERGENCY BUTTON INJECT ──────────────────────────────────
function injectEmergencyBtn() {
  if (document.querySelector('.emergency-btn')) return;
  const btn = document.createElement('button');
  btn.className = 'emergency-btn';
  btn.title = 'Emergency Help';
  btn.textContent = '🆘';
  btn.onclick = emergencyHelp;
  document.body.appendChild(btn);
}

// ── TOAST CONTAINER INJECT ───────────────────────────────────
function injectToastContainer() {
  if (document.getElementById('toast-container')) return;
  const c = document.createElement('div');
  c.id = 'toast-container';
  c.className = 'toast-container';
  document.body.appendChild(c);
}

// ── INIT ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  injectToastContainer();
  injectEmergencyBtn();
});
