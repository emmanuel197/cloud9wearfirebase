/**
 * Utility function to normalize image URLs
 * Ensures URLs work correctly regardless of whether they are relative or absolute
 */
export function normalizeImageUrl(url: string): string {
  // If it's already an absolute URL (starts with http:// or https://), return it
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If it's a relative URL starting with a slash, prepend the current origin
  if (url.startsWith('/')) {
    return window.location.origin + url;
  }
  
  // Otherwise, assume it's a relative URL and prepend the origin and a slash
  return window.location.origin + '/' + url;
}