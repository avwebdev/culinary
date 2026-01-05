/**
 * Email template utilities
 */

/**
 * Approximate OKLCH to HEX conversion
 * OKLCH format: oklch(L C H) where L is lightness (0-1), C is chroma (0-0.4), H is hue (0-360)
 */
export function oklchToHex(oklchString: string): string {
  // Default fallback
  const fallback = '#06604F';
  
  if (!oklchString || typeof oklchString !== 'string') {
    return fallback;
  }

  // Parse oklch(L C H) format
  const match = oklchString.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/);
  if (!match) {
    // If it's already a hex color, return it
    if (oklchString.startsWith('#')) {
      return oklchString;
    }
    return fallback;
  }

  const L = parseFloat(match[1]);
  const C = parseFloat(match[2]);
  const H = parseFloat(match[3]);

  // Approximate conversion via OKLab -> linear sRGB -> sRGB
  // This is a simplified approximation
  const a = C * Math.cos((H * Math.PI) / 180);
  const b = C * Math.sin((H * Math.PI) / 180);

  // OKLab to linear sRGB (approximate)
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  // Linear sRGB
  let r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  let g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  let bl = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  // Gamma correction (linear sRGB to sRGB)
  const gammaCorrect = (c: number) => {
    c = Math.max(0, Math.min(1, c));
    return c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  };

  r = gammaCorrect(r);
  g = gammaCorrect(g);
  bl = gammaCorrect(bl);

  // Convert to hex
  const toHex = (c: number) => {
    const hex = Math.round(c * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(bl)}`;
}

/**
 * Get theme colors with fallback
 */
export function getEmailColors(school?: SchoolBranding) {
  const defaultPrimary = '#06604F'; // Teal from site theme
  const defaultSecondary = '#8BBD5C'; // Green from site theme
  const defaultAccent = '#f97316'; // Orange accent

  return {
    primary: school?.primaryColor || defaultPrimary,
    secondary: school?.secondaryColor || defaultSecondary,
    accent: school?.accentColor || defaultAccent,
    background: '#ffffff',
    text: '#1a1a1a',
    textMuted: '#666666',
    border: '#e5e5e5',
  };
}

/**
 * School branding type
 */
export interface SchoolBranding {
  name: string;
  culinaryLogo?: {
    url: string;
  };
  email?: string;
  phone?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

/**
 * Order data type
 */
export interface OrderData {
  id: string | number;
  userEmail?: string;
  status?: string;
  deliveryDate?: string | Date;
  rejectionReason?: string;
  lines?: Array<{
    uuid: string;
  }> | any[];
  createdAt?: string | Date;
}

/**
 * Format date for display
 */
export function formatDate(dateValue?: string | Date): string {
  if (!dateValue) return 'N/A';
  const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Get full image URL from Strapi media
 */
export function getImageUrl(image?: { url: string }, strapiUrl?: string): string {
  if (!image?.url) {
    return '';
  }
  
  // If already absolute URL
  if (image.url.startsWith('http')) {
    return image.url;
  }
  
  // Prepend Strapi URL
  const baseUrl = strapiUrl || process.env.STRAPI_URL || 'http://localhost:1337';
  return `${baseUrl}${image.url}`;
}
