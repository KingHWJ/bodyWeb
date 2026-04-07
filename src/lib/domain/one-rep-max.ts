export function estimateOneRepMax(weight: number, repetitions: number): number {
  if (repetitions <= 1) {
    return weight;
  }

  const brzycki = weight * (36 / (37 - repetitions));
  const epley = weight * (1 + repetitions / 30);

  if (repetitions <= 8) {
    return brzycki;
  }

  if (repetitions >= 10) {
    return epley;
  }

  // 8 到 10 次之间做线性插值，让中间区间过渡更平滑。
  const interpolation = (repetitions - 8) / 2;
  return brzycki + (epley - brzycki) * interpolation;
}
