/**
 * ===================================================================
 *  E T E R N A L   C A N V A S  —  P E T A L S & S T A R D U S T
 * ===================================================================
 * 
 *  High-performance ambient particle engine for falling rose petals,
 *  twinkling stardust, floating bokeh hearts, and interactive touch trails.
 *  Fully supports prefers-reduced-motion and tab visibility pause.
 * ===================================================================
 */

(function () {
  'use strict';

  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height, dpr;
  let isRunning = true;
  let animationFrameId = null;

  // Accessibility check for reduced motion
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let prefersReducedMotion = reducedMotionQuery.matches;
  reducedMotionQuery.addEventListener('change', (e) => {
    prefersReducedMotion = e.matches;
  });

  // Particle Pools
  const petals = [];
  const stars = [];
  const interactiveParticles = [];
  const maxPetals = prefersReducedMotion ? 0 : 35;
  const maxStars = prefersReducedMotion ? 40 : 90;

  // Resize handler with HiDPI support
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);

    // Re-initialize stars when resized
    initStars();
  }

  // --- Twinkling Stars ---
  function initStars() {
    stars.length = 0;
    const count = prefersReducedMotion ? 30 : Math.floor((width * height) / 14000);
    for (let i = 0; i < Math.min(count, maxStars); i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.4 + 0.3,
        alpha: Math.random() * 0.7 + 0.2,
        twinkleSpeed: (Math.random() * 0.02 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
        hue: Math.random() > 0.6 ? 340 : 40 // Rose pink to gold/champagne
      });
    }
  }

  // --- Realistic Rose Petal Class ---
  class Petal {
    constructor(isBurst = false, burstX = width / 2, burstY = height / 2) {
      this.reset(isBurst, burstX, burstY);
    }

    reset(isBurst = false, burstX = width / 2, burstY = height / 2) {
      this.isBurst = isBurst;
      if (isBurst) {
        this.x = burstX;
        this.y = burstY;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 7 + 3;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed - 2;
        this.gravity = 0.12;
      } else {
        this.x = Math.random() * width;
        this.y = Math.random() * -60 - 20;
        this.vx = (Math.random() - 0.5) * 1.2;
        this.vy = Math.random() * 1.2 + 0.8;
        this.gravity = 0;
      }

      this.size = Math.random() * 14 + 10; // 10 to 24px
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.035;
      this.flip = Math.random() * Math.PI;
      this.flipSpeed = Math.random() * 0.03 + 0.015;
      this.sway = Math.random() * Math.PI * 2;
      this.swaySpeed = Math.random() * 0.02 + 0.01;
      this.swayAmp = Math.random() * 1.5 + 0.5;

      // Color variation: velvet deep red, burgundy to blush rose
      const shades = [
        { r: 180, g: 30, b: 65, a: 0.85 },   // Rich crimson
        { r: 130, g: 15, b: 45, a: 0.9 },    // Deep burgundy
        { r: 215, g: 75, b: 110, a: 0.8 },   // Rose blush
        { r: 160, g: 25, b: 55, a: 0.85 }    // Wine velvet
      ];
      this.color = shades[Math.floor(Math.random() * shades.length)];
      this.life = isBurst ? 1.0 : 999;
      this.decay = isBurst ? Math.random() * 0.012 + 0.008 : 0;
    }

    update() {
      if (this.isBurst) {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.vx *= 0.98;
        this.life -= this.decay;
        this.rotation += this.rotSpeed * 2;
        this.flip += this.flipSpeed * 2;
        return this.life > 0;
      }

      this.sway += this.swaySpeed;
      this.x += Math.sin(this.sway) * this.swayAmp + this.vx;
      this.y += this.vy;
      this.rotation += this.rotSpeed;
      this.flip += this.flipSpeed;

      // Wrap around edges
      if (this.y > height + 40 || this.x < -40 || this.x > width + 40) {
        this.reset(false);
      }
      return true;
    }

    draw(context) {
      context.save();
      context.translate(this.x, this.y);
      context.rotate(this.rotation);
      context.scale(Math.cos(this.flip), 1);

      const alpha = this.isBurst ? this.life * this.color.a : this.color.a;

      // Create organic curved petal shape
      context.beginPath();
      context.moveTo(0, -this.size * 0.6);
      context.bezierCurveTo(
        this.size * 0.6, -this.size * 0.6,
        this.size * 0.7, this.size * 0.5,
        0, this.size * 0.7
      );
      context.bezierCurveTo(
        -this.size * 0.7, this.size * 0.5,
        -this.size * 0.6, -this.size * 0.6,
        0, -this.size * 0.6
      );
      context.closePath();

      // Velvet gradient shading
      const grad = context.createLinearGradient(0, -this.size * 0.6, 0, this.size * 0.7);
      grad.addColorStop(0, `rgba(${this.color.r + 25}, ${this.color.g + 20}, ${this.color.b + 20}, ${alpha})`);
      grad.addColorStop(1, `rgba(${this.color.r - 20}, ${this.color.g - 10}, ${this.color.b - 10}, ${alpha * 0.9})`);

      context.fillStyle = grad;
      context.shadowColor = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alpha * 0.4})`;
      context.shadowBlur = 6;
      context.fill();

      // Subtle center vein
      context.beginPath();
      context.moveTo(0, -this.size * 0.45);
      context.quadraticCurveTo(this.size * 0.1, 0, 0, this.size * 0.5);
      context.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.15})`;
      context.lineWidth = 1;
      context.stroke();

      context.restore();
    }
  }

  // --- Interactive Floating Hearts & Sparks on Mouse/Touch ---
  class InteractiveParticle {
    constructor(x, y, type = 'spark') {
      this.x = x;
      this.y = y;
      this.type = type; // 'spark' or 'heart'
      this.size = type === 'heart' ? Math.random() * 12 + 8 : Math.random() * 3 + 1.5;
      this.alpha = 1.0;
      this.decay = Math.random() * 0.025 + 0.015;
      this.vx = (Math.random() - 0.5) * 2;
      this.vy = type === 'heart' ? -Math.random() * 2 - 1 : (Math.random() - 0.5) * 2;
      this.rotation = (Math.random() - 0.5) * 0.4;
      this.hue = Math.random() > 0.4 ? '340, 85%, 65%' : '45, 90%, 75%'; // Pink or Gold
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= this.decay;
      if (this.type === 'heart') {
        this.vy *= 0.98;
        this.size *= 0.99;
      }
      return this.alpha > 0;
    }

    draw(context) {
      context.save();
      context.translate(this.x, this.y);
      context.globalAlpha = Math.max(this.alpha, 0);

      if (this.type === 'heart') {
        context.rotate(this.rotation);
        context.fillStyle = `hsla(${this.hue}, ${this.alpha})`;
        context.shadowColor = `hsla(${this.hue}, 0.6)`;
        context.shadowBlur = 8;
        drawHeartPath(context, 0, 0, this.size);
        context.fill();
      } else {
        context.beginPath();
        context.arc(0, 0, this.size, 0, Math.PI * 2);
        context.fillStyle = `hsla(${this.hue}, ${this.alpha})`;
        context.shadowColor = `hsla(${this.hue}, 0.8)`;
        context.shadowBlur = 10;
        context.fill();
      }

      context.restore();
    }
  }

  function drawHeartPath(ctx, x, y, size) {
    const s = size / 16;
    ctx.beginPath();
    ctx.moveTo(x, y + s * 4);
    ctx.bezierCurveTo(x, y, x - s * 8, y, x - s * 8, y + s * 6);
    ctx.bezierCurveTo(x - s * 8, y + s * 11, x, y + s * 14, x, y + s * 16);
    ctx.bezierCurveTo(x, y + s * 14, x + s * 8, y + s * 11, x + s * 8, y + s * 6);
    ctx.bezierCurveTo(x + s * 8, y, x, y, x, y + s * 4);
    ctx.closePath();
  }

  // Initialize petals
  function initPetals() {
    petals.length = 0;
    if (prefersReducedMotion) return;
    for (let i = 0; i < maxPetals; i++) {
      const p = new Petal();
      p.y = Math.random() * height; // Spread initially
      petals.push(p);
    }
  }

  // --- Animation Loop ---
  function loop() {
    if (!isRunning) return;

    ctx.clearRect(0, 0, width, height);

    // 1. Draw Twinkling Stars
    for (let i = 0; i < stars.length; i++) {
      const star = stars[i];
      if (!prefersReducedMotion) {
        star.alpha += star.twinkleSpeed;
        if (star.alpha > 0.95 || star.alpha < 0.15) {
          star.twinkleSpeed = -star.twinkleSpeed;
        }
      }

      ctx.save();
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${star.hue}, 80%, 75%, ${star.alpha})`;
      ctx.shadowColor = `hsla(${star.hue}, 90%, 70%, ${star.alpha * 0.8})`;
      ctx.shadowBlur = star.radius * 4;
      ctx.fill();
      ctx.restore();
    }

    // 2. Draw & Update Petals
    if (!prefersReducedMotion) {
      for (let i = petals.length - 1; i >= 0; i--) {
        const petal = petals[i];
        const alive = petal.update();
        if (alive) {
          petal.draw(ctx);
        } else {
          petals.splice(i, 1);
        }
      }
    }

    // 3. Draw & Update Interactive Particles
    for (let i = interactiveParticles.length - 1; i >= 0; i--) {
      const p = interactiveParticles[i];
      if (p.update()) {
        p.draw(ctx);
      } else {
        interactiveParticles.splice(i, 1);
      }
    }

    animationFrameId = requestAnimationFrame(loop);
  }

  // --- Global Burst Functions ---
  window.createPetalBurst = function (x, y, count = 25) {
    if (prefersReducedMotion) return;
    const originX = x !== undefined ? x : width / 2;
    const originY = y !== undefined ? y : height / 2;
    for (let i = 0; i < count; i++) {
      petals.push(new Petal(true, originX, originY));
    }
  };

  window.createHeartBurst = function (x, y, count = 18) {
    const originX = x !== undefined ? x : width / 2;
    const originY = y !== undefined ? y : height / 2;
    for (let i = 0; i < count; i++) {
      interactiveParticles.push(new InteractiveParticle(originX, originY, 'heart'));
    }
  };

  // --- Pointer & Touch Interactivity ---
  let lastSpawnTime = 0;
  function handlePointerMove(e) {
    const now = performance.now();
    if (now - lastSpawnTime < 45) return; // Throttle to 22fps for sparkles
    lastSpawnTime = now;

    const x = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : null);
    const y = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : null);
    if (x === null || y === null) return;

    if (interactiveParticles.length < 50) {
      interactiveParticles.push(new InteractiveParticle(x, y, Math.random() > 0.7 ? 'heart' : 'spark'));
    }
  }

  window.addEventListener('mousemove', handlePointerMove, { passive: true });
  window.addEventListener('touchmove', handlePointerMove, { passive: true });

  // Page Visibility handling (save battery/CPU when tab is not active)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isRunning = false;
      cancelAnimationFrame(animationFrameId);
    } else {
      isRunning = true;
      lastSpawnTime = performance.now();
      loop();
    }
  });

  // Setup
  window.addEventListener('resize', () => {
    resize();
    initPetals();
  });

  // Initialization
  resize();
  initPetals();
  loop();

})();
