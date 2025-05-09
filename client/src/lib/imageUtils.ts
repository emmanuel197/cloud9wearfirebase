/**
 * Utility function to normalize image URLs
 * Ensures URLs work correctly regardless of whether they are relative or absolute
 */
export function normalizeImageUrl(url: string): string {
  // If it's already a relative path or GitHub Pages URL, return as is
  if (url.startsWith('/') || url.includes('.github.io/')) {
    return url;
  }

  // For uploads through the admin panel, use the full URL
  try {
    const urlObj = new URL(url);
    return url;
  } catch (e) {
    // Invalid URL, return as is
    console.warn('Invalid image URL:', url);
  }

  return url;
}