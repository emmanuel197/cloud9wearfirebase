/**
 * Utility function to normalize image URLs
 * Ensures URLs work correctly regardless of whether they are relative or absolute
 */
export function normalizeImageUrl(url: string): string {
  // If it's already a relative path or GitHub Pages URL, return as is
  if (url.startsWith('/') || url.includes('.github.io/')) {
    return url;
  }

  // For uploads through the admin panel or full URLs, use as is
  try {
    const urlObj = new URL(url);
    if (urlObj.pathname.includes('/uploads/products/')) {
      return url; // Keep the full URL for uploaded product images
    }
    return url;
  } catch (e) {
    // Invalid URL, return as is
    console.warn('Invalid image URL:', url);
  }

  return url;
}