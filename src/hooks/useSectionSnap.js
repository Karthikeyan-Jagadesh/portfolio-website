export function nearestSection(targetX, sectionWidth, total) {
  const raw = Math.round(Math.abs(targetX) / sectionWidth)
  return Math.max(0, Math.min(total - 1, raw))
}
