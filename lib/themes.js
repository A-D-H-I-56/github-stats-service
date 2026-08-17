/**
 * Curated theme presets for the GitHub Stats SVG card.
 */
export const THEMES = {
  dark: {
    bg: '#0d1117',
    border: '#30363d',
    title: '#58a6ff',
    text: '#c9d1d9',
    subtext: '#8b949e',
    accent: '#3fb950',
    icon: '#58a6ff',
    badgeBg: '#161b22',
  },
  radical: {
    bg: '#141321',
    border: '#383358',
    title: '#fe428e',
    text: '#a9fef7',
    subtext: '#b1a6c9',
    accent: '#f8d847',
    icon: '#fe428e',
    badgeBg: '#211e3b',
  },
  tokyonight: {
    bg: '#1a1b26',
    border: '#2f3549',
    title: '#70a5fd',
    text: '#c0caf5',
    subtext: '#7982a9',
    accent: '#38bdae',
    icon: '#7aa2f7',
    badgeBg: '#24283b',
  },
  dracula: {
    bg: '#282a36',
    border: '#44475a',
    title: '#ff79c6',
    text: '#f8f8f2',
    subtext: '#6272a4',
    accent: '#50fa7b',
    icon: '#8be9fd',
    badgeBg: '#343746',
  },
  nord: {
    bg: '#2e3440',
    border: '#4c566a',
    title: '#88c0d0',
    text: '#d8dee9',
    subtext: '#81a1c1',
    accent: '#a3be8c',
    icon: '#ebcb8b',
    badgeBg: '#3b4252',
  },
  catppuccin: {
    bg: '#1e1e2e',
    border: '#313244',
    title: '#cba6f7',
    text: '#cdd6f4',
    subtext: '#a6adc8',
    accent: '#a6e3a1',
    icon: '#89b4fa',
    badgeBg: '#181825',
  },
  cyberpunk: {
    bg: '#0c0e14',
    border: '#27293d',
    title: '#00f0ff',
    text: '#e2e8f0',
    subtext: '#ff0055',
    accent: '#ffe600',
    icon: '#00f0ff',
    badgeBg: '#171926',
  },
  monokai: {
    bg: '#272822',
    border: '#49483e',
    title: '#eb1f6a',
    text: '#f8f8f2',
    subtext: '#a6e22e',
    accent: '#e6db74',
    icon: '#66d9ef',
    badgeBg: '#3e3d32',
  },
  light: {
    bg: '#ffffff',
    border: '#d0d7de',
    title: '#0969da',
    text: '#24292f',
    subtext: '#57606a',
    accent: '#1a7f37',
    icon: '#0969da',
    badgeBg: '#f6f8fa',
  },
};

/**
 * Resolves theme configuration merging preset with any custom query overrides.
 *
 * @param {Record<string, string>} queryParams
 * @returns {object} Theme object
 */
export function getTheme(queryParams = {}) {
  const themeName = (queryParams.theme || 'dark').toLowerCase();
  const baseTheme = THEMES[themeName] || THEMES.dark;

  return {
    bg: queryParams.bg_color ? `#${queryParams.bg_color.replace(/^#/, '')}` : baseTheme.bg,
    border: queryParams.border_color ? `#${queryParams.border_color.replace(/^#/, '')}` : baseTheme.border,
    title: queryParams.title_color ? `#${queryParams.title_color.replace(/^#/, '')}` : baseTheme.title,
    text: queryParams.text_color ? `#${queryParams.text_color.replace(/^#/, '')}` : baseTheme.text,
    subtext: queryParams.subtext_color ? `#${queryParams.subtext_color.replace(/^#/, '')}` : baseTheme.subtext,
    accent: queryParams.accent_color ? `#${queryParams.accent_color.replace(/^#/, '')}` : baseTheme.accent,
    icon: queryParams.icon_color ? `#${queryParams.icon_color.replace(/^#/, '')}` : baseTheme.icon,
    badgeBg: queryParams.badge_bg ? `#${queryParams.badge_bg.replace(/^#/, '')}` : baseTheme.badgeBg,
    hideBorder: queryParams.hide_border === 'true' || queryParams.hide_border === '1',
  };
}
