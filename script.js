// ====================================================
//  BXRRETT — Landing Page Script
// ====================================================

// ====================================================
//  INTERACTIVE DOT GRID CANVAS (Hero background)
// ====================================================
(function initDotGrid() {
  const canvas = document.getElementById("grid-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  // Config
  const SPACING    = 46;   // grid spacing (px)
  const DOT_R      = 2.2;  // dot radius
  const CONNECT_D  = 90;   // max distance to draw a connection line
  const MOUSE_R    = 140;  // radius of mouse repulsion
  const REPEL_F    = 0.45; // repulsion force
  const RETURN_F   = 0.08; // spring return force
  const DAMPING    = 0.78; // velocity damping

  let W, H;
  let cols, rows;
  let points = [];
  let mx = -9999, my = -9999; // mouse position (relative to canvas)

  // ── Point class ─────────────────────────────────
  class Point {
    constructor(ox, oy) {
      this.ox = ox; this.oy = oy; // origin (home)
      this.x  = ox; this.y  = oy; // current
      this.vx = 0;  this.vy = 0;  // velocity
    }
    update() {
      const dx = mx - this.x;
      const dy = my - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < MOUSE_R && dist > 0) {
        // Repel away from mouse
        const force = ((MOUSE_R - dist) / MOUSE_R) * REPEL_F;
        this.vx -= (dx / dist) * force;
        this.vy -= (dy / dist) * force;
      }

      // Spring back to origin
      this.vx += (this.ox - this.x) * RETURN_F;
      this.vy += (this.oy - this.y) * RETURN_F;

      // Damp
      this.vx *= DAMPING;
      this.vy *= DAMPING;

      this.x += this.vx;
      this.y += this.vy;
    }
  }

  // ── Build grid ──────────────────────────────────
  function buildGrid() {
    const parent = canvas.parentElement;
    W = canvas.width  = parent ? parent.offsetWidth  : window.innerWidth;
    H = canvas.height = parent ? parent.offsetHeight : window.innerHeight;
    cols = Math.ceil(W / SPACING) + 2;
    rows = Math.ceil(H / SPACING) + 2;

    // Offset to center the grid
    const offX = (W - (cols - 1) * SPACING) / 2;
    const offY = (H - (rows - 1) * SPACING) / 2;

    points = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        points.push(new Point(offX + c * SPACING, offY + r * SPACING));
      }
    }
  }

  // ── Draw frame ──────────────────────────────────
  function draw() {
    ctx.clearRect(0, 0, W, H);

    // ── 1. Radial glow at mouse (white/grey) ───
    if (mx > -1000) {
      const grd = ctx.createRadialGradient(mx, my, 0, mx, my, 260);
      grd.addColorStop(0,    "rgba(255, 255, 255, 0.08)");
      grd.addColorStop(0.35, "rgba(255, 255, 255, 0.02)");
      grd.addColorStop(1,    "rgba(0,   0,   0, 0)");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);
    }

    // ── 2. Connection lines between neighboring points ──
    ctx.lineWidth = 0.7;
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      // Only check right + down neighbors in grid order
      const right = points[i + 1];
      const down  = points[i + cols];
      // Diagonal
      const diagDR = points[i + cols + 1];

      [right, down, diagDR].forEach(q => {
        if (!q) return;
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const d  = Math.sqrt(dx*dx + dy*dy);
        if (d < CONNECT_D) {
          // Fade lines near mouse (brighter)
          const mDist = Math.min(
            Math.hypot(mx - p.x, my - p.y),
            Math.hypot(mx - q.x, my - q.y)
          );
          const glow = mDist < MOUSE_R
            ? 0.5 + (1 - mDist / MOUSE_R) * 0.5
            : 0.15;
          const alpha = glow * (1 - d / CONNECT_D);
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.6})`;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      });
    }

    // ── 3. Dots ──────────────────────────────────
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      const mDist = Math.hypot(mx - p.x, my - p.y);
      const nearMouse = mDist < MOUSE_R;
      const alpha = nearMouse
        ? 0.5 + (1 - mDist / MOUSE_R) * 0.5
        : 0.25;
      const r = nearMouse
        ? DOT_R + (1 - mDist / MOUSE_R) * 1.5
        : DOT_R;

      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fill();
    }

    // ── 4. Update physics ────────────────────────
    points.forEach(p => p.update());
  }

  // ── Animation loop ───────────────────────────────
  function animate() {
    draw();
    requestAnimationFrame(animate);
  }

  // ── Mouse tracking (relative to canvas) ─────────
  window.addEventListener("mousemove", e => {
    const rect = canvas.getBoundingClientRect();
    mx = e.clientX - rect.left;
    my = e.clientY - rect.top;
  });
  window.addEventListener("mouseleave", () => { mx = -9999; my = -9999; });

  // ── Touch support ────────────────────────────────
  canvas.parentElement?.addEventListener("touchmove", e => {
    const rect = canvas.getBoundingClientRect();
    mx = e.touches[0].clientX - rect.left;
    my = e.touches[0].clientY - rect.top;
  }, { passive: true });

  // ── Resize ──────────────────────────────────────
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(buildGrid, 150);
  });

  buildGrid();
  animate();
})();

// ====================================================
//  MOUSE INTERACTION (Cursor)
// ====================================================
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let glowX  = mouseX, glowY = mouseY;
let dotX   = mouseX, dotY  = mouseY;

// Custom cursor
const cursorGlow = document.createElement("div");
const cursorDot  = document.createElement("div");
cursorGlow.className = "cursor-glow gang-cursor-glow";
cursorDot.className  = "cursor-dot gang-cursor-dot";
document.body.appendChild(cursorGlow);
document.body.appendChild(cursorDot);

window.addEventListener("mousemove", e => {
  mouseX = e.clientX; mouseY = e.clientY;
});

// Cursor expand on interactive targets
document.addEventListener("mouseover", e => {
  if (e.target.closest("a, button")) {
    cursorGlow.style.cssText = "width:48px;height:48px;background:rgba(255,255,255,0.18);border-color:rgba(255,255,255,0.55)";
  }
});
document.addEventListener("mouseout", e => {
  if (e.target.closest("a, button")) {
    cursorGlow.style.cssText = "";
  }
});

// Smooth cursor lerp
function tickCursor() {
  glowX += (mouseX - glowX) * 0.08;
  glowY += (mouseY - glowY) * 0.08;
  dotX  += (mouseX - dotX)  * 0.22;
  dotY  += (mouseY - dotY)  * 0.22;
  cursorGlow.style.left = glowX + "px"; cursorGlow.style.top = glowY + "px";
  cursorDot.style.left  = dotX  + "px"; cursorDot.style.top  = dotY  + "px";
  requestAnimationFrame(tickCursor);
}
tickCursor();
