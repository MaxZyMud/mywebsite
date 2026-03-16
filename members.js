// ===== FULL MEMBERS DATA =====
// photo: ใส่ URL รูปภาพ Facebook ของแต่ละคน เช่น
//   "https://graph.facebook.com/{FACEBOOK_USER_ID}/picture?type=large"
//   หรือ URL รูปภาพตรงๆ ก็ได้
// ถ้าไม่ใส่ photo (หรือใส่ null) จะแสดงตัวอักษรแทนอัตโนมัติ
const MEMBERS = [
  { name: "Massimo Toya", role: "leader", photo: "https://scontent.fbkk8-3.fna.fbcdn.net/v/t39.30808-6/492042802_122215173422205152_6101279449908198173_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=1d70fc&_nc_eui2=AeF3RjoIkJakd1xitR0nCiBVs-2TKJ2lsw6z7ZMonaWzDv7vD5VVAy3luNtJfk8FvWBnwSdoM7FXtgWhOSwxADd-&_nc_ohc=_-lxNjX1JfQQ7kNvwFOv85Z&_nc_oc=AdlQ5ESO2oo9eyXEu3DJVoSFKNmzu-yEsV4UMrzSG5OqqDDSnhhGnuVPqzE3VLMPEoJxX7-HO8Qe1nFk3cxoLo8h&_nc_zt=23&_nc_ht=scontent.fbkk8-3.fna&_nc_gid=YaaEdhO7e0WHEf048S-Bvw&_nc_ss=8&oh=00_AfxFG50FiX-o8U5DrPNwZrrWNxnvf7gIzpGtSQTZJV46wQ&oe=69BB6128", bio: "Founder & Leader of Bxrrett. Highly experienced — the backbone that keeps the family moving forward.", fb: "https://www.facebook.com/massimo.sukkasem", ig: null, tt: null },
  { name: "Sammie GalleryWalk", role: "leader", photo: null, fb: null, ig: null, tt: null },
  { name: "Zen Nosay", role: "leader", photo: "https://scontent.fbkk12-4.fna.fbcdn.net/v/t39.30808-1/476442544_477705088729761_7688757342109322069_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=103&ccb=1-7&_nc_sid=1d2534&_nc_eui2=AeGJ8EF-tSBaesO53tSCIeSbi9HRvaC--XeL0dG9oL75d9f8F6E86uspYr75v--Cf5_VnmjaGda1bSfwESaoBXg3&_nc_ohc=VdnD90IN1_MQ7kNvwGVRqbM&_nc_oc=AdlEJR1OEoRELsXRdDueJ-DnnSaRD0wCxtYBoaP_3Riugvq7enFq049gn_IfiokFIJFF3vGRXSaWn_49O2hrBHEf&_nc_zt=24&_nc_ht=scontent.fbkk12-4.fna&_nc_gid=4Vrgu1MKMZSh_GrItd_i0A&_nc_ss=8&oh=00_Afwqyuuq4DjIfyauvHmoTkg1Y00uPINmNRkD0LAv4Wm7pQ&oe=69BC70E6", fb: "https://www.facebook.com/zen.freaks", ig: null, tt: null },
  { name: "Jayz Lyfe", role: "member", photo: null, fb: "https://www.facebook.com/jayz.lyfestyle", ig: null, tt: null },
  { name: "Pegasus Lyfe", role: "member", photo: null, fb: null, ig: null, tt: null },
  { name: "Pleum Lyfestyle", role: "member", photo: null, fb: null, ig: null, tt: null },
  { name: "Justx Lyfestyle", role: "member", photo: null, fb: null, ig: null, tt: null },
  { name: "Fatez Smith", role: "member", photo: null, fb: null, ig: null, tt: null },
  { name: "Roll Bxrrett", role: "member", photo: null, fb: "https://www.facebook.com/rin.strainglean", ig: null, tt: null },
  { name: "Brisbane Bxrrett", role: "member", photo: null, fb: null, ig: null, tt: null },
  { name: "Recon Lyfestyle", role: "member", photo: null, fb: null, ig: null, tt: null },
];

const PALETTES = [
  { bg: "linear-gradient(135deg,#4285f4,#1a6de8)", c1: "#4285f4", c2: "#7c3aed" },
  { bg: "linear-gradient(135deg,#7c3aed,#4f46e5)", c1: "#7c3aed", c2: "#ec4899" },
  { bg: "linear-gradient(135deg,#34a853,#1b7a3e)", c1: "#34a853", c2: "#0ea5e9" },
  { bg: "linear-gradient(135deg,#fbbc05,#e5850a)", c1: "#fbbc05", c2: "#ea4335" },
  { bg: "linear-gradient(135deg,#ea4335,#c62828)", c1: "#ea4335", c2: "#f97316" },
  { bg: "linear-gradient(135deg,#0ea5e9,#0284c7)", c1: "#0ea5e9", c2: "#34a853" },
  { bg: "linear-gradient(135deg,#ec4899,#be185d)", c1: "#ec4899", c2: "#7c3aed" },
  { bg: "linear-gradient(135deg,#f97316,#c2410c)", c1: "#f97316", c2: "#fbbc05" },
];

const ICONS = {
  facebook: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>`,
  instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/></svg>`,
  tiktok: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-2.09-2.79V9.01A6.34 6.34 0 1 0 16.6 15.3l-.01-8.24a8.16 8.16 0 0 0 4.82 1.56V5.2a4.85 4.85 0 0 1-1.82 1.49z"/></svg>`,
};

const ROLE_LABEL = { leader: "Leader", admin: "Admin", member: "Member" };
const ITEMS_PER_PAGE = 8;
let currentPage = 1, filtered = [...MEMBERS];

function renderGrid() {
  const grid = document.getElementById("membersGrid");
  const slice = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  grid.innerHTML = "";

  if (!slice.length) {
    grid.innerHTML = `<div class="no-results">No members found...</div>`;
    return updatePagination();
  }

  slice.forEach((m, i) => {
    const pal = PALETTES[MEMBERS.indexOf(m) % PALETTES.length];
    let soc = "";
    if (m.fb) soc += `<a href="${m.fb}" target="_blank" class="social-btn facebook">${ICONS.facebook} FB</a>`;
    if (m.ig) soc += `<a href="${m.ig}" target="_blank" class="social-btn instagram">${ICONS.instagram} IG</a>`;
    if (m.tt) soc += `<a href="${m.tt}" target="_blank" class="social-btn tiktok">${ICONS.tiktok} TT</a>`;

    const card = document.createElement("div");
    card.className = "member-card";
    card.style.animationDelay = `${i * 0.055}s`;
    card.style.setProperty("--c1", pal.c1);
    card.style.setProperty("--c2", pal.c2);
    const avatarHTML = m.photo
      ? `<div class="member-avatar" style="background:${pal.bg};box-shadow:0 6px 16px ${pal.c1}40;padding:0;overflow:hidden;">
           <img src="${m.photo}" alt="${m.name}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" onerror="this.parentElement.innerHTML='${m.name[0].toUpperCase()}';this.parentElement.style.fontSize='22px';" />
         </div>`
      : `<div class="member-avatar" style="background:${pal.bg};box-shadow:0 6px 16px ${pal.c1}40">${m.name[0].toUpperCase()}</div>`;

    card.innerHTML = `
      ${avatarHTML}
      <span class="member-name">${m.name}</span>
      <span class="role-badge role-${m.role}">${ROLE_LABEL[m.role]}</span>
      <div class="social-links">${soc}</div>
    `;
    grid.appendChild(card);
  });
  updatePagination();
}

function updatePagination() {
  const total = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  document.getElementById("pageNum").textContent = currentPage;
  document.getElementById("prevBtn").disabled = currentPage === 1;
  document.getElementById("nextBtn").disabled = currentPage >= total;
}

function changePage(dir) {
  const total = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const next = currentPage + dir;
  if (next < 1 || next > total) return;
  currentPage = next;
  renderGrid();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.getElementById("searchInput").addEventListener("input", e => {
  const q = e.target.value.trim().toLowerCase();
  filtered = q ? MEMBERS.filter(m => m.name.toLowerCase().includes(q) || m.role.includes(q)) : [...MEMBERS];
  currentPage = 1;
  renderGrid();
});

// Navbar
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => navbar.classList.toggle("scrolled", window.scrollY > 20));

// Hamburger
const hamburger = document.getElementById("hamburger");
const mobileDrawer = document.getElementById("mobileDrawer");
if (hamburger) hamburger.addEventListener("click", () => mobileDrawer.classList.toggle("open"));
function closeMobile() { if (mobileDrawer) mobileDrawer.classList.remove("open"); }

// Expose MEMBERS globally so index.html can use it
window.MEMBERS = MEMBERS;

// Init
renderGrid();

// ====================================================
//  MEMBERS PAGE — ANIMATED PARTICLE BACKGROUND
// ====================================================
(function initMembersCanvas() {
  const canvas = document.getElementById('members-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const PARTICLE_COUNT = 90;
  const CONNECT_DIST = 130;
  let W, H, particles = [];
  let mx = -9999, my = -9999;

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : -6;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = Math.random() * 0.4 + 0.15;
      this.r = Math.random() * 1.8 + 0.6;
      this.alpha = Math.random() * 0.5 + 0.2;
    }
    update() {
      // Mouse repel
      const dx = this.x - mx, dy = this.y - my;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 100 && d > 0) {
        this.vx += (dx / d) * 0.06;
        this.vy += (dy / d) * 0.06;
      }
      this.x += this.vx;
      this.y += this.vy;
      // Dampen
      this.vx *= 0.99;
      this.vy = Math.max(this.vy * 0.99, 0.1);
      // Wrap sides
      if (this.x < 0) this.x = W;
      if (this.x > W) this.x = 0;
      if (this.y > H + 6) this.reset(false);
    }
  }

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function init() {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Draw connection lines
    ctx.lineWidth = 0.6;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < CONNECT_DIST) {
          const alpha = (1 - d / CONNECT_DIST) * 0.18;
          ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }

    // Draw dots
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
      ctx.fill();
      p.update();
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  window.addEventListener('resize', () => { resize(); });

  init();
  draw();
})();
