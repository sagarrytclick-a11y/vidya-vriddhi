/** SEO helpers — plain text snippets and absolute asset URLs. */

export function stripForMeta(value: string | null | undefined, max = 160): string {
  if (!value) return ''
  const plain = value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim()
  if (plain.length <= max) return plain
  return `${plain.slice(0, max - 1).trimEnd()}…`
}

export function toAbsoluteUrl(domain: string, pathOrUrl: string | null | undefined): string | undefined {
  if (!pathOrUrl) return undefined
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) return pathOrUrl
  const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`
  return `https://${domain}${path}`
}
