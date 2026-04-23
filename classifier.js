/**
 * OmniSign — Hand Sign Classifier
 * Uses landmark geometry from MediaPipe Hands to classify ASL signs.
 * Swap classifyHand() body with a TFLite/Fingerpose model for production.
 */

const FINGER = {
  THUMB:  { tip: 4,  pip: 3,  mcp: 2,  base: 1  },
  INDEX:  { tip: 8,  pip: 7,  mcp: 6,  base: 5  },
  MIDDLE: { tip: 12, pip: 11, mcp: 10, base: 9  },
  RING:   { tip: 16, pip: 15, mcp: 14, base: 13 },
  PINKY:  { tip: 20, pip: 19, mcp: 18, base: 17 },
};

/**
 * Returns true if the fingertip is above its MCP (finger is extended).
 * "above" = lower Y value in image space.
 */
function isExtended(lm, finger) {
  return lm[finger.tip].y < lm[finger.mcp].y;
}

function isCurled(lm, finger) {
  return lm[finger.tip].y > lm[finger.pip].y;
}

function thumbExtended(lm) {
  // Thumb extends sideways — compare x distance
  return Math.abs(lm[4].x - lm[2].x) > 0.08;
}

/**
 * Main classifier entry point.
 * @param {Array} landmarks - 21 MediaPipe hand landmarks [{x,y,z}]
 * @returns {{ sign: string, confidence: number } | null}
 */
export function classifyHand(landmarks) {
  if (!landmarks || landmarks.length < 21) return null;

  const lm = landmarks;
  const thumb  = thumbExtended(lm);
  const index  = isExtended(lm, FINGER.INDEX);
  const middle = isExtended(lm, FINGER.MIDDLE);
  const ring   = isExtended(lm, FINGER.RING);
  const pinky  = isExtended(lm, FINGER.PINKY);

  const extCount = [index, middle, ring, pinky].filter(Boolean).length;

  // ---- Alphabet ----
  if (!index && !middle && !ring && !pinky && !thumb) return { sign: 'S', confidence: 0.88 };
  if (!index && !middle && !ring && !pinky &&  thumb) return { sign: 'A', confidence: 0.85 };
  if ( index &&  middle &&  ring &&  pinky && !thumb) return { sign: 'B', confidence: 0.90 };
  if ( index && !middle && !ring && !pinky &&  thumb) return { sign: 'L', confidence: 0.87 };
  if ( index && !middle && !ring && !pinky && !thumb) return { sign: '1', confidence: 0.85 };
  if ( index &&  middle && !ring && !pinky && !thumb) return { sign: '2', confidence: 0.88 };
  if ( index &&  middle &&  ring && !pinky && !thumb) return { sign: 'W', confidence: 0.82 };
  if (!index && !middle && !ring &&  pinky && !thumb) return { sign: 'I', confidence: 0.86 };
  if (!index && !middle && !ring &&  pinky &&  thumb) return { sign: 'Y', confidence: 0.84 };
  if ( index &&  middle &&  ring &&  pinky &&  thumb) return { sign: '5', confidence: 0.92 };
  if (!index && !middle && !ring && !pinky && !thumb) return { sign: 'E', confidence: 0.75 };

  // Thumb + index touching → F or OK
  const thumbIndexClose =
    Math.hypot(lm[4].x - lm[8].x, lm[4].y - lm[8].y) < 0.05;
  if (thumbIndexClose && middle && ring && pinky)
    return { sign: 'F', confidence: 0.80 };

  return { sign: '?', confidence: 0.4 };
}

/**
 * Aggregate classifications over a rolling window for stability.
 * @param {string[]} window - last N sign predictions
 * @returns {string | null} - majority sign or null if no clear winner
 */
export function stableClassify(window, threshold = 0.6) {
  if (!window.length) return null;
  const counts = {};
  window.forEach(s => { counts[s] = (counts[s] || 0) + 1; });
  const [top, count] = Object.entries(counts).sort((a,b) => b[1]-a[1])[0];
  return count / window.length >= threshold ? top : null;
}
