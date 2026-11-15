// Picks black or white text, whichever is easier to read on a background colour.

function relativeLuminance(hex) {
  const [r, g, b] = [1, 3, 5].map((start) => {
    const channel = parseInt(hex.slice(start, start + 2), 16) / 255
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function readableTextColour(background) {
  if (!/^#[0-9a-f]{6}$/i.test(background)) return '#000000'
  const l = relativeLuminance(background)
  const againstWhite = 1.05 / (l + 0.05)
  const againstBlack = (l + 0.05) / 0.05
  return againstWhite >= againstBlack ? '#FFFFFF' : '#000000'
}