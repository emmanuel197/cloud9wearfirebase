/**
 * Utility function to normalize image URLs
 * Ensures URLs work correctly regardless of whether they are relative or absolute
 * and across different environments (development, production, Vercel)
 */
export function normalizeImageUrl(url: string): string {
  if (!url) return ''; // Handle null or undefined URLs
  
  // If it's already a relative path starting with / (like /uploads/), return as is
  if (url.startsWith('/uploads/')) {
    return url;
  }
  
  try {
    // Try to parse as URL to see if it's absolute
    new URL(url);
    
    // If URL contains our Replit domain but we're deployed elsewhere,
    // extract just the path portion for Vercel deployment
    if (url.includes('.replit.app/uploads/') || url.includes('replit.dev/uploads/')) {
      const match = url.match(/\/uploads\/.*$/);
      if (match) {
        return match[0]; // Return just the /uploads/... part
      }
    }
    
    // For other absolute URLs (like third-party CDNs) return as is
    return url;
  } catch (e) {
    // If it's not a valid URL (like a relative path without leading slash)
    if (url.includes('uploads/products/')) {
      return `/${url}`; // Add leading slash
    }
    
    // For any other case, return as is
    return url;
  }
}