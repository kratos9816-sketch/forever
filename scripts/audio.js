/**
 * ===================================================================
 *  E T E R N A L   A U D I O  —  R O M A N T I C   S O U N D S C A P E
 * ===================================================================
 * 
 *  Provides an ambient romantic generative piano synthesizer using the
 *  native Web Audio API. Requires ZERO external MP3 downloads or network
 *  dependencies, while fully supporting user-provided custom MP3 files!
 * 
 *  Starts strictly OFF by default as requested.
 * ===================================================================
 */

(function () {
  'use strict';

  let audioCtx = null;
  let isPlaying = false;
  let customAudio = null;
  let synthTimer = null;
  let masterGain = null;

  // Romantic chord progression notes in Hz (Dbmaj9 -> Bbm9 -> Gbmaj9 -> Abadd9)
  // Soft, deeply emotional, cinematic resonance
  const chordProgressions = [
    // Db maj 9 (Db, F, Ab, C, Eb)
    [138.59, 174.61, 207.65, 261.63, 311.13, 523.25],
    // Bb min 9 (Bb, Db, F, Ab, C)
    [116.54, 138.59, 174.61, 207.65, 261.63, 466.16],
    // Gb maj 9 (Gb, Bb, Db, F, Ab)
    [92.50, 116.54, 138.59, 174.61, 207.65, 369.99],
    // Ab add 9 / Ab sus (Ab, C, Eb, Bb)
    [103.83, 130.81, 155.56, 233.08, 311.13, 415.30]
  ];

  let currentChordIdx = 0;
  let noteInChordIdx = 0;

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();

      // Master output gain
      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.35, audioCtx.currentTime);

      // Gentle warm low-pass filter to give a dreamy, soft felt-piano tone
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, audioCtx.currentTime);
      filter.Q.setValueAtTime(0.7, audioCtx.currentTime);

      // Reverb/Delay simulation for lush space
      const delay = audioCtx.createDelay();
      delay.delayTime.setValueAtTime(0.42, audioCtx.currentTime);

      const delayFeedback = audioCtx.createGain();
      delayFeedback.gain.setValueAtTime(0.38, audioCtx.currentTime);

      delay.connect(delayFeedback);
      delayFeedback.connect(delay);
      delayFeedback.connect(filter);

      masterGain.connect(filter);
      masterGain.connect(delay);
      filter.connect(audioCtx.destination);
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Play a single soft warm acoustic/bell note
  function playSynthNote(freq, velocity = 0.4) {
    if (!audioCtx || !isPlaying) return;

    const now = audioCtx.currentTime;

    // Dual oscillator: Warm fundamental sine + gentle soft triangle harmonic
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const noteGain = audioCtx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 1.002, now); // Slight detune for warmth

    // Attack, Decay, Sustain, Release envelope (soft felt piano)
    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.linearRampToValueAtTime(velocity * 0.28, now + 0.08); // Soft attack
    noteGain.gain.exponentialRampToValueAtTime(velocity * 0.12, now + 0.8);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2); // Lush release

    osc1.connect(noteGain);
    osc2.connect(noteGain);
    noteGain.connect(masterGain);

    osc1.start(now);
    osc2.start(now);

    osc1.stop(now + 3.3);
    osc2.stop(now + 3.3);
  }

  // Romantic arpeggio sequence loop
  function tickSynthSequence() {
    if (!isPlaying) return;

    const chord = chordProgressions[currentChordIdx];
    const freq = chord[noteInChordIdx % chord.length];

    // Add gentle root bass note occasionally
    if (noteInChordIdx === 0) {
      playSynthNote(chord[0] / 2, 0.45);
    }

    // Play melodic chord note with gentle velocity dynamics
    const vel = 0.25 + Math.random() * 0.2;
    playSynthNote(freq, vel);

    noteInChordIdx++;
    let nextDelay = 580 + Math.random() * 80; // Relaxed romantic timing

    if (noteInChordIdx >= chord.length) {
      noteInChordIdx = 0;
      currentChordIdx = (currentChordIdx + 1) % chordProgressions.length;
      nextDelay = 950; // Pause softly between chord movements
    }

    synthTimer = setTimeout(tickSynthSequence, nextDelay);
  }

  // Start music
  function startMusic() {
    const config = window.CONFIG || {};
    const customUrl = config.music && config.music.customAudioUrl;

    if (customUrl) {
      if (!customAudio) {
        customAudio = new Audio(customUrl);
        customAudio.loop = true;
        customAudio.volume = 0.5;
      }
      customAudio.play().then(() => {
        isPlaying = true;
        updateUI(true);
      }).catch(err => {
        console.warn('Custom audio playback blocked, falling back to Web Audio synth:', err);
        fallbackToSynth();
      });
    } else {
      fallbackToSynth();
    }
  }

  function fallbackToSynth() {
    initAudioContext();
    isPlaying = true;
    updateUI(true);
    tickSynthSequence();
  }

  // Pause music
  function pauseMusic() {
    isPlaying = false;
    if (synthTimer) {
      clearTimeout(synthTimer);
      synthTimer = null;
    }
    if (customAudio) {
      customAudio.pause();
    }
    updateUI(false);
  }

  // Toggle music on/off
  function toggleMusic() {
    if (isPlaying) {
      pauseMusic();
    } else {
      startMusic();
    }
  }

  // Update button and visualizer in DOM
  function updateUI(playing) {
    const audioBtn = document.getElementById('music-toggle-btn');
    const statusText = document.getElementById('music-status-text');
    const visualizer = document.getElementById('music-bars');

    if (audioBtn) {
      audioBtn.setAttribute('aria-pressed', playing ? 'true' : 'false');
      audioBtn.classList.toggle('playing', playing);
      audioBtn.innerHTML = playing ? `
        <svg class="pause-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
        </svg>
      ` : `
        <svg class="play-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z"/>
        </svg>
      `;
    }
    if (statusText) {
      statusText.textContent = playing ? 'Music: Playing' : 'Music: Paused';
    }
    if (visualizer) {
      visualizer.classList.toggle('animating', playing);
    }
  }

  // Global Audio Controller
  window.RomanceAudio = {
    play: startMusic,
    pause: pauseMusic,
    toggle: toggleMusic,
    isPlaying: () => isPlaying
  };

  // Wire up button on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    const audioBtn = document.getElementById('music-toggle-btn');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        window.RomanceAudio.toggle();
      });
    }
  });

})();
