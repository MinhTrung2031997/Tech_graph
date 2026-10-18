export const CONTENT_FONT_SIZES = [12, 14, 16, 18] as const;
export type ContentFontSize = (typeof CONTENT_FONT_SIZES)[number];

export const CONTENT_FONT_STORAGE_KEY = 'content-font-size';
export const DEFAULT_CONTENT_FONT_SIZE: ContentFontSize = 14;

export function isContentFontSize(value: string | null): value is `${ContentFontSize}` {
  return value === '12' || value === '14' || value === '16' || value === '18';
}

/** Runs before paint so a stored size does not flash the default. */
export const contentFontBootScript = `(function(){try{var s=localStorage.getItem(${JSON.stringify(CONTENT_FONT_STORAGE_KEY)});if(s==='12'||s==='14'||s==='16'||s==='18')document.documentElement.style.setProperty('--content-size',s)}catch(e){}})();`;
