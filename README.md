# OmniSign 🤲✨

### **Sign Every Word — Real-time ASL to Speech in Your Browser**

OmniSign translates **American Sign Language (ASL)** into live speech using your webcam — with **no backend, no installs, and complete privacy**.

It also enables non-signers to **learn ASL interactively** through a built-in learning system.

🚀 Built for **Haathon 2024** by Team OmniSign

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

### 🔤 Letters → Speech

<img width="1512" height="982" alt="Screenshot 2026-04-23 at 4 39 11 PM" src="https://github.com/user-attachments/assets/f82448f4-4db7-4f66-9817-bd2b1b9577d4" />


### 🔢 Numbers → Speech

<img width="1512" height="982" alt="Screenshot 2026-04-23 at 4 39 22 PM" src="https://github.com/user-attachments/assets/129d4bfa-c8f2-4567-8a74-2e66f730f635" />


### ✋ Dual-Hand Detection

<img width="1512" height="982" alt="Screenshot 2026-04-23 at 4 39 30 PM" src="https://github.com/user-attachments/assets/9fdcd39d-196e-4126-bb77-22f7f8fa0ee5" />


### 📚 Learn Mode

<img width="1512" height="982" alt="Screenshot 2026-04-23 at 4 39 43 PM" src="https://github.com/user-attachments/assets/d3816a07-1853-4cae-944e-bc696a08cf35" />


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

---

## 🌍 Vision

> Breaking communication barriers between signers and non-signers using AI.

---

## 📄 License

MIT License — free to use, modify, and build upon.
