/**
 * localStorage key holding the visitor's explicit theme choice, `'light'` or
 * `'dark'`. An absent key means "follow the system preference".
 *
 * The choice is applied as `data-theme` on `<html>` before first paint by the
 * inline script in `BaseHead.astro`; `ThemeToggle.astro` reads and updates it.
 */
export const THEME_STORAGE_KEY = 'theme';
