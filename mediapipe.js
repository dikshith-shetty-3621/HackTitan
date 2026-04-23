/**
 * OmniSign — MediaPipe Hands Setup
 * Handles camera initialisation, hands model, and frame processing.
 */

import { classifyHand, stableClassify } from './classifier.js';

const CDN = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands/';

let hands = null;
let camera = null;
let stream = null;
let prevX = null;
let waveFrames = 0;
let waveDirection = 0;
let lastTriggerTime = 0;


const WINDOW_SIZE = 12; // frames to average for stability
let predictionWindow = [];
let lastAcceptedSign = '';
let lastAcceptedAt = 0;

function clamp01(v) {
  return Math.max(0, Math.min(1, v));
}

/**
 * @param {HTMLVideoElement} videoEl
 * @param {HTMLCanvasElement} canvasEl
 * @param {object} callbacks
 *   onSign(sign, confidence)
 *   onHandCount(n)
 *   onFPS(fps)
 *   onReady()
 *   onError(err)
 */
// onSign: (sign, confidence) => {
//   const detectedEl = document.getElementById('detected-sign');
//   const confBar = document.getElementById('conf-bar');
//   const confVal = document.getElementById('conf-val');
//   const videoContainer = document.getElementById('video-container');

//   const percent = Math.round(confidence * 100);

//   // Always show confidence
//   confBar.style.width = percent + '%';
//   confVal.textContent = percent + '%';

//   // 🔥 MAIN LOGIC
//   if (confidence < 0.75) {
//     detectedEl.textContent = '⚠️ Sign unclear — please repeat';
//     videoContainer.classList.add('unclear');
//   } else {
//     detectedEl.textContent = sign;
//     videoContainer.classList.remove('unclear');
//   }
// }

// function handleSign(sign, confidence) {
//   const detectedEl = document.getElementById('detected-sign');
//   const confBar = document.getElementById('conf-bar');
//   const confVal = document.getElementById('conf-val');
//   const videoContainer = document.getElementById('video-container');

//   const percent = Math.round(confidence * 100);

//   // Always show confidence
//   confBar.style.width = percent + '%';
//   confVal.textContent = percent + '%';

//   // Threshold logic
//   if (confidence < 0.75) {
//     detectedEl.textContent = 'Sign unclear — please repeat';

//     // Add visual alert
//     videoContainer.classList.add('unclear');

//   } else {
//     detectedEl.textContent = sign;

//     // Remove alert
//     videoContainer.classList.remove('unclear');
//   }
// }
/**
 * Updates the UI based on sign detection results.
 * Applies a 0.75 confidence threshold filter.
 */
function handleSign(sign, confidence) {
  const detectedEl = document.getElementById('detected-sign');
  const confBar = document.getElementById('conf-bar');
  const confVal = document.getElementById('conf-val');
  const videoContainer = document.querySelector('.video-container');

  const percent = Math.round(confidence * 100);

  // Always show confidence
  confBar.style.width = percent + '%';
  confVal.textContent = percent + '%';

  if (confidence < 0.55) {
    detectedEl.textContent = '⚠️ Sign unclear — please repeat';
    detectedEl.classList.add('unclear');
    videoContainer.classList.add('unclear-alert');
  } else {
    detectedEl.textContent = sign;
    detectedEl.classList.remove('unclear');
    videoContainer.classList.remove('unclear-alert');
  }
}
export async function startCamera(videoEl, canvasEl, callbacks = {}) {
  try {
    hands = new Hands({ locateFile: f => CDN + f });

    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.65,
      minTrackingConfidence: 0.6,
    });

    hands.onResults(results => onResults(results, canvasEl, callbacks));

    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: 'user',
        frameRate: { ideal: 60 },
      },
    });

    videoEl.srcObject = stream;
    await videoEl.play();

    canvasEl.width  = videoEl.videoWidth  || 1280;
    canvasEl.height = videoEl.videoHeight || 720;

    let fpsFrames = 0;
    let fpsTimer  = Date.now();

    camera = new Camera(videoEl, {
      onFrame: async () => {
        await hands.send({ image: videoEl });

        fpsFrames++;
        if (Date.now() - fpsTimer >= 1000) {
          callbacks.onFPS?.(fpsFrames);
          fpsFrames = 0;
          fpsTimer  = Date.now();
        }
      },
      width: 1280, height: 720,
    });

    await camera.start();
    callbacks.onReady?.();

  } catch (err) {
    callbacks.onError?.(err);
  }
}

export function stopCamera(videoEl) {
  camera?.stop();
  camera = null;
  hands?.close();
  hands = null;
  stream?.getTracks().forEach(t => t.stop());
  stream = null;
  if (videoEl) videoEl.srcObject = null;
  predictionWindow = [];
  lastAcceptedSign = '';
  lastAcceptedAt = 0;
}
function onResults(results, canvasEl, callbacks) {
  const ctx = canvasEl.getContext('2d');

  ctx.save();
  ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
  ctx.drawImage(results.image, 0, 0, canvasEl.width, canvasEl.height);

  const handCount = results.multiHandLandmarks?.length ?? 0;
  callbacks.onHandCount?.(handCount);

  if (handCount > 0) {
    let bestPrediction = null;
    results.multiHandLandmarks.forEach((landmarks) => {
      const prediction = classifyHand(landmarks);
      if (!prediction) return;
      if (!bestPrediction || prediction.confidence > bestPrediction.confidence) {
        bestPrediction = prediction;
      }
    });

    if (bestPrediction) {
      predictionWindow.push(bestPrediction);
      if (predictionWindow.length > WINDOW_SIZE) predictionWindow.shift();

      const stable = stableClassify(predictionWindow, 0.58);
      if (stable) {
        const combinedConfidence = clamp01((stable.avgConfidence * 0.7) + (stable.support * 0.3));
        handleSign(stable.sign, combinedConfidence);

        const now = Date.now();
        if (!(stable.sign === lastAcceptedSign && now - lastAcceptedAt < 700)) {
          callbacks.onSign?.(stable.sign, combinedConfidence);
          lastAcceptedSign = stable.sign;
          lastAcceptedAt = now;
        }
      } else {
        handleSign(bestPrediction.sign, bestPrediction.confidence * 0.6);
      }
    } else {
      predictionWindow = [];
      handleSign('—', 0);
    }
  } else {
    predictionWindow = [];
    handleSign('—', 0);
  }

  ctx.restore();
}
//   const ctx = canvasEl.getContext('2d');
//   ctx.save();
//   ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
//   ctx.drawImage(results.image, 0, 0, canvasEl.width, canvasEl.height);

//   const handCount = results.multiHandLandmarks?.length ?? 0;
//   callbacks.onHandCount?.(handCount);

//   let bestSign = null;
//   let bestConf = 0;

//   if (handCount > 0) {
//     results.multiHandLandmarks.forEach((landmarks, i) => {

//       // ==============================
//       // 👋 HELLO WAVE DETECTION
//       // ==============================
//       const wrist = landmarks[0];

//       if (prevX !== null) {
//         const dx = wrist.x - prevX;

//         if (dx > 0.04 && waveDirection !== 1) {
//           waveDirection = 1;
//           waveFrames++;
//         } else if (dx < -0.04 && waveDirection !== -1) {
//           waveDirection = -1;
//           waveFrames++;
//          waveDirection = 1;
//           waveFrames++;
//         } else if (dx < -0.04 && waveDirection !== -1) {
//           waveDirection = -1;
//           waveFrames++;
//         }
//       }

//       prevX = wrist.x;

//       const now = Date.now();
//       if (waveFrames > 6 && now - lastTriggerTime > 2000) {
//         waveFrames = 0;
//         waveDirection = 0;
//         lastTriggerTime = now;
//         callbacks.onSign?.('HELLO', 0.98);
//       }

//       // Draw skeleton and landmarks
//       drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {
//         color: i === 0 ? 'rgba(0,245,212,0.85)' : 'rgba(123,47,255,0.85)',
//         lineWidth: 2,
//       });

//       drawLandmarks(ctx, landmarks, {
//         color:     i === 0 ? '#00f5d4' : '#7b2fff',
//         fillColor: i === 0 ? 'rgba(0,245,212,0.25)' : 'rgba(123,47,255,0.25)',
//         lineWidth: 1,
//         radius: 4,
//       });

//       // Classification
//       const result = classifyHand(landmarks);
//       if (result && result.confidence > bestConf) {
//         bestSign = result.sign;
//         bestConf = result.confidence;
//       }

//       // Label
//       const label = results.multiHandedness[i]?.label ? results.multiHandedness[i].label + ' Hand' : 'Hand';
//       ctx.font = 'bold 13px DM Sans, sans-serif';
//       ctx.fillStyle = i === 0 ? '#00f5d4' : '#7b2fff';
//       ctx.fillText(label, wrist.x * canvasEl.width, wrist.y * canvasEl.height - 12);
//     });
//   }

//   ctx.restore();

//   // Rolling window stability & emit stable sign
//   if (bestSign && bestSign !== '?') {
//     predictionWindow.push(bestSign);
//     if (predictionWindow.length > WINDOW_SIZE) predictionWindow.shift();
//   } else {
//     predictionWindow = [];
//   }

//   const stable = stableClassify(predictionWindow);
//   if (stable && bestConf > 0.75) {
//     callbacks.onSign?.(stable, bestConf);
//   }
// }
