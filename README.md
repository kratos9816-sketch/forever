# Whatever Happens, It's Always You and Me ❤️

A cinematic, responsive romantic website built with a midnight-purple and burgundy velvet aesthetic, blush rose gold accents, interactive physics, and deeply emotional natural writing.

---

## ✨ Features Included

1. **Magical Gatekeeper Opening Screen**:
   - Celestial starry atmosphere with realistic falling rose petals and floating stardust.
   - Pulsing rose-gold heart emblem with the vow: *“Whatever happens… It's still YOU. It's still US. It's ALWAYS US.”*
   - Interactive **“Open my heart, baby”** button with particle petal burst and smooth curtain reveal.
2. **Deeply Emotional Love Letter**:
   - Styled as an illuminated frosted parchment with vintage wax crest, drop caps, and heartfelt original writing.
3. **The Four Pillars of US**:
   - Interactive glassmorphic cards: *Choosing Each Other*, *Communicating With Grace*, *Growing Together*, and *Staying Strong Through Storms*.
4. **Ten Reasons You Are My Forever**:
   - 10 beautifully sculpted numbered cards with interactive *“Read Why”* expandable reveals and heart sparkles.
5. **Cherished Moments (Polaroid Memory Lane)**:
   - Polaroid-style keepsake frames with rose-gold washi tape, custom romantic artwork, and sweet captions.
6. **Safe Harbor — "When We Fight" (Us vs. The Problem)**:
   - Our emergency sanctuary designed for difficult or vulnerable days.
   - Grounding rule: **“It is NEVER Me vs. You. It is YOU & ME vs. THE PROBLEM.”**
   - **Interactive 4-7-8 Breathing Ring**: Gentle expanding/contracting glowing ring guiding her through soothing breaths.
   - Grounding rules & reassurance cards.
   - **Virtual Warm Hug Button**: Sends an emergency shower of glowing hearts across the screen with a comforting reminder.
7. **Interactive Keepsakes & Surprises**:
   - **3D Interactive Love Envelope**: Realistic folded envelope with a wax seal; clicking the seal breaks it open and slides out an intimate love note.
   - **The Love Note Crystal Jar**: Clicking draws random sweet love notes with sparkling animations.
   - **Secret Heart Locket**: Click the glowing heart in the top corner to unlock a secret confession modal.
8. **Cinematic Ambient Music Controller**:
   - Fixed floating player in the corner.
   - **Starts OFF by default** as requested.
   - Features a built-in generative romantic piano synthesizer via Web Audio API (works 100% offline with zero external downloads), with animated soundwave visualizer.
   - Supports user-specified MP3 files in `config.js`.
9. **The Forever Promise Finale**:
   - Climax quote: *“I LOVE YOU MADLY. I LOVE YOU CRAZILY. I LOVE YOU WITH MY WHOLE HEART. IT'S YOU. IT'S ME. IT'S US. ❤️”*
   - **Live Relationship Counter**: Calculating exact days, hours, minutes, and seconds since your special day.
   - **Interactive “Seal Our Eternal Promise”**: Stamped seal with stardust burst that unlocks a keepsake couple's certificate.
10. **Accessibility & Performance**:
    - Full `prefers-reduced-motion` compliance.
    - Zero external runtime build tools or dependencies needed.
    - Lightning fast loading and fully responsive across mobile, tablet, and desktop screens.

---

## 🎨 How to Personalize (In 2 Minutes)

All customizable content is cleanly organized in [`config.js`](./config.js):

1. **Names & Nicknames**:
   ```javascript
   herName: "Her Real Name",
   herNickname: "Baby / Honey / Sweetheart",
   hisName: "Your Name",
   ```
2. **Anniversary Date**:
   ```javascript
   anniversaryDate: "2023-10-16T00:00:00", // Drives the live counter!
   ```
3. **Secret Confession**:
   Update `interactive.secretLocket.message` with your most intimate secret message.
4. **Photos / Memories**:
   Replace `assets/sunset.svg`, `assets/stars.svg`, etc., with your own photos (JPG, PNG, or WebP).
5. **Background Music**:
   You can drop any `.mp3` file into the folder and set `music.customAudioUrl: "your-song.mp3"`, or leave it `null` to use the built-in romantic generative piano!

---

## 🚀 How to Run & Preview

Simply double-click `index.html` to open it in Chrome, Safari, Edge, or Firefox.

Or run a local server:
```bash
# Python
python -m http.server 8000

# Node.js
npx serve .
```
Then visit `http://localhost:8000`.
