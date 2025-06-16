const isReducedAnimations = window.matchMedia(
  "(prefers-reduced-motion)",
).matches;

export { isReducedAnimations };
