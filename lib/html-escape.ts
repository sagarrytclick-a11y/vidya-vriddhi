/**
 * Escape user-controlled strings before embedding in HTML emails.
 */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * Escape for use inside mailto: / href attributes.
 */
export function escapeHtmlAttr(value: string): string {
  return escapeHtml(value).replace(/\(/g, '&#40;').replace(/\)/g, '&#41;')
}
