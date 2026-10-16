/**
 * ===================================================================
 *  E T E R N A L   V O W  —  M A I N   A P P L I C A T I O N
 * ===================================================================
 * 
 *  Drives all interactive features:
 *   - Gatekeeper opening sequence & curtain reveal
 *   - Live relationship time counter (days, hours, mins, secs)
 *   - 3D Wax Seal envelope open/close animation
 *   - Secret Heart Locket confession modal
 *   - Random Romantic Message Jar
 *   - 4-7-8 Safe Harbor Breathing circle & virtual hug pulse
 *   - Interactive Forever Promise Seal & Certificate
 *   - Full dynamic configuration population from config.js
 * ===================================================================
 */

(function () {
  'use strict';

  const config = window.CONFIG || {};

  // Wait for DOM
  document.addEventListener('DOMContentLoaded', () => {
    populateContent();
    setupGatekeeper();
    startAnniversaryTimer();
    setupEnvelope();
    setupSecretLocket();
    setupMessageJar();
    setupBreathingCircle();
    setupVirtualHug();
    setupForeverPromise();
    setupPillarCards();
    setupReasonCards();
    setupModalHandlers();
    setupClickRipples();
  });

  // --- 1. Populate Dynamic Content from config.js ---
  function populateContent() {
    // Replace her name across text placeholders
    document.querySelectorAll('.js-her-name').forEach(el => {
      el.textContent = config.herName || 'My Love';
    });
    document.querySelectorAll('.js-her-nickname').forEach(el => {
      el.textContent = config.herNickname || 'Baby';
    });
    document.querySelectorAll('.js-his-name').forEach(el => {
      el.textContent = config.hisName || 'Forever Yours';
    });
    document.querySelectorAll('.js-couples-tagline').forEach(el => {
      el.textContent = config.couplesTagline || "Whatever happens, it's always going to be YOU and ME.";
    });

    // Opening screen
    const gateQuote = document.getElementById('gatekeeper-quote');
    if (gateQuote && config.openingScreen) {
      gateQuote.textContent = config.openingScreen.mainQuote;
    }
    const gateBtn = document.getElementById('gatekeeper-btn');
    if (gateBtn && config.openingScreen) {
      gateBtn.querySelector('.btn-text').textContent = config.openingScreen.buttonText;
    }

    // Love letter paragraphs
    const letterContainer = document.getElementById('love-letter-body');
    if (letterContainer && config.loveLetter && config.loveLetter.paragraphs) {
      letterContainer.innerHTML = '';
      config.loveLetter.paragraphs.forEach(pText => {
        const p = document.createElement('p');
        p.className = 'letter-paragraph';
        p.textContent = pText;
        letterContainer.appendChild(p);
      });
    }

    // Four Pillars
    const pillarsContainer = document.getElementById('pillars-grid');
    if (pillarsContainer && config.fourPillars) {
      pillarsContainer.innerHTML = '';
      config.fourPillars.forEach((pillar, idx) => {
        const card = document.createElement('div');
        card.className = 'pillar-card glass-panel';
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'article');
        card.innerHTML = `
          <div class="pillar-header">
            <span class="pillar-num">${pillar.number}</span>
            <span class="pillar-badge">${pillar.badge}</span>
          </div>
          <h3 class="pillar-title">${pillar.title}</h3>
          <p class="pillar-subtitle">${pillar.subtitle}</p>
          <div class="pillar-body">
            <p>${pillar.description}</p>
          </div>
          <div class="pillar-vow">
            <span>${pillar.vow}</span>
          </div>
          <div class="card-glow-overlay"></div>
        `;
        pillarsContainer.appendChild(card);
      });
    }

    // Ten Reasons
    const reasonsContainer = document.getElementById('reasons-grid');
    if (reasonsContainer && config.tenReasons) {
      reasonsContainer.innerHTML = '';
      config.tenReasons.forEach((reason) => {
        const card = document.createElement('div');
        card.className = 'reason-card glass-panel';
        card.setAttribute('tabindex', '0');
        card.innerHTML = `
          <div class="reason-top">
            <span class="reason-badge">#${reason.number}</span>
            <span class="reason-sparkle">✦</span>
          </div>
          <h4 class="reason-title">${reason.title}</h4>
          <p class="reason-short">${reason.short}</p>
          <div class="reason-expand-content">
            <p>${reason.detail}</p>
          </div>
          <button class="reason-toggle-btn" aria-label="Read deeper detail for reason ${reason.number}">
            <span class="btn-read-more">Read Why</span>
            <svg class="chevron-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
          </button>
        `;
        reasonsContainer.appendChild(card);
      });
    }

    // Safe Harbor Rules
    const rulesContainer = document.getElementById('fight-rules-grid');
    if (rulesContainer && config.whenWeFight && config.whenWeFight.rules) {
      rulesContainer.innerHTML = '';
      config.whenWeFight.rules.forEach(rule => {
        const item = document.createElement('div');
        item.className = 'fight-rule-item glass-panel';
        item.innerHTML = `
          <div class="fight-rule-icon">${rule.icon}</div>
          <div class="fight-rule-info">
            <h5>${rule.heading}</h5>
            <p>${rule.text}</p>
          </div>
        `;
        rulesContainer.appendChild(item);
      });
    }

    // Cherished Moments / Memories
    const memoriesContainer = document.getElementById('memories-grid');
    if (memoriesContainer && config.memories) {
      memoriesContainer.innerHTML = '';
      config.memories.forEach(mem => {
        const item = document.createElement('div');
        item.className = 'polaroid-card';
        item.innerHTML = `
          <div class="polaroid-tape"></div>
          <div class="polaroid-img-wrapper">
            <img class="polaroid-img" src="${mem.imageUrl}" alt="${mem.title}" loading="lazy">
          </div>
          <div class="polaroid-caption-box">
            <span class="polaroid-date">${mem.date}</span>
            <h4 class="polaroid-title">${mem.title}</h4>
            <p class="polaroid-text">“${mem.caption}”</p>
          </div>
        `;
        memoriesContainer.appendChild(item);
      });
    }

    // Envelope Letter Content
    const envBody = document.getElementById('envelope-letter-text');
    if (envBody && config.interactive && config.interactive.envelopeNote) {
      envBody.textContent = config.interactive.envelopeNote.content;
    }

    // Secret Locket Modal text
    const locketText = document.getElementById('secret-locket-text');
    if (locketText && config.interactive && config.interactive.secretLocket) {
      locketText.textContent = config.interactive.secretLocket.message;
    }
  }

  // --- 2. Gatekeeper Opening Sequence ---
  function setupGatekeeper() {
    const gatekeeper = document.getElementById('gatekeeper-screen');
    const openBtn = document.getElementById('gatekeeper-btn');
    const mainContent = document.getElementById('main-journey');

    if (!gatekeeper || !openBtn) return;

    document.body.classList.add('gatekeeper-active');

    openBtn.addEventListener('click', (e) => {
      const rect = openBtn.getBoundingClientRect();
      const clickX = rect.left + rect.width / 2;
      const clickY = rect.top + rect.height / 2;

      // Burst of petals & hearts
      if (window.createPetalBurst) window.createPetalBurst(clickX, clickY, 35);
      if (window.createHeartBurst) window.createHeartBurst(clickX, clickY, 20);

      // Animation out
      gatekeeper.classList.add('curtain-open');
      openBtn.disabled = true;
      document.body.classList.remove('gatekeeper-active');

      setTimeout(() => {
        gatekeeper.style.display = 'none';
        if (mainContent) {
          mainContent.classList.remove('content-hidden');
          mainContent.setAttribute('aria-hidden', 'false');
          // Smooth scroll to hero
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 1000);
    });
  }

  // --- 3. Live Anniversary Time Counter ---
  function startAnniversaryTimer() {
    const daysEl = document.getElementById('timer-days');
    const hoursEl = document.getElementById('timer-hours');
    const minsEl = document.getElementById('timer-mins');
    const secsEl = document.getElementById('timer-secs');
    const subtitleEl = document.getElementById('timer-date-display');

    const startDate = new Date(config.anniversaryDate || '2023-10-16T00:00:00');

    if (subtitleEl) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      subtitleEl.textContent = `Counting every blessed second since ${startDate.toLocaleDateString(undefined, options)}`;
    }

    function update() {
      const now = new Date();
      let diff = Math.max(0, now - startDate);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      diff -= days * (1000 * 60 * 60 * 24);

      const hours = Math.floor(diff / (1000 * 60 * 60));
      diff -= hours * (1000 * 60 * 60);

      const mins = Math.floor(diff / (1000 * 60));
      diff -= mins * (1000 * 60);

      const secs = Math.floor(diff / 1000);

      if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
      if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
      if (minsEl) minsEl.textContent = String(mins).padStart(2, '0');
      if (secsEl) secsEl.textContent = String(secs).padStart(2, '0');
    }

    update();
    setInterval(update, 1000);
  }

  // --- 4. Interactive 3D Envelope ---
  function setupEnvelope() {
    const envelope = document.getElementById('romantic-envelope');
    const waxSeal = document.getElementById('envelope-wax-seal');
    const closeBtn = document.getElementById('envelope-close-btn');

    if (!envelope || !waxSeal) return;

    function openEnvelope() {
      if (!envelope.classList.contains('is-open')) {
        const rect = waxSeal.getBoundingClientRect();
        if (window.createHeartBurst) {
          window.createHeartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 16);
        }
        envelope.classList.add('is-open');
        envelope.setAttribute('aria-expanded', 'true');
      }
    }

    function closeEnvelope(e) {
      if (e) e.stopPropagation();
      envelope.classList.remove('is-open');
      envelope.setAttribute('aria-expanded', 'false');
    }

    waxSeal.addEventListener('click', openEnvelope);
    waxSeal.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openEnvelope();
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeEnvelope);
    }
  }

  // --- 5. Secret Heart Locket ---
  function setupSecretLocket() {
    const lockets = document.querySelectorAll('.js-locket-trigger');
    const modal = document.getElementById('secret-locket-modal');

    lockets.forEach(locket => {
      locket.addEventListener('click', (e) => {
        const rect = locket.getBoundingClientRect();
        if (window.createHeartBurst) {
          window.createHeartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 22);
        }
        openModal(modal);
      });
    });
  }

  // --- 6. Romantic Message Jar ("Pull a Love Note") ---
  function setupMessageJar() {
    const jar = document.getElementById('message-jar');
    const modal = document.getElementById('jar-note-modal');
    const noteTextEl = document.getElementById('jar-note-display');
    const pullAnotherBtn = document.getElementById('pull-another-note-btn');

    if (!jar || !modal) return;

    const notes = (config.interactive && config.interactive.jarNotes) || [
      "You make my heart smile in ways nobody else can.",
      "Every single love song finally makes sense with you.",
      "Whatever happens, I will always hold your hand."
    ];

    let lastIdx = -1;

    function drawRandomNote() {
      let idx;
      do {
        idx = Math.floor(Math.random() * notes.length);
      } while (notes.length > 1 && idx === lastIdx);
      lastIdx = idx;

      if (noteTextEl) {
        noteTextEl.style.opacity = '0';
        noteTextEl.textContent = notes[idx];
        setTimeout(() => {
          noteTextEl.style.opacity = '1';
        }, 150);
      }

      const rect = jar.getBoundingClientRect();
      if (window.createHeartBurst) {
        window.createHeartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 20);
      }

      openModal(modal);
    }

    jar.addEventListener('click', drawRandomNote);
    jar.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        drawRandomNote();
      }
    });

    if (pullAnotherBtn) {
      pullAnotherBtn.addEventListener('click', () => {
        drawRandomNote();
      });
    }
  }

  // --- 7. Breathing Circle & Safe Harbor Grounding ---
  function setupBreathingCircle() {
    const circle = document.getElementById('breathing-ring');
    const textEl = document.getElementById('breathing-instruction');

    if (!circle || !textEl) return;

    const phases = [
      { text: "Breathe in gently...", duration: 4000, state: 'inhale' },
      { text: "Hold... you are safe...", duration: 4000, state: 'hold' },
      { text: "Exhale softly... release...", duration: 4000, state: 'exhale' }
    ];

    let currentPhase = 0;

    function runBreathingStep() {
      const phase = phases[currentPhase];
      textEl.textContent = phase.text;

      circle.classList.remove('inhale', 'hold', 'exhale');
      circle.classList.add(phase.state);

      currentPhase = (currentPhase + 1) % phases.length;
      setTimeout(runBreathingStep, phase.duration);
    }

    runBreathingStep();
  }

  // --- 8. Virtual Hug Shower ---
  function setupVirtualHug() {
    const hugBtn = document.getElementById('virtual-hug-btn');
    const toast = document.getElementById('hug-toast');

    if (!hugBtn) return;

    hugBtn.addEventListener('click', (e) => {
      const rect = hugBtn.getBoundingClientRect();
      if (window.createHeartBurst) {
        window.createHeartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 35);
      }

      // Shower of hearts across viewport
      for (let i = 0; i < 4; i++) {
        setTimeout(() => {
          if (window.createHeartBurst) {
            window.createHeartBurst(
              Math.random() * window.innerWidth,
              Math.random() * (window.innerHeight * 0.8),
              12
            );
          }
        }, i * 200);
      }

      if (toast) {
        toast.classList.add('visible');
        setTimeout(() => {
          toast.classList.remove('visible');
        }, 3600);
      }
    });
  }

  // --- 9. Forever Promise Seal & Certificate ---
  function setupForeverPromise() {
    const sealBtn = document.getElementById('seal-promise-btn');
    const modal = document.getElementById('promise-cert-modal');

    if (!sealBtn || !modal) return;

    sealBtn.addEventListener('click', (e) => {
      const rect = sealBtn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      sealBtn.classList.add('sealed');

      if (window.createPetalBurst) window.createPetalBurst(cx, cy, 30);
      if (window.createHeartBurst) window.createHeartBurst(cx, cy, 30);

      setTimeout(() => {
        openModal(modal);
      }, 700);
    });
  }

  // --- 10. Pillar Cards Interaction ---
  function setupPillarCards() {
    const cards = document.querySelectorAll('.pillar-card');
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        const rect = card.getBoundingClientRect();
        if (window.createHeartBurst && Math.random() > 0.5) {
          window.createHeartBurst(rect.left + rect.width - 40, rect.top + 30, 4);
        }
      });
    });
  }

  // --- 11. Ten Reason Cards Interaction ---
  function setupReasonCards() {
    function toggleCard(card) {
      if (!card) return;
      const isExpanded = card.classList.contains('expanded');
      card.classList.toggle('expanded', !isExpanded);

      const btnText = card.querySelector('.btn-read-more');
      if (btnText) {
        btnText.textContent = isExpanded ? 'Read Why' : 'Show Less';
      }

      if (!isExpanded) {
        const rect = card.getBoundingClientRect();
        if (window.createHeartBurst) {
          window.createHeartBurst(rect.left + rect.width / 2, rect.top + 50, 8);
        }
      }
    }

    document.addEventListener('click', (e) => {
      const toggleBtn = e.target.closest('.reason-toggle-btn');
      const card = e.target.closest('.reason-card');

      if (toggleBtn || card) {
        const targetCard = card || toggleBtn.closest('.reason-card');
        toggleCard(targetCard);
      }
    });

    document.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && e.target.classList.contains('reason-card')) {
        e.preventDefault();
        toggleCard(e.target);
      }
    });
  }

  // --- 12. Modal Utility Helpers ---
  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    const focusable = modal.querySelector('button, [tabindex="0"]');
    if (focusable) focusable.focus();
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

  function setupModalHandlers() {
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      // Backdrop click closes
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          closeModal(overlay);
        }
      });

      // Close buttons
      const closeBtns = overlay.querySelectorAll('.modal-close-btn');
      closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          closeModal(overlay);
        });
      });
    });

    // ESC key closes any open modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal-overlay.active');
        if (activeModal) closeModal(activeModal);

        const openEnvelope = document.querySelector('.romantic-envelope.is-open');
        if (openEnvelope) openEnvelope.classList.remove('is-open');
      }
    });
  }

  // --- 13. Screen Click Ripples ---
  function setupClickRipples() {
    document.addEventListener('click', (e) => {
      // Ignore clicks on buttons/inputs to avoid cluttering UI interactions
      if (e.target.closest('button, a, input, textarea, .modal-content, .wax-seal')) return;

      if (window.createHeartBurst) {
        window.createHeartBurst(e.clientX, e.clientY, 5);
      }
    });
  }

})();
