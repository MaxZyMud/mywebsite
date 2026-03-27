import os
import re

# 1. index.html
index_content = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Bxrrett | LYFESTYLE</title>
  <meta name="description" content="Bxrrett - Welcome to Family" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="style.css" />
</head>
<body class="gang-landing-body">
  <!-- Dynamic Dot Grid Background -->
  <canvas id="grid-canvas"></canvas>

  <div class="gang-landing-content">
    <div class="gang-welcome reveal-fade" style="--d: 0.2s">WELCOME TO FAMILY</div>
    <h1 class="gang-title reveal-fade" style="--d: 0.5s">LYFESTYLE</h1>
    <a href="members.html" class="gang-btn reveal-fade" style="--d: 0.8s">CLICK</a>
  </div>

  <script src="script.js"></script>
</body>
</html>"""

with open(r'c:\Users\Administrator\Desktop\Project\index.html', 'w', encoding='utf-8') as f:
    f.write(index_content)


# 2. members.html
with open(r'c:\Users\Administrator\Desktop\Project\members.html', 'r', encoding='utf-8') as f:
    members_content = f.read()

# remove from <style> to </style>
members_content = re.sub(r'<style>[\s\S]*?</style>', '', members_content)

# remove the fb login bar
members_content = re.sub(r'<!-- ===== FACEBOOK LOGIN BAR ===== -->[\s\S]*?</div>\n', '', members_content)

# remove facebook sdk
members_content = re.sub(r'<!-- ===== FACEBOOK SDK ===== -->[\s\S]*?</script>', '', members_content)

# remove the string has-fb-bar
members_content = members_content.replace('has-fb-bar', '')

with open(r'c:\Users\Administrator\Desktop\Project\members.html', 'w', encoding='utf-8') as f:
    f.write(members_content)


# 3. members.js
with open(r'c:\Users\Administrator\Desktop\Project\members.js', 'r', encoding='utf-8') as f:
    members_js_content = f.read()

# remove the fb injection
members_js_content = re.sub(r'// Re-inject FB photo whenever grid re-renders[\s\S]*?};', '', members_js_content)

with open(r'c:\Users\Administrator\Desktop\Project\members.js', 'w', encoding='utf-8') as f:
    f.write(members_js_content)


# 4. style.css
gang_styles = """
/* ===== GANG LANDING PAGE ===== */
.gang-landing-body {
  margin: 0; padding: 0; overflow: hidden;
  background: #000;
  color: #fff;
  font-family: 'Inter', sans-serif;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

#grid-canvas {
  position: absolute; inset: 0; width: 100%; height: 100%;
  pointer-events: none; z-index: 0;
}

.gang-landing-content {
  position: relative; z-index: 1;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.gang-welcome {
  font-size: 14px;
  letter-spacing: 6px;
  color: #a0a0a0;
  text-transform: uppercase;
  margin-bottom: 20px;
  font-weight: 500;
}

.gang-title {
  font-size: clamp(50px, 8vw, 100px);
  font-weight: 900;
  letter-spacing: 8px;
  margin-bottom: 50px;
  color: #fff;
  text-shadow: 0 0 40px rgba(255, 255, 255, 0.4);
  line-height: 1;
}

.gang-btn {
  display: inline-block;
  padding: 13px 36px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: transparent;
  color: #fff;
  text-decoration: none;
  font-size: 13px;
  letter-spacing: 4px;
  font-weight: 600;
  text-transform: uppercase;
  transition: all 0.3s ease;
  cursor: pointer;
}

.gang-btn:hover {
  background: #fff;
  color: #000;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

.reveal-fade {
  opacity: 0;
  transform: translateY(20px);
  animation: revealFadeAnim 1s ease-out forwards;
  animation-delay: var(--d, 0s);
}

@keyframes revealFadeAnim {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.gang-cursor-glow {
  background: rgba(255, 255, 255, 0.08) !important;
  border-color: rgba(255, 255, 255, 0.2) !important;
}
.gang-cursor-dot {
  background: #fff !important;
}

/* Adjust members page just in case */
.members-page { padding-top: calc(var(--nav-h) + 40px); }
"""

with open(r'c:\Users\Administrator\Desktop\Project\style.css', 'a', encoding='utf-8') as f:
    f.write(gang_styles)


# 5. script.js
script_content = """// ====================================================
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
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
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
"""

with open(r'c:\Users\Administrator\Desktop\Project\script.js', 'w', encoding='utf-8') as f:
    f.write(script_content)

print("Formatting successful!")
