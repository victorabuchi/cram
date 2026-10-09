// The app's cards, like the shields.io badges on the GitHub profile, are a solid colour with white (or black) text.
// badge(hex) picks readable text for a brand colour: white when it has enough contrast, black on very light colours,
// otherwise the colour is darkened until white text is readable (WCAG AA, 4.5:1).
const channels = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
const luminance = (hex) => {
  const [r, g, b] = channels(hex).map((v) => v / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const contrast = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
const darken = (hex, k) => `#${channels(hex).map((v) => Math.round(v * (1 - k)).toString(16).padStart(2, '0')).join('')}`

export function badge(hex) {
  const white = { fg: '#ffffff', filter: 'brightness(0) invert(1)' }
  const black = { fg: '#111111', filter: 'brightness(0)' }
  if (contrast(1, luminance(hex)) >= 4.5) return { bg: hex, ...white }
  if (contrast(1, luminance(hex)) < 2.2) return { bg: hex, ...black } // only very light colours (yellow, cyan) get black text
  let k = 0
  while (k < 1 && contrast(1, luminance(darken(hex, k))) < 4.5) k += 0.04
  return { bg: darken(hex, k), ...white }
}

// Inline style for a badge-coloured card.
export const badgeStyle = (hex) => {
  const b = badge(hex)
  return { background: b.bg, color: b.fg, '--badge-fg': b.fg }
}
