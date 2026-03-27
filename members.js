// members.js — depends on data.js being loaded first

const PALETTES = [
  { bg:'linear-gradient(135deg,#4285f4,#1a6de8)', c1:'#4285f4', c2:'#7c3aed' },
  { bg:'linear-gradient(135deg,#7c3aed,#4f46e5)', c1:'#7c3aed', c2:'#ec4899' },
  { bg:'linear-gradient(135deg,#34a853,#1b7a3e)', c1:'#34a853', c2:'#0ea5e9' },
  { bg:'linear-gradient(135deg,#fbbc05,#e5850a)', c1:'#fbbc05', c2:'#ea4335' },
  { bg:'linear-gradient(135deg,#ea4335,#c62828)', c1:'#ea4335', c2:'#f97316' },
  { bg:'linear-gradient(135deg,#0ea5e9,#0284c7)', c1:'#0ea5e9', c2:'#34a853' },
  { bg:'linear-gradient(135deg,#ec4899,#be185d)', c1:'#ec4899', c2:'#7c3aed' },
  { bg:'linear-gradient(135deg,#f97316,#c2410c)', c1:'#f97316', c2:'#fbbc05' },
];

const ICONS = {
  facebook:  `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>`,
  instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/></svg>`,
  tiktok:    `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-2.09-2.79V9.01A6.34 6.34 0 1 0 16.6 15.3l-.01-8.24a8.16 8.16 0 0 0 4.82 1.56V5.2a4.85 4.85 0 0 1-1.82 1.49z"/></svg>`,
};

const ROLE_LABEL   = { leader:'Leader', admin:'Admin', member:'Member' };
const ITEMS_PER_PAGE = 8;

let MEMBERS     = [];
let currentPage = 1;
let filtered    = [];

// ── Init ──────────────────────────────────────────────────
function fetchMembers() {
  MEMBERS  = getMembers().sort((a,b) => (a.ord||999)-(b.ord||999) || a.id-b.id);
  filtered = [...MEMBERS];
  window.MEMBERS = MEMBERS;
  renderGrid();
  renderLeaderShowcaseIfExists();
  initMembersCanvas();
}

// ── Grid ──────────────────────────────────────────────────
function renderGrid() {
  const grid = document.getElementById('membersGrid');
  if (!grid) return;
  const slice = filtered.slice((currentPage-1)*ITEMS_PER_PAGE, currentPage*ITEMS_PER_PAGE);
  grid.innerHTML = '';

  if (!slice.length) {
    grid.innerHTML = `<div class="no-results">No members found...</div>`;
    return updatePagination();
  }

  slice.forEach((m, i) => {
    const pal  = PALETTES[MEMBERS.indexOf(m) % PALETTES.length];
    const soc  = buildSocials(m);
    const card = document.createElement('div');
    card.className = 'member-card';
    card.style.animationDelay = `${i * 0.055}s`;
    card.style.setProperty('--c1', pal.c1);
    card.style.setProperty('--c2', pal.c2);
    card.innerHTML = `
      ${avatarHtml(m, pal)}
      <span class="member-name">${m.name}</span>
      <span class="role-badge role-${m.role}">${ROLE_LABEL[m.role] || m.role}</span>
      <div class="social-links">${soc}</div>`;
    grid.appendChild(card);
  });
  updatePagination();
}

function avatarHtml(m, pal) {
  const init = m.name[0].toUpperCase();
  const base = `class="member-avatar" style="background:${pal.bg};box-shadow:0 6px 16px ${pal.c1}40"`;
  if (!m.photo) return `<div ${base}>${init}</div>`;
  return `<div ${base} style="background:${pal.bg};box-shadow:0 6px 16px ${pal.c1}40;padding:0;overflow:hidden;">
    <img src="${m.photo}" alt="${m.name}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;"
         onerror="this.parentElement.innerHTML='${init}';this.parentElement.style.fontSize='22px';" /></div>`;
}

function buildSocials(m) {
  let s = '';
  if (m.fb && m.fb !== '#') s += `<a href="${m.fb}" target="_blank" class="social-btn facebook">${ICONS.facebook} FB</a>`;
  if (m.ig) s += `<a href="${m.ig}" target="_blank" class="social-btn instagram">${ICONS.instagram} IG</a>`;
  if (m.tt) s += `<a href="${m.tt}" target="_blank" class="social-btn tiktok">${ICONS.tiktok} TT</a>`;
  return s;
}

function updatePagination() {
  const total = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const pg = document.getElementById('pageNum');
  if (pg) pg.textContent = currentPage;
  const p = document.getElementById('prevBtn'), n = document.getElementById('nextBtn');
  if (p) p.disabled = currentPage === 1;
  if (n) n.disabled = currentPage >= total;
}

function changePage(dir) {
  const next = currentPage + dir;
  const total = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  if (next < 1 || next > total) return;
  currentPage = next;
  renderGrid();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Search ────────────────────────────────────────────────
const searchEl = document.getElementById('searchInput');
if (searchEl) {
  searchEl.addEventListener('input', e => {
    const q = e.target.value.trim().toLowerCase();
    filtered = q ? MEMBERS.filter(m => m.name.toLowerCase().includes(q) || m.role.includes(q)) : [...MEMBERS];
    currentPage = 1;
    renderGrid();
  });
}

// ── Navbar ────────────────────────────────────────────────
const navbar       = document.getElementById('navbar');
const hamburger    = document.getElementById('hamburger');
const mobileDrawer = document.getElementById('mobileDrawer');
if (navbar)    window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 20));
if (hamburger) hamburger.addEventListener('click', () => mobileDrawer?.classList.toggle('open'));
function closeMobile() { mobileDrawer?.classList.remove('open'); }

// ── Leader Showcase ────────────────────────────────────────
function renderLeaderShowcaseIfExists() {
  const container = document.getElementById('mlCards');
  if (!container) return;

  const leaders = MEMBERS.filter(m => m.role === 'leader');
  if (!leaders.length) { document.getElementById('mlSection')?.remove(); return; }

  const LC = [
    { bg:'linear-gradient(135deg,#4285f4,#1a6de8)', c1:'#4285f4' },
    { bg:'linear-gradient(135deg,#7c3aed,#4f46e5)', c1:'#7c3aed' },
    { bg:'linear-gradient(135deg,#ec4899,#be185d)', c1:'#ec4899' },
    { bg:'linear-gradient(135deg,#fbbc05,#e5850a)', c1:'#fbbc05' },
    { bg:'linear-gradient(135deg,#34a853,#1b7a3e)', c1:'#34a853' },
  ];
  const SOC = {
    fb: ICONS.facebook,
    ig: ICONS.instagram,
    tt: ICONS.tiktok,
  };

  leaders.forEach((ldr, idx) => {
    const pal   = LC[idx % LC.length];
    const init  = ldr.name[0].toUpperCase();
    const bio   = ldr.bio || 'Leader of the Bxrrett family.';
    const avInner = ldr.photo
      ? `<img src="${ldr.photo}" alt="${ldr.name}" class="ml-photo" onerror="this.outerHTML='<span class=\\'ml-initial\\'>${init}</span>'" />`
      : `<span class="ml-initial">${init}</span>`;
    let soc = '';
    if (ldr.fb && ldr.fb !== '#') soc += `<a href="${ldr.fb}" class="ml-soc" target="_blank">${SOC.fb} Facebook</a>`;
    if (ldr.ig) soc += `<a href="${ldr.ig}" class="ml-soc" target="_blank">${SOC.ig} Instagram</a>`;
    if (ldr.tt) soc += `<a href="${ldr.tt}" class="ml-soc" target="_blank">${SOC.tt} TikTok</a>`;

    const row = document.createElement('div');
    row.className = 'ml-row' + (idx % 2 ? ' ml-row-flip' : '');
    row.innerHTML = `
      <div class="ml-avatar-wrap" style="--lc:${pal.c1}">
        <div class="ml-ring"></div><div class="ml-ring ml-ring2"></div>
        <div class="ml-avatar" style="background:${pal.bg};box-shadow:0 0 70px ${pal.c1}44">${avInner}</div>
      </div>
      <div class="ml-info">
        <span class="ml-num">0${idx+1}</span>
        <div class="ml-badge">👑 Leader</div>
        <h3 class="ml-name">${ldr.name}</h3>
        <p class="ml-bio">${bio}</p>
        <div class="ml-socials">${soc}</div>
      </div>`;
    container.appendChild(row);
  });

  const io = new IntersectionObserver(entries =>
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('ml-visible'); io.unobserve(e.target); } }),
    { threshold: 0.15 }
  );
  container.querySelectorAll('.ml-row').forEach(r => io.observe(r));
}

// ── Particle Canvas ────────────────────────────────────────
function initMembersCanvas() {
  const canvas = document.getElementById('members-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const N = 90, D = 130;
  let W, H, pts = [], mx = -9999, my = -9999;

  class P {
    constructor() { this.reset(true); }
    reset(init) {
      this.x = Math.random()*W; this.y = init ? Math.random()*H : -6;
      this.vx = (Math.random()-.5)*.35; this.vy = Math.random()*.4+.15;
      this.r = Math.random()*1.8+.6; this.a = Math.random()*.5+.2;
    }
    update() {
      const dx=this.x-mx, dy=this.y-my, d=Math.hypot(dx,dy);
      if (d<100&&d>0) { this.vx+=dx/d*.06; this.vy+=dy/d*.06; }
      this.x+=this.vx; this.y+=this.vy;
      this.vx*=.99; this.vy=Math.max(this.vy*.99,.1);
      if (this.x<0) this.x=W; if (this.x>W) this.x=0;
      if (this.y>H+6) this.reset(false);
    }
  }

  const resize = () => { W=canvas.width=innerWidth; H=canvas.height=innerHeight; };
  resize();
  pts = Array.from({length:N}, () => new P());

  function draw() {
    ctx.clearRect(0,0,W,H);
    ctx.lineWidth=.6;
    for (let i=0;i<N;i++) for (let j=i+1;j<N;j++) {
      const d=Math.hypot(pts[i].x-pts[j].x, pts[i].y-pts[j].y);
      if (d<D) { ctx.strokeStyle=`rgba(255,255,255,${(1-d/D)*.18})`; ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y); ctx.stroke(); }
    }
    pts.forEach(p => { ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle=`rgba(255,255,255,${p.a})`; ctx.fill(); p.update(); });
    requestAnimationFrame(draw);
  }

  window.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; });
  window.addEventListener('resize', resize);
  draw();
}

// ── Start ──────────────────────────────────────────────────
fetchMembers();
