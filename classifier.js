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

function clamp01(v) {
  return Math.max(0, Math.min(1, v));
}

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
  switch (predictedClass) {
    case 0: return "A";
    case 1: return "B";
    case 2: return "C";
    case 3: return "D";
    case 4: return "E";
    case 5: return "F";
    case 6: return "G";
    case 7: return "H";
    case 8: return "I";
    case 9: return "J";
    case 10: return "K";
    case 11: return "L";
    case 12: return "M";
    case 13: return "N";
    case 14: return "O";
    case 15: return "P";
    case 16: return "Q";
    case 17: return "R";
    case 18: return "S";
    case 19: return "T";
    case 20: return "U";
    case 21: return "V";
    case 22: return "W";
    case 23: return "X";
    case 24: return "Y";
    case 25: return "Z";
    default: return "Unknown";
  }
  if (!landmarks || landmarks.length < 21) return null;

  const lm = landmarks;

  function distance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  function fingerOpenScore(tip, pip, mcp) {
    const palm = distance(lm[0], lm[9]) + 1e-6;
    const tipLift = (lm[mcp].y - lm[tip].y) / palm;
    const pipLift = (lm[mcp].y - lm[pip].y) / palm;
    const spread = distance(lm[tip], lm[mcp]) / palm;
    return clamp01(0.5 * tipLift + 0.25 * pipLift + 0.25 * spread);
  }

  function thumbOpenScore() {
    const palm = distance(lm[0], lm[9]) + 1e-6;
    const thumbReach = distance(lm[4], lm[5]) / palm;
    const thumbSpread = Math.abs(lm[4].x - lm[2].x) / (Math.abs(lm[5].x - lm[17].x) + 1e-6);
    return clamp01(0.55 * thumbReach + 0.45 * thumbSpread);
  }

  const thumbScore = thumbOpenScore();
  const indexScore = fingerOpenScore(8, 7, 5);
  const middleScore = fingerOpenScore(12, 11, 9);
  const ringScore = fingerOpenScore(16, 15, 13);
  const pinkyScore = fingerOpenScore(20, 19, 17);

  const fingerScores = [thumbScore, indexScore, middleScore, ringScore, pinkyScore];
  const palm = distance(lm[0], lm[9]) + 1e-6;
  const thumbIndexDist = distance(lm[4], lm[8]) / palm;
  const thumbMiddleDist = distance(lm[4], lm[12]) / palm;
  const middleRingClosed = middleScore < 0.45 && ringScore < 0.45 && pinkyScore < 0.45;
  const indexClearlyUp = indexScore > 0.62;

  // Explicit D detector: index up, others curled, thumb near middle/index cluster.
  if (indexClearlyUp && middleRingClosed && thumbMiddleDist < 0.72 && thumbIndexDist < 0.95) {
    const dConfidence = clamp01(0.64 + 0.2 * clamp01(indexScore) + 0.16 * clamp01(1 - ((middleScore + ringScore + pinkyScore) / 3)));
    return { sign: 'D', confidence: dConfidence };
  }
  const fingerCurveScores = [indexScore, middleScore, ringScore, pinkyScore];
  const avgFingerOpen = (indexScore + middleScore + ringScore + pinkyScore) / 4;

  // Explicit C detector: allow broader curved-hand variance.
  const allCurvedButNotFlat = fingerCurveScores.every(v => v > 0.12 && v < 0.95);
  const curvedCount = fingerCurveScores.filter(v => v > 0.2 && v < 0.82).length;
  const thumbForC = thumbScore > 0.22 && thumbScore < 0.96;
  const cGap = thumbIndexDist > 0.3 && thumbIndexDist < 1.4;
  if (allCurvedButNotFlat && curvedCount >= 3 && thumbForC && cGap && avgFingerOpen > 0.24) {
    const curveCenter = 1 - (Math.abs(indexScore - 0.48) + Math.abs(middleScore - 0.48) + Math.abs(ringScore - 0.48) + Math.abs(pinkyScore - 0.48)) / 2;
    const cConfidence = clamp01(0.58 + 0.3 * clamp01(curveCenter) + 0.12 * clamp01(thumbScore));
    return { sign: 'C', confidence: cConfidence };
  }

  function matchScore(pattern) {
    const scores = [];
    for (let i = 0; i < 5; i++) {
      const expected = pattern[i];
      if (expected === null) continue;
      const value = fingerScores[i];
      scores.push(expected ? value : (1 - value));
    }
    if (!scores.length) return 0;
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  }

  const rules = [
    { sign: 'S', pattern: [false, false, false, false, false] },
    { sign: 'A', pattern: [true, false, false, false, false] },
    { sign: 'B', pattern: [false, true, true, true, true] },
    { sign: 'D', pattern: [true, true, false, false, false] },
    { sign: 'L', pattern: [true, true, false, false, false] },
    { sign: '1', pattern: [false, true, false, false, false] },
    { sign: '2', pattern: [false, true, true, false, false] },
    { sign: 'W', pattern: [false, true, true, true, false] },
    { sign: 'I', pattern: [false, false, false, false, true] },
    { sign: 'Y', pattern: [true, false, false, false, true] },
    { sign: '5', pattern: [true, true, true, true, true] },
  ];

  const ranked = rules
    .map(rule => ({ sign: rule.sign, score: matchScore(rule.pattern) }))
    .sort((a, b) => b.score - a.score);

  const best = ranked[0];
  const second = ranked[1];
  const separation = best.score - second.score;
  const confidence = clamp01(0.8 * best.score + 0.2 * clamp01(separation * 2));

  if (best.sign === 'A' && avgFingerOpen > 0.22) {
    return null;
  }

  if (best.score >= 0.62) {
    return { sign: best.sign, confidence };
  }

  // F or OK: Thumb + index touching, other 3 extended
  if (thumbIndexDist < 0.38 && middleScore > 0.55 && ringScore > 0.55 && pinkyScore > 0.55) {
    const fConfidence = clamp01((middleScore + ringScore + pinkyScore + (1 - indexScore)) / 4);
    return { sign: 'F', confidence: Math.max(0.62, fConfidence) };
  }

  // No match
  return null;
}

/**
 * Aggregate classifications over a rolling window for stability.
 * @param {string[]} window - last N sign predictions
 * @returns {string | null} - majority sign or null if no clear winner
 */
export function stableClassify(window, threshold = 0.58) {
  if (!window.length) return null;
  const counts = {};
  const confidenceSums = {};

  window.forEach(item => {
    const sign = typeof item === 'string' ? item : item?.sign;
    const confidence = typeof item === 'string' ? 0.6 : (item?.confidence ?? 0.6);
    if (!sign) return;
    counts[sign] = (counts[sign] || 0) + 1;
    confidenceSums[sign] = (confidenceSums[sign] || 0) + confidence;
  });

  const ranked = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  if (!ranked.length) return null;

  const [topSign, topCount] = ranked[0];
  const support = topCount / window.length;
  if (support < threshold) return null;

  return {
    sign: topSign,
    support,
    avgConfidence: confidenceSums[topSign] / topCount,
  };
}
