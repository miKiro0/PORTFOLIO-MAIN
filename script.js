// ── CANVAS ART ──────────────────────────────────────────────

function drawParticleNet(canvas, seed, palette) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.fillStyle = '#0d0d12';
  ctx.fillRect(0, 0, W, H);
  const rng = sfc32(seed, seed ^ 0xdeadbeef, seed ^ 0xcafebabe, 1);
  const pts = Array.from({length: 18}, () => ({
    x: rng() * W, y: rng() * H,
    vx: (rng()-0.5)*0.6, vy: (rng()-0.5)*0.6
  }));
  let frame = 0;
  let rafId;
  function draw() {
    ctx.fillStyle = 'rgba(13,13,18,0.18)';
    ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < pts.length; i++) {
      pts[i].x += pts[i].vx; pts[i].y += pts[i].vy;
      if (pts[i].x < 0 || pts[i].x > W) pts[i].vx *= -1;
      if (pts[i].y < 0 || pts[i].y > H) pts[i].vy *= -1;
      for (let j = i+1; j < pts.length; j++) {
        const dx = pts[j].x - pts[i].x, dy = pts[j].y - pts[i].y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d < 100) {
          ctx.beginPath();
          ctx.strokeStyle = palette[0] + Math.round((1 - d/100) * 180).toString(16).padStart(2,'0');
          ctx.lineWidth = 0.8;
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.stroke();
        }
      }
      ctx.beginPath();
      ctx.arc(pts[i].x, pts[i].y, 2, 0, Math.PI*2);
      ctx.fillStyle = palette[1];
      ctx.fill();
    }
    if (frame++ < 300) rafId = requestAnimationFrame(draw);
  }
  draw();
  return () => cancelAnimationFrame(rafId);
}

function drawGlitch(canvas, seed, color) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, W, H);
  const rng = sfc32(seed, 0x12345, 0xabcde, 9);
  let t = 0;
  let rafId;
  function draw() {
    ctx.fillStyle = 'rgba(17,17,17,0.3)';
    ctx.fillRect(0, 0, W, H);
    ctx.font = `bold ${14 + Math.sin(t)*3}px 'DM Mono', monospace`;
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.9;
    const words = ['Vibe', 'Code', 'Art', 'Loop', 'Glitch', 'Data'];
    for (let i = 0; i < 5; i++) {
      const word = words[Math.floor(rng()*words.length)];
      const x = (rng()*W*0.8)|0, y = ((rng()*H*0.8)+20)|0;
      ctx.fillStyle = `hsl(${(t*2 + i*40) % 360}, 80%, 65%)`;
      ctx.globalAlpha = 0.1 + rng()*0.3;
      ctx.fillText(word, x, y);
    }
    ctx.globalAlpha = 1;
    // scanlines
    for (let y = 0; y < H; y += 4) {
      ctx.fillStyle = 'rgba(0,0,0,0.12)';
      ctx.fillRect(0, y, W, 1);
    }
    t += 0.06;
    if (t < 50) rafId = requestAnimationFrame(draw);
  }
  draw();
  return () => cancelAnimationFrame(rafId);
}

function drawOrbs(canvas, seed, c1, c2) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.fillStyle = '#0a0a10';
  ctx.fillRect(0, 0, W, H);
  let t = 0;
  let rafId;
  function draw() {
    ctx.fillStyle = 'rgba(10,10,16,0.15)';
    ctx.fillRect(0, 0, W, H);
    const x1 = W/2 + Math.cos(t*0.7)*W*0.25, y1 = H/2 + Math.sin(t*0.5)*H*0.3;
    const x2 = W/2 + Math.cos(t*0.4+2)*W*0.2, y2 = H/2 + Math.sin(t*0.6+1)*H*0.25;
    const g1 = ctx.createRadialGradient(x1, y1, 0, x1, y1, 80);
    g1.addColorStop(0, c1); g1.addColorStop(1, 'transparent');
    ctx.beginPath(); ctx.arc(x1, y1, 80, 0, Math.PI*2);
    ctx.fillStyle = g1; ctx.fill();
    const g2 = ctx.createRadialGradient(x2, y2, 0, x2, y2, 70);
    g2.addColorStop(0, c2); g2.addColorStop(1, 'transparent');
    ctx.beginPath(); ctx.arc(x2, y2, 70, 0, Math.PI*2);
    ctx.fillStyle = g2; ctx.fill();
    t += 0.025;
    if (t < 40) rafId = requestAnimationFrame(draw);
  }
  draw();
  return () => cancelAnimationFrame(rafId);
}

function drawSymbols(canvas) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.fillStyle = '#0d0f14';
  ctx.fillRect(0, 0, W, H);
  const chars = '✦✧◈◉◊○●□■△▷◀▼⬟⬡⬢⬣⭔';
  let t = 0;
  let rafId;
  const items = Array.from({length: 24}, (_, i) => ({
    char: chars[i % chars.length],
    x: (i % 6) * (W/5.5) + 20,
    y: Math.floor(i/6) * (H/3.5) + 28,
    r: 0, size: 11 + (i%3)*3
  }));
  function draw() {
    ctx.fillStyle = 'rgba(13,15,20,0.25)';
    ctx.fillRect(0, 0, W, H);
    items.forEach((it, i) => {
      ctx.save();
      ctx.translate(it.x, it.y);
      ctx.rotate(it.r);
      const hue = (t * 2 + i * 15) % 360;
      ctx.fillStyle = `hsla(${hue}, 80%, 70%, 0.7)`;
      ctx.font = `${it.size}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(it.char, 0, 0);
      ctx.restore();
      it.r += 0.003 * (i % 2 === 0 ? 1 : -1);
    });
    t += 0.4;
    if (t < 500) rafId = requestAnimationFrame(draw);
  }
  draw();
  return () => cancelAnimationFrame(rafId);
}

// Gallery canvases
function drawGallery(canvas, type) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const types = [
    () => drawGrad(ctx, W, H, '#ff6b6b', '#ffd93d', '#6bcb77'),
    () => drawGrad(ctx, W, H, '#4af0c8', '#7b8cff', '#ff6b9d'),
    () => drawGrad(ctx, W, H, '#c77dff', '#7b2ff7', '#e040fb'),
    () => drawGrad(ctx, W, H, '#ff8c00', '#e040fb', '#ff6b6b'),
    () => drawGrad(ctx, W, H, '#00b4d8', '#0077b6', '#48cae4'),
    () => drawGrad(ctx, W, H, '#d4a5a5', '#c9ada7', '#f4a261'),
  ];
  types[type % types.length]();
}

function drawGrad(ctx, W, H, c1, c2, c3) {
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, c1);
  g.addColorStop(0.5, c2);
  g.addColorStop(1, c3);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  // noise overlay
  for (let i = 0; i < 2000; i++) {
    const x = Math.random()*W, y = Math.random()*H;
    ctx.fillStyle = `rgba(255,255,255,${Math.random()*0.08})`;
    ctx.fillRect(x, y, 1, 1);
  }
  // mesh blobs
  for (let i = 0; i < 4; i++) {
    const bx = Math.random()*W, by = Math.random()*H;
    const gr = ctx.createRadialGradient(bx, by, 0, bx, by, 80+Math.random()*60);
    gr.addColorStop(0, `rgba(255,255,255,0.18)`);
    gr.addColorStop(1, 'transparent');
    ctx.fillStyle = gr;
    ctx.beginPath();
    ctx.arc(bx, by, 140, 0, Math.PI*2);
    ctx.fill();
  }
}

// SFC32 RNG
function sfc32(a, b, c, d) {
  return function() {
    a |= 0; b |= 0; c |= 0; d |= 0;
    let t = (a + b | 0) + d | 0;
    d = d + 1 | 0; a = b ^ b >>> 9;
    b = c + (c << 3) | 0; c = (c << 21 | c >>> 11);
    c = c + t | 0; return (t >>> 0) / 4294967296;
  };
}

// ── LIGHTBOX ─────────────────────────────────────────────
const galleryData = [
  { title: 'Shiro', desc: 'A exercise to test whole body capability as an artist.', tags: ['Digital Art', 'Original Character', '2024'] },
  { title: 'Character Portrait', desc: 'Fluid color studies built from overlapping colors and experimentation of layers.', tags: ['Original Character', 'Color Theory', '2024'] },
  { title: 'Twins', desc: 'Solace in liminal space and inspired by the twins in the shinning.', tags: ['Digital Art', 'Original Character', '2025'] },
  { title: 'Devil', desc: 'High-energy composition of a inate concept of a demon.', tags: ['B&W', 'Original Character', '2025'] },
  { title: 'Solace', desc: 'Comfort in drawing faces and randomness.', tags: ['Original Character', 'Noise', '2023'] },
  { title: 'Mind breaking', desc: 'A clash of idea that makes and symbolize stress and tiredness.', tags: ['Abstract', 'Original Character', '2023'] },
];

function openLightbox(idx) {
  const data = galleryData[idx];
  document.getElementById('lb-title').textContent = data.title;
  document.getElementById('lb-desc').textContent = data.desc;
  const tagsEl = document.getElementById('lb-tags');
  tagsEl.innerHTML = data.tags.map(t => `<span class="tag">${t}</span>`).join('');
  // Copy image src to lightbox img
  const src = document.getElementById('g' + (idx + 1));
  const lbImg = document.getElementById('lb-canvas');
  lbImg.src = src.src;
  lbImg.alt = src.alt;
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox(e) {
  if (e && e.target !== document.getElementById('lightbox') && !e.target.classList.contains('lightbox-close')) return;
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.getElementById('lightbox').classList.remove('open');
    document.body.style.overflow = '';
  }
});

// ── CONTACT FORM ──────────────────────────────────────────
function submitForm() {
  const fname = document.getElementById('cf-fname').value.trim();
  const lname = document.getElementById('cf-lname').value.trim();
  const email = document.getElementById('cf-email').value.trim();
  const subject = document.getElementById('cf-subject').value;
  const message = document.getElementById('cf-message').value.trim();

  // Check required fields
  if (!fname || !lname || !email || !subject || !message) {

    // Highlight empty required fields
    ['cf-fname', 'cf-lname', 'cf-email', 'cf-subject', 'cf-message'].forEach(id => {
      const el = document.getElementById(id);

      // Safely get value
      const value = (el.value || '').trim();

      if (!value) {
        el.style.borderColor = '#ff6b6b';
        el.style.boxShadow = '0 0 0 3px rgba(255,107,107,0.15)';

        // Remove highlight after 2 seconds
        setTimeout(() => {
          el.style.borderColor = '';
          el.style.boxShadow = '';
        }, 2000);
      }
    });

    return;
  }

  document.getElementById('contact-form-body').style.display = 'none';
  document.getElementById('form-success').style.display = 'block';
}

// ── INIT (deferred until DOM is ready) ───────────────────
document.addEventListener('DOMContentLoaded', () => {
  // ── REVEAL ON SCROLL ──────────────────────────────────────
  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(r => io.observe(r));

  // ── SKILL BAR ANIMATION ──────────────────────────────────
  const skillsSection = document.getElementById('skills');
  if (skillsSection) {
    const skillsObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        document.querySelectorAll('.skill-fill').forEach(el => el.classList.add('animate'));
        skillsObserver.disconnect();
      }
    }, { threshold: 0.3 });
    skillsObserver.observe(skillsSection);
  }
});