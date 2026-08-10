import { z } from 'zod'

const rankingPattern = /^\d{1,5}(-\d{1,5})?$/

/**
 * College ranking: single number ("42") or range ("90-110").
 * Accepts number | string from older clients / forms.
 */
export const rankingValueSchema = z.preprocess((val) => {
  if (val === null || val === undefined || val === '') return undefined
  if (typeof val === 'number' && Number.isFinite(val)) return String(Math.trunc(val))
  if (typeof val === 'string') {
    const trimmed = val.trim()
    return trimmed === '' ? undefined : trimmed
  }
  return val
}, z.string().regex(rankingPattern, 'Use a number (e.g. 42) or range (e.g. 90-110)').optional())
