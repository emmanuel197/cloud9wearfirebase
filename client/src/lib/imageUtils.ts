/**
 * Utility function to normalize image URLs
 * Ensures URLs work correctly regardless of whether they are relative or absolute
 */
export function normalizeImageUrl(url: string): string {
  // If it's already a relative path, return as is
  if (url.startsWith('/')) {
    return url;
  }

  // Convert GitHub blob URLs to raw URLs
  if (url.includes('github.com') && url.includes('/blob/')) {
    return url.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
  }

  // Extract the relative path from replit domain URLs
  try {
    const urlObj = new URL(url);
    if (urlObj.pathname.includes('/uploads/products/')) {
      return urlObj.pathname;
    }
  } catch (e) {
    // Invalid URL, return as is
    console.warn('Invalid image URL:', url);
  }

  return url;
}