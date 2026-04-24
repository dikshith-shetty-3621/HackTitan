# OmniSign 🤲✨

### **Sign Every Word — Real-time ASL to Speech in Your Browser**

OmniSign translates **American Sign Language (ASL)** into live speech using your webcam — with **no backend, no installs, and complete privacy**.

It also enables non-signers to **learn ASL interactively** through a built-in learning system.

🚀 Built for **Hackathon 2026** by Team HackTitan

---

## ✨ Features

| Feature                   | Description                                                      |
| ------------------------- | ---------------------------------------------------------------- |
| 🎥 Live ASL Detection     | MediaPipe Hands at up to 60 FPS, supports 2 hands simultaneously |
| ⚡ Stable Sign Transitions | Adjustable latency buffer to avoid false detections              |
| 🗣️ Text to Speech        | Converts detected signs into real-time voice output              |
| 🧱 Phrase Builder         | Build full sentences and speak them                              |
| 📚 Learn ASL              | Learn alphabets, numbers, greetings, and common signs            |
| ↔️ Bidirectional          | Learn + communicate using the same system                        |
| 🔒 100% Private           | Runs entirely in-browser — no data leaves your device            |

---

## 🚀 Getting Started

No setup needed. Just clone and run.

```bash
git clone https://github.com/YOUR_USERNAME/omnisign.git
cd omnisign
open index.html
```

🌐 Live Demo:
👉 https://omnisign-gules.vercel.app/

> ⚠️ Camera access is required

---

## 🗂️ Project Structure

```
omnisign/
├── index.html
├── src/
│   ├── classifier.js
│   ├── mediapipe.js
│   ├── phrase.js
│   ├── speech.js
│   └── learn-data.js
└── README.md
```

---

## 🧠 How It Works

```
Webcam Input
    ↓
MediaPipe Hands (21 landmarks)
    ↓
Custom Classifier Logic
    ↓
Confidence Filtering + Stability System
    ↓
Detected Sign
    ↓
Phrase Builder → Speech Output
```

### 🎯 Stability System

Instead of detecting every frame, OmniSign uses a **rolling prediction window**, ensuring:

* smoother transitions
* fewer false detections
* better real-world usability

---

## 🔧 Tech Stack

* MediaPipe Hands
* Web Speech API
* Vanilla JavaScript (No frameworks)
* HTML + CSS (Glassmorphism UI)

---

## 📸 Screenshots





https://github.com/user-attachments/assets/7ab56ea9-ca8b-440c-a5b4-fb3c08c80ce4


### 🔤 Letters → Speech
### 🔢 Numbers → Speech
### ✋ Dual-Hand Detection
### 📚 Learn Mode
(Sorry For the Inconvinience That the Demo Video is muted but it in real website it converts sign into speech)
---

## 🗺️ Roadmap

* [ ] Integrate Fingerpose for better accuracy
* [ ] Add ML model (TFLite / ONNX) for full ASL vocabulary
* [ ] Speech → Sign (reverse communication)
* [ ] Add animated sign tutorials
* [ ] Convert to PWA (mobile support)
* [ ] Multi-language speech output

---

## 👥 Team

**Team Lead:** Diganth N
**Members:**

* Yashas A
* Vijeth H J
* Diganth A R

⏱️ Built in 24 hours at Hackathon
KalpAIthon 2.0

---

## 🌍 Vision

> Breaking communication barriers between signers and non-signers using AI.

---

## 📄 License

MIT License — free to use, modify, and build upon.
