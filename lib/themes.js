/**
 * Curated theme presets for the GitHub Stats SVG card.
 */
export const THEMES = {
  gatsby: {
    bg: '#000000',
    border: '#ffa7c4',
    title: '#ffa7c4',
    text: '#ffffff',
    subtext: '#d6deeb',
    accent: '#ffb86c',
    icon: '#ffa7c4',
    badgeBg: '#121212',
  },
  dark: {
    bg: '#090d16',
    border: '#1e293b',
    title: '#38bdf8',
    text: '#f8fafc',
    subtext: '#94a3b8',
    accent: '#4ade80',
    icon: '#38bdf8',
    badgeBg: '#0f172a',
  },
  tokyonight: {
    bg: '#16161e',
    border: '#2f3549',
    title: '#7aa2f7',
    text: '#c0caf5',
    subtext: '#7982a9',
    accent: '#2ac3de',
    icon: '#bb9af7',
    badgeBg: '#1f2335',
  },
  radical: {
    bg: '#141321',
    border: '#383358',
    title: '#fe428e',
    text: '#a9fef7',
    subtext: '#b1a6c9',
    accent: '#f8d847',
    icon: '#fe428e',
    badgeBg: '#1e1c33',
  },
  dracula: {
    bg: '#21222c',
    border: '#44475a',
    title: '#ff79c6',
    text: '#f8f8f2',
    subtext: '#6272a4',
    accent: '#50fa7b',
    icon: '#8be9fd',
    badgeBg: '#282a36',
  },
  nord: {
    bg: '#242933',
    border: '#4c566a',
    title: '#88c0d0',
    text: '#eceff4',
    subtext: '#81a1c1',
    accent: '#a3be8c',
    icon: '#ebcb8b',
    badgeBg: '#2e3440',
  },
  catppuccin: {
    bg: '#181825',
    border: '#313244',
    title: '#cba6f7',
    text: '#cdd6f4',
    subtext: '#a6adc8',
    accent: '#a6e3a1',
    icon: '#89b4fa',
    badgeBg: '#1e1e2e',
  },
  cyberpunk: {
    bg: '#08080c',
    border: '#27293d',
    title: '#00f0ff',
    text: '#ffffff',
    subtext: '#ff0055',
    accent: '#ffe600',
    icon: '#00f0ff',
    badgeBg: '#12131c',
  },
  monokai: {
    bg: '#1e1f1c',
    border: '#49483e',
    title: '#eb1f6a',
    text: '#f8f8f2',
    subtext: '#a6e22e',
    accent: '#e6db74',
    icon: '#66d9ef',
    badgeBg: '#272822',
  },
  light: {
    bg: '#ffffff',
    border: '#e2e8f0',
    title: '#0284c7',
    text: '#0f172a',
    subtext: '#64748b',
    accent: '#16a34a',
    icon: '#0284c7',
    badgeBg: '#f8fafc',
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