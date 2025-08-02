// server/utils/sm2.js
export const updateSM2 = (card, q) => {
  let ef = card.easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (ef < 1.3) ef = 1.3;
  let reps = q < 3 ? 0 : card.repetitions + 1;
  let intv = reps === 0 ? 1 : reps === 1 ? 1 : reps === 2 ? 6 : Math.round(card.interval * ef);
  let next = new Date(Date.now() + intv * 24 * 60 * 60 * 1000);
  return { easeFactor: ef, repetitions: reps, interval: intv, nextReview: next };
};
