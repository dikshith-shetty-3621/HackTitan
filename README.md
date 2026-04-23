
> **Sign Every Word.** — Real-time ASL to speech, bidirectional, in the browser.

OmniSign translates American Sign Language into live speech using your webcam — no backend, no installs, no data leaves your device. It also teaches ASL to non-signers through a dedicated learn section.

Built for **Haathon 2024** by Team OmniSign.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎥 Live ASL Detection | MediaPipe Hands at up to 60 FPS, 2 hands simultaneously |
| ⚡ Stable Sign Transitions | Adjustable latency buffer — shift between signs without false triggers |
| 🗣️ Text to Speech | Web Speech API speaks detected signs instantly |
| 🧱 Phrase Builder | Accumulate signs into full sentences, speak them at once |
| 📚 Learn ASL | Full alphabet, numbers, greetings, common words — separate from live mode |
| ↔️ Bidirectional | Signers can communicate outward; non-signers can learn inward |
| 🔒 100% Private | All ML runs in-browser — zero server calls for video |

---

## 🚀 Getting Started

No build step. No npm install. Just open the file.

```bash
git clone https://github.com/YOUR_USERNAME/omnisign.git
cd omnisign
# Open index.html in your browser
open index.html
```

Or visit the live demo: **[omnisign.vercel.app]([https://omnisign.vercel.app](https://omnisign-gules.vercel.app/))**

> **Camera access required.** Allow camera permissions when prompted.

---

## 🗂️ Project Structure

```
omnisign/
├── index.html              # Main app — self-contained, no build needed
├── src/
│   ├── classifier.js       # Hand landmark → ASL sign classifier
│   ├── mediapipe.js        # Camera + MediaPipe Hands setup
│   ├── phrase.js           # Phrase builder logic & preset phrases
│   ├── speech.js           # Web Speech API wrapper
│   └── learn-data.js       # Full ASL sign library (A-Z, 0-10, common)
├── assets/
│   └── signs/              # Sign reference images (optional)
└── README.md
```

---

## 🧠 How It Works

```
Webcam Frame
    ↓
MediaPipe Hands (WASM, in-browser)
    → 21 hand landmarks per hand (x, y, z)
    ↓
classifier.js
    → Fingertip extension geometry
    → Rolling 8-frame majority vote for stability
    ↓
Sign label + confidence
    ↓
Phrase Builder  →  Web Speech API
```

### Stability System

Instead of firing on every frame (which causes rapid-fire junk output), OmniSign uses a **rolling prediction window** — a sign must be held consistently for a configurable duration (0.5s – 3s) before it's accepted. This lets you comfortably move between signs.

---

## 🔧 Tech Stack

- **[MediaPipe Hands](https://google.github.io/mediapipe/solutions/hands)** — hand landmark detection
- **[Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)** — text to speech
- **Vanilla JS / HTML / CSS** — no framework, no bundler
- **CSS glassmorphism + particle canvas** — custom visual system

---

## 🗺️ Roadmap

- [ ] Integrate [Fingerpose](https://github.com/andypotato/fingerpose) for rule-based sign matching
- [ ] TFLite / ONNX model for full ASL vocabulary (100+ signs)
- [ ] Speech-to-sign (reverse translation for non-signers to communicate back)
- [ ] Sign GIFs in learn mode from lifeprint.com
- [ ] PWA — install as an offline app
- [ ] Multi-language TTS (Spanish, Hindi, etc.)

---

## 📸 Screenshots
<img width="1512" height="982" alt="Screenshot 2026-04-23 at 4 39 11 PM" src="https://github.com/user-attachments/assets/5e0842db-8628-4016-958e-eb2dfddd5b22" /># OmniSign 🤲
Letters into Speech

![Uploading Screenshot 2026-04-23 at 4.39.11 PM.png
<img width="1512" height="982" alt="Screenshot 2026-04-23 at 4 39 22 PM" src="https://github.com/user-attachments/assets/26ccfc8e-ba7d-467c-b578-45d3048e8c22" />
Numbers into speech 
<img width="1512" height="982" alt="Screenshot 2026-04-23 at 4 39 30 PM" src="https://github.com/user-attachments/assets/26925d08-cd1f-4e37-9ab5-53dba787ef0e" />
Both hands usable simultaneously
<img width="1512" height="982" alt="Screenshot 2026-04-23 at 4 39 43 PM" src="https://github.com/user-attachments/assets/130aeb69-5365-41c6-a08b-c184f1b6f72a" />
user can learn american sign language in our Website As well





---

## 👥 Team
Team Lead - Diganth N
Members - Yashas A
          Vijeth H J
          Diganth A R

Built in 24 hours at Hacthon by students o

---

## 📄 License
 free to use, fork, and build on.
