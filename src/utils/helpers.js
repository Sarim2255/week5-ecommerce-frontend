/**
 * Format numeric value as INR currency string
 * @param {number} value 
 * @returns {string}
 */
export const formatCurrency = (value) => {
  if (typeof value !== 'number') return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
};

/**
 * Fallback image handler for broken URLs
 */
export const handleImageError = (e) => {
  e.target.onerror = null; // Prevent infinite loop
  e.target.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='100%' height='100%' fill='%231e293b'/><path d='M150 100 L250 100 L200 150 Z' fill='%236366f1' opacity='0.5'/><text x='50%' y='60%' font-family='sans-serif' font-size='14' font-weight='bold' fill='%2394a3b8' dominant-baseline='middle' text-anchor='middle'>Hardware Gear</text></svg>";
};

/**
 * Truncate long descriptions with ellipses
 * @param {string} text 
 * @param {number} limit 
 * @returns {string}
 */
export const truncateText = (text, limit = 100) => {
  if (!text) return '';
  if (text.length <= limit) return text;
  return text.substring(0, limit) + '...';
};

/**
 * Format string ISO date to local date string
 * @param {string} dateString 
 * @returns {string}
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
