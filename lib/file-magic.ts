/**
 * Magic-byte / signature checks for uploads (do not trust Content-Type alone).
 */

export type DetectedImage =
  | { ok: true; ext: 'jpg' | 'png' | 'gif' | 'webp' }
  | { ok: false; error: string }

export type DetectedPdf = { ok: true } | { ok: false; error: string }

export function detectImageType(buffer: Buffer): DetectedImage {
  if (buffer.length < 12) {
    return { ok: false, error: 'File too small to be a valid image' }
  }

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { ok: true, ext: 'jpg' }
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { ok: true, ext: 'png' }
  }

  // GIF: GIF87a / GIF89a
  if (
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x38 &&
    (buffer[4] === 0x37 || buffer[4] === 0x39) &&
    buffer[5] === 0x61
  ) {
    return { ok: true, ext: 'gif' }
  }

  // WEBP: RIFF....WEBP
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return { ok: true, ext: 'webp' }
  }

  // Explicitly reject SVG / XML (even if Content-Type lied as image/*)
  const head = buffer.subarray(0, Math.min(buffer.length, 256)).toString('utf8').toLowerCase()
  if (head.includes('<svg') || head.includes('<?xml')) {
    return { ok: false, error: 'SVG/XML images are not allowed' }
  }

  return { ok: false, error: 'Unrecognized or unsupported image format' }
}

export function detectPdf(buffer: Buffer): DetectedPdf {
  if (buffer.length < 5) {
    return { ok: false, error: 'File too small to be a valid PDF' }
  }

  // %PDF-
  if (
    buffer[0] === 0x25 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x44 &&
    buffer[3] === 0x46 &&
    buffer[4] === 0x2d
  ) {
    return { ok: true }
  }

  return { ok: false, error: 'File is not a valid PDF' }
}
